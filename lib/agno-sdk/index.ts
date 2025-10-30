/**
 * Agno SDK
 *
 * A TypeScript SDK for integrating Agno payment processing into your application.
 * No API routes required - works entirely client-side with publishable keys (like Stripe).
 *
 * @example Basic Usage (No API Routes Needed!)
 * ```tsx
 * // 1. Set env: NEXT_PUBLIC_AGNOPAY_KEY="ak_your_key"
 *
 * // 2. Use the hook
 * import { useAgnoCheckout, AgnoCheckout } from '@/lib/agno-sdk';
 *
 * const { createOrder, isLoading } = useAgnoCheckout({
 *   onSuccess: (order) => router.push(`/checkout/${order.id}`)
 * });
 *
 * // 3. Create order (calls Agno API directly)
 * await createOrder({
 *   line_items: [{ code: 'ITEM-001', description: 'Product', amount: 9900, quantity: 1 }]
 * });
 *
 * // 4. Display checkout with custom styling
 * <AgnoCheckout orderId={order.id} style={{ primaryColor: '#10b981' }} />
 * ```
 *
 * @example Advanced: Server-side (Optional)
 * ```ts
 * // Only if you need server-side order creation
 * import { createOrderRouteHandler } from '@/lib/agno-sdk/server';
 * export const POST = createOrderRouteHandler(process.env.AGNOPAY_SECRET_KEY || '');
 * ```
 */

// Core SDK
export { AgnoClient as AgnoSDK } from './client';

// Components
export { AgnoCheckout } from './components/AgnoCheckout';

// Client-side hooks
export { useAgnoCheckout } from './client-hooks';
export type { UseAgnoCheckoutOptions, UseAgnoCheckoutReturn } from './client-hooks';

// Types
export type {
  AgnoConfig,
  LineItem,
  CreateOrderRequest,
  CreateOrderResponse,
  AgnoError,
  IframeStyleConfig,
} from './types';
export type { AgnoCheckoutProps } from './components/AgnoCheckout';
