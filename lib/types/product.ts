export interface Product {
  id: number;
  merchant_id: string;
  product_name: string;
  price: number;
  description: string;
  image_url?: string;
}

export type CreateProductInput = Omit<Product, 'id' | 'merchant_id'>;
