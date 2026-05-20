'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Play } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { useQuiz } from '@/components/quiz/quiz-context'

export function HeroSection() {
  const { openQuiz } = useQuiz()
  return (
    <section className="relative min-h-screen flex items-center pt-32 lg:pt-40 pb-20 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-navy">
        <Image
          src="/images/hero-bg.jpg"
          alt=""
          fill
          className="object-cover opacity-30"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/90 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy via-transparent to-transparent" />
      </div>

      {/* Decorative elements */}
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-gold/10 rounded-full blur-2xl" />

      <div className="relative mx-auto max-w-7xl px-6 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 border border-gold/20 mb-6">
              <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
              <span className="text-sm text-gold">Более 150 реализованных проектов</span>
            </div>

            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground leading-tight mb-6 text-balance">
              Одежда сцены
              <span className="block text-gold">премиум-класса на заказ</span>
            </h1>

            <p className="text-lg text-primary-foreground/70 mb-4 max-w-xl leading-relaxed">
              15+ лет на рынке, 150+ проектов, 89 регионов РФ
            </p>
            <p className="text-lg text-primary-foreground/70 mb-8 max-w-xl leading-relaxed">
              Гарантия качества 2 года. Изготавливаем театральные шторы, занавесы и драпировки для театров, 
              концертных залов и домов культуры. Собственное производство, индивидуальный пошив.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Button 
                size="lg" 
                className="bg-gold text-navy hover:bg-gold-light text-base px-8"
                onClick={openQuiz}
              >
                Рассчитать стоимость
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10 text-base"
                onClick={() => document.getElementById('gallery')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <Play className="mr-2 h-5 w-5" />
                Смотреть проекты
              </Button>
            </div>

            <div className="flex items-center gap-8 pt-8 border-t border-primary-foreground/10">
              <div>
                <div className="text-3xl font-bold text-gold">15+</div>
                <div className="text-sm text-primary-foreground/60">лет на рынке</div>
              </div>
              <div className="w-px h-12 bg-primary-foreground/10" />
              <div>
                <div className="text-3xl font-bold text-gold">150+</div>
                <div className="text-sm text-primary-foreground/60">проектов</div>
              </div>
              <div className="w-px h-12 bg-primary-foreground/10" />
              <div>
                <div className="text-3xl font-bold text-gold">89</div>
                <div className="text-sm text-primary-foreground/60">регионов РФ</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hidden lg:block"
          >
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-gold/20 to-transparent rounded-2xl blur-xl" />
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-gold/20">
                <Image
                  src="/images/hero-curtain.jpg"
                  alt="Театральный занавес премиум-класса"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              
              {/* Floating card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="absolute -bottom-6 -left-6 bg-card p-4 rounded-xl shadow-2xl border border-border"
              >
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-lg bg-gold/10 flex items-center justify-center">
                    <span className="text-2xl">🏆</span>
                  </div>
                  <div>
                    <div className="font-semibold text-card-foreground">Гарантия качества</div>
                    <div className="text-sm text-muted-foreground">2 года на все изделия</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <div className="flex flex-col items-center gap-2">
          <span className="text-xs text-primary-foreground/40">Листайте вниз</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="w-6 h-10 rounded-full border-2 border-primary-foreground/20 flex items-start justify-center p-2"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-gold" />
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}
