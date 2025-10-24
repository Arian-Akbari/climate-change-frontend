import { createOpenAI } from '@ai-sdk/openai';

export const model = createOpenAI({
  apiKey: process.env.OPENROUTER_API_KEY || '',
  baseURL: 'https://openrouter.ai/api/v1',
  compatibility: 'compatible',
});
