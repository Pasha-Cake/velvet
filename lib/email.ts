import nodemailer from 'nodemailer'

const RECIPIENTS = ['info@velvet-pro.ru', 'pirogov@cn.ru']

/**
 * Экранирует пользовательский ввод для безопасной вставки в HTML письма.
 * Защищает от HTML/XSS-инъекций и фишинговых ссылок в письмах сотрудникам.
 */
function escapeHtml(value: unknown): string {
  if (value === null || value === undefined) return ''
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

/**
 * Экранирует значение для безопасного использования в атрибутах href (mailto:/tel:).
 * Удаляет любые символы, способные изменить URL или внедрить скрипт.
 */
function escapeAttr(value: unknown): string {
  return escapeHtml(String(value ?? '').replace(/["'<>`\s]/g, ''))
}

// Create transporter - will use environment variables for SMTP config
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  // Таймауты, чтобы отправка не зависала бесконечно при проблемах с SMTP
  connectionTimeout: 15000, // 15с на установку соединения
  greetingTimeout: 15000, // 15с на приветствие сервера
  socketTimeout: 60000, // 60с на передачу данных (важно для больших вложений)
})

/**
 * Очищает строку для использования в теме письма (Subject).
 * Удаляет переносы строк для защиты от инъекции заголовков письма.
 */
function sanitizeSubject(value: unknown): string {
  return String(value ?? '').replace(/[\r\n]+/g, ' ').trim().slice(0, 200)
}

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

interface EmailAttachment {
  filename: string
  content: Buffer
  contentType?: string
}

export async function sendQuizEmail(data: QuizData, attachments?: EmailAttachment[]): Promise<boolean> {
  const clothingTypesText = Array.isArray(data.clothingTypes) 
    ? data.clothingTypes.map(escapeHtml).join(', ') 
    : escapeHtml(data.clothingTypes)

  const html = `
    <h2>Новая заявка с квиза на сайте Velvet-Pro</h2>
    <p><strong>Дата:</strong> ${new Date().toLocaleString('ru-RU')}</p>
    <hr>
    <h3>Информация о проекте</h3>
    <table style="border-collapse: collapse; width: 100%;">
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd;"><strong>Тип помещения:</strong></td>
        <td style="padding: 8px; border: 1px solid #ddd;">${escapeHtml(data.venueType)}</td>
      </tr>
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd;"><strong>Тип изделий:</strong></td>
        <td style="padding: 8px; border: 1px solid #ddd;">${clothingTypesText}</td>
      </tr>
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd;"><strong>Размеры:</strong></td>
        <td style="padding: 8px; border: 1px solid #ddd;">${escapeHtml(data.width)} x ${escapeHtml(data.height)} м</td>
      </tr>
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd;"><strong>Ткань:</strong></td>
        <td style="padding: 8px; border: 1px solid #ddd;">${escapeHtml(data.fabric)}</td>
      </tr>
    </table>
    <h3>Контактные данные</h3>
    <table style="border-collapse: collapse; width: 100%;">
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd;"><strong>Имя:</strong></td>
        <td style="padding: 8px; border: 1px solid #ddd;">${escapeHtml(data.name)}</td>
      </tr>
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd;"><strong>Email:</strong></td>
        <td style="padding: 8px; border: 1px solid #ddd;"><a href="mailto:${escapeAttr(data.email)}">${escapeHtml(data.email)}</a></td>
      </tr>
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd;"><strong>Телефон:</strong></td>
        <td style="padding: 8px; border: 1px solid #ddd;"><a href="tel:${escapeAttr(data.phone)}">${escapeHtml(data.phone)}</a></td>
      </tr>
      ${data.company ? `
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd;"><strong>Компания:</strong></td>
        <td style="padding: 8px; border: 1px solid #ddd;">${escapeHtml(data.company)}</td>
      </tr>
      ` : ''}
      ${data.comment ? `
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd;"><strong>Комментарий:</strong></td>
        <td style="padding: 8px; border: 1px solid #ddd;">${escapeHtml(data.comment)}</td>
      </tr>
      ` : ''}
    </table>
    ${attachments && attachments.length > 0 ? `<p><strong>Прикрепленные файлы:</strong> ${attachments.map((a) => escapeHtml(a.filename)).join(', ')}</p>` : ''}
  `

  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || 'noreply@velvet-pro.ru',
      to: RECIPIENTS,
      subject: sanitizeSubject(`Новая заявка с квиза: ${data.name} - ${data.venueType}`),
      html,
      ...(attachments && attachments.length > 0
        ? { attachments: attachments.map((a) => ({ filename: a.filename, content: a.content, contentType: a.contentType })) }
        : {}),
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
    <p><strong>${escapeHtml(data.productName)}</strong></p>
    ` : ''}
    <h3>Контактные данные</h3>
    <table style="border-collapse: collapse; width: 100%;">
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd;"><strong>Имя:</strong></td>
        <td style="padding: 8px; border: 1px solid #ddd;">${escapeHtml(data.name)}</td>
      </tr>
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd;"><strong>Email:</strong></td>
        <td style="padding: 8px; border: 1px solid #ddd;"><a href="mailto:${escapeAttr(data.email)}">${escapeHtml(data.email)}</a></td>
      </tr>
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd;"><strong>Телефон:</strong></td>
        <td style="padding: 8px; border: 1px solid #ddd;"><a href="tel:${escapeAttr(data.phone)}">${escapeHtml(data.phone)}</a></td>
      </tr>
      ${data.company ? `
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd;"><strong>Компания:</strong></td>
        <td style="padding: 8px; border: 1px solid #ddd;">${escapeHtml(data.company)}</td>
      </tr>
      ` : ''}
      ${data.message ? `
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd;"><strong>Сообщение:</strong></td>
        <td style="padding: 8px; border: 1px solid #ddd;">${escapeHtml(data.message)}</td>
      </tr>
      ` : ''}
    </table>
  `

  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || 'noreply@velvet-pro.ru',
      to: RECIPIENTS,
      subject: sanitizeSubject(`Заявка на товар: ${data.productName || 'Общий запрос'} - ${data.name}`),
      html,
    })
    return true
  } catch (error) {
    console.error('Failed to send contact email:', error)
    return false
  }
}
