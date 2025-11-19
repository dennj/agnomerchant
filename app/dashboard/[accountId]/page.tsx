'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { CatalogPreview } from '@/components/dashboard/catalog-preview';
import { AddProductForm } from '@/components/dashboard/add-product-form';
import { PromptEditor } from '@/components/dashboard/prompt-editor';
import { UserManagement } from '@/components/dashboard/user-management';
import { Product } from '@/lib/types/product';
import { Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ChatbotBubble } from '@/components/chatbot-bubble';

export default function AccountDashboardPage() {
  const params = useParams();
  const accountId = params.accountId as string;

  const [products, setProducts] = useState<Product[]>([]);
  const [collectionInfo, setCollectionInfo] = useState({
    name: 'agnopay',
    pointsCount: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [accountUsers, setAccountUsers] = useState<{ id: string; email: string }[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string>('');

  const fetchProducts = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/products?accountId=${accountId}`);

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error);
      }

      const data = await response.json();
      setProducts(data.products);
      setCollectionInfo(data.collectionInfo);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setIsLoading(false);
    }
  }, [accountId]);

  const fetchAccountData = useCallback(async () => {
    try {
      const response = await fetch('/api/account');
      if (!response.ok) throw new Error('Failed to fetch account');

      const data = await response.json();
      const account = data.accounts.find((acc: { id: string; users: { id: string; email: string }[] }) => acc.id === accountId);
      if (!account) throw new Error(`Account ${accountId} not found`);

      setAccountUsers(account.users);
      setCurrentUserId(data.userId);
    } catch (error) {
      console.error('Error fetching account data:', error);
      throw error;
    }
  }, [accountId]);

  useEffect(() => {
    if (accountId) {
      fetchAccountData();
      fetchProducts();
    }
  }, [accountId, fetchAccountData, fetchProducts]);

  const handleProductAdded = () => {
    fetchProducts();
    setSelectedProduct(null);
  };

  const handleProductEdit = (product: Product) => {
    setSelectedProduct(product);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setSelectedProduct(null);
  };

  const handleProductDelete = async (product: Product) => {
    if (!confirm(`Are you sure you want to delete "${product.product_name}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const response = await fetch(`/api/products?id=${product.id}&accountId=${accountId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error);
      }

      fetchProducts();

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
        <div className="mt-3 flex items-center gap-2">
          <span className="text-sm text-gray-500">Account:</span>
          <Badge variant="outline" className="font-mono text-xs">
            {accountId}
          </Badge>
        </div>
      </div>

      {/* AI Prompt Editor */}
      <PromptEditor accountId={accountId} />

      <AddProductForm
        onSuccess={handleProductAdded}
        initialProduct={selectedProduct}
        onCancelEdit={handleCancelEdit}
        accountId={accountId}
      />

      <CatalogPreview
        products={products}
        onProductEdit={handleProductEdit}
        onProductDelete={handleProductDelete}
      />

      {/* User Management */}
      <UserManagement
        accountId={accountId}
        users={accountUsers}
        currentUserId={currentUserId}
        onUpdate={fetchAccountData}
      />

      {/* Chatbot for this account */}
      <ChatbotBubble accountId={accountId} />
    </div>
  );
}
