'use client';

import React from 'react';
import type { IframeStyleConfig } from '../types';

export interface AgnoCheckoutProps {
  orderId: string;
  walletUrl?: string;
  onSuccess?: (orderId: string) => void;
  onError?: (error: Error) => void;
  className?: string;
  title?: string;
  style?: IframeStyleConfig;
  hideHeader?: boolean;
}

/**
 * Agno Checkout Component
 * Displays the wallet checkout page in an iframe
 */
export function AgnoCheckout({
  orderId,
  walletUrl = 'http://localhost:3000',
  onSuccess,
  onError,
  className,
  title = 'Complete Your Purchase',
  style,
  hideHeader = false,
}: AgnoCheckoutProps) {
  // Build iframe URL with style parameters
  const iframeUrl = React.useMemo(() => {
    const url = new URL(`${walletUrl}/order/${orderId}`);

    if (style) {
      if (style.transparent !== undefined) {
        url.searchParams.set('transparent', String(style.transparent));
      }
      if (style.primaryColor) {
        url.searchParams.set('primaryColor', style.primaryColor);
      }
      if (style.backgroundColor) {
        url.searchParams.set('backgroundColor', style.backgroundColor);
      }
      if (style.textColor) {
        url.searchParams.set('textColor', style.textColor);
      }
      if (style.borderRadius) {
        url.searchParams.set('borderRadius', style.borderRadius);
      }
      if (style.fontFamily) {
        url.searchParams.set('fontFamily', style.fontFamily);
      }
    }

    return url.toString();
  }, [walletUrl, orderId, style]);

  // Listen for messages from the iframe (for future payment status updates)
  React.useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Only accept messages from the wallet URL
      if (!event.origin.startsWith(walletUrl)) {
        return;
      }

      try {
        const data = event.data;

        if (data.type === 'agno:payment:success') {
          onSuccess?.(orderId);
        } else if (data.type === 'agno:payment:error') {
          onError?.(new Error(data.error || 'Payment failed'));
        }
      } catch (error) {
        console.error('Error handling message from iframe:', error);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [walletUrl, orderId, onSuccess, onError]);

  // Apply transparent background if configured
  const containerClassName = React.useMemo(() => {
    if (className) return className;

    const baseClass = 'min-h-screen flex items-center justify-center p-4';
    const bgClass = style?.transparent ? 'bg-transparent' : 'bg-gray-50';

    return `${baseClass} ${bgClass}`;
  }, [className, style?.transparent]);

  const cardClassName = React.useMemo(() => {
    const baseClass = 'w-full max-w-4xl rounded-lg overflow-hidden';
    const bgClass = style?.transparent ? 'bg-transparent' : 'bg-white shadow-xl';

    return `${baseClass} ${bgClass}`;
  }, [style?.transparent]);

  return (
    <div className={containerClassName}>
      <div className={cardClassName}>
        {!hideHeader && title && (
          <div
            className="p-4"
            style={{
              background: style?.primaryColor
                ? style.primaryColor
                : 'linear-gradient(to right, rgb(37, 99, 235), rgb(147, 51, 234))',
            }}
          >
            <h1
              className="text-2xl font-bold text-center"
              style={{
                color: style?.textColor || 'white',
                fontFamily: style?.fontFamily,
              }}
            >
              {title}
            </h1>
          </div>
        )}
        <div className="relative w-full" style={{ height: hideHeader ? '100vh' : 'calc(100vh - 200px)' }}>
          <iframe
            src={iframeUrl}
            className="w-full h-full border-0"
            title="Agno Checkout"
            sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox"
            allow="payment"
          />
        </div>
      </div>
    </div>
  );
}
