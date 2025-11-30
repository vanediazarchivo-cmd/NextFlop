'use client'

import { useState, useEffect } from 'react'
import { AppHeader } from '@/components/app-header'
import { HeroCarousel } from '@/components/hero-carousel'
import { ContentCarousel } from '@/components/content-carousel'
import { ContinueWatching } from '@/components/continue-watching'
import { MovieModal } from '@/components/movie-modal'
import { mediaService, type Media } from '@/services/media.service'

export default function HomePage() {
  const [selectedMovie, setSelectedMovie] = useState<Media | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  
  // Estado para cada sección
  const [recommendedItems, setRecommendedItems] = useState<Media[]>([])
  const [trendingItems, setTrendingItems] = useState<Media[]>([])
  const [popularItems, setPopularItems] = useState<Media[]>([])
  const [acclaimedItems, setAcclaimedItems] = useState<Media[]>([])
  const [newReleases, setNewReleases] = useState<Media[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadContent = async () => {
      try {
        setIsLoading(true)
        const [
          recommended,
          trending,
          popular,
          acclaimed,
          newRel,
        ] = await Promise.all([
          mediaService.getRecommended(6),
          mediaService.getTrending(6),
          mediaService.getPopular(6),
          mediaService.getAcclaimed(6),
          mediaService.getNewReleases(6),
        ])

        setRecommendedItems(recommended)
        setTrendingItems(trending)
        setPopularItems(popular)
        setAcclaimedItems(acclaimed)
        setNewReleases(newRel)
      } catch (error) {
        console.error('Error loading home content:', error)
        // Mantener arrays vacíos si hay error
      } finally {
        setIsLoading(false)
      }
    }

    loadContent()
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
          <p className="text-muted-foreground">Cargando contenido...</p>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />

      <main className="pt-16">
        <div className="space-y-8 pb-12">
          {/* Hero Carousel - Full width */}
          <HeroCarousel />

          {/* Content sections with container */}
          <div className="container mx-auto px-4 space-y-8">
            {/* Continue Watching Section */}
            <ContinueWatching />

            {/* Recommended Section */}
            {recommendedItems.length > 0 && (
              <ContentCarousel
                title="Recomendado para ti"
                items={recommendedItems.map(m => ({ id: m.id, title: m.title, image: m.posterUrl }))}
                onItemClick={(id) => {
                  const media = recommendedItems.find(m => m.id === id)
                  if (media) handleItemClick(media)
                }}
              />
            )}

            {/* Trending Section */}
            {trendingItems.length > 0 && (
              <ContentCarousel
                title="En tendencia"
                items={trendingItems.map(m => ({ id: m.id, title: m.title, image: m.posterUrl }))}
                onItemClick={(id) => {
                  const media = trendingItems.find(m => m.id === id)
                  if (media) handleItemClick(media)
                }}
              />
            )}

            {/* Popular This Week */}
            {popularItems.length > 0 && (
              <ContentCarousel
                title="Populares esta semana"
                items={popularItems.map(m => ({ id: m.id, title: m.title, image: m.posterUrl }))}
                onItemClick={(id) => {
                  const media = popularItems.find(m => m.id === id)
                  if (media) handleItemClick(media)
                }}
              />
            )}

            {/* Acclaimed */}
            {acclaimedItems.length > 0 && (
              <ContentCarousel
                title="Aclamadas por la crítica"
                items={acclaimedItems.map(m => ({ id: m.id, title: m.title, image: m.posterUrl }))}
                onItemClick={(id) => {
                  const media = acclaimedItems.find(m => m.id === id)
                  if (media) handleItemClick(media)
                }}
              />
            )}

            {/* New Releases */}
            {newReleases.length > 0 && (
              <ContentCarousel
                title="Nuevas en la plataforma"
                items={newReleases.map(m => ({ id: m.id, title: m.title, image: m.posterUrl }))}
                onItemClick={(id) => {
                  const media = newReleases.find(m => m.id === id)
                  if (media) handleItemClick(media)
                }}
              />
            )}
          </div>
        </div>
      </main>

      {/* Movie Modal */}
      <MovieModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        movie={selectedMovie}
      />
    </div>
  )
}
