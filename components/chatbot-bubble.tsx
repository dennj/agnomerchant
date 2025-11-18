'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Loader2 } from 'lucide-react';
import { ProductCard } from './product-card';
import { AgnoPayCheckout } from '@agnopay/sdk';
import { useChatbot } from '@/hooks/useChatbot';
import { ChatMessage } from './chat-message';

interface ChatbotBubbleProps {
  accountId: string;
}

export function ChatbotBubble({ accountId }: ChatbotBubbleProps) {
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const {
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
  } = useChatbot(accountId);

  useEffect(() => {
    // Auto-focus input when chat opens or when loading completes
    if (isOpen && !isCheckoutOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen, isLoading, isCheckoutOpen]);

  const handleOrderCreated = () => setIsCheckoutOpen(true);

  return (
    <>
      {/* Chat Widget Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-4 sm:bottom-8 left-1/2 -translate-x-1/2 bg-gray-50 hover:bg-zinc-100 text-gray-700 border border-emerald-500 rounded-full px-6 sm:px-20 py-3 sm:py-4 shadow-md hover:shadow-lg transition-all z-50 flex items-center gap-2 sm:gap-3 max-w-[calc(100vw-2rem)]"
          aria-label="Open chat"
        >
          <MessageCircle className="w-4 h-4 text-gray-600 flex-shrink-0" />
          <span className="font-normal text-xs sm:text-sm whitespace-nowrap">Dúvidas? Escreva aqui</span>
        </button>
      )}

      {/* Chat Window - Centered Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex flex-col items-center justify-end px-4 sm:px-6 pb-6 sm:pb-8 pt-20 bg-black/30 backdrop-blur-sm gap-6"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="relative w-full max-w-2xl h-full max-h-[700px] bg-white rounded-2xl shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-white px-6 py-5 rounded-t-2xl flex items-center border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full p-2">
                  <MessageCircle className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900">Assistente IA</h3>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50/30">
              {messages.length === 0 && (
                <div className="flex justify-start">
                  <div className="max-w-[80%] rounded-2xl p-4 bg-white shadow-sm border border-gray-100">
                    <p className="text-sm text-gray-700">Oi! Estou aqui para ajudar com vendas e suporte.</p>
                  </div>
                </div>
              )}

              {messages.map((msg, idx) => (
                <div key={idx}>
                  <div
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <ChatMessage message={msg} variant="bubble" />
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
                  <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                    <Loader2 className="w-5 h-5 animate-spin text-emerald-500" />
                  </div>
                </div>
              )}

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-2xl p-4 shadow-sm">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <div className="bg-white border-t border-gray-100 px-6 py-5 rounded-b-2xl">
              <form onSubmit={sendMessage}>
                <div className="flex gap-3 items-center">
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:bg-white text-sm text-gray-900 placeholder:text-gray-400 transition-all"
                    disabled={isLoading}
                  />
                  <button
                    type="submit"
                    disabled={isLoading || !input.trim()}
                    className="bg-gradient-to-br from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 disabled:from-gray-200 disabled:to-gray-300 disabled:cursor-not-allowed text-white rounded-full p-3.5 transition-all shadow-md hover:shadow-lg flex items-center justify-center"
                    aria-label="Send message"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </form>
            </div>

            {/* Checkout Modal - Inside Chatbot */}
            {isCheckoutOpen && checkoutOrderId && (
              <>
                {/* Modal Overlay */}
                <div
                  className="absolute inset-0 bg-black/30 backdrop-blur-sm z-10 rounded-2xl"
                  onClick={() => setIsCheckoutOpen(false)}
                />

                {/* Modal Content */}
                <div className="absolute inset-2 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl z-20 flex flex-col overflow-hidden border border-white/50">
                  {/* Modal Header */}
                  <div className="flex items-center justify-between px-3 py-2 border-b border-gray-200/50 bg-white/50 backdrop-blur-lg">
                    <h3 className="text-sm font-semibold text-gray-800">
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
                  <div className="flex-1 overflow-y-auto overflow-x-hidden">
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

          {/* Floating X Button */}
          <button
            onClick={() => setIsOpen(false)}
            className="bg-white hover:bg-gray-100 rounded-full p-5 shadow-lg transition-all"
            aria-label="Close chat"
          >
            <X className="w-8 h-8 text-gray-600" />
          </button>
        </div>
      )}
    </>
  );
}
