export interface Product {
  id: string;
  merchant_id: string;
  Name?: string;
  product_name?: string;
  price: number;
  Short_description?: string;
  Description?: string;
  image_url?: string;
  SKU?: string;
}

export interface CreateProductInput {
  name: string;
  price: number;
  description: string;
  image_url?: string;
  sku?: string;
}

export interface ProductFormData extends CreateProductInput {}
