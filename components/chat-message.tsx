import ReactMarkdown from 'react-markdown';
import { Message } from '@/hooks/useChatbot';

interface ChatMessageProps {
  message: Message;
  variant?: 'bubble' | 'fullscreen';
}

export function ChatMessage({ message, variant = 'bubble' }: ChatMessageProps) {
  const isUser = message.role === 'user';

  const bubbleStyles = isUser
    ? 'bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-md'
    : 'bg-white text-gray-700 shadow-sm border border-gray-100';

  const fullscreenStyles = isUser
    ? 'bg-blue-600 text-white'
    : 'bg-gray-100 text-gray-900';

  const styles = variant === 'bubble' ? bubbleStyles : fullscreenStyles;
  const roundedClass = variant === 'bubble' ? 'rounded-2xl p-4' : 'rounded-lg p-3';

  return (
    <div className={`max-w-[80%] ${roundedClass} ${styles}`}>
      {isUser ? (
        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
      ) : (
        <div className="text-sm prose prose-sm max-w-none prose-p:my-1 prose-ul:my-1 prose-ol:my-1 prose-li:my-0">
          <ReactMarkdown>{message.content}</ReactMarkdown>
        </div>
      )}
    </div>
  );
}
