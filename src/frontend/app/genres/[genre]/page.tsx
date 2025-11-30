'use client'

import { useState, useEffect } from 'react'
import { AppHeader } from '@/components/app-header'
import { MovieModal } from '@/components/movie-modal'
import { useParams } from 'next/navigation'
import { mediaService, type Media } from '@/services/media.service'

export default function GenrePage() {
  const params = useParams()
  const genre = (params?.genre as string) || ''
  const [items, setItems] = useState<Media[]>([])
  const [selectedMovie, setSelectedMovie] = useState<Media | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const genreName = genre ? genre.charAt(0).toUpperCase() + genre.slice(1) : ''

  useEffect(() => {
    const load = async () => {
      if (!genre) return
      try {
        setIsLoading(true)
        // Obtener hasta 24 elementos del género
        const list = await mediaService.getByGenre(genre, 24)
        setItems(list)
      } catch (error) {
        console.error('Error loading genre content', error)
        setItems([])
      } finally {
        setIsLoading(false)
      }
    }

    load()
  }, [genre])

  const handleItemClick = (item: Media) => {
    setSelectedMovie(item)
    setIsModalOpen(true)
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />

      <main className="pt-20 pb-12">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-2">{genreName}</h1>
            <p className="text-lg text-muted-foreground">
              Explora todas las películas y series de {genreName.toLowerCase()}
            </p>
          </div>

          {isLoading ? (
            <div className="py-20 text-center text-muted-foreground">Cargando contenido...</div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="cursor-pointer group"
                  onClick={() => handleItemClick(item)}
                >
                  <div className="relative aspect-[2/3] rounded-lg overflow-hidden mb-2 transition-transform group-hover:scale-105">
                    <img
                      src={item.posterUrl || "/placeholder.svg"}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="text-sm font-medium truncate group-hover:text-primary transition-colors">
                    {item.title}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <MovieModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        movie={selectedMovie}
      />
    </div>
  )
}
