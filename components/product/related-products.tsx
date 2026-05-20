'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { categoryLabels, type Product } from '@/lib/types'

interface RelatedProductsProps {
  products: Product[]
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat('ru-RU').format(price)
}

export function RelatedProducts({ products }: RelatedProductsProps) {
  return (
    <section className="py-12 border-t border-border">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <h2 className="font-serif text-2xl font-bold text-foreground mb-8">
          Похожие товары
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href={`/product/${product.slug}`} className="group block">
                <div className="bg-card rounded-xl overflow-hidden border border-border hover:border-accent transition-colors">
                  <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-4">
                    <div className="text-xs text-muted-foreground mb-1">
                      {categoryLabels[product.category]}
                    </div>
                    <h3 className="font-semibold text-card-foreground mb-2 group-hover:text-accent transition-colors">
                      {product.name}
                    </h3>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs text-muted-foreground">от </span>
                        <span className="font-bold text-foreground">
                          {formatPrice(product.minPrice)} ₽
                        </span>
                      </div>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="text-accent hover:text-accent hover:bg-accent/10"
                      >
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
