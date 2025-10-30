'use client';

import { use } from 'react';

export default function CheckoutPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = use(params);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="p-4 bg-gradient-to-r from-blue-600 to-purple-600">
          <h1 className="text-2xl font-bold text-white text-center">
            Complete Your Purchase
          </h1>
        </div>
        <div className="relative w-full" style={{ height: 'calc(100vh - 200px)' }}>
          <iframe
            src={`http://localhost:3000/order/${orderId}`}
            className="w-full h-full border-0"
            title="Checkout"
            sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox"
            allow="payment"
          />
        </div>
      </div>
    </div>
  );
}
