/**
 * Agno SDK Types
 */

export interface AgnoConfig {
  apiKey: string;
  walletUrl?: string; // Default: http://localhost:3000
  apiUrl?: string; // Default: https://agnoapi.vercel.app
}

export interface LineItem {
  code: string;
  description: string;
  amount: number;
  quantity: number;
}

export interface CreateOrderRequest {
  line_items: LineItem[];
}

export interface CreateOrderResponse {
  id: string;
  status: string;
  // Add other fields returned by the API
}

export interface AgnoError {
  message: string;
  code?: string;
  details?: unknown;
}

/**
 * Iframe styling configuration
 */
export interface IframeStyleConfig {
  transparent?: boolean;
  primaryColor?: string;
  backgroundColor?: string;
  textColor?: string;
  borderRadius?: string;
  fontFamily?: string;
}
