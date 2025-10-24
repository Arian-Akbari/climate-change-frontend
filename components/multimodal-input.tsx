'use client';

import type { UIMessage } from 'ai';
import cx from 'classnames';
import type React from 'react';
import { useRef, useEffect, useCallback, memo, useState } from 'react';
import { useLocalStorage, useWindowSize } from 'usehooks-ts';
import { motion, AnimatePresence } from 'framer-motion';

import { ArrowUpIcon, StopIcon } from './icons';

import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { SuggestedActions } from './suggested-actions';
import type { UseChatHelpers } from '@ai-sdk/react';

function PureMultimodalInput({
  chatId,
  input,
  setInput,
  status,
  stop,
  messages,
  setMessages,
  append,
  handleSubmit,
  className,
}: {
  chatId: string;
  input: UseChatHelpers['input'];
  setInput: UseChatHelpers['setInput'];
  status: UseChatHelpers['status'];
  stop: () => void;
  messages: Array<UIMessage>;
  setMessages: UseChatHelpers['setMessages'];
  append: UseChatHelpers['append'];
  handleSubmit: UseChatHelpers['handleSubmit'];
  className?: string;
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { width } = useWindowSize();
  const [textareaHeight, setTextareaHeight] = useState<number>(60);
  const [isFocused, setIsFocused] = useState<boolean>(false);

  // Check if the AI is currently processing
  const isProcessing = status === 'submitted' || status === 'streaming';

  // Reset height on status change (from processing to ready)
  useEffect(() => {
    if (!isProcessing && textareaRef.current) {
      // Only adjust height if there's input
      if (input.trim().length > 0) {
        adjustHeight();
      } else {
        // Reset to default height
        textareaRef.current.style.height = '60px';
        setTextareaHeight(60);
      }
    }
  }, [isProcessing, input]);

  useEffect(() => {
    if (textareaRef.current) {
      adjustHeight();
    }
  }, []);

  const adjustHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = '60px'; // Reset to base height
      const scrollHeight = Math.min(
        180,
        Math.max(60, textareaRef.current.scrollHeight),
      );
      textareaRef.current.style.height = `${scrollHeight}px`;
      setTextareaHeight(scrollHeight);
    }
  };

  const resetHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = '60px';
      setTextareaHeight(60);
    }
  };

  const [localStorageInput, setLocalStorageInput] = useLocalStorage(
    'input',
    '',
  );

  useEffect(() => {
    if (textareaRef.current) {
      const domValue = textareaRef.current.value;
      // Prefer DOM value over localStorage to handle hydration
      const finalValue = domValue || localStorageInput || '';
      setInput(finalValue);
      if (finalValue.trim().length > 0) {
        adjustHeight();
      }
    }
    // Only run once after hydration
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setLocalStorageInput(input);
    if (input.trim().length > 0) {
      adjustHeight();
    }
  }, [input, setLocalStorageInput]);

  const handleInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(event.target.value);
    adjustHeight();
  };

  const submitForm = useCallback(() => {
    handleSubmit();
    setLocalStorageInput('');
    resetHeight();

    if (width && width > 768) {
      textareaRef.current?.focus();
    }
  }, [handleSubmit, setLocalStorageInput, width]);

  const buttonVariants = {
    initial: { opacity: 0, scale: 0.8 },
    animate: {
      opacity: 1,
      scale: 1,
      transition: { type: 'spring', stiffness: 500, damping: 30 },
    },
    exit: { opacity: 0, scale: 0.8, transition: { duration: 0.15 } },
  };

  return (
    <motion.div
      className="relative w-full flex flex-col gap-4"
      layout
      transition={{ type: 'spring', stiffness: 400, damping: 40 }}
    >
      {messages.length === 0 && (
        <SuggestedActions append={append} chatId={chatId} />
      )}

      <motion.div
        className="relative"
        layout
        transition={{ type: 'spring', stiffness: 400, damping: 40 }}
      >
        <motion.div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          animate={{
            boxShadow: isProcessing
              ? [
                  '0 0 0 0 rgba(0,0,0,0)',
                  '0 0 0 3px rgba(147,197,253,0.15)',
                  '0 0 0 0 rgba(0,0,0,0)',
                ]
              : isFocused
                ? '0 0 0 2px rgba(147,197,253,0.3)'
                : '0 0 0 0 rgba(0,0,0,0)',
          }}
          transition={
            isProcessing
              ? {
                  duration: 2.5,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: 'loop' as const,
                }
              : {
                  duration: 0.2,
                }
          }
        />

        <Textarea
          data-testid="multimodal-input"
          ref={textareaRef}
          placeholder="پیام خود را بنویسید..."
          value={input}
          onChange={handleInput}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={cx(
            'min-h-[60px] p-4 max-h-[180px] overflow-y-auto resize-none rounded-2xl !text-base bg-muted ps-14 pe-4 focus-visible:ring-0 focus-visible:ring-offset-0 transition-all duration-200 ease-in-out border-muted',
            {
              'border-primary/30': isProcessing,
            },
            className,
          )}
          style={{ height: `${textareaHeight}px` }}
          rows={1}
          autoFocus
          disabled={isProcessing}
          onKeyDown={(event) => {
            if (
              event.key === 'Enter' &&
              !event.shiftKey &&
              !event.nativeEvent.isComposing
            ) {
              event.preventDefault();
              if (!isProcessing && input.trim().length > 0) {
                submitForm();
              }
            }
          }}
        />

        <AnimatePresence mode="wait">
          <motion.div
            key={isProcessing ? 'stop' : 'send'}
            variants={buttonVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="absolute bottom-3 left-3 z-10"
          >
            {isProcessing ? (
              <motion.div
                whileTap={{ scale: 0.9 }}
                whileHover={{ scale: 1.1, rotate: 90 }}
                transition={{ type: 'spring', stiffness: 400, damping: 15 }}
              >
                <Button
                  data-testid="stop-button"
                  size="icon"
                  variant="outline"
                  className="rounded-full size-8 flex items-center justify-center hover:bg-background hover:text-destructive shadow-sm border-muted-foreground/20 backdrop-blur-sm"
                  onClick={(event) => {
                    event.preventDefault();
                    stop();
                    setMessages((messages) => messages);
                  }}
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.5, repeat: 0 }}
                  >
                    <StopIcon size={16} />
                  </motion.div>
                  <span className="sr-only">توقف تولید</span>
                </Button>
              </motion.div>
            ) : (
              <motion.div
                whileTap={{ scale: 0.9 }}
                whileHover={{ scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 400, damping: 15 }}
              >
                <Button
                  data-testid="send-button"
                  size="icon"
                  className={cx(
                    'rounded-full size-8 flex items-center justify-center transition-colors shadow-sm backdrop-blur-sm border',
                    input.trim().length > 0
                      ? 'bg-primary text-primary-foreground hover:bg-primary/90 border-primary/50'
                      : 'bg-muted text-muted-foreground cursor-not-allowed border-muted-foreground/20',
                  )}
                  disabled={input.trim().length === 0}
                  onClick={(event) => {
                    event.preventDefault();
                    if (input.trim().length > 0) {
                      submitForm();
                    }
                  }}
                >
                  <motion.div
                    initial={{ opacity: 0.8 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ArrowUpIcon size={16} />
                  </motion.div>
                  <span className="sr-only">ارسال پیام</span>
                </Button>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

export const MultimodalInput = memo(
  PureMultimodalInput,
  (prevProps, nextProps) => {
    if (prevProps.input !== nextProps.input) return false;
    if (prevProps.status !== nextProps.status) return false;
    return true;
  },
);
