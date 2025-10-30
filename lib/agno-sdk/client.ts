/**
 * Agno SDK API Client
 */

import type {
  AgnoConfig,
  CreateOrderRequest,
  CreateOrderResponse,
  AgnoError,
} from './types';

export class AgnoClient {
  private config: Required<AgnoConfig>;

  constructor(config: AgnoConfig) {
    this.config = {
      apiKey: config.apiKey,
      walletUrl: config.walletUrl || 'http://localhost:3000',
      apiUrl: config.apiUrl || 'https://agnoapi.vercel.app',
    };
  }

  /**
   * Create a new order
   */
  async createOrder(
    request: CreateOrderRequest
  ): Promise<CreateOrderResponse> {
    try {
      const response = await fetch(`${this.config.apiUrl}/v1/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.config.apiKey}`,
        },
        body: JSON.stringify(request),
      });

      const data = await response.json();

      if (!response.ok) {
        const error: AgnoError = {
          message: data.error?.message || 'Failed to create order',
          code: data.error?.code,
          details: data.error,
        };
        throw error;
      }

      return data;
    } catch (error) {
      if ((error as AgnoError).message) {
        throw error;
      }
      throw {
        message: 'Network error while creating order',
        details: error,
      } as AgnoError;
    }
  }

  /**
   * Get the wallet URL for an order
   */
  getOrderUrl(orderId: string): string {
    return `${this.config.walletUrl}/order/${orderId}`;
  }

  /**
   * Get the wallet URL
   */
  getWalletUrl(): string {
    return this.config.walletUrl;
  }
}
