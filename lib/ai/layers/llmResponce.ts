import { systemPrompt } from '@/lib/ai/prompts';
import { generateUUID } from '@/lib/utils';
import { getWeather } from '@/lib/ai/tools/get-weather';
import { model } from '@/lib/ai/providers';
import { smoothStream, streamText } from 'ai';

import type { ChatMessage } from '@/lib/ai/type';

/**
 * Processes chat messages through the LLM with available tools
 */
export async function processChatMessage(
  messages: ChatMessage[],
  dataStream: any,
) {
  const result = streamText({
    model: model('qwen/qwen-2.5-72b-instruct'),
    system: systemPrompt(),
    messages,
    maxSteps: 5,
    experimental_activeTools: ['getWeather'],
    experimental_transform: smoothStream({ chunking: 'word' }),
    experimental_generateMessageId: generateUUID,
    tools: {
      getWeather,
    },
    experimental_telemetry: {
      isEnabled: true,
      functionId: 'stream-text',
    },
  });

  result.consumeStream();
  result.mergeIntoDataStream(dataStream, {
    sendReasoning: false,
  });
}

/**
 * Creates a security error response
 */
export function createSecurityErrorResponse(reason: string): Response {
  return new Response(
    JSON.stringify({
      error: 'متأسفانه درخواست شما به دلایل امنیتی پردازش نشد.',
      details: reason,
    }),
    {
      status: 403,
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
}
