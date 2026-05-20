export interface Product {
  id: string
  slug: string
  name: string
  category: ProductCategory
  shortDescription: string
  fullDescription: string
  images: string[]
  specifications: ProductSpecification[]
  features: string[]
  minPrice: number
  maxPrice: number
  unit: string
  inStock: boolean
  popular: boolean
}

export interface ProductSpecification {
  label: string
  value: string
}

export type ProductCategory = 
  | 'curtains'      // Занавесы
  | 'backdrops'     // Задники
  | 'wings'         // Кулисы
  | 'borders'       // Падуги
  | 'cycloramas'    // Горизонты
  | 'drapes'        // Драпировки

export const categoryLabels: Record<ProductCategory, string> = {
  curtains: 'Занавесы',
  backdrops: 'Задники',
  wings: 'Кулисы',
  borders: 'Падуги',
  cycloramas: 'Горизонты',
  drapes: 'Драпировки',
}

export interface QuizFormData {
  venueType: string
  clothingType: string[]
  width: string
  height: string
  fabric: string
  fireResistant: boolean
  mounting: string
  name: string
  email: string
  phone: string
  company: string
  comment: string
  files: File[]
}

export interface ContactFormData {
  name: string
  email: string
  phone: string
  company: string
  message: string
  productId?: string
}

export interface GalleryProject {
  id: string
  title: string
  location: string
  category: string
  image: string
  year: number
}

export interface Advantage {
  icon: string
  title: string
  description: string
}

export interface TimelineStep {
  step: number
  title: string
  description: string
}
