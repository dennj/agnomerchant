'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Loader2, X } from 'lucide-react';
import { Product } from '@/lib/types/product';

interface AddProductFormProps {
  onSuccess: () => void;
  initialProduct?: Product | null;
  onCancelEdit?: () => void;
  accountId: string;
}

export function AddProductForm({ onSuccess, initialProduct, onCancelEdit, accountId }: AddProductFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    image_url: '',
    sku: '',
  });

  const isEditMode = !!initialProduct;

  // Populate form when initialProduct changes
  useEffect(() => {
    if (initialProduct) {
      setFormData({
        name: initialProduct.product_name || initialProduct.Name || '',
        price: initialProduct.price ? (initialProduct.price / 100).toString() : '',
        description: initialProduct.Description || initialProduct.Short_description || '',
        image_url: initialProduct.image_url || '',
        sku: initialProduct.SKU || '',
      });
    }
  }, [initialProduct]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.name.trim()) {
      toast.error('Product name is required');
      return;
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      toast.error('Price must be greater than 0');
      return;
    }

    if (!formData.description.trim()) {
      toast.error('Description is required');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`/api/products?accountId=${accountId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          price: Math.round(parseFloat(formData.price) * 100), // Convert to cents
          description: formData.description.trim(),
          image_url: formData.image_url.trim() || undefined,
          sku: formData.sku.trim() || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to add product');
      }

      if (data.updated) {
        toast.success('Product updated successfully!');
      } else {
        toast.success('Product added successfully!');
      }

      // Reset form
      setFormData({
        name: '',
        price: '',
        description: '',
        image_url: '',
        sku: '',
      });

      onSuccess();
    } catch (error) {
      console.error('Error adding product:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to add product');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>{isEditMode ? 'Edit Product' : 'Add New Product'}</CardTitle>
            <CardDescription>
              {isEditMode
                ? 'Update the product details. Changes will be automatically re-indexed for AI search.'
                : 'Add a new product to your catalog. It will be automatically indexed for AI search.'
              }
            </CardDescription>
          </div>
          {isEditMode && onCancelEdit && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={onCancelEdit}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Adidas Ultraboost 22"
                disabled={isLoading}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price (R$) *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="e.g., 299.90"
                disabled={isLoading}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe your product in detail..."
              rows={3}
              disabled={isLoading}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="image_url">Image URL</Label>
              <Input
                id="image_url"
                type="url"
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                placeholder="https://example.com/image.jpg"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sku">SKU</Label>
              <Input
                id="sku"
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                placeholder="e.g., UB22-BLK-42"
                disabled={isLoading}
              />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isEditMode ? 'Updating Product...' : 'Adding Product...'}
              </>
            ) : (
              isEditMode ? 'Update Product' : 'Add Product to Catalog'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
