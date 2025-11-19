import { useState } from 'react';
import Image from 'next/image';
import { Product } from '@/lib/types/product';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Edit2, Trash2 } from 'lucide-react';

interface CatalogPreviewProps {
  products: Product[];
  onProductEdit?: (product: Product) => void;
  onProductDelete?: (product: Product) => void;
}

export function CatalogPreview({ products, onProductEdit, onProductDelete }: CatalogPreviewProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  return (
    <div className="space-y-6">
      {/* Collection Info */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Product Catalog</h2>
        </div>
        <Badge variant="secondary" className="text-lg px-4 py-2">
          {products.length} {'Products'}
        </Badge>
      </div>

      {/* Products Grid */}
      {products.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-500">
              No products in the catalog yet. Add your first product below.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {products.map((product) => (
              <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div
                  className="aspect-square w-full overflow-hidden bg-gray-100 cursor-pointer relative"
                  onClick={() => setSelectedProduct(product)}
                >
                  {product.image_url ? (
                    <Image
                      src={product.image_url}
                      alt={product.product_name}
                      fill
                      className="object-cover hover:scale-105 transition-transform"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200">
                      <span className="text-gray-400 text-sm">No Image</span>
                    </div>
                  )}
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
                    {product.product_name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between mt-3">
                    <p className="text-lg font-bold text-gray-900">
                      R$ {(product.price / 100).toFixed(2)}
                    </p>
                    <Badge variant="outline" className="text-xs">
                      ID: {product.id}
                    </Badge>
                  </div>
                  {(onProductEdit || onProductDelete) && (
                    <div className="flex gap-2 mt-3">
                      {onProductEdit && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => onProductEdit(product)}
                        >
                          <Edit2 className="h-3 w-3 mr-2" />
                          Edit
                        </Button>
                      )}
                      {onProductDelete && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => onProductDelete(product)}
                        >
                          <Trash2 className="h-3 w-3 mr-2" />
                          Delete
                        </Button>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
          ))}
        </div>
      )}

      {/* Product Detail Modal */}
      <Dialog open={!!selectedProduct} onOpenChange={(open) => !open && setSelectedProduct(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {selectedProduct && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl">
                  {selectedProduct.product_name}
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-6">
                {/* Image */}
                <div className="w-full aspect-video overflow-hidden rounded-lg bg-gray-100 relative">
                  {selectedProduct.image_url ? (
                    <Image
                      src={selectedProduct.image_url}
                      alt={selectedProduct.product_name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200">
                      <span className="text-gray-400 text-2xl">No Image</span>
                    </div>
                  )}
                </div>

                {/* Price and ID */}
                <div className="flex items-center justify-between">
                  <p className="text-3xl font-bold text-blue-600">
                    R$ {(selectedProduct.price / 100).toFixed(2)}
                  </p>
                  <Badge variant="outline" className="text-sm">
                    ID: {selectedProduct.id}
                  </Badge>
                </div>

                {/* Description */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Details</h3>
                  <p className="text-gray-700 whitespace-pre-wrap">{selectedProduct.description}</p>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
