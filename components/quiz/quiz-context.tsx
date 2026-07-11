'use client'

import { createContext, useContext, useState, ReactNode } from 'react'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { QuizForm } from '@/components/quiz/quiz-form'

interface QuizContextType {
  openQuiz: () => void
  closeQuiz: () => void
  isOpen: boolean
}

const QuizContext = createContext<QuizContextType | null>(null)

export function useQuiz() {
  const context = useContext(QuizContext)
  if (!context) {
    throw new Error('useQuiz must be used within QuizProvider')
  }
  return context
}

export function QuizProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)

  const openQuiz = () => setIsOpen(true)
  const closeQuiz = () => setIsOpen(false)

  return (
    <QuizContext.Provider value={{ openQuiz, closeQuiz, isOpen }}>
      {children}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent showCloseButton={false} className="max-w-2xl max-h-[90vh] overflow-y-auto p-0">
          <DialogTitle className="sr-only">Расчет стоимости проекта</DialogTitle>
          <QuizForm onClose={closeQuiz} />
        </DialogContent>
      </Dialog>
    </QuizContext.Provider>
  )
}
