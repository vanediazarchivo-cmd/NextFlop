'use client'

import { useState, useEffect } from 'react'
import { AppHeader } from '@/components/app-header'
import { ContentCarousel } from '@/components/content-carousel'
import { MovieModal } from '@/components/movie-modal'
import { mediaService, type Media } from '@/services/media.service'

export default function MoviesPage() {
  const [selectedMovie, setSelectedMovie] = useState<Media | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  
  // Estado para diferentes categorías
  const [recommended, setRecommended] = useState<Media[]>([])
  const [acclaimed, setAcclaimed] = useState<Media[]>([])
  const [recent, setRecent] = useState<Media[]>([])
  const [popular, setPopular] = useState<Media[]>([])
  const [classic, setClassic] = useState<Media[]>([])

  useEffect(() => {
    const loadMovies = async () => {
      try {
        setIsLoading(true)
        const [
          recommendedData,
          acclaimedData,
          recentData,
          popularData,
          classicData,
        ] = await Promise.all([
          mediaService.getMovies(6),
          mediaService.getAcclaimed(6),
          mediaService.getNewReleases(6),
          mediaService.getPopular(6),
          mediaService.getMovies(6),
        ])

        setRecommended(recommendedData)
        setAcclaimed(acclaimedData)
        setRecent(recentData)
        setPopular(popularData)
        setClassic(classicData)
      } catch (error) {
        console.error('Error loading movies:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadMovies()
  }, [])

  const handleItemClick = (media: Media) => {
    setSelectedMovie(media)
    setIsModalOpen(true)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <AppHeader />
        <main className="pt-32 flex items-center justify-center">
          <p className="text-muted-foreground">Cargando películas...</p>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />

      <main className="pt-16 pb-12">
        <div className="container mx-auto px-4 space-y-8">
          <div className="pt-8">
            <h1 className="text-4xl font-bold mb-2">Películas</h1>
            <p className="text-muted-foreground">Explora nuestro catálogo de películas</p>
          </div>

          {recommended.length > 0 && (
            <ContentCarousel
              title="Recomendado para ti"
              items={recommended.map(m => ({ id: m.id, title: m.title, image: m.posterUrl }))}
              onItemClick={(id) => {
                const media = recommended.find(m => m.id === id)
                if (media) handleItemClick(media)
              }}
            />
          )}

          {acclaimed.length > 0 && (
            <ContentCarousel
              title="Aclamadas por la crítica"
              items={acclaimed.map(m => ({ id: m.id, title: m.title, image: m.posterUrl }))}
              onItemClick={(id) => {
                const media = acclaimed.find(m => m.id === id)
                if (media) handleItemClick(media)
              }}
            />
          )}

          {recent.length > 0 && (
            <ContentCarousel
              title="Lanzamientos Recientes"
              items={recent.map(m => ({ id: m.id, title: m.title, image: m.posterUrl }))}
              onItemClick={(id) => {
                const media = recent.find(m => m.id === id)
                if (media) handleItemClick(media)
              }}
            />
          )}

          {popular.length > 0 && (
            <ContentCarousel
              title="Populares"
              items={popular.map(m => ({ id: m.id, title: m.title, image: m.posterUrl }))}
              onItemClick={(id) => {
                const media = popular.find(m => m.id === id)
                if (media) handleItemClick(media)
              }}
            />
          )}

          {classic.length > 0 && (
            <ContentCarousel
              title="Clásicos"
              items={classic.map(m => ({ id: m.id, title: m.title, image: m.posterUrl }))}
              onItemClick={(id) => {
                const media = classic.find(m => m.id === id)
                if (media) handleItemClick(media)
              }}
            />
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
