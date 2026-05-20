'use client'

import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import type { ProductSpecification } from '@/lib/types'

interface ProductSpecificationsProps {
  specifications: ProductSpecification[]
  features: string[]
  description: string
}

export function ProductSpecifications({ 
  specifications, 
  features,
  description 
}: ProductSpecificationsProps) {
  return (
    <section className="py-12 border-t border-border">
      <div className="grid lg:grid-cols-3 gap-12">
        {/* Description */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-serif text-2xl font-bold text-foreground mb-4">
              Описание
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-8">
              {description}
            </p>

            {/* Specifications table */}
            <h3 className="font-semibold text-lg text-foreground mb-4">
              Характеристики
            </h3>
            <div className="border border-border rounded-xl overflow-hidden">
              <table className="w-full">
                <tbody>
                  {specifications.map((spec, index) => (
                    <tr 
                      key={index}
                      className={index % 2 === 0 ? 'bg-muted/30' : 'bg-background'}
                    >
                      <td className="py-3 px-4 text-muted-foreground font-medium w-1/3">
                        {spec.label}
                      </td>
                      <td className="py-3 px-4 text-foreground">
                        {spec.value}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>

        {/* Sidebar */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="sticky top-36"
          >
            {/* Features card */}
            <div className="p-6 rounded-xl bg-secondary/50 border border-border mb-6">
              <h3 className="font-semibold text-foreground mb-4">
                Что вы получаете
              </h3>
              <ul className="space-y-3">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3 text-sm">
                    <div className="w-5 h-5 rounded-full bg-accent/10 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-accent" />
                    </div>
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact card */}
            <div className="p-6 rounded-xl bg-navy text-primary-foreground">
              <h3 className="font-semibold mb-2">Нужна консультация?</h3>
              <p className="text-sm text-primary-foreground/70 mb-4">
                Наш специалист ответит на ваши вопросы и поможет подобрать оптимальное решение
              </p>
              <a 
                href="tel:+78001234567"
                className="block text-lg font-bold text-gold hover:text-gold-light transition-colors"
              >
                8 (800) 123-45-67
              </a>
              <p className="text-xs text-primary-foreground/50 mt-1">
                Бесплатно по России
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
