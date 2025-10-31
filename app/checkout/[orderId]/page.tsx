'use client';

import { use } from 'react';
import { AgnoPayCheckout } from '@agnopay/sdk';
import { useRouter } from 'next/navigation';

export default function CheckoutPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = use(params);
  const router = useRouter();

  const handleSuccess = (orderId: string) => {
    console.log('Payment successful for order:', orderId);
    // Redirect to success page or show success message
    router.push(`/success?orderId=${orderId}`);
  };

  const handleError = (error: Error) => {
    console.error('Payment error:', error);
    alert(`Payment failed: ${error.message}`);
  };

  return (
    <AgnoPayCheckout
      orderId={orderId}
      onSuccess={handleSuccess}
      onError={handleError}
      style={{
        transparent: false,
        primaryColor: '#dc2626', // Red color
        textColor: '#2c2a2aff',
        borderRadius: '0.5rem',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    />
  );
}
