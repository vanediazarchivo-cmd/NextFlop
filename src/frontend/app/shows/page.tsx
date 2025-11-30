'use client'

import { useState, useEffect } from 'react'
import { AppHeader } from '@/components/app-header'
import { ContentCarousel } from '@/components/content-carousel'
import { MovieModal } from '@/components/movie-modal'
import { mediaService, type Media } from '@/services/media.service'

export default function ShowsPage() {
  const [recommended, setRecommended] = useState<Media[]>([])
  const [popular, setPopular] = useState<Media[]>([])
  const [newShows, setNewShows] = useState<Media[]>([])
  const [miniSeries, setMiniSeries] = useState<Media[]>([])
  const [top10, setTop10] = useState<Media[]>([])
  const [selectedShow, setSelectedShow] = useState<Media | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    const load = async () => {
      try {
        const [rec, pop, nn, mini, top] = await Promise.all([
          mediaService.getRecommended(6),
          mediaService.getPopular(6),
          mediaService.getNewReleases(6),
          mediaService.getSeries(6),
          mediaService.getPopular(6),
        ])
        setRecommended(rec)
        setPopular(pop)
        setNewShows(nn)
        setMiniSeries(mini)
        setTop10(top)
      } catch (err) {
        console.error('Error loading shows', err)
      }
    }
    load()
  }, [])

  const handleItemClick = (id: string) => {
    const found = [...recommended, ...popular, ...newShows, ...miniSeries, ...top10].find(m => m.id === id) || null
    setSelectedShow(found)
    setIsModalOpen(true)
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />

      <main className="pt-20 pb-12">
        <div className="container mx-auto px-4 space-y-8">
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-2">Series</h1>
            <p className="text-lg text-muted-foreground">Encuentra tu próxima serie favorita</p>
          </div>

          {/* Shows Sections */}
          <ContentCarousel
            title="Series recomendadas"
            items={recommended.map(m => ({ id: m.id, title: m.title, image: m.posterUrl }))}
            onItemClick={handleItemClick}
          />

          <ContentCarousel
            title="Series populares"
            items={popular.map(m => ({ id: m.id, title: m.title, image: m.posterUrl }))}
            onItemClick={handleItemClick}
          />

          <ContentCarousel
            title="Series nuevas"
            items={newShows.map(m => ({ id: m.id, title: m.title, image: m.posterUrl }))}
            onItemClick={handleItemClick}
          />

          <ContentCarousel
            title="Miniseries"
            items={miniSeries.map(m => ({ id: m.id, title: m.title, image: m.posterUrl }))}
            onItemClick={handleItemClick}
          />

          <ContentCarousel
            title="Top 10 de la semana"
            items={top10.map(m => ({ id: m.id, title: m.title, image: m.posterUrl }))}
            onItemClick={handleItemClick}
          />
        </div>
      </main>

      <MovieModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        movie={selectedShow}
      />
    </div>
  )
}
