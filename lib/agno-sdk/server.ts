/**
 * Agno SDK Server Utilities
 * Server-side only functions and route handlers
 */

import { NextRequest, NextResponse } from 'next/server';
import { AgnoClient } from './client';
import type { CreateOrderRequest } from './types';

/**
 * Creates a Next.js API route handler for order creation
 * Usage: Export this directly in your app/api/agno/orders/route.ts
 */
export function createOrderRouteHandler(apiKey: string) {
  const agno = new AgnoClient({ apiKey });

  return async function POST(request: NextRequest) {
    try {
      const body: CreateOrderRequest = await request.json();

      // Validate request
      if (!body.line_items || body.line_items.length === 0) {
        return NextResponse.json(
          { error: { message: 'line_items is required and cannot be empty' } },
          { status: 400 }
        );
      }

      // Create order using the Agno SDK
      const order = await agno.createOrder(body);

      return NextResponse.json(order);
    } catch (error) {
      console.error('Order creation error:', error);

      // Handle Agno SDK errors
      if (error && typeof error === 'object' && 'message' in error) {
        return NextResponse.json(
          { error },
          { status: 400 }
        );
      }

      return NextResponse.json(
        { error: { message: 'Failed to create order' } },
        { status: 500 }
      );
    }
  };
}

/**
 * Initialize the Agno SDK for server-side use
 */
export function initAgnoServer(apiKey: string) {
  return new AgnoClient({ apiKey });
}
