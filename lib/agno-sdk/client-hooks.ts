/**
 * Agno SDK Client-side Hooks
 * React hooks for client-side order creation
 */

'use client';

import { useState } from 'react';
import type { CreateOrderRequest, CreateOrderResponse, AgnoError } from './types';

export interface UseAgnoCheckoutOptions {
  apiEndpoint?: string; // Default: /api/agno/orders
  onSuccess?: (order: CreateOrderResponse) => void;
  onError?: (error: AgnoError) => void;
}

export interface UseAgnoCheckoutReturn {
  createOrder: (request: CreateOrderRequest) => Promise<CreateOrderResponse | null>;
  isLoading: boolean;
  error: AgnoError | null;
  order: CreateOrderResponse | null;
}

/**
 * React hook for creating orders from the client
 */
export function useAgnoCheckout(
  options: UseAgnoCheckoutOptions = {}
): UseAgnoCheckoutReturn {
  const { apiEndpoint = '/api/agno/orders', onSuccess, onError } = options;

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<AgnoError | null>(null);
  const [order, setOrder] = useState<CreateOrderResponse | null>(null);

  const createOrder = async (
    request: CreateOrderRequest
  ): Promise<CreateOrderResponse | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      const data = await response.json();

      if (!response.ok) {
        const err: AgnoError = {
          message: data.error?.message || 'Failed to create order',
          code: data.error?.code,
          details: data.error,
        };
        setError(err);
        onError?.(err);
        return null;
      }

      setOrder(data);
      onSuccess?.(data);
      return data;
    } catch (err) {
      const error: AgnoError = {
        message: 'Network error while creating order',
        details: err,
      };
      setError(error);
      onError?.(error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createOrder,
    isLoading,
    error,
    order,
  };
}
