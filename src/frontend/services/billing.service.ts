// src/frontend/services/billing.service.ts
import { apiFetch, apiAuthFetch } from './api'

export interface Payment {
  id: string
  userId: string
  subscriptionId: string
  originalAmount: number
  finalAmount: number
  pointsRedeemed: number
  pointsGained: number
  status: 'pending' | 'succeeded' | 'failed'
  failureDetails?: Record<string, any>
  createdAt?: Date
  updatedAt?: Date
}

export interface ProcessPaymentInput {
  subscriptionId: string
  paymentMethodId: string
  pointsToRedeem?: number
}

export interface PaymentMethodInput {
  cardNumber: string
  expiryDate: string
  cvv: string
  cardholderName: string
}

export const billingService = {
  /**
   * Procesar un pago
   */
  async processPayment(data: ProcessPaymentInput): Promise<Payment> {
    return apiAuthFetch<Payment>('/payments/process', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  /**
   * Obtener historial de pagos del usuario
   */
  async getPaymentHistory(): Promise<Payment[]> {
    return apiAuthFetch<Payment[]>('/payments/history')
  },

  /**
   * Obtener detalles de un pago específico
   */
  async getPayment(paymentId: string): Promise<Payment> {
    return apiAuthFetch<Payment>(`/payments/${paymentId}`)
  },

  /**
   * Obtener pagos por estado
   */
  async getPaymentsByStatus(status: 'pending' | 'succeeded' | 'failed'): Promise<Payment[]> {
    return apiAuthFetch<Payment[]>(`/payments/status/${status}`)
  },

  /**
   * Crear método de pago (guardar tarjeta)
   */
  async createPaymentMethod(data: PaymentMethodInput): Promise<{ paymentMethodId: string }> {
    return apiAuthFetch<{ paymentMethodId: string }>('/payment-methods', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  /**
   * Obtener métodos de pago guardados
   */
  async getPaymentMethods(): Promise<Array<{ id: string; last4Digits: string }>> {
    return apiAuthFetch<Array<{ id: string; last4Digits: string }>>('/payment-methods')
  },

  /**
   * Eliminar un método de pago
   */
  async deletePaymentMethod(paymentMethodId: string): Promise<void> {
    return apiAuthFetch<void>(`/payment-methods/${paymentMethodId}`, {
      method: 'DELETE',
    })
  },

  /**
   * Canjear puntos por descuento
   */
  async redeemPoints(points: number): Promise<{ discountAmount: number; pointsRedeemed: number }> {
    return apiAuthFetch<{ discountAmount: number; pointsRedeemed: number }>('/billing/redeem-points', {
      method: 'POST',
      body: JSON.stringify({ points }),
    })
  },

  /**
   * Obtener tasa de conversión de puntos
   */
  async getPointsExchangeRate(): Promise<{ pointsValue: number; moneyValue: number }> {
    return apiFetch<{ pointsValue: number; moneyValue: number }>('/billing/points-exchange-rate')
  },
}
