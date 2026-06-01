import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { sendContactEmail } from '@/lib/email'

const contactSchema = z.object({
  name: z.string().min(2, 'Имя обязательно'),
  email: z.string().email('Некорректный email'),
  phone: z.string().min(10, 'Телефон обязателен'),
  company: z.string().optional(),
  message: z.string().optional(),
  productId: z.string().optional(),
  productName: z.string().optional(),
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
