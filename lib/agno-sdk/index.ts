/**
 * Agno SDK
 *
 * A TypeScript SDK for integrating Agno payment processing into your application.
 *
 * @example Server-side (API Route)
 * ```ts
 * // app/api/agno/orders/route.ts
 * import { createOrderRouteHandler } from '@/lib/agno-sdk/server';
 *
 * export const POST = createOrderRouteHandler(process.env.AGNOPAY_KEY || '');
 * ```
 *
 * @example Client-side
 * ```tsx
 * import { useAgnoCheckout, AgnoCheckout } from '@/lib/agno-sdk';
 *
 * const { createOrder, isLoading } = useAgnoCheckout();
 *
 * const order = await createOrder({
 *   line_items: [{ code: 'ITEM-001', description: 'Product', amount: 1000, quantity: 1 }]
 * });
 *
 * <AgnoCheckout orderId={order.id} />
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
