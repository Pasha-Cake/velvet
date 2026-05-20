'use client'

import { motion } from 'framer-motion'
import { Calculator } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useQuiz } from '@/components/quiz/quiz-context'

export function QuizSection() {
  const { openQuiz } = useQuiz()

  return (
    <section className="py-24 bg-navy relative overflow-hidden">
      {/* Decorative */}
      <div className="absolute inset-0 bg-[url('/images/pattern.png')] opacity-5" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-gold/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-gold/5 rounded-full blur-2xl" />

      <div className="relative mx-auto max-w-4xl px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gold/10 mb-6">
            <Calculator className="h-8 w-8 text-gold" />
          </div>

          <h2 className="font-serif text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
            Рассчитайте стоимость проекта
          </h2>
          <p className="text-lg text-primary-foreground/70 max-w-2xl mx-auto mb-8">
            Ответьте на несколько вопросов о вашем проекте, и мы подготовим 
            индивидуальное коммерческое предложение с точной стоимостью
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Button 
              size="lg" 
              className="bg-gold text-navy hover:bg-gold-light text-base px-8"
              onClick={openQuiz}
            >
              <Calculator className="mr-2 h-5 w-5" />
              Рассчитать стоимость
            </Button>
            <p className="text-sm text-primary-foreground/50">
              Займет 2-3 минуты
            </p>
          </div>

          <div className="grid grid-cols-3 gap-8 max-w-lg mx-auto">
            {[
              { value: '5', label: 'простых вопросов' },
              { value: '24ч', label: 'срок ответа' },
              { value: 'Бесплатно', label: 'консультация' },
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl font-bold text-gold">{item.value}</div>
                <div className="text-xs text-primary-foreground/50">{item.label}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
