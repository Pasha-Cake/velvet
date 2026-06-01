import Link from 'next/link'
import Image from 'next/image'
import { Phone, Mail, MapPin, Send } from 'lucide-react'

const navigation = {
  products: [
    { name: 'АРЗ', href: '#catalog' },
    { name: 'Арлекин', href: '#catalog' },
    { name: 'Кулисы', href: '#catalog' },
    { name: 'Падуги', href: '#catalog' },
    { name: 'Задники', href: '#catalog' },
    { name: 'Порталы', href: '#catalog' },
  ],
  company: [
    { name: 'О компании', href: '#' },
    { name: 'Наши проекты', href: '#gallery' },
    { name: 'Как мы работаем', href: '#' },
    { name: 'Контакты', href: '#contacts' },
  ],
  legal: [
    { name: 'Политика конфиденциальности', href: 'https://velvet-pro.ru/politica.pdf', external: true },
  ],
}

export function Footer() {
  return (
    <footer id="contacts" className="bg-navy-dark text-primary-foreground">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center mb-6">
              <Image 
                src="/images/logo.svg" 
                alt="Velvet-Pro - Одежда сцены" 
                width={125} 
                height={53}
                className="h-12 w-auto brightness-0 invert"
              />
            </Link>
            <p className="text-sm text-primary-foreground/60 mb-6">
              Профессиональное изготовление театральных штор и драпировок 
              для театров, концертных залов и домов культуры.
            </p>
            <div className="space-y-3">
              <a href="tel:+74954806072" className="flex items-center gap-3 text-sm hover:text-gold transition-colors">
                <Phone className="h-4 w-4 text-gold" />
                +7 495 480-60-72
              </a>
              <a href="mailto:info@velvet-pro.ru" className="flex items-center gap-3 text-sm hover:text-gold transition-colors">
                <Mail className="h-4 w-4 text-gold" />
                info@velvet-pro.ru
              </a>
              <a 
                href="https://max.ru/u/f9LHodD0cOKAibvv4xnLwydR6sh_3dfTyvofGfaGlDE43RYshE6ATx0BtoM" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-sm hover:text-gold transition-colors"
              >
                <svg className="h-4 w-4 text-gold" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                </svg>
                MAX
              </a>
              <a 
                href="https://t.me/velvetpro" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-sm hover:text-gold transition-colors"
              >
                <Send className="h-4 w-4 text-gold" />
                Telegram
              </a>
              <div className="flex items-start gap-3 text-sm text-primary-foreground/60">
                <MapPin className="h-4 w-4 text-gold shrink-0 mt-0.5" />
                <span>г. Москва, ул. Котляковская, 3с1</span>
              </div>
            </div>
          </div>

          {/* Products */}
          <div>
            <h3 className="font-semibold mb-4">Продукция</h3>
            <ul className="space-y-2">
              {navigation.products.map((item) => (
                <li key={item.name}>
                  <Link 
                    href={item.href}
                    className="text-sm text-primary-foreground/60 hover:text-gold transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold mb-4">Компания</h3>
            <ul className="space-y-2">
              {navigation.company.map((item) => (
                <li key={item.name}>
                  <Link 
                    href={item.href}
                    className="text-sm text-primary-foreground/60 hover:text-gold transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Working hours */}
          <div>
            <h3 className="font-semibold mb-4">Режим работы</h3>
            <div className="space-y-2 text-sm text-primary-foreground/60">
              <p>Будни с 10:00 до 17:00</p>
            </div>
            <div className="mt-6 p-4 rounded-lg bg-gold/10 border border-gold/20">
              <p className="text-sm text-gold font-medium">Бесплатная онлайн-консультация</p>
              <p className="text-xs text-primary-foreground/60 mt-1">для регионов РФ</p>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-primary-foreground/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-primary-foreground/40">
            © {new Date().getFullYear()} Velvet-Pro. Все права защищены.
          </p>
          <div className="flex gap-6">
            {navigation.legal.map((item) => (
              <a 
                key={item.name}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary-foreground/40 hover:text-gold transition-colors"
              >
                {item.name}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
