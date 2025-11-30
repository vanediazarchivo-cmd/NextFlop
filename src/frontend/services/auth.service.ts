// src/frontend/services/auth.service.ts
import { apiFetch, apiAuthFetch, setAuthToken, getAuthToken, clearAuthToken } from './api'

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterCredentials {
  email: string
  password: string
  fullName: string
}

export interface AuthResponse {
  user: {
    id: string
    email: string
    fullName: string
    currentPoints: number
  }
  accessToken: string
}

export interface UserProfile {
  id: string
  email: string
  fullName: string
  currentPoints: number
}

export const authService = {
  /**
   * Iniciar sesión
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiFetch<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    })
    
    if (response?.accessToken) {
      setAuthToken(response.accessToken)
    }
    
    return response
  },

  /**
   * Registrar nuevo usuario
   */
  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    const response = await apiFetch<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(credentials),
    })
    
    if (response?.accessToken) {
      setAuthToken(response.accessToken)
    }
    
    return response
  },

  /**
   * Obtener perfil del usuario actual
   */
  async getCurrentUser(): Promise<UserProfile> {
    return apiAuthFetch<UserProfile>('/auth/me')
  },

  /**
   * Agregar puntos al usuario
   */
  async addPoints(points: number): Promise<UserProfile> {
    return apiAuthFetch<UserProfile>('/auth/add-points', {
      method: 'POST',
      body: JSON.stringify({ points }),
    })
  },

  /**
   * Obtener saldo de puntos actual
   */
  async getPoints(): Promise<{ currentPoints: number }> {
    return apiAuthFetch<{ currentPoints: number }>('/auth/points')
  },

  /**
   * Logout (limpia el token)
   */
  logout(): void {
    clearAuthToken()
  },

  /**
   * Verifica si hay un token válido
   */
  isAuthenticated(): boolean {
    return !!getAuthToken()
  },
}
