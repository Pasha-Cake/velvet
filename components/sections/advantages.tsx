'use client'

import { motion } from 'framer-motion'
import { Factory, Flame, Ruler, Truck, Shield, Clock } from 'lucide-react'
import { advantages } from '@/lib/data'

const iconMap: Record<string, React.ReactNode> = {
  factory: <Factory className="h-6 w-6" />,
  fire: <Flame className="h-6 w-6" />,
  ruler: <Ruler className="h-6 w-6" />,
  truck: <Truck className="h-6 w-6" />,
  shield: <Shield className="h-6 w-6" />,
  clock: <Clock className="h-6 w-6" />,
}

export function AdvantagesSection() {
  return (
    <section id="advantages" className="py-24 bg-navy relative overflow-hidden">
      {/* Decorative */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-gold/5 to-transparent" />
      <div className="absolute -bottom-32 -left-32 w-64 h-64 rounded-full bg-gold/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
            Почему выбирают нас
          </h2>
          <p className="text-lg text-primary-foreground/70 max-w-2xl mx-auto">
            Более 15 лет мы создаем качественную одежду сцены для театров 
            и концертных залов по всей России
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {advantages.map((advantage, index) => (
            <motion.div
              key={advantage.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group"
            >
              <div className="h-full p-6 rounded-xl bg-navy-light/50 border border-primary-foreground/10 hover:border-gold/30 transition-all hover:bg-navy-light">
                <div className="w-12 h-12 rounded-lg bg-gold/10 text-gold flex items-center justify-center mb-4 group-hover:bg-gold group-hover:text-navy transition-colors">
                  {iconMap[advantage.icon]}
                </div>
                <h3 className="font-semibold text-lg text-primary-foreground mb-2">
                  {advantage.title}
                </h3>
                <p className="text-primary-foreground/60">
                  {advantage.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 p-8 rounded-2xl bg-gradient-to-r from-gold/10 to-gold/5 border border-gold/20"
        >
          {[
            { value: '150+', label: 'Реализованных проектов' },
            { value: '89', label: 'Регионов присутствия' },
            { value: '15+', label: 'Лет опыта' },
            { value: '100%', label: 'Соблюдение сроков' },
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-gold mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-primary-foreground/60">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
