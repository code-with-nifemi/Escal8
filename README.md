# Escal8 - AI Voice Conversation Platform

A modern dashboard and AI agent management platform built with Next.js 16, featuring real-time voice conversations powered by ElevenLabs AI.

## Features

- **Dashboard Analytics** - Real-time metrics and charts for call performance
- **AI Agent Management** - Create, configure, and manage conversational AI agents
- **Voice Chat** - Real-time voice conversations with AI agents via WebSocket
- **Live Transcripts** - See transcriptions of user and agent speech in real-time
- **Agent Creation** - Clone and customize AI agents with custom instructions
- **Conversation History** - All conversations saved to Supabase database

## Tech Stack

- **Next.js 16** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS 4** - Styling
- **Lucide React** - Icon library
- **Recharts** - Charts and data visualization
- **ElevenLabs API** - Conversational AI and voice synthesis
- **Web Audio API** - Real-time audio processing

## Prerequisites

- Node.js 20+
- Backend API running (see `/backend` folder)
- ElevenLabs API key
- Supabase account and project

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Setup

Create a `.env.local` file:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and add your backend API URL:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### 3. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the dashboard.

### 4. Start the Backend

Make sure the backend API is running (see `/backend` folder):

```bash
cd ../backend
uvicorn app.main:app --reload
```

## Project Structure

```
Escal8/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Dashboard home
│   │   ├── agents/
│   │   │   └── page.tsx          # Agent management & voice chat
│   │   ├── layout.tsx            # Root layout
│   │   └── globals.css           # Global styles
│   ├── components/
│   │   ├── Sidebar.tsx           # Navigation sidebar
│   │   ├── DashboardHeader.tsx   # Dashboard header
│   │   ├── AgentsList.tsx        # Agents display
│   │   ├── Charts.tsx            # Analytics charts
│   │   └── ...                   # Other components
│   ├── hooks/
│   │   └── useAgentConversation.ts  # WebSocket voice chat hook
│   └── types/
│       └── websocket.ts          # ElevenLabs WebSocket types
├── public/                       # Static assets
├── package.json
└── README.md
```

## Usage

### Dashboard

The main dashboard displays:
- Call metrics (total calls, minutes, success rate, avg duration)
- Performance charts
- Most called agents
- Language distribution

### Agents Page

Navigate to `/agents` to:
1. **View All Agents** - See your created AI agents
2. **Create New Agent** - Click "Create New Agent" button
   - Enter agent name
   - Add custom instructions/prompts
   - Click "Create Agent"
3. **Start Voice Chat** - Click "Start Voice Chat" on any agent
   - Click "Start Conversation" to begin
   - Speak naturally with your agent
   - View live transcripts
   - Click "Stop Conversation" or "End Chat" to finish

### Voice Chat Features

- Real-time audio streaming via WebSocket
- Live transcription of both user and agent speech
- Audio playback queue with interruption handling
- Automatic message saving to Supabase
- Connection status indicators
- Listening animation

## API Integration

The frontend connects to the backend API at `NEXT_PUBLIC_API_URL` for:

- `GET /api/agents` - List all agents
- `POST /api/agents/clone` - Create new agent
- `GET /api/agents/{agent_id}/websocket-url` - Get WebSocket URL
- `POST /api/conversations/start` - Start conversation
- `POST /api/conversations/{id}/messages` - Save messages
- `POST /api/conversations/{id}/end` - End conversation

## Development

### Build for Production

```bash
npm run build
npm start
```

### Linting

```bash
npm run lint
```

## Deployment

This Next.js app can be deployed to:
- **Vercel** (recommended)
- **Netlify**
- **AWS Amplify**
- Any Node.js hosting platform

Make sure to set the `NEXT_PUBLIC_API_URL` environment variable in your deployment platform.

## Troubleshooting

### WebSocket Connection Issues
- Ensure backend is running on the correct port
- Check CORS settings in backend
- Verify ElevenLabs API key is valid

### Microphone Not Working
- Check browser permissions for microphone access
- Use HTTPS in production (required for microphone)
- Try a different browser

### Audio Not Playing
- Check browser audio permissions
- Ensure speakers/headphones are connected
- Try refreshing the page

## Contributing

This is a hackathon project. Feel free to extend and modify as needed.

## License

Educational and entertainment purposes.
