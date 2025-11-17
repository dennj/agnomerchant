'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Loader2 } from 'lucide-react';
import { ProductCard } from './product-card';
import { AgnoPayCheckout } from '@agnopay/sdk';

interface Product {
  id: string;
  product_name?: string;
  Name?: string;
  price?: number;
  image_url?: string;
  Short_description?: string;
  Description?: string;
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

  const handleOrderCreated = (payment: { orderId: string }) => {
    setCheckoutOrderId(payment.orderId);
    setIsCheckoutOpen(true);
  };

  const handleCheckoutSuccess = () => {
    setIsCheckoutOpen(false);
    setCheckoutOrderId(null);
    // Could add success message to chat here
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
      {/* Chat Widget Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-gray-50 hover:bg-zinc-100 text-gray-700 border border-orange-400 rounded-full px-20 py-4 shadow-md hover:shadow-lg transition-all z-50 flex items-center gap-3"
          aria-label="Open chat"
        >
          <MessageCircle className="w-4 h-4 text-gray-600" />
          <span className="font-normal text-sm">Ask me anything</span>
        </button>
      )}

      {/* Chat Window - Full Screen Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 backdrop-blur-md bg-white/30 flex flex-col">
          {/* Header */}
          <div className="bg-gray-500/70 backdrop-blur-lg text-gray-50 px-6 py-4 flex items-center justify-between border-b border-white/30">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-gray-50" />
              <h3 className="font-semibold">Shopping Assistant</h3>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-white/50 rounded-full p-2 transition-colors"
              aria-label="Close chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto px-4 py-8">
            <div className="max-w-3xl mx-auto space-y-4">
              {messages.length === 0 && (
                <div className="flex justify-start">
                  <div className="max-w-[80%] rounded-lg p-3 bg-gray-100 text-gray-900">
                    <p className="text-sm">Hi! Looking for something? Ask me anything!</p>
                  </div>
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
          </div>

          {/* Input Form */}
          <div className="bg-gray-500/70 backdrop-blur-xl border-t border-gray-200/50 px-6 py-5 shadow-lg">
            <form onSubmit={sendMessage} className="max-w-3xl mx-auto">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 px-5 py-3 bg-white border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-gray-400 text-sm text-gray-900 placeholder:text-gray-400 shadow-sm"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="bg-gray-800 hover:bg-gray-900 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-full px-6 py-3 transition-colors flex items-center gap-2 shadow-sm"
                  aria-label="Send message"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>

          {/* Checkout Modal - Inside Chatbot */}
          {isCheckoutOpen && checkoutOrderId && (
            <>
              {/* Modal Overlay */}
              <div
                className="absolute inset-0 bg-black/30 backdrop-blur-sm z-10"
                onClick={() => setIsCheckoutOpen(false)}
              />

              {/* Modal Content */}
              <div className="absolute inset-x-4 top-20 bottom-20 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl z-20 flex flex-col overflow-hidden border border-white/50 max-w-3xl mx-auto">
                {/* Modal Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200/50 bg-white/50 backdrop-blur-lg">
                  <h3 className="text-base font-semibold text-gray-800">
                    Complete Your Purchase
                  </h3>
                  <button
                    onClick={() => setIsCheckoutOpen(false)}
                    className="text-gray-600 hover:bg-gray-100/50 rounded-full p-1 transition-colors"
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
      )}
    </>
  );
}
