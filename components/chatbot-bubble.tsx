'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Loader2 } from 'lucide-react';
import { AgnoPayCheckout } from '@agnopay/sdk';
import { ProductCard } from './product-card';

interface Product {
  id: string;
  product_name?: string;
  Name?: string;
  price?: number;
  image_url?: string;
  Short_description?: string;
  Description?: string;
  Color?: string;
  SKU?: string;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  products?: Product[];
}

export function ChatbotBubble() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutOrderId, setCheckoutOrderId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleOrderCreated = (orderId: string) => {
    setCheckoutOrderId(orderId);
    setIsCheckoutOpen(true);
  };

  const handleCheckoutSuccess = (orderId: string) => {
    setIsCheckoutOpen(false);
    setCheckoutOrderId(null);
    // Add success message to chat
    setMessages((prev) => [...prev, {
      role: 'assistant',
      content: `✅ Payment successful! Your order ${orderId} has been confirmed. Thank you for your purchase!`
    }]);
  };

  const handleCheckoutError = (error: Error) => {
    console.error('Checkout error:', error);
    setIsCheckoutOpen(false);
    // Add error message to chat
    setMessages((prev) => [...prev, {
      role: 'assistant',
      content: `❌ Payment failed: ${error.message}. Please try again.`
    }]);
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
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to get response');
      }

      const data = await res.json();
      setMessages((prev) => [...prev, {
        role: 'assistant',
        content: data.reply,
        products: data.products || undefined
      }]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Chat Bubble Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg transition-all hover:scale-110 z-50"
          aria-label="Open chat"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-[500px] h-[600px] z-50">
          <div className="relative w-full h-full bg-white rounded-lg shadow-2xl flex flex-col border border-gray-200">
            {/* Header */}
            <div className="bg-blue-600 text-white p-4 rounded-t-lg flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                <h3 className="font-semibold">Shoe Shopping Assistant</h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="hover:bg-blue-700 rounded p-1 transition-colors"
                aria-label="Close chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 && (
                <div className="text-center text-gray-500 mt-8">
                  <p className="text-sm">Hi! Looking for shoes? Ask me anything!</p>
                </div>
              )}

              {messages.map((msg, idx) => (
                <div key={idx}>
                  <div
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${msg.role === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                        }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                    </div>
                  </div>

                  {/* Product Cards */}
                  {msg.products && msg.products.length > 0 && (
                    <div className="mt-2 grid grid-cols-2 gap-2">
                      {msg.products.map((product) => (
                        <ProductCard
                          key={product.id}
                          product={product}
                          onOrderCreated={handleOrderCreated}
                        />
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 rounded-lg p-3">
                    <Loader2 className="w-4 h-4 animate-spin text-gray-600" />
                  </div>
                </div>
              )}

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <form onSubmit={sendMessage} className="p-4 border-t border-gray-200">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg px-4 py-2 transition-colors"
                  aria-label="Send message"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>

            {/* Checkout Modal - Inside Chatbot */}
            {isCheckoutOpen && checkoutOrderId && (
              <>
                {/* Modal Overlay */}
                <div
                  className="absolute inset-0 bg-black/50 z-10 rounded-lg"
                  onClick={() => setIsCheckoutOpen(false)}
                />

                {/* Modal Content */}
                <div className="absolute inset-4 bg-white rounded-lg shadow-2xl z-20 flex flex-col overflow-hidden">
                  {/* Modal Header */}
                  <div className="flex items-center justify-between p-3 border-b border-gray-200 bg-blue-600">
                    <h3 className="text-base font-semibold text-white">
                      Complete Your Purchase
                    </h3>
                    <button
                      onClick={() => setIsCheckoutOpen(false)}
                      className="text-white hover:bg-blue-700 rounded p-1 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Checkout Content */}
                  <div className="flex-1 overflow-hidden">
                    <AgnoPayCheckout
                      orderId={checkoutOrderId}
                      onSuccess={handleCheckoutSuccess}
                      onError={handleCheckoutError}
                      hideHeader={true}
                      style={{
                        transparent: false,
                        primaryColor: '#2563eb',
                        textColor: '#1f2937',
                        borderRadius: '0.5rem',
                        fontFamily: 'system-ui, -apple-system, sans-serif',
                      }}
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
