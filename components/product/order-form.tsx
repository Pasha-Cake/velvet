'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { Check, Loader2, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import type { Product } from '@/lib/types'

const orderSchema = z.object({
  name: z.string().min(2, 'Введите ваше имя'),
  email: z.string().email('Некорректный email'),
  phone: z.string().regex(/^\+7\s?\(?\d{3}\)?\s?\d{3}[-\s]?\d{2}[-\s]?\d{2}$/, 'Формат: +7 (999) 123-45-67'),
  company: z.string().optional(),
  message: z.string().optional(),
})

type OrderData = z.infer<typeof orderSchema>

interface OrderFormProps {
  product: Product
  onClose: () => void
}

export function OrderForm({ product, onClose }: OrderFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<OrderData>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      company: '',
      message: '',
    },
  })

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

  const onSubmit = async (data: OrderData) => {
    setIsSubmitting(true)
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          productId: product.id,
          productName: product.name,
        }),
      })

      if (!response.ok) throw new Error('Ошибка отправки')
      
      setIsSuccess(true)
    } catch (error) {
      console.error('Submit error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="p-6 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-16 h-16 rounded-full bg-green-100 mx-auto mb-4 flex items-center justify-center"
        >
          <Check className="h-8 w-8 text-green-600" />
        </motion.div>
        <h3 className="text-xl font-bold text-foreground mb-2">Заявка отправлена!</h3>
        <p className="text-muted-foreground mb-4">
          Наш менеджер свяжется с вами в ближайшее время
        </p>
        <Button onClick={onClose}>Закрыть</Button>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Оставить заявку</h3>
          <p className="text-sm text-muted-foreground">{product.name}</p>
        </div>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
          <X className="h-5 w-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">
            Ваше имя *
          </label>
          <Input {...register('name')} placeholder="Иван Петров" />
          {errors.name && (
            <p className="text-sm text-destructive mt-1">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-1">
            Организация
          </label>
          <Input {...register('company')} placeholder="Название театра / ДК" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Email *
            </label>
            <Input {...register('email')} type="email" placeholder="email@example.com" />
            {errors.email && (
              <p className="text-sm text-destructive mt-1">{errors.email.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
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
          <label className="block text-sm font-medium text-foreground mb-1">
            Сообщение
          </label>
          <Textarea
            {...register('message')}
            placeholder="Опишите ваш проект или задайте вопрос"
            rows={3}
          />
        </div>

        <p className="text-xs text-muted-foreground">
          Нажимая кнопку «Отправить», вы соглашаетесь с{' '}
          <a href="#" className="text-accent hover:underline">
            политикой конфиденциальности
          </a>
        </p>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Отправка...
            </>
          ) : (
            'Отправить заявку'
          )}
        </Button>
      </form>
    </div>
  )
}
