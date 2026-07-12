import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { sendQuizEmail } from '@/lib/email'

// Ограничения на вложения
const MAX_FILES = 5
const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10 МБ
const MAX_TOTAL_SIZE = 15 * 1024 * 1024 // 15 МБ
const ALLOWED_EXTENSIONS = ['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png']
const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'image/jpeg',
  'image/png',
]

// Запрещаем HTML-теги в текстовых полях как дополнительный слой защиты
const noHtml = (min: number, max: number, msg?: string) =>
  z.string().min(min, msg).max(max).refine((v) => !/[<>]/.test(v), { message: 'Недопустимые символы' })

const quizSchema = z.object({
  venueType: noHtml(1, 100),
  clothingTypes: z.string().transform(val => JSON.parse(val)),
  width: noHtml(1, 20),
  height: noHtml(1, 20),
  fabric: noHtml(1, 100),
  name: noHtml(2, 100),
  email: z.string().email().max(150),
  phone: noHtml(10, 30),
  company: noHtml(0, 150).optional(),
  comment: noHtml(0, 2000).optional(),
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

    // Extract and validate uploaded files
    const rawFiles = formData.getAll('files').filter(
      (f): f is File => f instanceof File && f.size > 0
    )

    if (rawFiles.length > MAX_FILES) {
      return NextResponse.json(
        { error: `Можно прикрепить не более ${MAX_FILES} файлов` },
        { status: 400 }
      )
    }

    let totalSize = 0
    for (const file of rawFiles) {
      const ext = file.name.slice(file.name.lastIndexOf('.')).toLowerCase()
      if (!ALLOWED_EXTENSIONS.includes(ext) || !ALLOWED_MIME_TYPES.includes(file.type)) {
        return NextResponse.json(
          { error: `Недопустимый тип файла: ${file.name}. Разрешены PDF, DOC, DOCX, JPG, PNG` },
          { status: 400 }
        )
      }
      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          { error: `Файл «${file.name}» превышает 10 МБ` },
          { status: 400 }
        )
      }
      totalSize += file.size
    }

    if (totalSize > MAX_TOTAL_SIZE) {
      return NextResponse.json(
        { error: 'Суммарный размер файлов превышает 15 МБ' },
        { status: 400 }
      )
    }

    // Convert files to buffers for email attachments
    const attachments = await Promise.all(
      rawFiles.map(async (file) => ({
        filename: file.name,
        content: Buffer.from(await file.arrayBuffer()),
        contentType: file.type || undefined,
      }))
    )

    console.log('Quiz submission received:', {
      ...validated.data,
      filesCount: attachments.length,
      fileNames: attachments.map((a) => a.filename),
    })

    // Send email notification to info@velvet-pro.ru and pirogov@cn.ru
    const emailSent = await sendQuizEmail(validated.data, attachments)

    if (!emailSent) {
      return NextResponse.json(
        { error: 'Не удалось отправить заявку. Попробуйте ещё раз или напишите на info@velvet-pro.ru' },
        { status: 502 }
      )
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
