'use client';

import { useState, useEffect } from 'react';
import { CatalogPreview } from '@/components/dashboard/catalog-preview';
import { AddProductForm } from '@/components/dashboard/add-product-form';
import { Product } from '@/lib/types/product';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/lib/contexts/auth-context';
import { Badge } from '@/components/ui/badge';

export default function DashboardPage() {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [collectionInfo, setCollectionInfo] = useState({
    name: 'agnopay',
    pointsCount: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/products');

      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }

      const data = await response.json();
      setProducts(data.products || []);
      setCollectionInfo(data.collectionInfo || { name: 'agnopay', pointsCount: 0 });
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleProductAdded = () => {
    // Refresh the product list
    fetchProducts();
    // Clear selected product (in case we were editing)
    setSelectedProduct(null);
  };

  const handleProductEdit = (product: Product) => {
    setSelectedProduct(product);
    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setSelectedProduct(null);
  };

  const handleProductDelete = async (product: Product) => {
    const productName = product.product_name || product.Name || 'this product';

    if (!confirm(`Are you sure you want to delete "${productName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const response = await fetch(`/api/products?id=${product.id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete product');
      }

      // Refresh the product list
      fetchProducts();

      // If we were editing this product, clear the form
      if (selectedProduct?.id === product.id) {
        setSelectedProduct(null);
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      alert(error instanceof Error ? error.message : 'Failed to delete product');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Product Catalog Management</h1>
        <p className="text-gray-600 mt-2">
          Manage your product catalog. Products are automatically indexed for AI-powered search.
        </p>
        {user && (
          <div className="mt-3 flex items-center gap-2">
            <span className="text-sm text-gray-500">Merchant ID:</span>
            <Badge variant="outline" className="font-mono text-xs">
              {user.id}
            </Badge>
          </div>
        )}
      </div>

      <AddProductForm
        onSuccess={handleProductAdded}
        initialProduct={selectedProduct}
        onCancelEdit={handleCancelEdit}
      />

      <CatalogPreview
        products={products}
        collectionName={collectionInfo.name}
        totalCount={collectionInfo.pointsCount}
        onProductEdit={handleProductEdit}
        onProductDelete={handleProductDelete}
      />
    </div>
  );
}
