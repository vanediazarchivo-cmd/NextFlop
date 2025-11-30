'use client'

import { useState, useEffect } from 'react'
import { AppHeader } from '@/components/app-header'
import { Button } from '@/components/ui/button'
import { Heart, Play } from 'lucide-react'
import { ActionPopup } from '@/components/action-popup'
import { ConfirmationDialog } from '@/components/confirmation-dialog'
import { profilesService } from '@/services/profiles.service'
import { mediaService, type Media } from '@/services/media.service'

export default function FavoritesPage() {
  const [items, setItems] = useState<Media[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showPopup, setShowPopup] = useState(false)
  const [popupMessage, setPopupMessage] = useState('')
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [itemToRemove, setItemToRemove] = useState<string | null>(null)
  const [currentProfileId, setCurrentProfileId] = useState<string>('')

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        setIsLoading(true)
        
        // Obtener el perfil actual del localStorage
        const profileId = localStorage.getItem('currentProfileId') || ''
        if (!profileId) {
          console.error('No profile selected')
          setIsLoading(false)
          return
        }
        
        setCurrentProfileId(profileId)
        
        // Obtener perfil (que contiene array de IDs de favoritos)
        const profile = await profilesService.getProfile(profileId)
        
        // Para cada ID de favorito, obtener los datos completos de la película
        const favoriteItems = await Promise.all(
          profile.favorites.map(mediaId =>
            mediaService.getDetail(mediaId).catch(() => null)
          )
        )
        
        // Filtrar los que no se pudieron obtener
        const validItems = favoriteItems.filter((item): item is Media => item !== null)
        setItems(validItems)
      } catch (error) {
        console.error('Error loading favorites:', error)
      } finally {
        setIsLoading(false)
      }
    }
    
    loadFavorites()
  }, [])

  const handleRemove = (id: string) => {
    setItemToRemove(id)
    setShowConfirmDialog(true)
  }

  const confirmRemove = async () => {
    if (!itemToRemove || !currentProfileId) return
    
    try {
      // Eliminar del backend
      await profilesService.removeFromFavorites(currentProfileId, itemToRemove)
      
      // Eliminar de la lista local
      setItems(items.filter(item => item.id !== itemToRemove))
      
      setPopupMessage('Eliminado de Favoritos')
      setShowPopup(true)
      setTimeout(() => setShowPopup(false), 3000)
    } catch (error) {
      console.error('Error removing favorite:', error)
      setPopupMessage('Error al eliminar favorito')
      setShowPopup(true)
      setTimeout(() => setShowPopup(false), 3000)
    } finally {
      setItemToRemove(null)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />

      <main className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-red-500/20 to-pink-500/20 flex items-center justify-center">
              <Heart className="h-6 w-6 text-red-500 fill-current" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Favoritos</h1>
              <p className="text-muted-foreground">{items.length} {items.length === 1 ? 'título' : 'títulos'} favoritos</p>
            </div>
          </div>

          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Heart className="h-16 w-16 text-muted-foreground mb-4" />
              <h2 className="text-2xl font-bold mb-2">No tienes favoritos</h2>
              <p className="text-muted-foreground max-w-md">
                Marca tus películas y series favoritas para tenerlas siempre a mano
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {items.map((item) => (
                <div key={item.id} className="group">
                  <div className="relative aspect-[2/3] rounded-lg overflow-hidden mb-3">
                    <img
                      src={item.posterUrl || "/placeholder.svg"}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <Button size="icon" className="h-12 w-12 rounded-full">
                        <Play className="h-5 w-5 fill-current" />
                      </Button>
                      <Button 
                        size="icon" 
                        variant="destructive" 
                        className="h-12 w-12 rounded-full"
                        onClick={() => handleRemove(item.id)}
                      >
                        <Heart className="h-5 w-5 fill-current" />
                      </Button>
                    </div>
                    <div className="absolute top-2 right-2 bg-black/80 backdrop-blur-sm px-2 py-1 rounded text-xs font-medium flex items-center gap-1">
                      <span className="text-yellow-400">★</span>
                      {item.rating}
                    </div>
                    <div className="absolute top-2 left-2">
                      <Heart className="h-5 w-5 text-red-500 fill-current" />
                    </div>
                  </div>
                  <h3 className="font-semibold mb-1 line-clamp-2 group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {item.releaseYear}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <ActionPopup
        isOpen={showPopup}
        onClose={() => setShowPopup(false)}
        message={popupMessage}
        type="error"
        icon="heart"
      />

      <ConfirmationDialog
        isOpen={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        onConfirm={confirmRemove}
        title="Eliminar de Favoritos"
        description="¿Estás seguro de que quieres eliminar este título de tus favoritos?"
        confirmText="Eliminar"
        variant="destructive"
      />
    </div>
  )
}
