from fastapi import (
    FastAPI,
    WebSocket,
    WebSocketDisconnect,
    HTTPException,
    File,
    UploadFile,
)
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import Optional, List
import os
from dotenv import load_dotenv
from supabase import create_client, Client
from elevenlabs import ElevenLabs
from datetime import datetime
import uuid
import io
import tempfile
import httpx

load_dotenv()

app = FastAPI(title="Escal8 - Backend API")

# CORS configuration for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize clients
supabase_url = os.getenv("SUPABASE_URL", "")
supabase_key = os.getenv("SUPABASE_KEY", "")
elevenlabs_api_key = os.getenv("ELEVENLABS_API_KEY", "")
openai_api_key = os.getenv("OPENAI_API_KEY", "")

if not all([supabase_url, supabase_key, elevenlabs_api_key]):
    raise RuntimeError(
        "Missing required environment variables: SUPABASE_URL, SUPABASE_KEY, ELEVENLABS_API_KEY"
    )

supabase: Client = create_client(supabase_url, supabase_key)
elevenlabs_client = ElevenLabs(api_key=elevenlabs_api_key)

# OpenAI client (optional, for enhanced text chat)
openai_client = None
if openai_api_key:
    from openai import OpenAI

    openai_client = OpenAI(api_key=openai_api_key)

# Base agent configuration
BASE_AGENT_ID = "agent_4301kak9z54ye2xt7apdc1encesz"


# Pydantic models
class CloneAgentRequest(BaseModel):
    agent_name: str
    extra_prompts: str
    user_id: Optional[str] = None


class StartConversationRequest(BaseModel):
    agent_id: str
    user_id: Optional[str] = None
    channel: str = "web"


class SendMessageRequest(BaseModel):
    conversation_id: str
    message: str


@app.get("/")
async def root():
    return {"message": "Escal8 - Backend API"}


@app.get("/health")
async def health_check():
    return {"status": "healthy"}


@app.get("/api/agents/base")
async def get_base_agent():
    """Get the base agent configuration."""
    try:
        # Fetch base agent directly by ID
        base_agent = elevenlabs_client.conversational_ai.agents.get(
            agent_id=BASE_AGENT_ID
        )

        return {
            "agent_id": base_agent.agent_id,
            "name": base_agent.name if hasattr(base_agent, "name") else "Base Agent",
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/agents/{agent_id}/websocket-url")
async def get_agent_websocket_url(agent_id: str):
    """Get a signed WebSocket URL for real-time conversation with an agent."""
    try:
        # Get signed URL from ElevenLabs API
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"https://api.elevenlabs.io/v1/convai/conversation/get-signed-url",
                params={"agent_id": agent_id},
                headers={"xi-api-key": elevenlabs_api_key},
            )

            if response.status_code == 200:
                data = response.json()
                return {"signed_url": data.get("signed_url")}
            else:
                raise HTTPException(
                    status_code=response.status_code,
                    detail=f"Failed to get signed URL: {response.text}",
                )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/agents/clone")
async def clone_agent(request: CloneAgentRequest):
    """Clone the base agent with custom prompts using the duplicate method."""
    try:
        # Duplicate the base agent using ElevenLabs API
        # The duplicated agent will automatically inherit all settings from the base
        duplicated_agent = elevenlabs_client.conversational_ai.agents.duplicate(
            agent_id=BASE_AGENT_ID, name=f"Custom Agent - {request.agent_name}"
        )

        # Extract agent_id from the duplicated agent response
        new_agent_id = duplicated_agent.agent_id

        # Note: The extra_prompts are stored in Supabase for tracking purposes
        # To actually modify the agent's behavior, you would need to:
        # 1. Get the agent's full configuration
        # 2. Reconstruct the conversation_config with the merged prompt
        # 3. Call update() with the new config
        # This is complex due to the nested structure of ConversationalConfig
        # For now, we store the extra prompts and the duplicate serves as a template

        # Store in Supabase with the extra prompts noted
        agent_data = {
            "elevenlabs_agent_id": new_agent_id,
            "base_agent_id": BASE_AGENT_ID,
            "name": request.agent_name,
            "extra_prompts": request.extra_prompts,
            "voice_id": None,  # Will be inherited from base agent
            "created_by_user_id": request.user_id,
        }

        result = supabase.table("agents").insert(agent_data).execute()

        return {
            "agent_id": new_agent_id,
            "db_id": result.data[0]["id"],
            "name": request.agent_name,
            "message": "Agent cloned successfully. Note: Extra prompts are stored but not yet applied to the agent behavior. See implementation notes for details.",
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/agents")
async def list_agents():
    """List all cloned agents."""
    try:
        result = supabase.table("agents").select("*").execute()
        return {"agents": result.data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/conversations/start")
async def start_conversation(request: StartConversationRequest):
    """Start a new conversation."""
    try:
        # Get or create user
        user_id = request.user_id
        if not user_id:
            # Create anonymous user
            user_result = (
                supabase.table("user_profiles")
                .insert(
                    {
                        "display_name": "Anonymous User",
                        "metadata": {"type": "anonymous"},
                    }
                )
                .execute()
            )
            user_id = user_result.data[0]["id"]

        # Get agent from DB
        agent_result = (
            supabase.table("agents")
            .select("*")
            .eq("elevenlabs_agent_id", request.agent_id)
            .execute()
        )
        if not agent_result.data:
            raise HTTPException(status_code=404, detail="Agent not found")

        agent = agent_result.data[0]

        # Create conversation
        conversation_data = {
            "user_id": user_id,
            "agent_id": agent["id"],
            "elevenlabs_agent_id": request.agent_id,
            "channel": request.channel,
        }

        result = supabase.table("conversations").insert(conversation_data).execute()

        return {
            "conversation_id": result.data[0]["id"],
            "agent_name": agent["name"],
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/conversations/{conversation_id}/messages")
async def send_message(conversation_id: str, request: SendMessageRequest):
    """Send a message in a conversation and get AI response."""
    try:
        # Verify conversation exists
        conv_result = (
            supabase.table("conversations")
            .select("*")
            .eq("id", conversation_id)
            .execute()
        )
        if not conv_result.data:
            raise HTTPException(status_code=404, detail="Conversation not found")

        conversation = conv_result.data[0]
        elevenlabs_agent_id = conversation["elevenlabs_agent_id"]

        # Store user message
        user_message_data = {
            "conversation_id": conversation_id,
            "role": "user",
            "content_text": request.message,
        }
        user_msg_result = supabase.table("messages").insert(user_message_data).execute()

        # Get agent details for personality/system prompt
        agent_result = (
            supabase.table("agents")
            .select("*")
            .eq("elevenlabs_agent_id", elevenlabs_agent_id)
            .execute()
        )
        agent_data = agent_result.data[0] if agent_result.data else None

        # Get conversation history for context
        history_result = (
            supabase.table("messages")
            .select("role, content_text")
            .eq("conversation_id", conversation_id)
            .order("created_at")
            .execute()
        )

        # Format conversation history for LLM
        conversation_history = []
        for msg in history_result.data[:-1]:  # Exclude the message we just added
            conversation_history.append(
                {
                    "role": msg["role"] if msg["role"] != "system" else "assistant",
                    "content": msg["content_text"],
                }
            )

        # Generate response using OpenAI (if available) or fallback
        if openai_client and agent_data:
            try:
                # Create system prompt from agent configuration
                system_prompt = f"""You are a customer service agent with the following characteristics:
                
Agent Name: {agent_data.get("name", "Customer Service Agent")}
Additional Instructions: {agent_data.get("extra_prompts", "Be helpful and professional.")}

You are engaging in a text-based chat with a customer. Respond naturally and stay in character."""

                # Build messages for OpenAI
                messages = [{"role": "system", "content": system_prompt}]
                messages.extend(conversation_history)
                messages.append({"role": "user", "content": request.message})

                # Get response from OpenAI
                response = openai_client.chat.completions.create(
                    model="gpt-4o-mini",
                    messages=messages,
                    max_tokens=500,
                    temperature=0.8,
                )

                assistant_response = response.choices[0].message.content
            except Exception as e:
                print(f"OpenAI error: {e}")
                assistant_response = f"I received your message: '{request.message}'. I'm here to help! (Note: Full conversational AI features work best with voice)"
        else:
            # Fallback response
            assistant_response = f"I received your message: '{request.message}'. I'm here to help! (Note: For the best experience, try using the voice interface)"

        # Store assistant message
        assistant_message_data = {
            "conversation_id": conversation_id,
            "role": "assistant",
            "content_text": assistant_response,
        }
        assistant_msg_result = (
            supabase.table("messages").insert(assistant_message_data).execute()
        )

        return {
            "user_message": user_msg_result.data[0],
            "assistant_message": assistant_msg_result.data[0],
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/conversations/{conversation_id}/messages")
async def get_messages(conversation_id: str):
    """Get all messages in a conversation."""
    try:
        result = (
            supabase.table("messages")
            .select("*")
            .eq("conversation_id", conversation_id)
            .order("created_at")
            .execute()
        )
        return {"messages": result.data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/conversations/{conversation_id}/end")
async def end_conversation(conversation_id: str):
    """End a conversation."""
    try:
        result = (
            supabase.table("conversations")
            .update({"ended_at": datetime.utcnow().isoformat()})
            .eq("id", conversation_id)
            .execute()
        )

        return {"success": True}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/text-to-speech")
async def text_to_speech(text: str, voice_id: Optional[str] = "SOYHLrjzK2X1ezoPC6cr"):
    """Convert text to speech using ElevenLabs TTS."""
    try:
        # For ElevenLabs SDK 2.24.0+, use the text_to_speech.convert method
        # which returns an iterator of audio chunks
        audio_generator = elevenlabs_client.text_to_speech.convert(
            voice_id=voice_id,
            text=text,
            model_id="eleven_multilingual_v2",  # Using multilingual model
            output_format="mp3_44100_128",
        )

        # Collect audio bytes from generator
        audio_bytes = b"".join(audio_generator)

        return StreamingResponse(
            io.BytesIO(audio_bytes),
            media_type="audio/mpeg",
            headers={"Content-Disposition": "inline; filename=speech.mp3"},
        )
    except Exception as e:
        print(f"TTS Error: {str(e)}")
        print(f"Error type: {type(e)}")
        import traceback

        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"TTS Error: {str(e)}")


@app.post("/api/speech-to-text")
async def speech_to_text(audio_file: UploadFile = File(...)):
    """Convert speech to text using a simple fallback or OpenAI Whisper."""
    try:
        # Read the uploaded audio file
        audio_data = await audio_file.read()

        # Option 1: If OpenAI is available, use Whisper for STT
        if openai_client:
            try:
                # Save to temporary file
                with tempfile.NamedTemporaryFile(
                    delete=False, suffix=".webm"
                ) as temp_file:
                    temp_file.write(audio_data)
                    temp_file_path = temp_file.name

                try:
                    with open(temp_file_path, "rb") as audio_file_obj:
                        # Use OpenAI Whisper for transcription
                        transcription = openai_client.audio.transcriptions.create(
                            model="whisper-1", file=audio_file_obj
                        )

                    return {
                        "text": transcription.text,
                        "success": True,
                    }
                finally:
                    # Clean up temp file
                    if os.path.exists(temp_file_path):
                        os.unlink(temp_file_path)

            except Exception as whisper_error:
                print(f"Whisper STT error: {whisper_error}")
                # Fall through to alternative

        # Option 2: Fallback - return a message indicating STT is not configured
        return {
            "text": "[Voice message received - please configure OPENAI_API_KEY for speech-to-text]",
            "success": False,
            "error": "STT requires OpenAI API key",
        }

    except Exception as e:
        print(f"STT Error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"STT Error: {str(e)}")


@app.websocket("/ws/audio")
async def websocket_audio_endpoint(websocket: WebSocket):
    """
    WebSocket endpoint for real-time audio streaming.
    Handles bidirectional audio communication between frontend and backend.
    """
    await websocket.accept()

    try:
        while True:
            # Receive audio data from frontend
            data = await websocket.receive_bytes()

            # TODO: Process audio with Whisper STT
            # TODO: Send transcribed text to GPT-4o
            # TODO: Parse action tags from LLM response
            # TODO: Generate audio response with ElevenLabs
            # TODO: Send audio back to frontend

            # Placeholder response
            await websocket.send_json({"type": "status", "message": "Audio received"})

    except WebSocketDisconnect:
        print("Client disconnected")
    except Exception as e:
        print(f"Error: {e}")
        await websocket.close()


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
