// src/frontend/services/media.service.ts
import { apiFetch, apiAuthFetch } from './api'

export enum MediaType {
  MOVIE = 'movie',
  SERIES = 'series',
  DOCUMENTARY = 'documentary',
}

export interface Media {
  id: string
  title: string
  description?: string
  type: MediaType
  genres: string[]
  rating: number
  maturityRating: string
  releaseYear: number
  duration: number
  posterUrl?: string
  trailerUrl?: string
  isActive: boolean
  viewCount: number
  averageRating: number
  totalRatings: number
  createdAt: Date
  updatedAt: Date
}

export interface SearchFilters {
  genres?: string[]
  type?: MediaType
  minYear?: number
  maxYear?: number
  minRating?: number
  maxRating?: number
  maturityRating?: string[]
  language?: string
  offset?: number
  limit?: number
}

export interface PaginatedMediaResponse {
  items: Media[]
  total: number
  page: number
  limit: number
}

export const mediaService = {
  /**
   * Obtener todas las películas/series
   */
  async getAll(limit: number = 20, offset: number = 0): Promise<PaginatedMediaResponse> {
    return apiFetch<PaginatedMediaResponse>('/media', {
      method: 'GET',
    })
  },

  /**
   * Obtener medios recomendados
   */
  async getRecommended(limit: number = 6): Promise<Media[]> {
    return apiFetch<Media[]>(`/media/recommended?limit=${limit}`)
  },

  /**
   * Obtener medios en tendencia
   */
  async getTrending(limit: number = 6): Promise<Media[]> {
    return apiFetch<Media[]>(`/media/trending?limit=${limit}`)
  },

  /**
   * Obtener medios populares
   */
  async getPopular(limit: number = 6): Promise<Media[]> {
    return apiFetch<Media[]>(`/media/popular?limit=${limit}`)
  },

  /**
   * Obtener medios aclamados
   */
  async getAcclaimed(limit: number = 6): Promise<Media[]> {
    return apiFetch<Media[]>(`/media/acclaimed?limit=${limit}`)
  },

  /**
   * Obtener nuevos lanzamientos
   */
  async getNewReleases(limit: number = 6): Promise<Media[]> {
    return apiFetch<Media[]>(`/media/new-releases?limit=${limit}`)
  },

  /**
   * Obtener solo películas
   */
  async getMovies(limit: number = 6): Promise<Media[]> {
    return apiFetch<Media[]>(`/media?type=movie&limit=${limit}`)
  },

  /**
   * Obtener solo series
   */
  async getSeries(limit: number = 6): Promise<Media[]> {
    return apiFetch<Media[]>(`/media?type=series&limit=${limit}`)
  },

  /**
   * Buscar medios por término
   */
  async search(query: string, filters?: SearchFilters): Promise<PaginatedMediaResponse> {
    const params = new URLSearchParams({
      q: query,
      limit: filters?.limit?.toString() || '20',
      offset: filters?.offset?.toString() || '0',
    })

    if (filters?.type) params.append('type', filters.type)
    if (filters?.genres?.length) params.append('genres', filters.genres.join(','))
    if (filters?.minRating) params.append('minRating', filters.minRating.toString())
    if (filters?.maxRating) params.append('maxRating', filters.maxRating.toString())

    return apiFetch<PaginatedMediaResponse>(`/media/search?${params.toString()}`)
  },

  /**
   * Obtener detalles de un medio
   */
  async getDetail(mediaId: string): Promise<Media> {
    return apiFetch<Media>(`/media/${mediaId}`)
  },

  /**
   * Calificar un medio
   */
  async rateMedia(mediaId: string, rating: number): Promise<Media> {
    return apiAuthFetch<Media>(`/media/${mediaId}/rate`, {
      method: 'POST',
      body: JSON.stringify({ rating }),
    })
  },

  /**
   * Obtener por género
   */
  async getByGenre(genre: string, limit: number = 20): Promise<Media[]> {
    return apiFetch<Media[]>(`/media?genres=${genre}&limit=${limit}`)
  },

  /**
   * Obtener géneros disponibles
   */
  async getGenres(): Promise<string[]> {
    return apiFetch<string[]>('/media/genres')
  },

  // Uploads are handled by TMDB seeding; no manual upload endpoints.
}
