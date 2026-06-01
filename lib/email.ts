import nodemailer from 'nodemailer'

const RECIPIENTS = ['info@velvet-pro.ru', 'pirogov@cn.ru']

// Create transporter - will use environment variables for SMTP config
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

interface QuizData {
  venueType: string
  clothingTypes: string[]
  width: string
  height: string
  fabric: string
  name: string
  email: string
  phone: string
  company?: string
  comment?: string
}

interface ContactData {
  name: string
  email: string
  phone: string
  company?: string
  message?: string
  productId?: string
  productName?: string
}

export async function sendQuizEmail(data: QuizData, files?: string[]): Promise<boolean> {
  const clothingTypesText = Array.isArray(data.clothingTypes) 
    ? data.clothingTypes.join(', ') 
    : data.clothingTypes

  const html = `
    <h2>Новая заявка с квиза на сайте Velvet-Pro</h2>
    <p><strong>Дата:</strong> ${new Date().toLocaleString('ru-RU')}</p>
    <hr>
    <h3>Информация о проекте</h3>
    <table style="border-collapse: collapse; width: 100%;">
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd;"><strong>Тип помещения:</strong></td>
        <td style="padding: 8px; border: 1px solid #ddd;">${data.venueType}</td>
      </tr>
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd;"><strong>Тип изделий:</strong></td>
        <td style="padding: 8px; border: 1px solid #ddd;">${clothingTypesText}</td>
      </tr>
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd;"><strong>Размеры:</strong></td>
        <td style="padding: 8px; border: 1px solid #ddd;">${data.width} x ${data.height} м</td>
      </tr>
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd;"><strong>Ткань:</strong></td>
        <td style="padding: 8px; border: 1px solid #ddd;">${data.fabric}</td>
      </tr>
    </table>
    <h3>Контактные данные</h3>
    <table style="border-collapse: collapse; width: 100%;">
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd;"><strong>Имя:</strong></td>
        <td style="padding: 8px; border: 1px solid #ddd;">${data.name}</td>
      </tr>
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd;"><strong>Email:</strong></td>
        <td style="padding: 8px; border: 1px solid #ddd;"><a href="mailto:${data.email}">${data.email}</a></td>
      </tr>
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd;"><strong>Телефон:</strong></td>
        <td style="padding: 8px; border: 1px solid #ddd;"><a href="tel:${data.phone}">${data.phone}</a></td>
      </tr>
      ${data.company ? `
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd;"><strong>Компания:</strong></td>
        <td style="padding: 8px; border: 1px solid #ddd;">${data.company}</td>
      </tr>
      ` : ''}
      ${data.comment ? `
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd;"><strong>Комментарий:</strong></td>
        <td style="padding: 8px; border: 1px solid #ddd;">${data.comment}</td>
      </tr>
      ` : ''}
    </table>
    ${files && files.length > 0 ? `<p><strong>Прикрепленные файлы:</strong> ${files.join(', ')}</p>` : ''}
  `

  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || 'noreply@velvet-pro.ru',
      to: RECIPIENTS,
      subject: `Новая заявка с квиза: ${data.name} - ${data.venueType}`,
      html,
    })
    return true
  } catch (error) {
    console.error('Failed to send quiz email:', error)
    return false
  }
}

export async function sendContactEmail(data: ContactData): Promise<boolean> {
  const html = `
    <h2>Новая заявка на товар с сайта Velvet-Pro</h2>
    <p><strong>Дата:</strong> ${new Date().toLocaleString('ru-RU')}</p>
    <hr>
    ${data.productName ? `
    <h3>Товар</h3>
    <p><strong>${data.productName}</strong></p>
    ` : ''}
    <h3>Контактные данные</h3>
    <table style="border-collapse: collapse; width: 100%;">
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd;"><strong>Имя:</strong></td>
        <td style="padding: 8px; border: 1px solid #ddd;">${data.name}</td>
      </tr>
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd;"><strong>Email:</strong></td>
        <td style="padding: 8px; border: 1px solid #ddd;"><a href="mailto:${data.email}">${data.email}</a></td>
      </tr>
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd;"><strong>Телефон:</strong></td>
        <td style="padding: 8px; border: 1px solid #ddd;"><a href="tel:${data.phone}">${data.phone}</a></td>
      </tr>
      ${data.company ? `
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd;"><strong>Компания:</strong></td>
        <td style="padding: 8px; border: 1px solid #ddd;">${data.company}</td>
      </tr>
      ` : ''}
      ${data.message ? `
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd;"><strong>Сообщение:</strong></td>
        <td style="padding: 8px; border: 1px solid #ddd;">${data.message}</td>
      </tr>
      ` : ''}
    </table>
  `

  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || 'noreply@velvet-pro.ru',
      to: RECIPIENTS,
      subject: `Заявка на товар: ${data.productName || 'Общий запрос'} - ${data.name}`,
      html,
    })
    return true
  } catch (error) {
    console.error('Failed to send contact email:', error)
    return false
  }
}
