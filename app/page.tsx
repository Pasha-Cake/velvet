import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { HeroSection } from '@/components/sections/hero'
import { CatalogSection } from '@/components/sections/catalog'
import { AdvantagesSection } from '@/components/sections/advantages'
import { TimelineSection } from '@/components/sections/timeline'
import { GallerySection } from '@/components/sections/gallery'
import { SeoBlock } from '@/components/sections/seo-block'
import { QuizSection } from '@/components/sections/quiz-section'
import { QuizProvider } from '@/components/quiz/quiz-context'

export default function Home() {
  return (
    <QuizProvider>
      <Header />
      <main>
        <HeroSection />
        <CatalogSection />
        <AdvantagesSection />
        <TimelineSection />
        <GallerySection />
        <QuizSection />
        <SeoBlock />
      </main>
      <Footer />
    </QuizProvider>
  )
}
