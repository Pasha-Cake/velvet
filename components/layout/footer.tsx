import Link from 'next/link'
import { Phone, Mail, MapPin } from 'lucide-react'

const navigation = {
  products: [
    { name: 'Занавесы', href: '#' },
    { name: 'Задники', href: '#' },
    { name: 'Кулисы', href: '#' },
    { name: 'Падуги', href: '#' },
    { name: 'Горизонты', href: '#' },
    { name: 'Драпировки', href: '#' },
  ],
  company: [
    { name: 'О компании', href: '#' },
    { name: 'Наши проекты', href: '#gallery' },
    { name: 'Как мы работаем', href: '#' },
    { name: 'Контакты', href: '#contacts' },
  ],
  legal: [
    { name: 'Политика конфиденциальности', href: '#' },
    { name: 'Договор оферты', href: '#' },
  ],
}

export function Footer() {
  return (
    <footer id="contacts" className="bg-navy-dark text-primary-foreground">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 rounded-lg bg-gold flex items-center justify-center">
                <span className="font-serif text-xl font-bold text-navy">V</span>
              </div>
              <div>
                <span className="block font-serif text-xl font-bold">Velvet-Pro</span>
                <span className="block text-xs text-primary-foreground/60 -mt-1">Одежда сцены</span>
              </div>
            </Link>
            <p className="text-sm text-primary-foreground/60 mb-6">
              Профессиональное изготовление театральных штор и драпировок 
              для театров, концертных залов и домов культуры.
            </p>
            <div className="space-y-3">
              <a href="tel:+78001234567" className="flex items-center gap-3 text-sm hover:text-gold transition-colors">
                <Phone className="h-4 w-4 text-gold" />
                8 (800) 123-45-67
              </a>
              <a href="mailto:info@velvet-pro.ru" className="flex items-center gap-3 text-sm hover:text-gold transition-colors">
                <Mail className="h-4 w-4 text-gold" />
                info@velvet-pro.ru
              </a>
              <div className="flex items-start gap-3 text-sm text-primary-foreground/60">
                <MapPin className="h-4 w-4 text-gold shrink-0 mt-0.5" />
                <span>г. Москва, ул. Театральная, д. 1, офис 100</span>
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
              <p>Пн-Пт: 9:00 - 18:00</p>
              <p>Сб: 10:00 - 15:00</p>
              <p>Вс: Выходной</p>
            </div>
            <div className="mt-6 p-4 rounded-lg bg-gold/10 border border-gold/20">
              <p className="text-sm text-gold font-medium">Бесплатный выезд замерщика</p>
              <p className="text-xs text-primary-foreground/60 mt-1">по всей России</p>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-primary-foreground/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-primary-foreground/40">
            © {new Date().getFullYear()} Velvet-Pro. Все права защищены.
          </p>
          <div className="flex gap-6">
            {navigation.legal.map((item) => (
              <Link 
                key={item.name}
                href={item.href}
                className="text-sm text-primary-foreground/40 hover:text-gold transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
