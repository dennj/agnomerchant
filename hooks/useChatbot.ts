import { useState, useRef, useEffect } from 'react';
import { useAgnoPayCheckout } from '@agnopay/sdk';

export interface Product {
  id: string;
  product_name?: string;
  Name?: string;
  price?: number;
  image_url?: string;
  Short_description?: string;
  Description?: string;
  SKU?: string;
}

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  products?: Product[];
}

export function useChatbot(accountId: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutOrderId, setCheckoutOrderId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { createOrder } = useAgnoPayCheckout({
    onSuccess: (order) => {
      setCheckoutOrderId(order.uuid);
      setIsCheckoutOpen(true);
    },
    onError: (error) => {
      setError(`Failed to create order: ${error.message}`);
    },
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleCheckoutSuccess = () => {
    setIsCheckoutOpen(false);
    setCheckoutOrderId(null);
  };

  const handleCheckoutError = (error: Error) => {
    console.error('Checkout error:', error);
    setError(`Payment failed: ${error.message}`);
    setIsCheckoutOpen(false);
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          accountId
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to get response');
      }

      const data = await res.json();

      // Add AI response to messages (skip if buy intent with no message)
      if (data.reply || !data.buy_intent) {
        setMessages((prev) => [...prev, {
          role: 'assistant',
          content: data.reply,
          products: data.products || undefined
        }]);
      }

      // Handle buy intent - automatically create order and open checkout
      if (data.buy_intent?.product) {
        const { product, quantity } = data.buy_intent;
        try {
          await createOrder({
            line_items: [{
              code: product.SKU!,
              description: product.product_name || product.Name!,
              amount: product.price!,
              quantity: quantity || 1,
            }],
          });
        } catch (orderErr) {
          setError(orderErr instanceof Error ? orderErr.message : 'Failed to create order');
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    messages,
    input,
    setInput,
    isLoading,
    error,
    isCheckoutOpen,
    setIsCheckoutOpen,
    checkoutOrderId,
    messagesEndRef,
    sendMessage,
    handleCheckoutSuccess,
    handleCheckoutError,
  };
}
