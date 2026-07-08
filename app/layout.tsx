import type { Metadata, Viewport } from 'next'
import Script from 'next/script'
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
  title: 'Одежда сцены на заказ | Velvet-Pro — Театральные шторы, занавесы, драпировки',
  description: 'Velvet-Pro — производство одежды сцены на заказ. Театральные шторы, АРЗ, кулисы, падуги, задники для театров, ДК, концертных залов. 15+ лет опыта, 150+ проектов, доставка по РФ. Гарантия 2 года.',
  keywords: ['одежда сцены', 'театральные шторы', 'занавес на заказ', 'АРЗ', 'кулисы', 'падуги', 'задник сцены', 'арлекин', 'портал сцены', 'velvet-pro', 'театральный занавес', 'драпировка сцены'],
  generator: 'v0.app',
  authors: [{ name: 'Velvet-Pro' }],
  robots: 'index, follow',
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
    title: 'Одежда сцены на заказ | Velvet-Pro',
    description: 'Производство театральных штор, занавесов и драпировок. 15+ лет опыта, 150+ проектов, доставка по РФ.',
    type: 'website',
    locale: 'ru_RU',
    siteName: 'Velvet-Pro',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Одежда сцены на заказ | Velvet-Pro',
    description: 'Производство театральных штор, занавесов и драпировок для театров и ДК',
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
      <head>
        <Script
          id="gtm"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-TQQ26X8W');`,
          }}
        />
      </head>
      <body className="font-sans antialiased bg-background">
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-TQQ26X8W"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
