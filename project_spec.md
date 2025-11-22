# Project Specification: "The Infinite Hold" (Bureaucracy Simulator)

## 1. Tech Stack

- **Monorepo:** Python (Backend) + Node.js (Frontend)
- **Backend:** FastAPI (Python 3.10+)
  - **WebSockets:** `fastapi.websockets` for real-time audio streaming.
  - **Audio Processing:** OpenAI Whisper (STT), ElevenLabs (TTS), FFmpeg (Audio manipulation).
  - **Database:** Supabase (PostgreSQL) via `supabase-py`.
  - **LLM:** OpenAI GPT-4o via `openai` SDK.
- **Frontend:** React (Vite + TypeScript)
  - **State Management:** Zustand (for global fee state).
  - **Styling:** Tailwind CSS.
  - **Audio:** Native MediaRecorder API + WebSocket for streaming.

## 2. Architecture Overview

The app consists of a widget embedded on a client site. When a user speaks, the browser streams audio chunks to the FastAPI backend via WebSocket.

1. **Browser:** Captures audio -> Sends blob to WebSocket.
2. **FastAPI:** Receives audio -> Transcribes (Whisper) -> Sends text to LLM.
3. **LLM (The Brain):** Generates text response + "Action Tags" (e.g., `[TRANSFER_DEPT]`, `[ADD_FEE:5.00]`).
4. **Backend Logic:** - Parses Action Tags.
   - Triggers fee updates via WebSocket back to frontend.
   - Selects Voice ID (switching voices if "transferred").
   - Sends text to ElevenLabs API.
5. **ElevenLabs:** Streams audio back to frontend -> Played to user.

## 3. Key "Evil" Features (Implementation Details)

### A. The Voice Pipeline

- **Endpoint:** `ws://localhost:8000/ws/audio`
- **Logic:** Must handle full-duplex streaming.
- **Latency Hiding:** If the LLM takes time, play a "typing" or "paper shuffling" sound effect immediately.

### B. The "Regret Recalculation" Engine (Billing)

- **Trigger:** When LLM output contains `[ADD_FEE: amount : reason]`.
- **Action:** Backend pushes a JSON event to the frontend `fee_update` channel.
- **Frontend:** React updates the "Total Due" ticker with a counting-up animation.

### C. Persona Switching

- **Mechanism:** Maintain a `current_persona` state in the WebSocket session.
- **Default Voice:** "Polite Sarah".
- **Switch:** If LLM outputs `[TRANSFER: "Aggressive Igor"]`, the next ElevenLabs call uses Igor's Voice ID.

### D. The "Hostage" NPS Survey

- **Component:** A modal that appears on socket close.
- **Logic:**
  - If user selects < 9 stars: Show toast "Error: Submission failed. Positivity checksum invalid."
  - If user selects 10 stars: Success.

## 4. Database Schema (Supabase)

- **Table `calls`:** `id`, `user_ip`, `duration`, `frustration_score` (int), `transcript_summary` (text).
- **Table `fees`:** `call_id`, `fee_name`, `amount`.

## 5. Required Environment Variables

- `OPENAI_API_KEY`
- `ELEVENLABS_API_KEY`
- `SUPABASE_URL`
- `SUPABASE_KEY`
