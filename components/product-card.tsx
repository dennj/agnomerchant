'use client';

import { useState } from 'react';
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
    product_name?: string;
    Name?: string;
    price?: number;
    image_url?: string;
    Short_description?: string;
    Description?: string;
    SKU?: string;
  };
  createOrder: (orderData: OrderData) => Promise<unknown>;
}

export function ProductCard({ product, createOrder }: ProductCardProps) {
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const name = product.product_name || product.Name;
  const description = product.Short_description || product.Description?.substring(0, 80) + '...';
  const fullDescription = product.Description;
  const imageUrl = product.image_url;
  const price = product.price;
  const sku = product.SKU;

  const handleBuyNow = async () => {
    setIsLoading(true);
    try {
      const orderData: OrderData = {
        line_items: [
          {
            code: sku!,
            description: name!,
            amount: price!,
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
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover hover:scale-105 transition-transform"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x200?text=No+Image';
            }}
          />
        </div>
        <div className="p-3 flex-1 flex flex-col">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-semibold text-sm line-clamp-2 flex-1">{name}</h3>
            <span className="font-bold text-blue-600 text-sm whitespace-nowrap">R$ {price ? (price / 100).toFixed(2) : '0.00'}</span>
          </div>
          <p className="text-xs text-gray-600 line-clamp-2 mb-2">{description}</p>

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
              {name}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Image */}
            {imageUrl && (
              <div className="w-full aspect-video overflow-hidden rounded-lg bg-gray-100">
                <img
                  src={imageUrl}
                  alt={name || ''}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Price and SKU */}
            <div className="flex items-center justify-between">
              <p className="text-3xl font-bold text-blue-600">
                R$ {price ? (price / 100).toFixed(2) : '0.00'}
              </p>
              {sku && (
                <Badge variant="outline" className="text-sm">
                  SKU: {sku}
                </Badge>
              )}
            </div>

            {/* Short Description */}
            {product.Short_description && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Summary</h3>
                <p className="text-gray-700">{product.Short_description}</p>
              </div>
            )}

            {/* Full Description */}
            {fullDescription && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Details</h3>
                <p className="text-gray-700 whitespace-pre-wrap">{fullDescription}</p>
              </div>
            )}

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
                  Buy Now - R$ {price ? (price / 100).toFixed(2) : '0.00'}
                </>
              )}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
