/**
 * Agno SDK API Client
 */

import type {
  AgnoConfig,
  CreateOrderRequest,
  CreateOrderResponse,
  AgnoError,
} from './types';

// Hardcoded Agno API URL
const AGNO_API_URL = 'https://agnoapi.vercel.app';

export class AgnoClient {
  private config: AgnoConfig;

  constructor(config: AgnoConfig) {
    this.config = config;
  }

  /**
   * Create a new order
   */
  async createOrder(
    request: CreateOrderRequest
  ): Promise<CreateOrderResponse> {
    try {
      const response = await fetch(`${AGNO_API_URL}/v1/orders`, {
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
}
