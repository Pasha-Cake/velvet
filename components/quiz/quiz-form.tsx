'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ArrowLeft, ArrowRight, Check, X, Upload, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Progress } from '@/components/ui/progress'
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

interface QuizFormProps {
  onClose: () => void
}

const steps = [
  { id: 1, title: 'Тип помещения' },
  { id: 2, title: 'Тип изделия' },
  { id: 3, title: 'Размеры' },
  { id: 4, title: 'Опции' },
  { id: 5, title: 'Контакты' },
]

export function QuizForm({ onClose }: QuizFormProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [files, setFiles] = useState<File[]>([])

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    trigger,
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
  const progress = (currentStep / steps.length) * 100

  const validateCurrentStep = async () => {
    switch (currentStep) {
      case 1:
        return await trigger('venueType')
      case 2:
        return await trigger('clothingTypes')
      case 3:
        return await trigger(['width', 'height'])
      case 4:
        return await trigger(['fabric', 'mounting'])
      case 5:
        return await trigger(['name', 'email', 'phone'])
      default:
        return true
    }
  }

  const nextStep = async () => {
    const isValid = await validateCurrentStep()
    if (isValid && currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const onSubmit = async (data: QuizData) => {
    setIsSubmitting(true)
    
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

      if (!response.ok) throw new Error('Ошибка отправки')
      
      setIsSuccess(true)
    } catch (error) {
      console.error('Submit error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(e.target.files || [])
    const validFiles = newFiles.filter(file => file.size <= 10 * 1024 * 1024) // 10MB limit
    setFiles(prev => [...prev, ...validFiles].slice(0, 5)) // Max 5 files
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
      <div className="sticky top-0 bg-card z-10 px-6 pt-6 pb-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Расчет стоимости</h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="flex items-center gap-2 mb-2">
          {steps.map((step) => (
            <div
              key={step.id}
              className={`flex-1 h-1 rounded-full transition-colors ${
                step.id <= currentStep ? 'bg-accent' : 'bg-muted'
              }`}
            />
          ))}
        </div>
        <p className="text-sm text-muted-foreground">
          Шаг {currentStep} из {steps.length}: {steps[currentStep - 1].title}
        </p>
      </div>

      {/* Form content */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="p-6 min-h-[300px]">
          <AnimatePresence mode="wait">
            {/* Step 1: Venue Type */}
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <h4 className="font-medium text-foreground mb-4">
                  Какой тип помещения вы оснащаете?
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  {venueTypes.map((venue) => (
                    <label
                      key={venue.value}
                      className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        watchedValues.venueType === venue.value
                          ? 'border-accent bg-accent/5'
                          : 'border-border hover:border-accent/50'
                      }`}
                    >
                      <input
                        type="radio"
                        {...register('venueType')}
                        value={venue.value}
                        className="sr-only"
                      />
                      <span className="text-sm">{venue.label}</span>
                    </label>
                  ))}
                </div>
                {errors.venueType && (
                  <p className="text-sm text-destructive">{errors.venueType.message}</p>
                )}
              </motion.div>
            )}

            {/* Step 2: Clothing Types */}
            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <h4 className="font-medium text-foreground mb-4">
                  Какие элементы одежды сцены вам нужны?
                </h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Можно выбрать несколько вариантов
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {clothingTypes.map((type) => {
                    const isSelected = watchedValues.clothingTypes?.includes(type.value)
                    return (
                      <label
                        key={type.value}
                        className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                          isSelected
                            ? 'border-accent bg-accent/5'
                            : 'border-border hover:border-accent/50'
                        }`}
                      >
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={(checked) => {
                            const current = watchedValues.clothingTypes || []
                            if (checked) {
                              setValue('clothingTypes', [...current, type.value])
                            } else {
                              setValue('clothingTypes', current.filter((v) => v !== type.value))
                            }
                          }}
                        />
                        <span className="text-sm">{type.label}</span>
                      </label>
                    )
                  })}
                </div>
                {errors.clothingTypes && (
                  <p className="text-sm text-destructive">{errors.clothingTypes.message}</p>
                )}
              </motion.div>
            )}

            {/* Step 3: Dimensions */}
            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h4 className="font-medium text-foreground mb-4">
                  Укажите примерные размеры сцены
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Ширина портала (м)
                    </label>
                    <Input
                      {...register('width')}
                      placeholder="например, 12"
                      type="number"
                      step="0.1"
                    />
                    {errors.width && (
                      <p className="text-sm text-destructive mt-1">{errors.width.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Высота портала (м)
                    </label>
                    <Input
                      {...register('height')}
                      placeholder="например, 8"
                      type="number"
                      step="0.1"
                    />
                    {errors.height && (
                      <p className="text-sm text-destructive mt-1">{errors.height.message}</p>
                    )}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Если точных размеров нет — укажите примерные.
                </p>
              </motion.div>
            )}

            {/* Step 4: Options */}
            {currentStep === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <h4 className="font-medium text-foreground mb-4">
                    Предпочтения по ткани
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    {fabricTypes.map((fabric) => (
                      <label
                        key={fabric.value}
                        className={`flex items-center p-3 rounded-lg border-2 cursor-pointer transition-all ${
                          watchedValues.fabric === fabric.value
                            ? 'border-accent bg-accent/5'
                            : 'border-border hover:border-accent/50'
                        }`}
                      >
                        <input
                          type="radio"
                          {...register('fabric')}
                          value={fabric.value}
                          className="sr-only"
                        />
                        <span className="text-sm">{fabric.label}</span>
                      </label>
                    ))}
                  </div>
                  {errors.fabric && (
                    <p className="text-sm text-destructive mt-1">{errors.fabric.message}</p>
                  )}
                </div>
              </motion.div>
            )}

            {/* Step 5: Contacts */}
            {currentStep === 5 && (
              <motion.div
                key="step5"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <h4 className="font-medium text-foreground mb-4">
                  Контактные данные
                </h4>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Ваше имя *
                    </label>
                    <Input {...register('name')} placeholder="Иван Петров" />
                    {errors.name && (
                      <p className="text-sm text-destructive mt-1">{errors.name.message}</p>
                    )}
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Организация
                    </label>
                    <Input {...register('company')} placeholder="Название театра / ДК" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Email *
                    </label>
                    <Input {...register('email')} type="email" placeholder="email@example.com" />
                    {errors.email && (
                      <p className="text-sm text-destructive mt-1">{errors.email.message}</p>
                    )}
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Телефон *
                    </label>
                    <Input
                      {...register('phone')}
                      placeholder="+7 (999) 123-45-67"
                      onChange={(e) => {
                        const formatted = formatPhone(e.target.value)
                        setValue('phone', formatted)
                      }}
                    />
                    {errors.phone && (
                      <p className="text-sm text-destructive mt-1">{errors.phone.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Комментарий
                  </label>
                  <Textarea
                    {...register('comment')}
                    placeholder="Дополнительная информация о проекте"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Прикрепить файлы
                  </label>
                  <div className="border-2 border-dashed border-border rounded-lg p-4 text-center">
                    <input
                      type="file"
                      multiple
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      onChange={handleFileChange}
                      className="hidden"
                      id="file-upload"
                    />
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">
                        Чертежи, фото, ТЗ (до 10 Мб)
                      </p>
                    </label>
                  </div>
                  {files.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {files.map((file, index) => (
                        <div key={index} className="flex items-center justify-between text-sm bg-muted p-2 rounded">
                          <span className="truncate">{file.name}</span>
                          <button
                            type="button"
                            onClick={() => removeFile(index)}
                            className="text-muted-foreground hover:text-destructive"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-start gap-3 pt-2">
                  <Checkbox id="privacy-policy" required />
                  <label htmlFor="privacy-policy" className="text-xs text-muted-foreground leading-relaxed">
                    Нажимая кнопку «Отправить», вы соглашаетесь с{' '}
                    <a 
                      href="https://velvet-pro.ru/politica.pdf" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-accent hover:underline"
                    >
                      политикой конфиденциальности
                    </a>
                  </label>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-card border-t border-border px-6 py-4 flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Назад
          </Button>

          {currentStep < steps.length ? (
            <Button type="button" onClick={nextStep}>
              Далее
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Отправка...
                </>
              ) : (
                'Отправить заявку'
              )}
            </Button>
          )}
        </div>
      </form>
    </div>
  )
}
