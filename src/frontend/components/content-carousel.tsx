"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, Heart, Clock, Play, Info } from 'lucide-react'
import { ActionPopup } from '@/components/action-popup'

interface ContentItem {
  id: string
  title: string
  image?: string
}

interface ContentCarouselProps {
  title: string
  items: ContentItem[]
  onItemClick?: (id: string) => void
}

export function ContentCarousel({ title, items, onItemClick }: ContentCarouselProps) {
  const [scrollPosition, setScrollPosition] = useState(0)
  const [showPopup, setShowPopup] = useState(false)
  const [popupMessage, setPopupMessage] = useState('')
  const [popupIcon, setPopupIcon] = useState<'heart' | 'clock'>('heart')

  const scroll = (direction: 'left' | 'right') => {
    const container = document.getElementById(`carousel-${title.replace(/\s+/g, '-')}`)
    if (container) {
      const scrollAmount = 400
      const newPosition = direction === 'left' ? scrollPosition - scrollAmount : scrollPosition + scrollAmount
      container.scrollTo({ left: newPosition, behavior: 'smooth' })
      setScrollPosition(newPosition)
    }
  }

  const handleAddToFavorites = (e: React.MouseEvent, itemTitle: string) => {
    e.stopPropagation()
    setPopupMessage(`"${itemTitle}" agregado a Favoritos`)
    setPopupIcon('heart')
    setShowPopup(true)
    setTimeout(() => setShowPopup(false), 3000)
  }

  const handleAddToWatchLater = (e: React.MouseEvent, itemTitle: string) => {
    e.stopPropagation()
    setPopupMessage(`"${itemTitle}" agregado a Ver más tarde`)
    setPopupIcon('clock')
    setShowPopup(true)
    setTimeout(() => setShowPopup(false), 3000)
  }

  return (
    <>
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">{title}</h2>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" onClick={() => scroll('left')} className="h-8 w-8">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => scroll('right')} className="h-8 w-8">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div
          id={`carousel-${title.replace(/\s+/g, '-')}`}
          className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {items.map((item) => (
            <div
              key={item.id}
              className="flex-shrink-0 w-48 cursor-pointer group"
              onClick={() => onItemClick?.(item.id)}
            >
              <div className="relative aspect-[2/3] rounded-lg overflow-hidden mb-2">
                <img
                  src={item.image || "/placeholder.svg"}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-3 space-y-2">
                    <div className="flex gap-2">
                      <Button
                        size="icon"
                        className="h-9 w-9 rounded-full bg-white text-black hover:bg-white/90"
                        onClick={(e) => {
                          e.stopPropagation()
                          onItemClick?.(item.id)
                        }}
                      >
                        <Play className="h-4 w-4 fill-current" />
                      </Button>
                      <Button
                        size="icon"
                        variant="outline"
                        className="h-9 w-9 rounded-full bg-transparent border-white hover:bg-white/20"
                        onClick={(e) => handleAddToFavorites(e, item.title)}
                      >
                        <Heart className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="outline"
                        className="h-9 w-9 rounded-full bg-transparent border-white hover:bg-white/20"
                        onClick={(e) => handleAddToWatchLater(e, item.title)}
                      >
                        <Clock className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="outline"
                        className="h-9 w-9 rounded-full bg-transparent border-white hover:bg-white/20 ml-auto"
                        onClick={(e) => {
                          e.stopPropagation()
                          onItemClick?.(item.id)
                        }}
                      >
                        <Info className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-sm font-medium truncate group-hover:text-primary transition-colors">{item.title}</p>
            </div>
          ))}
        </div>
      </div>

      <ActionPopup isOpen={showPopup} onClose={() => setShowPopup(false)} message={popupMessage} type="success" icon={popupIcon} />
    </>
  )
}
