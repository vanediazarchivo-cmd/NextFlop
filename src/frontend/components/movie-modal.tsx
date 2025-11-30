'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Clock, Heart, Play, X } from 'lucide-react'
import { ActionPopup } from '@/components/action-popup'
import { type Media } from '@/services/media.service'

interface MovieModalProps {
  isOpen: boolean
  onClose: () => void
  movie?: Media | null
}

export function MovieModal({ isOpen, onClose, movie }: MovieModalProps) {
  const [showPopup, setShowPopup] = useState(false)
  const [popupMessage, setPopupMessage] = useState('')
  const [popupIcon, setPopupIcon] = useState<'heart' | 'clock'>('heart')
  const [isFavorite, setIsFavorite] = useState(false)

  if (!movie) return null

  const handleAddToWatchLater = () => {
    setPopupMessage(`"${movie.title}" agregado a Ver más tarde`)
    setPopupIcon('clock')
    setShowPopup(true)
    setTimeout(() => setShowPopup(false), 3000)
  }

  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite)
    setPopupMessage(isFavorite ? `"${movie.title}" eliminado de Favoritos` : `"${movie.title}" agregado a Favoritos`)
    setPopupIcon('heart')
    setShowPopup(true)
    setTimeout(() => setShowPopup(false), 3000)
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-3xl p-0 overflow-hidden">
          <div className="relative aspect-video">
            <img
              src={movie.posterUrl || "/placeholder.svg"}
              alt={movie.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
          </div>
          <div className="p-6">
            <DialogTitle className="text-3xl font-bold mb-2">{movie.title}</DialogTitle>
            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
              <span>{movie.releaseYear}</span>
              <span>•</span>
              <span>{movie.type}</span>
              <span>•</span>
              <span>{movie.genres.join(', ')}</span>
            </div>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              {movie.description}
            </p>
            <div className="flex gap-3">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                <Play className="h-5 w-5 mr-2 fill-primary-foreground" />
                Reproducir
              </Button>
              <Button size="lg" variant="outline" onClick={handleAddToWatchLater}>
                <Clock className="h-5 w-5 mr-2" />
                Ver más tarde
              </Button>
              <Button 
                size="lg" 
                variant={isFavorite ? "default" : "outline"}
                onClick={handleToggleFavorite}
                className={isFavorite ? "bg-red-500 hover:bg-red-600" : ""}
              >
                <Heart className={`h-5 w-5 mr-2 ${isFavorite ? 'fill-current' : ''}`} />
                {isFavorite ? 'En Favoritos' : 'Agregar a Favoritos'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      <ActionPopup
        isOpen={showPopup}
        onClose={() => setShowPopup(false)}
        message={popupMessage}
        type="success"
        icon={popupIcon}
      />
    </>
  )
}
                <Heart className={`h-5 w-5 ${isFavorite ? 'fill-current' : ''}`} />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <ActionPopup
        isOpen={showPopup}
        onClose={() => setShowPopup(false)}
        message={popupMessage}
        type="success"
        icon={popupIcon}
      />
    </>
  )
}
