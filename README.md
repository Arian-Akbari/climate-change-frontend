# Blue Assistant

Blue Assistant is a next-generation AI-powered chat application designed for integration into Blue Bank's mobile application. It provides a conversational interface in Persian, offers personalized financial advice, executes transactions, and addresses FAQs using the Qwen Large Language Model (LLM).

## Features

- **Persian Language Support**: Fully supports Persian language queries and responses
- **Real-time Streaming**: Messages are streamed in real-time for a smooth chat experience
- **Personalized Responses**: Context-aware responses based on user history and preferences
- **Modern UI**: Clean, responsive interface with light/dark mode support
- **Weather Integration**: Built-in weather information tool

## Technology Stack

### Frontend

- **Next.js**: App Router architecture for efficient page rendering
- **React**: Component-based UI development
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Framer Motion**: Animation library for smooth transitions
- **Lucide React**: SVG icon library

### Backend & AI

- **Vercel AI SDK**: Integration with AI models
- **OpenAI**: API integration for AI capabilities
- **SWR**: Data fetching and caching

### Development Tools

- **TypeScript**: Static type checking
- **ESLint/Prettier**: Code quality and formatting

## Getting Started

### Prerequisites

- Node.js (v18.x or higher)
- npm or pnpm

### Installation

1. Clone the repository

```bash
git clone https://github.com/yourusername/blue-assistant.git
cd blue-assistant
```

2. Install dependencies

```bash
npm install
# or
pnpm install
```

3. Set up environment variables
   Create a `.env.local` file in the root directory:

```
# OpenAI API Key
OPENAI_API_KEY=your_openai_api_key
```

4. Run the development server

```bash
npm run dev
# or
pnpm dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
├── app/                 # Next.js App Router
│   ├── (chat)/          # Chat-related routes
│   │   ├── api/         # API endpoints
│   │   └── chat/        # Chat page
│   ├── globals.css      # Global styles
│   └── layout.tsx       # Root layout
├── components/          # React components
│   ├── ui/              # UI components (button, input, etc.)
│   ├── chat.tsx         # Main chat component
│   └── message.tsx      # Message display component
└── lib/                 # Utility functions and modules
    └── ai/              # AI-related utilities
        └── tools/       # AI tools (weather, etc.)
```

## Architecture

Blue Assistant follows a modern architecture:

1. **Chat Interface Layer**: Conversational UI for Persian-language queries
2. **Orchestration Layer**: Manages conversation flow and coordinates with sub-systems
3. **Tool Registry & Execution**: Metadata about available "tools" (e.g., weather lookup)
4. **Response Generation System**: Uses Qwen LLM to orchestrate final replies to the user

## Data Flow

1. User types a query in Persian
2. Frontend sends the query to the Next.js backend
3. Backend processes the query and calls the appropriate AI model/tools
4. AI model generates a response which is streamed back to the user
5. User interactions are logged for future context

## Roadmap

- **Advanced Financial Services**: Investment advice, loan applications, insurance quotes
- **Wider Banking Operations**: Wire transfers, deposit histories, credit card queries
- **Enhanced Channels**: Voice assistant integration, third-party platform chatbots
- **Full Data Privacy & Compliance**: Stronger protocols for banking and data protection laws
- **AI Governance**: Model drift evaluation, fairness, and bias checks

## License

This project is proprietary software developed for Blue Bank.

---

© 2024 Blue Bank. All Rights Reserved.
