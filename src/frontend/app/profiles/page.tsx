'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Play, Plus, Settings } from 'lucide-react'
import { profilesService, type Profile } from '@/services'

export default function ProfilesPage() {
  const router = useRouter()
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadProfiles = async () => {
      try {
        setIsLoading(true)
        const data = await profilesService.getMyProfiles()
        setProfiles(data)
      } catch (error) {
        console.error('Error loading profiles:', error)
        // Si hay error, mostrar array vacío y permitir crear perfil
      } finally {
        setIsLoading(false)
      }
    }

    loadProfiles()
  }, [])

  const handleProfileClick = (profileId: string) => {
    // Store selected profile in localStorage or state management
    localStorage.setItem('selectedProfile', profileId)
    router.push('/home')
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-background">
      {/* Logo Header */}
      <div className="flex items-center gap-2 mb-8">
        <Play className="h-10 w-10 text-primary fill-primary" />
        <span className="text-3xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
          NextFlop
        </span>
      </div>

      {/* Title */}
      <h1 className="text-4xl font-bold mb-12 text-center">¿Quién está viendo?</h1>

      {/* Profiles Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        {profiles.map((profile) => (
          <button
            key={profile.id}
            onClick={() => handleProfileClick(profile.id)}
            className="group flex flex-col items-center gap-3 p-4 rounded-lg hover:scale-105 transition-transform"
          >
            <div className="w-32 h-32 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 border-2 border-border group-hover:border-primary flex items-center justify-center text-5xl transition-all">
              {profile.icon}
            </div>
            <span className="text-lg font-medium text-muted-foreground group-hover:text-foreground transition-colors">
              {profile.name}
            </span>
          </button>
        ))}

        {/* Add Profile Button */}
        <button
          onClick={() => router.push('/profiles/create')}
          className="group flex flex-col items-center gap-3 p-4 rounded-lg hover:scale-105 transition-transform"
        >
          <div className="w-32 h-32 rounded-xl bg-card/50 backdrop-blur-sm border-2 border-dashed border-border group-hover:border-primary flex items-center justify-center transition-all">
            <Plus className="h-12 w-12 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
          <span className="text-lg font-medium text-muted-foreground group-hover:text-foreground transition-colors">
            Crear perfil
          </span>
        </button>
      </div>

      {/* Settings Link */}
      <Link
        href="/settings"
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mt-8"
      >
        <Settings className="h-5 w-5" />
        <span>Configurar cuenta</span>
      </Link>
    </div>
  )
}
