'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, Flame, Shield, Calculator, Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { OrderForm } from '@/components/product/order-form'
import { QuizForm } from '@/components/quiz/quiz-form'
import { categoryLabels, type Product } from '@/lib/types'

interface ProductInfoProps {
  product: Product
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat('ru-RU').format(price)
}

export function ProductInfo({ product }: ProductInfoProps) {
  const [orderOpen, setOrderOpen] = useState(false)
  const [quizOpen, setQuizOpen] = useState(false)

  return (
    <>
      <div className="space-y-6">
        {/* Category & badges */}
        <div className="flex items-center gap-3">
          <Badge variant="secondary">{categoryLabels[product.category]}</Badge>
          <Badge variant="outline" className="border-accent/50 text-accent">
            <Flame className="w-3 h-3 mr-1" />
            Класс Г1
          </Badge>
          {product.inStock && (
            <Badge className="bg-green-100 text-green-700 border-0">
              <Check className="w-3 h-3 mr-1" />
              В наличии
            </Badge>
          )}
        </div>

        {/* Title */}
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground">
          {product.name}
        </h1>

        {/* Short description */}
        <p className="text-lg text-muted-foreground">
          {product.shortDescription}
        </p>

        {/* Price */}
        <div className="p-6 rounded-xl bg-secondary/50 border border-border">
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-sm text-muted-foreground">от</span>
            <span className="text-3xl font-bold text-foreground">
              {formatPrice(product.minPrice)} ₽
            </span>
            <span className="text-muted-foreground">/ {product.unit}</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Точная стоимость зависит от размеров, материала и дополнительных опций
          </p>
        </div>

        {/* Features list */}
        <div>
          <h3 className="font-semibold text-foreground mb-3">Включено:</h3>
          <ul className="space-y-2">
            {product.features.map((feature, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-3 text-muted-foreground"
              >
                <div className="w-5 h-5 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3 text-accent" />
                </div>
                {feature}
              </motion.li>
            ))}
          </ul>
        </div>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <Button 
            size="lg" 
            className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90"
            onClick={() => setOrderOpen(true)}
          >
            <Phone className="mr-2 h-5 w-5" />
            Оставить заявку
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            className="flex-1"
            onClick={() => setQuizOpen(true)}
          >
            <Calculator className="mr-2 h-5 w-5" />
            Рассчитать стоимость
          </Button>
        </div>

        {/* Trust badges */}
        <div className="grid grid-cols-2 gap-4 pt-4">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
            <Shield className="h-8 w-8 text-accent" />
            <div>
              <div className="font-medium text-foreground text-sm">Гарантия 5 лет</div>
              <div className="text-xs text-muted-foreground">На все изделия</div>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
            <Flame className="h-8 w-8 text-accent" />
            <div>
              <div className="font-medium text-foreground text-sm">Сертификат</div>
              <div className="text-xs text-muted-foreground">Пожарной безопасности</div>
            </div>
          </div>
        </div>
      </div>

      {/* Order form dialog */}
      <Dialog open={orderOpen} onOpenChange={setOrderOpen}>
        <DialogContent className="max-w-lg">
          <DialogTitle className="sr-only">Оставить заявку</DialogTitle>
          <OrderForm product={product} onClose={() => setOrderOpen(false)} />
        </DialogContent>
      </Dialog>

      {/* Quiz dialog */}
      <Dialog open={quizOpen} onOpenChange={setQuizOpen}>
        <DialogContent showCloseButton={false} className="sm:max-w-4xl max-h-[90vh] overflow-y-auto p-0">
          <DialogTitle className="sr-only">Расчет стоимости</DialogTitle>
          <QuizForm onClose={() => setQuizOpen(false)} />
        </DialogContent>
      </Dialog>
    </>
  )
}
