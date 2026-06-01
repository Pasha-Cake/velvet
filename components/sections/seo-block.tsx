'use client'

import { motion } from 'framer-motion'

export function SeoBlock() {
  return (
    <section className="py-16 bg-background border-t border-border">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="prose prose-gray max-w-none"
        >
          <h2 className="font-serif text-2xl font-bold text-foreground mb-6">
            Одежда сцены: профессиональное изготовление театральных штор и драпировок
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8 text-muted-foreground">
            <div className="space-y-4">
              <p>
                Компания Velvet-Pro специализируется на изготовлении одежды сцены 
                для театров, концертных залов, домов культуры и других культурных 
                учреждений. Наше собственное производство позволяет создавать 
                изделия любой сложности: от классических АРЗ (антрактно-раздвижных занавесов) 
                до современных систем драпировки.
              </p>
              <p>
                Мы используем только качественные материалы, соответствующие требованиям ГОСТ. 
                Все изделия проходят строгий контроль качества и сопровождаются 
                необходимой документацией. Гарантия 2 года на все изделия.
              </p>
            </div>
            
            <div className="space-y-4">
              <p>
                <strong className="text-foreground">Что входит в понятие «одежда сцены»:</strong>
              </p>
              <ul className="list-disc list-inside space-y-1">
                <li>АРЗ (Антрактно-раздвижной занавес) — главный занавес сцены</li>
                <li>Задник — фоновое полотно для оформления глубины сцены</li>
                <li>Кулисы — боковые драпировки для маскировки закулисья</li>
                <li>Падуги — горизонтальные элементы, закрывающие верх сцены</li>
                <li>Арлекин — декоративный элемент портала сцены</li>
                <li>Портал — комплексное оформление проема сцены</li>
              </ul>
              <p>
                Выполняем полный комплекс работ: от проектирования 
                до изготовления и доставки. Работаем по всей России — 89 регионов, 
                более 150 реализованных проектов за 15 лет.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
