// Define message types for better type safety
export type ChatMessage = {
  id?: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  createdAt?: Date;
};

export type ChatRequest = {
  id: string;
  messages: ChatMessage[];
};
