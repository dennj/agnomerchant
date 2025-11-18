'use client';

import { useEffect, useState } from 'react';
import { ChatbotBubble } from './chatbot-bubble';
import { ChatbotFullscreen } from './chatbot-fullscreen';

interface ChatbotProps {
  accountId: string;
}

export function Chatbot({ accountId }: ChatbotProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await fetch(`/api/account/${accountId}/settings`);
        if (res.ok) {
          const data = await res.json();
          setIsFullscreen(data.isFullscreen || false);
        }
      } catch (error) {
        console.error('Failed to fetch chatbot settings:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchSettings();
  }, [accountId]);

  if (isLoading) {
    return null; // Or a loading spinner
  }

  if (isFullscreen) {
    return <ChatbotFullscreen accountId={accountId} />;
  }

  return <ChatbotBubble accountId={accountId} />;
}
