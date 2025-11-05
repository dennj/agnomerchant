'use client';

import { ShoppingCart, Loader2 } from 'lucide-react';
import { useAgnoPayCheckout } from '@agnopay/sdk';

interface ProductCardProps {
  product: {
    product_name?: string;
    Name?: string;
    price?: number;
    image_url?: string;
    Short_description?: string;
    Description?: string;
    Color?: string;
    SKU?: string;
  };
  onOrderCreated?: (orderId: string) => void;
}

export function ProductCard({ product, onOrderCreated }: ProductCardProps) {
  const name = product.product_name || product.Name;
  const description = product.Short_description || product.Description?.substring(0, 80) + '...';
  const imageUrl = product.image_url;
  const price = product.price;
  const sku = product.SKU;

  const { createOrder, isLoading, error: sdkError } = useAgnoPayCheckout({
    onSuccess: (order) => {
      // Order has uuid property, not id
      const orderId = order.id;
      onOrderCreated?.(orderId);
    },
    onError: (error) => {
      alert(`Failed to create order: ${error.message}`);
    },
  });

  const handleBuyNow = async () => {
    try {
      await createOrder({
        line_items: [
          {
            code: sku!,
            description: name!,
            amount: Math.round(price! * 100), // Convert to cents
            quantity: 1,
          },
        ],
      });
    } catch (err) {
      alert(`Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow flex flex-col">
      <div className="relative h-32 bg-gray-100">
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x200?text=No+Image';
          }}
        />
      </div>
      <div className="p-3 flex-1 flex flex-col">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-semibold text-sm line-clamp-2 flex-1">{name}</h3>
          <span className="font-bold text-blue-600 text-sm whitespace-nowrap">${price}</span>
        </div>
        <p className="text-xs text-gray-600 line-clamp-2 mb-2">{description}</p>
        {product.Color && (
          <p className="text-xs text-gray-500 mb-1">Color: {product.Color}</p>
        )}
        {product.SKU && (
          <p className="text-xs text-gray-400 mb-2">SKU: {product.SKU}</p>
        )}

        <div className="flex-1"></div>

        {/* SDK Error Display */}
        {sdkError && (
          <div className="text-xs text-red-600 mb-2 p-2 bg-red-50 rounded">
            {sdkError.message}
          </div>
        )}

        {/* Buy Button */}
        <button
          onClick={handleBuyNow}
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white text-xs font-semibold py-2 px-3 rounded transition-colors flex items-center justify-center gap-1"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-3 h-3 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <ShoppingCart className="w-3 h-3" />
              Buy Now
            </>
          )}
        </button>
      </div>
    </div>
  );
}
