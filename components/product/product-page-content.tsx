'use client'

import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { ProductGallery } from '@/components/product/product-gallery'
import { ProductInfo } from '@/components/product/product-info'
import { ProductSpecifications } from '@/components/product/product-specifications'
import { RelatedProducts } from '@/components/product/related-products'
import { QuizProvider } from '@/components/quiz/quiz-context'
import { categoryLabels, type Product } from '@/lib/types'

interface ProductPageContentProps {
  product: Product
  relatedProducts: Product[]
}

export function ProductPageContent({ product, relatedProducts }: ProductPageContentProps) {
  return (
    <QuizProvider>
      <Header />
      <main className="pt-32 lg:pt-36 pb-16">
        {/* Breadcrumbs */}
        <div className="mx-auto max-w-7xl px-6 mb-8">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground">
            <a href="/" className="hover:text-foreground transition-colors">Главная</a>
            <span>/</span>
            <a href="/#catalog" className="hover:text-foreground transition-colors">Каталог</a>
            <span>/</span>
            <a href={`/#catalog`} className="hover:text-foreground transition-colors">
              {categoryLabels[product.category]}
            </a>
            <span>/</span>
            <span className="text-foreground">{product.name}</span>
          </nav>
        </div>

        {/* Product content */}
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid lg:grid-cols-2 gap-12 mb-16">
            <ProductGallery images={product.images} name={product.name} />
            <ProductInfo product={product} />
          </div>

          <ProductSpecifications 
            specifications={product.specifications} 
            features={product.features}
            description={product.fullDescription}
          />

          {relatedProducts.length > 0 && (
            <RelatedProducts products={relatedProducts} />
          )}
        </div>
      </main>
      <Footer />
    </QuizProvider>
  )
}
