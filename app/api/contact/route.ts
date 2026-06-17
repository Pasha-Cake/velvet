import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { sendContactEmail } from '@/lib/email'

// Запрещаем HTML-теги в текстовых полях как дополнительный слой защиты
const noHtml = (min: number, max: number, msg?: string) =>
  z.string().min(min, msg).max(max).refine((v) => !/[<>]/.test(v), { message: 'Недопустимые символы' })

const contactSchema = z.object({
  name: noHtml(2, 100, 'Имя обязательно'),
  email: z.string().email('Некорректный email').max(150),
  phone: noHtml(10, 30, 'Телефон обязателен'),
  company: noHtml(0, 150).optional(),
  message: noHtml(0, 2000).optional(),
  productId: noHtml(0, 100).optional(),
  productName: noHtml(0, 200).optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const validated = contactSchema.safeParse(body)
    
    if (!validated.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validated.error.flatten() },
        { status: 400 }
      )
    }

    console.log('Contact form submission:', validated.data)

    // Send email notification to info@velvet-pro.ru and pirogov@cn.ru
    const emailSent = await sendContactEmail(validated.data)
    
    if (!emailSent) {
      console.warn('Email notification failed but form was submitted')
    }

    return NextResponse.json({ 
      success: true,
      message: 'Заявка успешно отправлена',
      id: `CONTACT-${Date.now()}`
    })
  } catch (error) {
    console.error('Contact API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
