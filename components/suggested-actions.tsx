'use client';

import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { memo } from 'react';
import type { UseChatHelpers } from '@ai-sdk/react';

interface SuggestedActionsProps {
  chatId: string;
  append: UseChatHelpers['append'];
}

function PureSuggestedActions({ chatId, append }: SuggestedActionsProps) {
  const suggestedActions = [
    {
      title: 'معرفی دستیار',
      label: 'چه خدماتی ارائه می‌دهید؟',
      action: 'دستیار بلو چه خدماتی ارائه می‌دهد و چطور می‌تواند به من کمک کند؟',
    },
    {
      title: 'مدیریت حساب',
      label: 'چگونه موجودی حسابم را ببینم؟',
      action: 'چگونه می‌توانم موجودی حساب‌های بانکی خود را مشاهده کنم؟',
    },
    {
      title: 'انتقال وجه',
      label: 'روش‌های انتقال پول آنلاین',
      action: 'روش‌های انتقال وجه آنلاین در بانک بلو چیست؟',
    },
    {
      title: 'خدمات ویژه',
      label: 'تسهیلات و وام‌های بانکی',
      action: 'شرایط دریافت تسهیلات و وام‌های بانکی در بانک بلو چیست؟',
    },
  ];

  return (
    <div
      data-testid="suggested-actions"
      className="grid sm:grid-cols-2 gap-2 w-full"
    >
      {suggestedActions.map((suggestedAction, index) => (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ delay: 0.05 * index }}
          key={`suggested-action-${suggestedAction.title}-${index}`}
          className={index > 1 ? 'hidden sm:block' : 'block'}
        >
          <Button
            variant="ghost"
            onClick={async () => {
              window.history.replaceState({}, '', `/chat`);

              append({
                role: 'user',
                content: suggestedAction.action,
              });
            }}
            className="text-right border rounded-xl px-4 py-3.5 text-sm flex-1 gap-1 sm:flex-col w-full h-auto justify-start items-start"
          >
            <span className="font-medium">{suggestedAction.title}</span>
            <span className="text-muted-foreground">
              {suggestedAction.label}
            </span>
          </Button>
        </motion.div>
      ))}
    </div>
  );
}

export const SuggestedActions = memo(PureSuggestedActions, () => true);
