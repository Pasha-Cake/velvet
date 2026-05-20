import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

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

    // Here you would typically:
    // 1. Save to database
    // 2. Send email notification to sales team
    // 3. Integrate with CRM (Bitrix24, amoCRM, etc.)
    
    console.log('Contact form submission:', validated.data)

    // Simulate processing
    await new Promise(resolve => setTimeout(resolve, 300))

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
