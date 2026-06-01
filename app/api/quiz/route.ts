import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { sendQuizEmail } from '@/lib/email'

const quizSchema = z.object({
  venueType: z.string().min(1),
  clothingTypes: z.string().transform(val => JSON.parse(val)),
  width: z.string().min(1),
  height: z.string().min(1),
  fabric: z.string().min(1),
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(10),
  company: z.string().optional(),
  comment: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    
    // Extract text fields
    const data: Record<string, string> = {}
    for (const [key, value] of formData.entries()) {
      if (typeof value === 'string') {
        data[key] = value
      }
    }

    // Validate
    const validated = quizSchema.safeParse(data)
    
    if (!validated.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validated.error.flatten() },
        { status: 400 }
      )
    }

    // Extract files if any
    const files: string[] = []
    for (const [key, value] of formData.entries()) {
      if (value instanceof File && key === 'files') {
        files.push(value.name)
      }
    }

    console.log('Quiz submission received:', {
      ...validated.data,
      filesCount: files.length,
      fileNames: files,
    })

    // Send email notification to info@velvet-pro.ru and pirogov@cn.ru
    const emailSent = await sendQuizEmail(validated.data, files)
    
    if (!emailSent) {
      console.warn('Email notification failed but form was submitted')
    }

    return NextResponse.json({ 
      success: true,
      message: 'Заявка успешно отправлена',
      id: `QUIZ-${Date.now()}`
    })
  } catch (error) {
    console.error('Quiz API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
