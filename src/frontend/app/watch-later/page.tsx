"use client"

import { useState, useEffect } from 'react'
import { AppHeader } from '@/components/app-header'
import { Button } from '@/components/ui/button'
import { Clock, Play } from 'lucide-react'
import { ActionPopup } from '@/components/action-popup'
import { ConfirmationDialog } from '@/components/confirmation-dialog'
import { profilesService } from '@/services/profiles.service'
import { mediaService, type Media } from '@/services/media.service'

export default function WatchLaterPage() {
  const [items, setItems] = useState<Media[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showPopup, setShowPopup] = useState(false)
  const [popupMessage, setPopupMessage] = useState('')
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [itemToRemove, setItemToRemove] = useState<string | null>(null)
  const [currentProfileId, setCurrentProfileId] = useState<string>('')

  useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true)
        const profileId = localStorage.getItem('currentProfileId') || ''
        if (!profileId) {
          setItems([])
          setIsLoading(false)
          return
        }
        setCurrentProfileId(profileId)
        const profile = await profilesService.getProfile(profileId)
        const list = await Promise.all(
          profile.watchLater.map(id => mediaService.getDetail(id).catch(() => null))
        )
        const valid = list.filter((m): m is Media => m !== null)
        setItems(valid)
      } catch (err) {
        console.error('Error loading watch later', err)
        setItems([])
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [])

  const handleRemove = (id: string) => {
    setItemToRemove(id)
    setShowConfirmDialog(true)
  }

  const confirmRemove = async () => {
    if (!itemToRemove || !currentProfileId) return
    try {
      await profilesService.removeFromWatchLater(currentProfileId, itemToRemove)
      setItems(items.filter(i => i.id !== itemToRemove))
      setPopupMessage('Eliminado de Ver más tarde')
      setShowPopup(true)
      setTimeout(() => setShowPopup(false), 3000)
    } catch (err) {
      console.error('Error removing watch later', err)
      setPopupMessage('Error al eliminar')
      setShowPopup(true)
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
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
              <Clock className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Ver más tarde</h1>
              <p className="text-muted-foreground">{items.length} {items.length === 1 ? 'título' : 'títulos'} guardados</p>
            </div>
          </div>

          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Clock className="h-16 w-16 text-muted-foreground mb-4" />
              <h2 className="text-2xl font-bold mb-2">No tienes contenido guardado</h2>
              <p className="text-muted-foreground max-w-md">
                Agrega películas y series a tu lista para verlas más tarde
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {items.map((item) => (
                <div key={item.id} className="group">
                  <div className="relative aspect-[2/3] rounded-lg overflow-hidden mb-3">
                    <img
                      src={item.image || "/placeholder.svg"}
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
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    </div>
                    <div className="absolute top-2 right-2 bg-black/80 backdrop-blur-sm px-2 py-1 rounded text-xs font-medium">
                      {item.duration}
                    </div>
                  </div>
                  <h3 className="font-semibold mb-1 line-clamp-2 group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Agregado el {new Date(item.addedDate).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
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
        type="success"
        icon="trash"
      />

      <ConfirmationDialog
        isOpen={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        onConfirm={confirmRemove}
        title="Eliminar de Ver más tarde"
        description="¿Estás seguro de que quieres eliminar este título de tu lista?"
        confirmText="Eliminar"
        variant="destructive"
      />
    </div>
  )
}
