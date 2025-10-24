'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { PlusIcon, SparklesIcon } from './icons';
import { memo } from 'react';
import { motion } from 'framer-motion';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from './ui/tooltip';

function PureChatHeader({
  chatId,
  isReadonly,
}: {
  chatId: string;
  isReadonly: boolean;
}) {
  const router = useRouter();

  return (
    <motion.header
      className="flex sticky top-0 z-10 bg-background/80 backdrop-blur-lg p-4 items-center justify-between md:px-8 border-b"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      <motion.div
        className="flex items-center gap-2 me-4"
        whileHover={{ scale: 1.02 }}
        transition={{ type: 'spring', stiffness: 400, damping: 10 }}
      >
        <div className="size-9 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-700 dark:from-blue-400 dark:to-blue-600 text-white">
          <SparklesIcon size={16} />
        </div>
        <motion.div
          className="flex items-center gap-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <span className="text-xl font-medium text-gray-800 dark:text-gray-200 ms-1">
            دستیار
          </span>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-blue-500 dark:from-blue-300 dark:to-blue-500">
            بلو
          </span>
        </motion.div>
      </motion.div>

      <div className="flex items-center gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all rounded-full px-4 border border-transparent hover:border-zinc-200 dark:hover:border-zinc-700"
                  onClick={() => {
                    // Force a complete page reload to clear all state
                    window.location.href = '/';
                  }}
                >
                  <PlusIcon size={16} />
                  <span className="font-medium">گفتگوی جدید</span>
                </Button>
              </motion.div>
            </TooltipTrigger>
            <TooltipContent
              side="bottom"
              className="bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700"
            >
              شروع گفتگوی جدید
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </motion.header>
  );
}

export const ChatHeader = memo(PureChatHeader);
