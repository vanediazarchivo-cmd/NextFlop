// src/frontend/services/subscriptions.service.ts
import { apiFetch, apiAuthFetch } from './api'

export interface SubscriptionPlan {
  id: string
  name: string
  price: number
  maxProfiles: number
  createdAt: Date
  updatedAt: Date
}

export interface Subscription {
  id: string
  userId: string
  planId: string
  status: 'active' | 'expired' | 'canceled'
  consecutiveMonthsPaid: number
  startDate: Date
  endDate: Date
  createdAt?: Date
  updatedAt?: Date
}

export interface CreateSubscriptionInput {
  planId: string
}

export const subscriptionsService = {
  /**
   * Obtener todos los planes de suscripción disponibles
   */
  async getPlans(): Promise<SubscriptionPlan[]> {
    return apiFetch<SubscriptionPlan[]>('/plans')
  },

  /**
   * Obtener detalles de un plan específico
   */
  async getPlan(planId: string): Promise<SubscriptionPlan> {
    return apiFetch<SubscriptionPlan>(`/plans/${planId}`)
  },

  /**
   * Obtener suscripción actual del usuario
   */
  async getCurrentSubscription(): Promise<Subscription | null> {
    try {
      return await apiAuthFetch<Subscription>('/subscriptions/current')
    } catch (error) {
      // Si no tiene suscripción, retornar null
      return null
    }
  },

  /**
   * Obtener todas las suscripciones del usuario
   */
  async getMySubscriptions(): Promise<Subscription[]> {
    return apiAuthFetch<Subscription[]>('/subscriptions')
  },

  /**
   * Obtener suscripción por ID
   */
  async getSubscription(subscriptionId: string): Promise<Subscription> {
    return apiAuthFetch<Subscription>(`/subscriptions/${subscriptionId}`)
  },

  /**
   * Crear una nueva suscripción
   */
  async createSubscription(planId: string): Promise<Subscription> {
    return apiAuthFetch<Subscription>('/subscriptions', {
      method: 'POST',
      body: JSON.stringify({ planId }),
    })
  },

  /**
   * Cancelar una suscripción
   */
  async cancelSubscription(subscriptionId: string): Promise<Subscription> {
    return apiAuthFetch<Subscription>(`/subscriptions/${subscriptionId}/cancel`, {
      method: 'POST',
    })
  },

  /**
   * Reactivar una suscripción cancelada
   */
  async reactivateSubscription(subscriptionId: string): Promise<Subscription> {
    return apiAuthFetch<Subscription>(`/subscriptions/${subscriptionId}/reactivate`, {
      method: 'POST',
    })
  },

  /**
   * Verificar si la suscripción está activa
   */
  async isSubscriptionActive(): Promise<boolean> {
    const subscription = await this.getCurrentSubscription()
    return subscription?.status === 'active'
  },
}
