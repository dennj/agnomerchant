'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ProductPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckout = async () => {
    setIsLoading(true);

    try {
      // Create order intent via API
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          line_items: [
            {
              code: 'ITEM-001',
              description: 'Test Product',
              amount: 99,
              quantity: 1,
            },
          ],
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Failed to create order');
      }

      const orderIntent = await response.json();

      // Redirect to checkout page with iframe
      router.push(`/checkout/${orderIntent.id}`);
    } catch (error) {
      console.error('Checkout error:', error);
      alert(error instanceof Error ? error.message : 'Failed to start checkout');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-6">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Product Image */}
          <div className="mb-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg h-48 flex items-center justify-center">
            <span className="text-6xl">🎁</span>
          </div>

          {/* Product Info */}
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Premium Course Bundle
          </h1>
          <p className="text-gray-600 mb-4">
            Complete access to all courses and exclusive content
          </p>

          {/* Price */}
          <div className="mb-6">
            <span className="text-3xl font-bold text-gray-900">R$ 99,00</span>
          </div>

          {/* Checkout Button */}
          <button
            onClick={handleCheckout}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-4 px-6 rounded-lg hover:shadow-xl transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {isLoading ? 'Creating order...' : 'Checkout'}
          </button>
        </div>
      </div>
    </div>
  );
}
