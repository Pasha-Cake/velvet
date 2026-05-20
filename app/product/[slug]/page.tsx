import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { ProductPageContent } from '@/components/product/product-page-content'
import { products } from '@/lib/data'

interface ProductPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params
  const product = products.find(p => p.slug === slug)
  
  if (!product) {
    return { title: 'Товар не найден' }
  }

  return {
    title: `${product.name} | Velvet-Pro — Одежда сцены`,
    description: product.fullDescription,
    openGraph: {
      title: product.name,
      description: product.shortDescription,
      images: product.images[0] ? [product.images[0]] : [],
    },
  }
}

export function generateStaticParams() {
  return products.map((product) => ({
    slug: product.slug,
  }))
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params
  const product = products.find(p => p.slug === slug)

  if (!product) {
    notFound()
  }

  const relatedProducts = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4)

  return <ProductPageContent product={product} relatedProducts={relatedProducts} />
}
