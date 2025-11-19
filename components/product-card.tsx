'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ShoppingCart, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';

interface OrderData {
  line_items: Array<{
    code: string;
    description: string;
    amount: number;
    quantity: number;
  }>;
}

interface ProductCardProps {
  product: {
    id: number;
    product_name: string;
    price: number;
    image_url?: string;
    description: string;
  };
  createOrder: (orderData: OrderData) => Promise<unknown>;
}

export function ProductCard({ product, createOrder }: ProductCardProps) {
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleBuyNow = async () => {
    setIsLoading(true);
    try {
      const orderData: OrderData = {
        line_items: [
          {
            code: product.id.toString(),
            description: product.product_name,
            amount: product.price,
            quantity: 1,
          },
        ],
      };

      await createOrder(orderData);
    } catch (err) {
      alert(`Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow flex flex-col">
        <div
          className="relative h-32 bg-gray-100 cursor-pointer"
          onClick={() => setShowModal(true)}
        >
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.product_name}
              fill
              className="object-cover hover:scale-105 transition-transform"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-200">
              <span className="text-gray-400 text-xs">No Image</span>
            </div>
          )}
        </div>
        <div className="p-3 flex-1 flex flex-col">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-semibold text-sm line-clamp-2 flex-1">{product.product_name}</h3>
            <span className="font-bold text-blue-600 text-sm whitespace-nowrap">R$ {(product.price / 100).toFixed(2)}</span>
          </div>

          <div className="flex-1"></div>

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

      {/* Product Detail Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              {product.product_name}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Image */}
            <div className="w-full aspect-video overflow-hidden rounded-lg bg-gray-100 relative">
              {product.image_url ? (
                <Image
                  src={product.image_url}
                  alt={product.product_name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-200">
                  <span className="text-gray-400 text-xl">No Image</span>
                </div>
              )}
            </div>

            {/* Price and ID */}
            <div className="flex items-center justify-between">
              <p className="text-3xl font-bold text-blue-600">
                R$ {(product.price / 100).toFixed(2)}
              </p>
              <Badge variant="outline" className="text-sm">
                ID: {product.id}
              </Badge>
            </div>

            {/* Description */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Details</h3>
              <p className="text-gray-700 whitespace-pre-wrap">{product.description}</p>
            </div>

            {/* Buy Button in Modal */}
            <button
              onClick={() => {
                setShowModal(false);
                handleBuyNow();
              }}
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded transition-colors flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <ShoppingCart className="w-5 h-5" />
                  Buy Now - R$ {(product.price / 100).toFixed(2)}
                </>
              )}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
