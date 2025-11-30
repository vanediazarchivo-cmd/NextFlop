// src/frontend/services/profiles.service.ts
import { apiAuthFetch } from './api'

export interface Profile {
  id: string
  userId: string
  name: string
  iconUrl: string
  tasteProfile: Array<{ genre: string; score: number }>
  favorites: string[]
  watchLater: string[]
  history: Array<{ mediaId: string; watchedAt: Date }>
  createdAt?: Date
  updatedAt?: Date
}

export interface CreateProfileInput {
  name: string
  iconUrl?: string
}

export interface UpdateProfileInput {
  name?: string
  iconUrl?: string
}

export const profilesService = {
  /**
   * Obtener todos los perfiles del usuario autenticado
   */
  async getMyProfiles(): Promise<Profile[]> {
    return apiAuthFetch<Profile[]>('/profiles')
  },

  /**
   * Obtener un perfil específico
   */
  async getProfile(profileId: string): Promise<Profile> {
    return apiAuthFetch<Profile>(`/profiles/${profileId}`)
  },

  /**
   * Crear un nuevo perfil
   */
  async createProfile(data: CreateProfileInput): Promise<Profile> {
    return apiAuthFetch<Profile>('/profiles', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  /**
   * Actualizar un perfil
   */
  async updateProfile(profileId: string, data: UpdateProfileInput): Promise<Profile> {
    return apiAuthFetch<Profile>(`/profiles/${profileId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  },

  /**
   * Eliminar un perfil
   */
  async deleteProfile(profileId: string): Promise<void> {
    return apiAuthFetch<void>(`/profiles/${profileId}`, {
      method: 'DELETE',
    })
  },

  /**
   * Agregar película a favoritos
   */
  async addToFavorites(profileId: string, mediaId: string): Promise<Profile> {
    return apiAuthFetch<Profile>(`/profiles/${profileId}/list/favorites`, {
      method: 'POST',
      body: JSON.stringify({ mediaId }),
    })
  },

  /**
   * Eliminar película de favoritos
   */
  async removeFromFavorites(profileId: string, mediaId: string): Promise<Profile> {
    return apiAuthFetch<Profile>(`/profiles/${profileId}/list/favorites/${mediaId}`, {
      method: 'DELETE',
    })
  },

  /**
   * Agregar película a "Ver más tarde"
   */
  async addToWatchLater(profileId: string, mediaId: string): Promise<Profile> {
    return apiAuthFetch<Profile>(`/profiles/${profileId}/list/watchLater`, {
      method: 'POST',
      body: JSON.stringify({ mediaId }),
    })
  },

  /**
   * Eliminar película de "Ver más tarde"
   */
  async removeFromWatchLater(profileId: string, mediaId: string): Promise<Profile> {
    return apiAuthFetch<Profile>(`/profiles/${profileId}/list/watchLater/${mediaId}`, {
      method: 'DELETE',
    })
  },

  /**
   * Agregar película al historial (cuando se ve)
   */
  async addToHistory(profileId: string, mediaId: string): Promise<Profile> {
    return apiAuthFetch<Profile>(`/profiles/${profileId}/history`, {
      method: 'POST',
      body: JSON.stringify({ mediaId }),
    })
  },

  /**
   * Obtener favoritos
   */
  async getFavorites(profileId: string): Promise<string[]> {
    const profile = await apiAuthFetch<Profile>(`/profiles/${profileId}`)
    return profile.favorites
  },

  /**
   * Obtener "Ver más tarde"
   */
  async getWatchLater(profileId: string): Promise<string[]> {
    const profile = await apiAuthFetch<Profile>(`/profiles/${profileId}`)
    return profile.watchLater
  },

  /**
   * Obtener historial
   */
  async getHistory(profileId: string): Promise<Array<{ mediaId: string; watchedAt: Date }>> {
    const profile = await apiAuthFetch<Profile>(`/profiles/${profileId}`)
    return profile.history
  },
}
