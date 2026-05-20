'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Flame, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { products } from '@/lib/data'
import { categoryLabels, type ProductCategory } from '@/lib/types'
import { useQuiz } from '@/components/quiz/quiz-context'

const categories: { value: ProductCategory | 'all'; label: string }[] = [
  { value: 'all', label: 'Все товары' },
  { value: 'curtains', label: 'Занавесы' },
  { value: 'backdrops', label: 'Задники' },
  { value: 'wings', label: 'Кулисы' },
  { value: 'borders', label: 'Падуги' },
  { value: 'cycloramas', label: 'Горизонты' },
  { value: 'drapes', label: 'Драпировки' },
]

function formatPrice(price: number): string {
  return new Intl.NumberFormat('ru-RU').format(price)
}

export function CatalogSection() {
  const [activeCategory, setActiveCategory] = useState<ProductCategory | 'all'>('all')
  const { openQuiz } = useQuiz()

  const filteredProducts = activeCategory === 'all' 
    ? products 
    : products.filter(p => p.category === activeCategory)

  return (
    <section id="catalog" className="py-24 bg-background">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
            Каталог продукции
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Изготавливаем все элементы одежды сцены: от классических занавесов 
            до современных систем драпировки
          </p>
        </motion.div>

        {/* Category filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((category) => (
            <button
              key={category.value}
              onClick={() => setActiveCategory(category.value)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeCategory === category.value
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>

        {/* Products grid */}
        <motion.div 
          layout
          className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Link href={`/product/${product.slug}`} className="group block">
                  <div className="bg-card rounded-xl overflow-hidden border border-border hover:border-accent transition-colors hover:shadow-lg">
                    {/* Image */}
                    <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      {/* Badges */}
                      <div className="absolute top-3 left-3 flex flex-col gap-2">
                        {product.popular && (
                          <Badge className="bg-gold text-navy border-0">
                            <Star className="w-3 h-3 mr-1 fill-current" />
                            Популярное
                          </Badge>
                        )}
                        <Badge variant="secondary" className="bg-card/90 backdrop-blur-sm">
                          <Flame className="w-3 h-3 mr-1" />
                          Г1
                        </Badge>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <div className="text-xs text-muted-foreground mb-1">
                        {categoryLabels[product.category]}
                      </div>
                      <h3 className="font-semibold text-card-foreground mb-2 group-hover:text-accent transition-colors">
                        {product.name}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {product.shortDescription}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-xs text-muted-foreground">от</div>
                          <div className="font-bold text-foreground">
                            {formatPrice(product.minPrice)} ₽
                          </div>
                        </div>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="text-accent hover:text-accent hover:bg-accent/10"
                        >
                          Подробнее
                          <ArrowRight className="ml-1 h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <p className="text-muted-foreground mb-4">
            Не нашли нужный товар? Мы изготовим любой элемент по вашему проекту
          </p>
          <Button 
            size="lg" 
            className="bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={openQuiz}
          >
            Заказать индивидуальный проект
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
