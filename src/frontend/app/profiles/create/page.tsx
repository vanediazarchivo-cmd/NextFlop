'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Play, ArrowLeft } from 'lucide-react'
import { profilesService } from '@/services/profiles.service'

const availableIcons = ['👨', '👩', '👦', '👧', '🧔', '👴', '👵', '🧒', '👶', '🐶', '🐱', '🦊']

export default function CreateProfilePage() {
  const router = useRouter()
  const [profileName, setProfileName] = useState('')
  const [selectedIcon, setSelectedIcon] = useState(availableIcons[0])
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const created = await profilesService.createProfile({ name: profileName, iconUrl: selectedIcon })
      // Guardar perfil seleccionado y redirigir
      localStorage.setItem('currentProfileId', created.id)
      alert('Perfil creado exitosamente')
      router.push('/profiles')
    } catch (err) {
      console.error('Error creating profile', err)
      alert('Error al crear el perfil')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center">
          <Link href="/" className="flex items-center gap-2">
            <Play className="h-8 w-8 text-primary fill-primary" />
            <span className="text-2xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              NextFlop
            </span>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-16 max-w-lg">
        <Button variant="ghost" className="mb-6" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver
        </Button>

        <Card className="bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl">Crear perfil</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="profileName">Nombre del perfil</Label>
                <Input
                  id="profileName"
                  type="text"
                  placeholder="Ej: Juan"
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  required
                  maxLength={20}
                />
              </div>

              <div className="space-y-3">
                <Label>Selecciona un icono</Label>
                <div className="grid grid-cols-6 gap-3">
                  {availableIcons.map((icon) => (
                    <button
                      key={icon}
                      type="button"
                      onClick={() => setSelectedIcon(icon)}
                      className={`aspect-square rounded-lg flex items-center justify-center text-3xl transition-all ${
                        selectedIcon === icon
                          ? 'bg-primary/20 border-2 border-primary scale-110'
                          : 'bg-card border-2 border-border hover:border-primary/50 hover:scale-105'
                      }`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => router.back()}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-primary hover:bg-primary/90"
                  disabled={isLoading}
                >
                  {isLoading ? 'Creando...' : 'Crear'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
