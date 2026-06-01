'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { X, MapPin, Calendar } from 'lucide-react'
import { galleryProjects } from '@/lib/data'
import type { GalleryProject } from '@/lib/types'

export function GallerySection() {
  const [selectedProject, setSelectedProject] = useState<GalleryProject | null>(null)

  return (
    <section id="gallery" className="py-24 bg-secondary/30">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
            Наши проекты
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Работаем с ведущими театрами, концертными залами 
            и культурными учреждениями России
          </p>
        </motion.div>

        {/* Gallery Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {galleryProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group cursor-pointer"
              onClick={() => setSelectedProject(project)}
            >
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
                
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <div className="text-xs text-gold mb-1">{project.category}</div>
                  <h3 className="font-semibold text-primary-foreground mb-2">
                    {project.title}
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-primary-foreground/70">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {project.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {project.year}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90"
            onClick={() => setSelectedProject(null)}
          >
            <button
              className="absolute top-4 right-4 p-2 text-white/80 hover:text-white"
              onClick={() => setSelectedProject(null)}
            >
              <X className="h-8 w-8" />
            </button>
            
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-4xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative aspect-[16/10] rounded-xl overflow-hidden">
                <Image
                  src={selectedProject.image}
                  alt={selectedProject.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="mt-4 text-center">
                <h3 className="text-xl font-semibold text-white mb-2">
                  {selectedProject.title}
                </h3>
                <div className="flex items-center justify-center gap-4 text-white/70">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {selectedProject.location}
                  </span>
                  <span>{selectedProject.category}</span>
                  <span>{selectedProject.year}</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
