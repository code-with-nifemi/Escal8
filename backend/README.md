# Backend API Configuration

## Environment Setup

### 1. Create your `.env` file

Copy the `.env.example` file and rename it to `.env`:

```bash
cp .env.example .env
```

### 2. Configure your environment variables

#### Required Variables:

- **SUPABASE_URL**: Your Supabase project URL
- **SUPABASE_KEY**: Your Supabase anonymous/service key
- **ELEVENLABS_API_KEY**: Your ElevenLabs API key

#### Optional Variables:

- **OPENAI_API_KEY**: Required for text chat and speech-to-text features

#### Base Agent Configuration:

The backend supports cloning from **3 different base agents**, which are randomly selected when a user creates a new agent. This provides variety in the agent personalities.

```env
# Agent 1: BureaucratBot 9000 - The original frustrating agent
BASE_AGENT_ID_1=agent_4401kamradv5esha969hw9dgexma

# Agent 2: Empathy Nullifier - Even more bureaucratic
BASE_AGENT_ID_2=agent_your_second_agent_id_here

# Agent 3: Loop Master - Specialist in circular reasoning
BASE_AGENT_ID_3=agent_your_third_agent_id_here
```

### 3. Setting up Base Agents in ElevenLabs

You need to create 3 different base agents in your ElevenLabs account:

1. **Log in to ElevenLabs Console**: https://elevenlabs.io/app/conversational-ai
2. **Create 3 different agents** with different personalities:
   - **Agent 1**: BureaucratBot 9000 - Bureaucratic and frustrating
   - **Agent 2**: Empathy Nullifier - Extra bureaucratic with no empathy
   - **Agent 3**: Loop Master - Specialist in circular logic
3. **Copy each agent ID** and paste into your `.env` file

#### How to find Agent IDs:

1. Go to your ElevenLabs Conversational AI dashboard
2. Click on an agent
3. The URL will contain the agent ID: `https://elevenlabs.io/app/conversational-ai/[AGENT_ID]`
4. Copy the agent ID from the URL

### 4. Install Dependencies

```bash
pip install -r requirements.txt
```

### 5. Run the Server

```bash
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## How Agent Cloning Works

When a user creates a new agent via the `/api/agents/clone` endpoint:

1. The backend **randomly selects** one of the 3 base agent IDs
2. The selected base agent is **duplicated** using the ElevenLabs API
3. The new agent inherits all properties from the base agent (voice, personality, etc.)
4. The cloned agent is stored in Supabase with:
   - The new agent ID
   - Reference to which base agent it was cloned from
   - Custom prompts/instructions from the user
   - Creator user ID

## API Endpoints

### Get Base Agents Info
```
GET /api/agents/base
```

Returns information about all 3 base agents available for cloning.

### Clone an Agent
```
POST /api/agents/clone
Body: {
  "agent_name": "My Custom Agent",
  "extra_prompts": "Be extra helpful and friendly",
  "user_id": "optional-user-id"
}
```

Creates a new agent by randomly selecting and cloning one of the 3 base agents.

### List All Agents
```
GET /api/agents
```

Returns all cloned agents from the database.

## Troubleshooting

### Error: "Missing required environment variables"

Make sure you've set all required variables in your `.env` file:
- `SUPABASE_URL`
- `SUPABASE_KEY`
- `ELEVENLABS_API_KEY`

### Error: "Failed to clone agent"

1. Verify your ElevenLabs API key is valid
2. Ensure the base agent IDs exist in your ElevenLabs account
3. Check that you have sufficient credits in your ElevenLabs account

### All clones use the same base agent

If all 3 `BASE_AGENT_ID_*` variables point to the same agent ID, update them with 3 different agent IDs in your `.env` file.

## Development Notes

- The random selection ensures variety in agent personalities
- Each cloned agent is tracked in Supabase with its base agent reference
- The `base_agent_id` field in the response tells you which base agent was used
- For testing, you can temporarily set all 3 agent IDs to the same value
