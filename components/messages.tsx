import type { UIMessage } from 'ai';
import { PreviewMessage, ThinkingMessage } from './message';
import { useScrollToBottom } from './use-scroll-to-bottom';
import { Overview } from './overview';
import { memo } from 'react';
import equal from 'fast-deep-equal';
import type { UseChatHelpers } from '@ai-sdk/react';
import { ArrowDown } from 'lucide-react';
import { Button } from './ui/button';
import { AnimatePresence, motion } from 'framer-motion';

// Simple vote type definition to replace database schema
export type Vote = {
  chatId: string;
  messageId: string;
  isUpvoted: boolean;
};

interface MessagesProps {
  chatId: string;
  status: UseChatHelpers['status'];
  votes: Array<Vote>;
  messages: Array<UIMessage>;
  setMessages: UseChatHelpers['setMessages'];
  reload: UseChatHelpers['reload'];
  isReadonly: boolean;
}

function PureMessages({
  chatId,
  status,
  votes,
  messages,
  setMessages,
  reload,
  isReadonly,
}: MessagesProps) {
  const [
    messagesContainerRef,
    messagesEndRef,
    showScrollButton,
    scrollToBottom,
  ] = useScrollToBottom<HTMLDivElement>(status);

  return (
    <div className="relative flex-1 flex flex-col overflow-hidden">
      <div
        ref={messagesContainerRef}
        className="flex flex-col min-w-0 gap-6 flex-1 overflow-y-auto h-full no-scrollbar pt-6 md:pt-8 pb-10"
      >
        {messages.length === 0 && <Overview />}

        {messages.map((message, index) => (
          <PreviewMessage
            key={message.id}
            chatId={chatId}
            message={message}
            isLoading={status === 'streaming' && messages.length - 1 === index}
            vote={votes.find((vote) => vote.messageId === message.id)}
            setMessages={setMessages}
            reload={reload}
            isReadonly={isReadonly}
            status={status}
          />
        ))}

        {status === 'submitted' &&
          messages.length > 0 &&
          messages[messages.length - 1].role === 'user' && <ThinkingMessage />}

        <div
          ref={messagesEndRef}
          className="shrink-0 min-w-[24px] min-h-[24px]"
        />
      </div>

      <AnimatePresence>
        {showScrollButton && (
          <motion.div
            className="fixed bottom-24 mx-auto w-full right-1/2 z-30"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
          >
            <Button
              onClick={scrollToBottom}
              className="rounded-full size-10 shadow-md hover:shadow-xl bg-[#191919] hover:bg-zinc-100 dark:hover:bg-zinc-800 text-foreground border border-border p-0 flex items-center justify-center"
            >
              <ArrowDown size={20} />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export const Messages = memo(
  PureMessages,
  (prevProps: MessagesProps, nextProps: MessagesProps) => {
    if (prevProps.status !== nextProps.status) return false;
    if (prevProps.status && nextProps.status) return false;
    if (prevProps.messages.length !== nextProps.messages.length) return false;
    if (!equal(prevProps.messages, nextProps.messages)) return false;
    if (!equal(prevProps.votes, nextProps.votes)) return false;

    return true;
  },
);
