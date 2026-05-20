import type { Metadata, Viewport } from 'next'
import { Montserrat, Roboto, Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const montserrat = Montserrat({ 
  subsets: ["latin", "cyrillic"],
  variable: "--font-montserrat",
  weight: ["400", "500", "600", "700", "800"]
})

const roboto = Roboto({ 
  subsets: ["latin", "cyrillic"],
  variable: "--font-roboto",
  weight: ["400", "500", "700"]
})

const inter = Inter({ 
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter"
})

export const metadata: Metadata = {
  title: 'Одежда сцены | Velvet-Pro — Театральные шторы и драпировки',
  description: 'Профессиональное изготовление театральных штор, занавесов и драпировок для сцен. Работаем с театрами, ДК, концертными залами. Индивидуальный пошив, монтаж, гарантия качества.',
  keywords: ['театральные шторы', 'одежда сцены', 'занавес', 'драпировка', 'кулисы', 'задник сцены', 'velvet-pro'],
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
  openGraph: {
    title: 'Одежда сцены | Velvet-Pro',
    description: 'Профессиональное изготовление театральных штор и драпировок',
    type: 'website',
  },
}

export const viewport: Viewport = {
  themeColor: '#1a2744',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ru" className={`${montserrat.variable} ${roboto.variable} ${inter.variable}`}>
      <body className="font-sans antialiased bg-background">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
