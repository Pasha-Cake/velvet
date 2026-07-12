'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Check, X, Paperclip, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { venueTypes, clothingTypes, fabricTypes } from '@/lib/data'

// Validation schema
const quizSchema = z.object({
  venueType: z.string().min(1, 'Выберите тип помещения'),
  clothingTypes: z.array(z.string()).min(1, 'Выберите хотя бы один тип изделия'),
  width: z.string().min(1, 'Укажите ширину'),
  height: z.string().min(1, 'Укажите высоту'),
  fabric: z.string().min(1, 'Выберите тип ткани'),
  name: z.string().min(2, 'Введите ваше имя'),
  email: z.string().email('Некорректный email'),
  phone: z.string().regex(/^\+7\s?\(?\d{3}\)?\s?\d{3}[-\s]?\d{2}[-\s]?\d{2}$/, 'Формат: +7 (999) 123-45-67'),
  company: z.string().optional(),
  comment: z.string().optional(),
})

type QuizData = z.infer<typeof quizSchema>

// Ограничения на вложения (зеркалят серверные правила)
const MAX_FILES = 5
const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10 МБ
const MAX_TOTAL_SIZE = 15 * 1024 * 1024 // 15 МБ
const ALLOWED_EXTENSIONS = ['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png']

interface QuizFormProps {
  onClose: () => void
}

export function QuizForm({ onClose }: QuizFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [files, setFiles] = useState<File[]>([])
  const [fileErrors, setFileErrors] = useState<string[]>([])
  const [submitError, setSubmitError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<QuizData>({
    resolver: zodResolver(quizSchema),
    defaultValues: {
      venueType: '',
      clothingTypes: [],
      width: '',
      height: '',
      fabric: '',
      name: '',
      email: '',
      phone: '',
      company: '',
      comment: '',
    },
  })

  const watchedValues = watch()

  const onSubmit = async (data: QuizData) => {
    setIsSubmitting(true)
    setSubmitError(null)

    try {
      const formData = new FormData()
      Object.entries(data).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          formData.append(key, JSON.stringify(value))
        } else {
          formData.append(key, String(value))
        }
      })
      files.forEach(file => formData.append('files', file))

      const response = await fetch('/api/quiz', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        if (response.status === 413) {
          setSubmitError('Вложения слишком большие для отправки. Уменьшите размер файлов или отправьте их на info@velvet-pro.ru')
          return
        }
        let message = 'Не удалось отправить заявку. Попробуйте ещё раз или напишите на info@velvet-pro.ru'
        try {
          const body = await response.json()
          if (body?.error) message = body.error
        } catch {
          // тело не JSON — используем сообщение по умолчанию
        }
        setSubmitError(message)
        return
      }

      setIsSuccess(true)
    } catch (error) {
      console.error('Submit error:', error)
      setSubmitError('Не удалось отправить заявку. Проверьте подключение и попробуйте ещё раз.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(e.target.files || [])
    const errors: string[] = []
    const accepted: File[] = []

    let totalSize = files.reduce((sum, f) => sum + f.size, 0)

    for (const file of newFiles) {
      const ext = file.name.slice(file.name.lastIndexOf('.')).toLowerCase()

      if (!ALLOWED_EXTENSIONS.includes(ext)) {
        errors.push(`«${file.name}»: недопустимый формат (разрешены PDF, DOC, DOCX, JPG, PNG)`)
        continue
      }
      if (file.size > MAX_FILE_SIZE) {
        errors.push(`«${file.name}»: размер больше 10 МБ`)
        continue
      }
      if (files.length + accepted.length >= MAX_FILES) {
        errors.push(`«${file.name}»: можно прикрепить не более ${MAX_FILES} файлов`)
        continue
      }
      if (totalSize + file.size > MAX_TOTAL_SIZE) {
        errors.push(`«${file.name}»: суммарный размер файлов превысит 15 МБ`)
        continue
      }
      totalSize += file.size
      accepted.push(file)
    }

    if (accepted.length > 0) {
      setFiles(prev => [...prev, ...accepted])
    }
    setFileErrors(errors)
    // Сбрасываем значение, чтобы тот же файл можно было выбрать повторно
    e.target.value = ''
  }

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index))
  }

  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, '')
    let formatted = '+7'
    if (digits.length > 1) {
      formatted += ' (' + digits.slice(1, 4)
    }
    if (digits.length > 4) {
      formatted += ') ' + digits.slice(4, 7)
    }
    if (digits.length > 7) {
      formatted += '-' + digits.slice(7, 9)
    }
    if (digits.length > 9) {
      formatted += '-' + digits.slice(9, 11)
    }
    return formatted
  }

  if (isSuccess) {
    return (
      <div className="p-8 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-16 h-16 rounded-full bg-green-100 mx-auto mb-6 flex items-center justify-center"
        >
          <Check className="h-8 w-8 text-green-600" />
        </motion.div>
        <h3 className="text-2xl font-bold text-foreground mb-2">Заявка отправлена!</h3>
        <p className="text-muted-foreground mb-6">
          Наш специалист свяжется с вами в течение 24 часов 
          для уточнения деталей и расчета стоимости.
        </p>
        <Button onClick={onClose}>Закрыть</Button>
      </div>
    )
  }

  return (
    <div className="relative">
      {/* Header */}
      <div className="bg-navy px-6 py-6 sm:px-8">
        <button
          onClick={onClose}
          aria-label="Закрыть"
          className="absolute top-4 right-4 text-primary-foreground/60 hover:text-primary-foreground transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
        <h3 className="font-serif text-xl sm:text-2xl font-bold text-primary-foreground text-balance pr-8">
          Рассчитайте стоимость одежды сцены
        </h3>
        <p className="mt-2 text-sm text-primary-foreground/75 leading-relaxed">
          Заполните форму — в течение <span className="font-semibold text-gold-light">24 часов</span> пришлём
          коммерческое предложение с точной стоимостью
        </p>
        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5">
          {['Бесплатно', 'Расчет от технолога', '150+ проектов'].map((perk) => (
            <span key={perk} className="flex items-center gap-1.5 text-xs text-primary-foreground/85">
              <Check className="h-3.5 w-3.5 text-gold" />
              {perk}
            </span>
          ))}
        </div>
      </div>

      {/* Form content */}
      <form onSubmit={handleSubmit(onSubmit)} className="px-6 py-6 sm:px-8">
        {/* О проекте */}
        <div className="mb-6">
          <p className="text-xs font-bold uppercase tracking-wider text-gold-dark mb-3">О проекте</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-1">
              <label htmlFor="venueType" className="block text-sm font-semibold text-foreground mb-1.5">
                Тип помещения <span className="text-destructive">*</span>
              </label>
              <select
                id="venueType"
                {...register('venueType')}
                className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="">Выберите...</option>
                {venueTypes.map((venue) => (
                  <option key={venue.value} value={venue.value}>{venue.label}</option>
                ))}
              </select>
              {errors.venueType && (
                <p className="text-xs text-destructive mt-1">{errors.venueType.message}</p>
              )}
            </div>
            <div>
              <label htmlFor="width" className="block text-sm font-semibold text-foreground mb-1.5">
                Ширина портала, м <span className="text-destructive">*</span>
              </label>
              <Input id="width" {...register('width')} placeholder="например, 12" type="number" step="0.1" />
              {errors.width && (
                <p className="text-xs text-destructive mt-1">{errors.width.message}</p>
              )}
            </div>
            <div>
              <label htmlFor="height" className="block text-sm font-semibold text-foreground mb-1.5">
                Высота портала, м <span className="text-destructive">*</span>
              </label>
              <Input id="height" {...register('height')} placeholder="например, 8" type="number" step="0.1" />
              {errors.height && (
                <p className="text-xs text-destructive mt-1">{errors.height.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Что нужно изготовить */}
        <div className="mb-6">
          <p className="text-sm font-semibold text-foreground mb-2">
            Что нужно изготовить{' '}
            <span className="font-normal text-muted-foreground">(можно несколько)</span>{' '}
            <span className="text-destructive">*</span>
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1">
            {clothingTypes.map((type) => {
              const isSelected = watchedValues.clothingTypes?.includes(type.value)
              return (
                <label
                  key={type.value}
                  className="flex items-center gap-2.5 py-1.5 px-2 rounded-md cursor-pointer hover:bg-secondary transition-colors"
                >
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={(checked) => {
                      const current = watchedValues.clothingTypes || []
                      if (checked) {
                        setValue('clothingTypes', [...current, type.value], { shouldValidate: true })
                      } else {
                        setValue('clothingTypes', current.filter((v) => v !== type.value), { shouldValidate: true })
                      }
                    }}
                  />
                  <span className="text-sm text-foreground">{type.label}</span>
                </label>
              )
            })}
          </div>
          {errors.clothingTypes && (
            <p className="text-xs text-destructive mt-1">{errors.clothingTypes.message}</p>
          )}
        </div>

        {/* Ткань */}
        <div className="mb-6">
          <p className="text-sm font-semibold text-foreground mb-2">
            Ткань <span className="text-destructive">*</span>
          </p>
          <div className="flex flex-wrap gap-2">
            {fabricTypes.map((fabric) => {
              const isSelected = watchedValues.fabric === fabric.value
              return (
                <label
                  key={fabric.value}
                  className={`rounded-full border px-3.5 py-1.5 text-sm cursor-pointer transition-colors ${
                    isSelected
                      ? 'border-gold-dark bg-accent/15 text-gold-dark font-semibold'
                      : 'border-border text-foreground hover:border-gold'
                  }`}
                >
                  <input type="radio" {...register('fabric')} value={fabric.value} className="sr-only" />
                  {fabric.label}
                </label>
              )
            })}
          </div>
          {errors.fabric && (
            <p className="text-xs text-destructive mt-1">{errors.fabric.message}</p>
          )}
        </div>

        {/* Контакты */}
        <div className="mb-6">
          <p className="text-xs font-bold uppercase tracking-wider text-gold-dark mb-3">Контакты</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-foreground mb-1.5">
                Ваше имя <span className="text-destructive">*</span>
              </label>
              <Input id="name" {...register('name')} placeholder="Иван Петров" />
              {errors.name && (
                <p className="text-xs text-destructive mt-1">{errors.name.message}</p>
              )}
            </div>
            <div>
              <label htmlFor="company" className="block text-sm font-semibold text-foreground mb-1.5">
                Организация
              </label>
              <Input id="company" {...register('company')} placeholder="Название театра / ДК" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-foreground mb-1.5">
                Email <span className="text-destructive">*</span>
              </label>
              <Input id="email" {...register('email')} type="email" placeholder="email@example.com" />
              {errors.email && (
                <p className="text-xs text-destructive mt-1">{errors.email.message}</p>
              )}
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-semibold text-foreground mb-1.5">
                Телефон <span className="text-destructive">*</span>
              </label>
              <Input
                id="phone"
                {...register('phone')}
                placeholder="+7 (999) 123-45-67"
                onChange={(e) => {
                  const formatted = formatPhone(e.target.value)
                  setValue('phone', formatted)
                }}
              />
              {errors.phone && (
                <p className="text-xs text-destructive mt-1">{errors.phone.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Комментарий */}
        <div className="mb-4">
          <label htmlFor="comment" className="block text-sm font-semibold text-foreground mb-1.5">
            Комментарий
          </label>
          <Textarea id="comment" {...register('comment')} placeholder="Дополнительная информация о проекте" rows={2} />
        </div>

        {/* Вложения */}
        <div className="mb-4">
          <input
            type="file"
            multiple
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            onChange={handleFileChange}
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className="flex items-center gap-2.5 rounded-md border border-dashed border-border px-3.5 py-2.5 text-sm text-muted-foreground cursor-pointer hover:border-gold transition-colors"
          >
            <Paperclip className="h-4 w-4 text-gold-dark flex-none" />
            Прикрепить чертежи, фото, ТЗ — PDF, DOC, JPG, PNG, до 10 МБ на файл
          </label>
          {fileErrors.length > 0 && (
            <div className="mt-2 space-y-1">
              {fileErrors.map((error, index) => (
                <p key={index} className="text-xs text-destructive">{error}</p>
              ))}
            </div>
          )}
          {files.length > 0 && (
            <div className="mt-2 space-y-1">
              {files.map((file, index) => (
                <div key={index} className="flex items-center justify-between text-sm bg-secondary p-2 rounded">
                  <span className="truncate">{file.name}</span>
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    aria-label={`Удалить ${file.name}`}
                    className="text-muted-foreground hover:text-destructive flex-none ml-2"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Политика */}
        <div className="flex items-start gap-2.5 mb-4">
          <Checkbox id="privacy-policy" required className="mt-0.5" />
          <label htmlFor="privacy-policy" className="text-xs text-muted-foreground leading-relaxed">
            Нажимая кнопку «Получить расчет», вы соглашаетесь с{' '}
            <a
              href="https://velvet-pro.ru/politica.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold-dark hover:underline"
            >
              политикой конфиденциальности
            </a>
          </label>
        </div>

        {/* Submit error */}
        {submitError && (
          <p className="text-sm text-destructive mb-3" role="alert">{submitError}</p>
        )}

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-gold text-navy-dark hover:bg-gold-light font-bold text-base h-12"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Отправка...
            </>
          ) : (
            'Получить расчет стоимости'
          )}
        </Button>
        <p className="text-xs text-muted-foreground text-center mt-2.5">
          Ответим в течение 24 часов · Бесплатно и ни к чему не обязывает
        </p>
      </form>
    </div>
  )
}
