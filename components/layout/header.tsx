'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Phone, Mail, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useQuiz } from '@/components/quiz/quiz-context'

const navigation = [
  { name: 'Каталог', href: '#catalog' },
  { name: 'О нас', href: '#advantages' },
  { name: 'Проекты', href: '#gallery' },
  { name: 'Контакты', href: '#contacts' },
]

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { openQuiz } = useQuiz()

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Top bar - dark */}
      <div className="hidden lg:block bg-navy-dark">
        <div className="mx-auto max-w-7xl px-6 py-2">
          <div className="flex items-center justify-between text-sm text-primary-foreground/70">
            <div className="flex items-center gap-6">
              <a href="tel:+74954806072" className="flex items-center gap-2 hover:text-gold transition-colors">
                <Phone className="h-4 w-4" />
                +7 495 480-60-72
              </a>
              <a 
                href="https://max.ru/u/f9LHodD0cOKAibvv4xnLwydR6sh_3dfTyvofGfaGlDE43RYshE6ATx0BtoM" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-gold transition-colors"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                </svg>
                MAX
              </a>
              <a 
                href="https://t.me/velvetpro" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-gold transition-colors"
              >
                <Send className="h-4 w-4" />
                Telegram
              </a>
              <a href="mailto:info@velvet-pro.ru" className="flex items-center gap-2 hover:text-gold transition-colors">
                <Mail className="h-4 w-4" />
                info@velvet-pro.ru
              </a>
            </div>
            <p>Бесплатная онлайн-консультация для регионов РФ</p>
          </div>
        </div>
      </div>

      {/* Main nav - white background */}
      <nav className="bg-white border-b border-border shadow-sm">
        <div className="mx-auto max-w-7xl px-6 py-3">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center">
              <Image 
                src="/images/logo.svg" 
                alt="Velvet-Pro - Одежда сцены" 
                width={125} 
                height={53}
                className="h-12 w-auto"
              />
            </Link>

            <div className="hidden lg:flex items-center gap-8">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-sm font-medium text-foreground/80 hover:text-gold transition-colors"
                >
                  {item.name}
                </a>
              ))}
            </div>

            <div className="hidden lg:flex items-center gap-4">
              <Button 
                className="bg-gold text-navy hover:bg-gold-light font-medium"
                onClick={openQuiz}
              >
                Рассчитать стоимость
              </Button>
            </div>

            <button
              type="button"
              className="lg:hidden text-foreground"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed top-0 right-0 bottom-0 w-80 bg-navy z-50 lg:hidden"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-8">
                  <span className="font-serif text-xl font-bold text-primary-foreground">Меню</span>
                  <button onClick={() => setMobileMenuOpen(false)}>
                    <X className="h-6 w-6 text-primary-foreground" />
                  </button>
                </div>
                <nav className="space-y-4">
                  {navigation.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className="block text-lg text-primary-foreground/80 hover:text-gold transition-colors py-2"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.name}
                    </a>
                  ))}
                </nav>
                <div className="mt-8 pt-8 border-t border-navy-light space-y-4">
                  <a href="tel:+74954806072" className="flex items-center gap-3 text-primary-foreground/70 hover:text-gold">
                    <Phone className="h-5 w-5" />
                    +7 495 480-60-72
                  </a>
                  <a href="mailto:info@velvet-pro.ru" className="flex items-center gap-3 text-primary-foreground/70 hover:text-gold">
                    <Mail className="h-5 w-5" />
                    info@velvet-pro.ru
                  </a>
                  <a 
                    href="https://max.ru/u/f9LHodD0cOKAibvv4xnLwydR6sh_3dfTyvofGfaGlDE43RYshE6ATx0BtoM" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-primary-foreground/70 hover:text-gold"
                  >
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                    </svg>
                    MAX
                  </a>
                </div>
                <Button 
                  className="w-full mt-8 bg-gold text-navy hover:bg-gold-light"
                  onClick={() => {
                    setMobileMenuOpen(false)
                    openQuiz()
                  }}
                >
                  Рассчитать стоимость
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  )
}
