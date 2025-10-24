import { createDataStreamResponse } from 'ai';

import { securityCheck } from '@/lib/ai/layers/security';
import type { ChatRequest } from '@/lib/ai/type';
import {
  processChatMessage,
  createSecurityErrorResponse,
} from '@/lib/ai/layers/llmResponce';

export const maxDuration = 60;

/**
 * Main route handler for chat API
 */
export async function POST(request: Request): Promise<Response> {
  try {
    // 1. Parse request
    const { id, messages } = (await request.json()) as ChatRequest;

    // 2. Security layer
    const securityResult = await securityCheck(messages);
    if (!securityResult.isSecure) {
      return createSecurityErrorResponse(securityResult.reason || '');
    }

    // 3. Process chat (more layers will be added in future)
    return createDataStreamResponse({
      execute: (dataStream) => processChatMessage(messages, dataStream),
      onError: () => 'متأسفانه خطایی رخ داد!',
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: 'خطایی هنگام پردازش درخواست شما رخ داد!',
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
  }
}
