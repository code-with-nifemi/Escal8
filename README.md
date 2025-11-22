# Escal8 - AI Voice Conversations

A real-time voice conversation platform powered by ElevenLabs AI agents, featuring a modern Next.js dashboard with analytics, agent management, and WebSocket-based voice chat. All conversations are persisted in Supabase.

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Quick Start

```bash
# 1. Setup Backend
cd backend
cp .env.example .env
# Edit .env with your Supabase and ElevenLabs credentials
pip install -r requirements.txt
uvicorn app.main:app --reload

# 2. Setup Frontend (in a new terminal)
cd Escal8
cp .env.local.example .env.local
npm install
npm run dev

# 3. Open http://localhost:3000
```

## Overview

This project demonstrates how to:

- Build a modern dashboard with Next.js 16 and React 19
- Create and manage ElevenLabs conversational AI agents
- Implement real-time voice chat via WebSocket
- Process audio with Web Audio API (PCM encoding/decoding)
- Display live transcripts during conversations
- Store all conversation data in Supabase
- Visualize call metrics and analytics

## Project Structure

```
.
├── Escal8/                # Next.js 16 Frontend (MAIN FRONTEND)
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx              # Dashboard home
│   │   │   ├── agents/
│   │   │   │   └── page.tsx          # Agent management & voice chat
│   │   │   ├── layout.tsx
│   │   │   └── globals.css
│   │   ├── components/               # UI components
│   │   │   ├── Sidebar.tsx           # Navigation
│   │   │   ├── DashboardHeader.tsx
│   │   │   ├── AgentsList.tsx
│   │   │   └── Charts.tsx
│   │   ├── hooks/
│   │   │   └── useAgentConversation.ts  # WebSocket voice chat hook
│   │   └── types/
│   │       └── websocket.ts          # ElevenLabs WebSocket types
│   ├── package.json
│   ├── .env.local                    # Environment config
│   └── README.md                     # Frontend documentation
├── backend/                # FastAPI backend
│   ├── app/
│   │   ├── __init__.py
│   │   └── main.py        # Main FastAPI application with agent & conversation APIs
│   ├── requirements.txt   # Python dependencies
│   ├── Dockerfile
│   └── .env.example       # Environment variables template
├── frontend/              # Legacy React + Vite frontend (DEPRECATED)
│   └── ...                # Use Escal8 instead
├── docker-compose.yml     # Docker orchestration
├── project_spec.md        # Original project specification
└── README.md              # This file
```

## Tech Stack

### Backend

- **FastAPI** - Modern Python web framework
- **ElevenLabs Python SDK** - Conversational AI agent management
- **Supabase** - PostgreSQL database with real-time capabilities
- **Python 3.11+** - Runtime environment

### Frontend (Escal8)

- **Next.js 16** - React framework with App Router
- **React 19** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS 4** - Styling
- **Lucide React** - Icon library
- **Recharts** - Charts and data visualization

## Database Schema

The Supabase database includes the following tables:

- **user_profiles** - User information and metadata
- **agents** - Cloned agent configurations and prompts
- **conversations** - Conversation sessions linking users and agents
- **messages** - Individual messages within conversations
- **audio_logs** - Audio artifacts and metadata from conversations

## Getting Started

### Prerequisites

- Node.js 20+ (for local development)
- Python 3.11+ (for local development)
- Supabase account and project
- ElevenLabs API key
- Docker & Docker Compose (optional)

### Environment Setup

1. **Backend Configuration**

Copy the environment template and fill in your credentials:

```bash
cp backend/.env.example backend/.env
```

Edit `backend/.env`:

```env
# Supabase Configuration
SUPABASE_URL=https://xzpiiwlwwgewyvxmpynk.supabase.co
SUPABASE_KEY=your_supabase_anon_key_here

# ElevenLabs Configuration
ELEVENLABS_API_KEY=your_elevenlabs_api_key_here
```

2. **Frontend Configuration (Escal8)**

Copy the environment template:

```bash
cp Escal8/.env.local.example Escal8/.env.local
```

Edit `Escal8/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Database Setup

The database tables have been created with the following migrations:

- `create_user_profiles_table`
- `create_agents_table`
- `create_conversations_table`
- `create_messages_table`
- `create_audio_logs_table`

All tables include Row Level Security (RLS) enabled with permissive policies for development.

### Running Locally (Development)

#### 1. Backend (Terminal 1)

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

#### 2. Frontend - Escal8 (Terminal 2)

```bash
cd Escal8
npm install
npm run dev
```

The application will be available at:

- **Frontend (Escal8):** http://localhost:3000
- **Dashboard:** http://localhost:3000
- **Agents:** http://localhost:3000/agents
- **Backend API:** http://localhost:8000
- **API Docs:** http://localhost:8000/docs

**Note:** The `/frontend` folder contains the legacy React+Vite app used for initial prototyping. **Use Escal8 as the main frontend** - it has all features integrated plus the full dashboard experience.

### Running with Docker

Start both services:

```bash
docker-compose up --build
```

## API Endpoints

### Agent Management

- `GET /api/agents/base` - Get base agent configuration
- `POST /api/agents/clone` - Create/clone an agent with custom prompts
- `GET /api/agents` - List all created agents
- `GET /api/agents/{agent_id}/websocket-url` - Get signed WebSocket URL for voice chat

### Conversation Management

- `POST /api/conversations/start` - Start a new conversation
- `POST /api/conversations/{conversation_id}/messages` - Send a message
- `GET /api/conversations/{conversation_id}/messages` - Get conversation history
- `POST /api/conversations/{conversation_id}/end` - End a conversation

### System

- `GET /` - Root endpoint (returns "Escal8 - Backend API")
- `GET /health` - Health check

## Features

### ✅ Implemented

#### Dashboard (Escal8)

- 📊 Real-time call metrics and analytics
- 📈 Performance charts with Recharts
- 🤖 Agent management interface
- 🎨 Professional Escal8 design system
- 🧭 Sidebar navigation with routing

#### Voice Chat

- 🎤 Real-time audio streaming via WebSocket
- 💬 Live transcription of user and agent speech
- 🔊 Audio playback queue with interruption handling
- ⏸️ Pause/resume conversation controls
- 📝 Message history display

#### Agent Management

- ➕ Create new AI agents with custom prompts
- 🗂️ List all created agents
- 🎙️ Start voice chat with any agent
- 💾 All agents stored in Supabase

#### Backend

- 🚀 FastAPI with async/await
- 🗄️ Supabase PostgreSQL database
- 🤖 ElevenLabs Conversational AI integration
- 🔗 WebSocket signed URL generation
- 📊 Full conversation history tracking

### ⏳ To Be Implemented

- 🔐 User authentication and authorization
- 💾 Audio artifact storage in Supabase Storage
- 📊 Advanced conversation analytics dashboard
- 📱 Mobile responsive optimizations
- 🔍 Search and filter agents/conversations

## Usage

### 1. Access the Dashboard

Navigate to http://localhost:3000 to view:

- Call metrics and analytics
- Performance charts
- Most called agents
- Language distribution

### 2. Create a New Agent

1. Click "Agents" in the sidebar or navigate to http://localhost:3000/agents
2. Click "Create New Agent"
3. Enter a name for your agent
4. Add custom instructions/prompts
5. Click "Create Agent"

### 3. Start a Voice Conversation

1. From the Agents page, find your agent
2. Click "Start Voice Chat"
3. Allow microphone permissions when prompted
4. Click "Start Conversation" to begin
5. Speak naturally with your agent in real-time
6. View live transcripts of your conversation
7. Click "Stop Conversation" or "End Chat" when finished
8. All messages are automatically stored in Supabase

### 4. View Conversation History

All conversation history is automatically saved and can be:

- Queried through the API (`GET /api/conversations/{id}/messages`)
- Viewed directly in your Supabase dashboard

## Development Notes

### Base Agent

The current base agent is "Middle Management Queen" with ID: `agent_4301kak9z54ye2xt7apdc1encesz`

This can be changed by updating the `BASE_AGENT_ID` constant in `backend/app/main.py:58`.

### API Integration

The backend uses:

- ElevenLabs Python SDK for agent operations (`elevenlabs_client.conversational_ai.agents.*`)
- Supabase Python client for database operations

### Frontend Architecture

The Escal8 frontend uses:

- **Next.js App Router** for routing and server-side rendering
- **React Hooks** (`useState`, `useEffect`, `useRef`) for state management
- **Custom Hooks** (`useAgentConversation`) for WebSocket voice chat logic
- **Client Components** (`'use client'`) for interactive features
- **Web Audio API** for real-time audio processing

### Voice Chat Technology

- **WebSocket Connection** to ElevenLabs for bi-directional streaming
- **Microphone Input** → PCM 16-bit encoding @ 16kHz → Base64 → WebSocket
- **Agent Audio** → WebSocket → Base64 decode → PCM → Web Audio API playback
- **Audio Queue System** with interruption handling
- **Live Transcription** for both user and agent speech

## Troubleshooting

### Common Issues

#### Backend Issues

1. **Missing environment variables**: Ensure all required variables are set in `backend/.env`
2. **Database connection errors**: Verify Supabase URL and anon key
3. **ElevenLabs API errors**: Check API key validity and rate limits
4. **CORS errors**: Backend allows `http://localhost:3000` (Escal8) by default

#### Frontend Issues

1. **Can't access microphone**:
   - Check browser permissions
   - Use HTTPS in production (microphone requires secure context)
   - Try Chrome/Edge for best Web Audio API support
2. **WebSocket connection fails**:
   - Ensure backend is running on port 8000
   - Check `NEXT_PUBLIC_API_URL` in `.env.local`
   - Verify ElevenLabs API key is valid
3. **No audio playback**:
   - Check browser audio permissions
   - Ensure speakers/headphones are connected
   - Try refreshing the page

### Debug Mode

Run the backend with debug logging:

```bash
uvicorn app.main:app --reload --log-level debug
```

Check browser console for frontend errors:

```
F12 → Console tab
```

## Contributing

This is a hackathon project. Feel free to extend and modify as needed.

## Frontend Comparison

### Why Escal8 over /frontend?

| Feature              | Escal8 (Main)               | /frontend (Legacy)   |
| -------------------- | --------------------------- | -------------------- |
| **Framework**        | Next.js 16 + React 19       | React 18 + Vite      |
| **Routing**          | App Router (built-in)       | Single page          |
| **Dashboard**        | ✅ Full analytics dashboard | ❌ No dashboard      |
| **Design**           | Professional Escal8 system  | Basic Tailwind       |
| **Navigation**       | Sidebar with routing        | Basic view switching |
| **Charts**           | Recharts integration        | None                 |
| **Voice Chat**       | ✅ Full integration         | ✅ Full integration  |
| **Agent Management** | ✅ Full CRUD UI             | ✅ Basic UI          |
| **Port**             | 3000                        | 5173                 |
| **Recommended**      | ✅ **YES**                  | ❌ Deprecated        |

**Use Escal8** for the complete experience with dashboard, analytics, and professional UI.

## License

This is a hackathon project for educational and entertainment purposes.

## Learn More About Next.js

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
