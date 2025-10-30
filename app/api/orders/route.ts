/**
 * Agno Orders API Route
 * This route handler is provided by the Agno SDK
 */

import { createOrderRouteHandler } from '@/lib/agno-sdk/server';

// Export the SDK-provided route handler
export const POST = createOrderRouteHandler(process.env.AGNOPAY_KEY || '');
