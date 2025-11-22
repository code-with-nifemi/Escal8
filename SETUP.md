# Setup Guide

This guide will help you get the project up and running.

## Prerequisites

Before starting, ensure you have:

1. **Node.js 20+** installed
2. **Python 3.11+** installed
3. **A Supabase account** - Sign up at https://supabase.com
4. **An ElevenLabs API key** - Get one at https://elevenlabs.io

## Step 1: Clone the Repository

```bash
git clone <repository-url>
cd 2025-11-tanda-hackathons
```

## Step 2: Set Up Supabase

### 2.1 Get Your Supabase Credentials

1. Log in to your Supabase account
2. Navigate to your project (or create a new one named "loop")
3. Go to Settings → API
4. Copy your:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **Anon/Public Key** (starts with `eyJ...`)

### 2.2 Database Setup

The database tables have already been created via migrations. The schema includes:

- `user_profiles` - User information
- `agents` - Cloned AI agent configurations
- `conversations` - Conversation sessions
- `messages` - Chat messages
- `audio_logs` - Audio artifacts

You can verify the tables exist by:
1. Opening your Supabase project
2. Going to Table Editor
3. Checking for the tables listed above

## Step 3: Get ElevenLabs API Key

1. Sign up or log in to ElevenLabs at https://elevenlabs.io
2. Navigate to your Profile → API Keys
3. Copy your API key

## Step 4: Configure Environment Variables

### Backend Configuration

1. Navigate to the backend directory:
```bash
cd backend
```

2. Copy the example environment file:
```bash
cp .env.example .env
```

3. Edit `.env` and fill in your credentials:
```env
# Supabase Configuration
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_KEY=your_supabase_anon_key_here

# ElevenLabs Configuration
ELEVENLABS_API_KEY=your_elevenlabs_api_key_here
```

### Frontend Configuration (Optional)

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Copy the example environment file:
```bash
cp .env.example .env
```

3. The default configuration should work for local development:
```env
VITE_API_URL=http://localhost:8000
```

## Step 5: Install Dependencies

### Backend Dependencies

```bash
cd backend
python -m venv venv

# On Windows:
venv\Scripts\activate

# On macOS/Linux:
source venv/bin/activate

pip install -r requirements.txt
```

### Frontend Dependencies

**Note:** This project uses Yarn instead of npm for better compatibility with native modules on Windows.

```bash
# Install Yarn globally if you don't have it
npm install -g yarn

cd frontend
yarn install
```

## Step 6: Verify ElevenLabs Agent

The project uses a base agent called "Middle Management Queen". To verify it exists:

1. You can check using the ElevenLabs dashboard, or
2. The backend will automatically verify when you make your first API call

If you want to use a different base agent:
1. Get the agent ID from your ElevenLabs dashboard
2. Update `BASE_AGENT_ID` in `backend/app/main.py` (line 36)

## Step 7: Start the Application

### Start Backend (Terminal 1)

```bash
cd backend
# Activate virtual environment if not already active
uvicorn app.main:app --reload --port 8000
```

You should see:
```
INFO:     Uvicorn running on http://0.0.0.0:8000
INFO:     Application startup complete.
```

### Start Frontend (Terminal 2)

```bash
cd frontend
yarn dev
```

You should see:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

## Step 8: Test the Application

1. Open your browser and navigate to http://localhost:5173
2. You should see the home page with "Clone New Agent" button
3. Try cloning an agent:
   - Click "Clone New Agent"
   - Enter a name (e.g., "My Custom Agent")
   - Add custom instructions (e.g., "Be extra polite and helpful")
   - Click "Clone Agent"
4. Once cloned, start a conversation by clicking "Start Chat"
5. Send a message and verify you receive a response

## Troubleshooting

### Backend won't start

**Error: "Missing required environment variables"**
- Make sure your `.env` file exists in the `backend/` directory
- Verify all three environment variables are set (SUPABASE_URL, SUPABASE_KEY, ELEVENLABS_API_KEY)

**Error: "Connection refused" to Supabase**
- Verify your SUPABASE_URL is correct
- Check that your SUPABASE_KEY is the anon/public key, not the service role key

### Frontend won't connect to backend

**Error: "Network Error" or "Failed to fetch"**
- Ensure the backend is running on port 8000
- Check that CORS is properly configured (it should be by default)
- Verify the frontend `.env` has the correct `VITE_API_URL`

### Agent cloning fails

**Error: "Failed to clone agent"**
- Verify your ELEVENLABS_API_KEY is valid
- Check that you have credits available in your ElevenLabs account
- Ensure the base agent ID exists in your ElevenLabs account

### Database errors

**Error: "relation does not exist"**
- The database tables might not have been created
- Verify tables exist in your Supabase project's Table Editor
- If missing, contact support or manually create the schema

## Next Steps

Once everything is working:

1. **Explore the API**: Visit http://localhost:8000/docs for interactive API documentation
2. **Customize the base agent**: Update the `BASE_AGENT_ID` constant to use your own agent
3. **Extend functionality**: Add features like audio streaming, user authentication, etc.
4. **Deploy**: Consider deploying to platforms like Vercel (frontend) and Railway/Render (backend)

## Additional Resources

- [ElevenLabs API Documentation](https://elevenlabs.io/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [React Documentation](https://react.dev/)

## Getting Help

If you run into issues:

1. Check the console logs in both terminal windows
2. Review the browser console for frontend errors
3. Verify all environment variables are correctly set
4. Ensure you have internet connectivity for API calls
5. Check that you have sufficient credits/quota in your ElevenLabs account
