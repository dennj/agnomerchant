# Agno SDK

A TypeScript SDK for integrating Agno payment processing into your application.

## Features

- 🔐 Secure server-side API key management
- 💳 Simple order creation
- 🎨 Pre-built checkout UI component
- 📦 TypeScript support with full type definitions
- ⚡ React hooks compatible

## Installation

The SDK is located in `lib/agno-sdk` and can be imported directly:

```typescript
import { AgnoSDK, AgnoCheckout } from '@/lib/agno-sdk';
```

## Quick Start

### 1. Server-Side: Create Orders

Use the SDK in API routes to create orders securely:

```typescript
// app/api/orders/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { AgnoSDK } from '@/lib/agno-sdk';

const agno = new AgnoSDK({
  apiKey: process.env.AGNOPAY_KEY || '',
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const order = await agno.createOrder(body);
    return NextResponse.json(order);
  } catch (error) {
    return NextResponse.json({ error }, { status: 400 });
  }
}
```

### 2. Client-Side: Display Checkout

Use the `AgnoCheckout` component to display the payment interface:

```typescript
'use client';

import { AgnoCheckout } from '@/lib/agno-sdk';
import { useRouter } from 'next/navigation';

export default function CheckoutPage({ orderId }: { orderId: string }) {
  const router = useRouter();

  return (
    <AgnoCheckout
      orderId={orderId}
      walletUrl="http://localhost:3000"
      onSuccess={(orderId) => router.push(`/success?orderId=${orderId}`)}
      onError={(error) => console.error(error)}
    />
  );
}
```

## API Reference

### AgnoSDK

#### Constructor

```typescript
const agno = new AgnoSDK({
  apiKey: string;           // Your Agno API key (required)
  walletUrl?: string;       // Wallet URL (default: http://localhost:3000)
  apiUrl?: string;          // API URL (default: https://agnoapi.vercel.app)
});
```

#### Methods

##### `createOrder(request: CreateOrderRequest): Promise<CreateOrderResponse>`

Creates a new order.

```typescript
const order = await agno.createOrder({
  line_items: [
    {
      code: 'ITEM-001',
      description: 'Premium Course',
      amount: 1000,      // Amount in cents
      quantity: 1,
    },
  ],
});
```

##### `getOrderUrl(orderId: string): string`

Returns the full wallet URL for an order.

```typescript
const url = agno.getOrderUrl('order_123');
// Returns: http://localhost:3000/order/order_123
```

### AgnoCheckout Component

A React component that displays the checkout interface in an iframe.

#### Props

```typescript
interface AgnoCheckoutProps {
  orderId: string;                        // The order ID (required)
  walletUrl?: string;                     // Wallet URL (default: http://localhost:3000)
  onSuccess?: (orderId: string) => void;  // Success callback
  onError?: (error: Error) => void;       // Error callback
  className?: string;                     // Custom CSS class
  title?: string;                         // Checkout title (default: "Complete Your Purchase")
  hideHeader?: boolean;                   // Hide the checkout header (default: false)
  style?: IframeStyleConfig;              // Iframe styling configuration
}
```

#### Styling Configuration

Customize the appearance of the checkout iframe:

```typescript
interface IframeStyleConfig {
  transparent?: boolean;      // Make background transparent
  primaryColor?: string;      // Primary color (can be gradient)
  backgroundColor?: string;   // Background color
  textColor?: string;         // Text color
  borderRadius?: string;      // Border radius (e.g., "0.5rem")
  fontFamily?: string;        // Font family
}
```

**Example with custom styling:**

```typescript
<AgnoCheckout
  orderId={order.id}
  style={{
    transparent: true,
    primaryColor: '#10b981',
    textColor: '#ffffff',
    borderRadius: '1rem',
    fontFamily: 'Inter, sans-serif',
  }}
  hideHeader={false}
/>
```

## Environment Variables

Create a `.env` file with your Agno API key:

```bash
AGNOPAY_KEY=your_api_key_here
```

⚠️ **Important**: Never expose your API key in client-side code. Always use it server-side only.

## Complete Example

```typescript
// 1. Create order from client
const response = await fetch('/api/orders', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    line_items: [{
      code: 'PROD-001',
      description: 'My Product',
      amount: 5000,
      quantity: 1,
    }],
  }),
});

const order = await response.json();

// 2. Redirect to checkout
router.push(`/checkout/${order.id}`);

// 3. Display checkout with AgnoCheckout component
<AgnoCheckout orderId={order.id} />
```

## Types

All TypeScript types are exported from the SDK:

```typescript
import type {
  AgnoConfig,
  LineItem,
  CreateOrderRequest,
  CreateOrderResponse,
  AgnoError,
  IframeStyleConfig,
  AgnoCheckoutProps,
} from '@/lib/agno-sdk';
```

## Advanced Usage

### Custom Branded Checkout

Create a fully branded checkout experience:

```typescript
<AgnoCheckout
  orderId={order.id}
  walletUrl="http://localhost:3000"
  title="Secure Checkout"
  style={{
    transparent: false,
    primaryColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    backgroundColor: '#f9fafb',
    textColor: '#ffffff',
    borderRadius: '1rem',
    fontFamily: '"Inter", "Helvetica Neue", sans-serif',
  }}
  onSuccess={(orderId) => {
    console.log('Payment successful!', orderId);
    router.push('/success');
  }}
  onError={(error) => {
    console.error('Payment failed:', error);
  }}
/>
```

### Transparent Overlay Checkout

Embed the checkout as a transparent overlay:

```typescript
<AgnoCheckout
  orderId={order.id}
  hideHeader={true}
  style={{
    transparent: true,
  }}
  className="fixed inset-0 z-50"
/>
```

## License

MIT
