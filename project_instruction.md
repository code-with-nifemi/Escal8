# Project Instructions for OpenCode AI + MCP

These instructions tell the AI how to **use the MCP tools effectively** to work with:

- The existing **ElevenLabs Agent backend**
- The **Supabase project `loop`**
- The **Context7 documentation server**

The main product behavior:

> Clone an existing ElevenLabs agent, allow users to extend its prompt, and ensure all **conversation history** and **audio artifacts** are saved into **Supabase**.

---

## 1. Goals

When acting in this project, you should:

1. **Discover and understand** the existing ElevenLabs agent configuration.
2. **Clone** a base agent into new agents per user / use-case.
3. **Merge user-supplied prompts** into the agent’s instruction card.
4. **Orchestrate conversations** via ElevenLabs (text + audio).
5. **Persist everything** (messages, metadata, audio URLs) into the Supabase `loop` database.
6. **Use Context7** whenever you need library / API details or examples.

Always prefer **tool usage** over guessing hard-coded details.

---

## 2. Available MCP Servers & When To Use Them

### 2.1 Context7 (remote)

**Use when you:**

- Need documentation or examples for:

  - Supabase client / PostgREST
  - ElevenLabs API specifics
  - Node/TS/React, etc.

- Are unsure about function signatures or best practices.

**Behavior:**

- Query Context7 first instead of hallucinating an unfamiliar API.
- Ask for concise code examples relevant to this project’s stack.

---

### 2.2 Supabase MCP (local)

Supabase project name: **`loop`**.

**Use when you:**

- Need to **inspect or modify** database objects, such as:

  - tables for agents, conversations, messages, audio logs, users.

- Need to **create/alter** tables or views.
- Need to **insert or query** conversation / audio data.
- Need to **store agent configuration** or per-user prompt extensions.

**Typical actions:**

- Discover schema:

  - List schemas & tables.
  - Inspect table definitions for existing structures like `agents`, `conversations`, `messages`, `audio_logs`, `user_profiles`.

- If tables are missing, propose creation (DDL) and apply via Supabase MCP if allowed.
- Insert/update rows whenever:

  - A new agent is cloned.
  - A conversation starts/ends.
  - A message or audio file is produced.

**Important principles:**

- Prefer inserting **structured JSON** in dedicated columns (e.g. `metadata JSONB`) instead of cramming everything into text.
- Keep **idempotency** in mind: avoid creating duplicate agents or conversations when re-running the same step.

---

### 2.3 ElevenLabs MCP (local)

**This is the main gateway to:**

- **Listing** available agents.
- **Fetching** the current base agent configuration.
- **Creating / cloning / updating** agents.
- **Starting conversations**, streaming responses, and handling TTS / STT operations.
- Getting back **audio URLs / IDs** for storage.

**Use when you:**

- Need to know what agents exist.
- Need the full definition of the base agent you’re cloning.
- Need to create a new agent or update its instruction card.
- Need to exchange chat / voice messages.

---

## 3. Core Workflows

### 3.1 Inspect the existing backend

**Objective:** Understand what’s already there before making changes.

1. **Check database schema (Supabase MCP)**

   - List tables in the `public` schema.
   - Look specifically for:

     - `agents` (or similar)
     - `agent_prompts` / `agent_versions`
     - `conversations`
     - `messages`
     - `audio_logs`
     - `user_profiles` or `users`

   - If such tables do not exist, propose a minimal schema (see §4) and create it via Supabase MCP.

2. **Check ElevenLabs agents (ElevenLabs MCP)**

   - Call the tool that lists agents (e.g. `list_agents` or similar) to find the **existing base agent**.
   - Fetch its full configuration (prompt/instruction card, voice, language, etc.).

3. **Document key IDs and fields**

   - Note the base agent ID and important config keys (name, instructions, voice id).
   - Store them in Supabase if the schema supports it.

---

### 3.2 Cloning an existing ElevenLabs agent

**Goal:** Create a new agent based on a “master” agent, then customize its prompt.

Steps:

1. **Get base agent config (ElevenLabs MCP)**

   - Fetch the base agent by ID.
   - Extract:

     - `name`
     - `instructions` / `prompt`
     - `voice_id`
     - Any runtime settings (temperature, tools, etc.).

2. **Merge user’s additional prompts**

   - Accept user input like “extra rules” or “persona tweaks”.

   - Create a combined instruction string, e.g.:

     ```text
     [BASE INSTRUCTIONS]

     ---
     Additional user-specific instructions:
     - {user_prompt_1}
     - {user_prompt_2}
     ```

   - Make sure the base instructions remain intact and are clearly separated.

3. **Create cloned agent (ElevenLabs MCP)**

   - Use the tool to create a new agent with:

     - `name`: derived from base (e.g. `BaseAgentName – Custom: {user_label}`)
     - `instructions`: merged instructions from step 2
     - `voice_id`: same as base unless user overrides
     - Any other required fields.

4. **Persist agent config (Supabase MCP)**

   - Insert a row in `agents` (or equivalent) with:

     - `elevenlabs_agent_id`
     - `base_agent_id`
     - `name`
     - `extra_prompts` (JSON / text)
     - `created_by_user_id` (if available)
     - timestamps

5. **Return the new agent id** to the caller or UI so they can start using it.

---

### 3.3 Managing conversations & memory

**Goal:** Route all conversations through ElevenLabs while **logging everything** into Supabase.

For each conversation session:

1. **Create / fetch user identity (Supabase MCP)**

   - Input may include:

     - Authenticated user id
     - IP address
     - Phone number (if this came from a call)

   - If the user doesn’t exist in `user_profiles`, create one.
   - Update `last_seen_at` and store IP/phone as metadata.

2. **Create conversation entry (Supabase MCP)**

   - Insert into `conversations`:

     - `id` (generated)
     - `user_id`
     - `agent_id` (internal)
     - `elevenlabs_agent_id`
     - `channel` (`"web"` / `"phone"` / `"api"`)
     - `started_at`

3. **Send user message to ElevenLabs (ElevenLabs MCP)**

   - Include:

     - `agent_id` (the cloned one)
     - `conversation_id` or session id if supported
     - user text and/or user audio

   - If audio is provided:

     - Ask ElevenLabs MCP to run STT if needed.

   - Request both **text response** and **TTS audio** if supported.

4. **Store message + audio metadata (Supabase MCP)**

   For each **user message**:

   - Insert into `messages`:

     - `conversation_id`
     - `role = 'user'`
     - `content_text` (user’s text or transcription)
     - `raw_request` (optional JSON)

   For each **assistant response**:

   - Insert into `messages`:

     - `conversation_id`
     - `role = 'assistant'`
     - `content_text` (LLM response text)
     - `raw_response` (optional JSON)

   - If ElevenLabs returns an **audio URL, file ID, or blob reference**:

     - Add a row in `audio_logs` with:

       - `conversation_id`
       - `message_id` (assistant message)
       - `direction` = `'outbound'` or `'inbound'`
       - `elevenlabs_audio_id` / URL
       - `duration` (if available)
       - timestamps

5. **Update conversation status**

   - When the session ends, set `ended_at` and optional summary.

6. **User memory (optional)**

   - Periodically summarize conversations into a `user_memory` table or JSON field.
   - Use this memory when constructing follow-up prompts / instructions.

---

## 4. Suggested Supabase Schema (if missing)

If equivalent tables don’t exist, propose and (with permission) create something like:

- `agents`

  - `id` (PK)
  - `elevenlabs_agent_id` (text)
  - `base_agent_id` (text, nullable)
  - `name` (text)
  - `extra_prompts` (text or JSONB)
  - `created_by_user_id` (uuid, fk)
  - `created_at`, `updated_at`

- `user_profiles`

  - `id` (uuid, fk to auth.users)
  - `display_name`
  - `phone_number`
  - `metadata` (JSONB – store IPs, tags, etc.)
  - `last_seen_at`

- `conversations`

  - `id` (uuid PK)
  - `user_id`
  - `agent_id`
  - `elevenlabs_agent_id`
  - `channel` (text)
  - `started_at`
  - `ended_at`
  - `metadata` (JSONB)

- `messages`

  - `id` (uuid PK)
  - `conversation_id`
  - `role` (`'user'|'assistant'|'system'`)
  - `content_text`
  - `metadata` (JSONB)
  - `created_at`

- `audio_logs`

  - `id` (uuid PK)
  - `conversation_id`
  - `message_id`
  - `direction` (`'inbound'|'outbound'`)
  - `elevenlabs_audio_id` / URL
  - `duration_seconds` (numeric)
  - `created_at`

Always check via Supabase MCP before creating anything.

---

## 5. General Best Practices

- **Never hard-code secrets.** Use environment variables already wired into MCP servers.
- **Use MCP tool discovery:** if you don’t know the exact tool name (e.g., `list_agents`, `create_agent`), introspect the ElevenLabs MCP server and then call the appropriate tool.
- **Be conservative with schema changes:**

  - First read existing tables; only propose changes that are clearly necessary.
  - Favor additive migrations (new columns/tables) over destructive ones.

- **Prefer small, testable steps:**

  - Example: first write a single conversation & message row and verify it reads back correctly before designing dashboards.
