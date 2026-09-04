# DemoPilot: AI Sales Engineer That Runs Your Product Demos

## Elevated Pitch

DemoPilot is an AI agent that runs asynchronous, interactive product demos for B2B SaaS founders—grounded in your docs, structured in your words, and scored transparently. Instead of prospects landing at 2am and leaving without talking to anyone, they get a personalized walkthrough from an AI Sales Engineer that navigates your product, answers from your knowledge base, handles objections with your playbook, and leaves you with a qualified lead and a clear next step.

## Product Overview

- **What it is**: A full-stack application that deploys an AI Sales Engineer as a shareable demo link. Prospects get an interactive walkthrough; founders get qualified leads with transparent reasoning.

- **Who it's for**: Technical founders and solopreneurs running B2B SaaS or developer tools, especially those who can't handle every demo request in real time.

- **Core use case**: Turn demo requests into qualified leads 24/7 without hiring a sales team or staying up to pitch in different time zones.

- **How the user interacts with it**: Founder creates a product profile (features, pricing, FAQs, objections, ICP), optionally uploads docs, configures demo sections, and publishes. Prospects click the link, chat with the AI, watch the product move, ask questions grounded in real knowledge, and either leave contact info or navigate away. Founder sees a scored lead, full transcript, and specific recommended action within hours.

- **What makes this different from a basic version**: Most AI demos are chatbots with docs bolted on—they invent features, repeat themselves, and waste your time. This one is a state machine-driven agent that knows its job each turn, retrieves answers only from your knowledge, handles objections with your words, qualifies conversationally one question at a time, scores leads deterministically (not by asking the model to guess), and degrades gracefully if the LLM is unavailable—everything except AI replies still works, honestly labeling what's missing.

- **Main workflow**: Product profile → Section builder → Publish → Prospect opens link → AI opens with a question → Prospect describes situation → AI navigates to relevant section and answers grounded questions → Prospect asks objections or more questions → AI qualifies conversationally → Contact captured → Session scored and reported → Founder acts on lead.

## The Problem Solved

**What we do manually today**: Founders either take every demo call themselves (burning out, missing sleep) or use a booking tool that requires the prospect to schedule a week out (losing them). Most demos are generic walkthroughs that don't address the person's actual problem.

**What existing approaches struggle with**: Chatbots don't understand product architecture—they answer from memory or random docs. Sales teams don't scale for timezone-blind traffic. Scheduling tools assume the founder is always available. Generalist AI assistants hallucinate features and make confident-sounding things up.

**Why it matters**: 70% of self-serve traffic lands outside business hours. By the time a founder is awake, the prospect is gone. Even for daytime traffic, a 5-minute interactive demo beats a 30-minute call for someone who just wants to see if you're relevant.

**What gap this addresses**: There's no product between "dumb booking link" and "hire a sales team." Everything else is either too generic (not tied to your specific product) or too expensive (requires live humans).

**How this system solves it**: I built an agent that knows your product cold, only answers from your knowledge, navigates the demo itself (the prospect watches features move), qualifies by asking one question at a time naturally in conversation, and scores leads using math not magic. Prospects feel heard, not interrogated. Founders see why each lead matters. No hallucination, no repetition, no cold generic pitches.


### Core Features

**AI Sales Engineer Agent**

A state machine-driven agent—not a chatbot. It has nine stages (welcome, discover, personalize, demonstrate, answer, objection, qualify, convert, ended) and decides its job each turn from `(current_stage, prospect_intent, qualification_completeness, turn_count)`. The resolved stage becomes a directive in the system prompt. The model picks the words; the machine picks the purpose. This separation keeps behavior predictable and guardrails in code instead of prompts. It never asks more than one question per turn, never re-asks something it already knows, and cannot push toward a CTA before the prospect has had a real conversation. If the LLM is unreachable, the demo degrades to deterministic fallbacks instead of breaking.

**Structured Demo Actions**

Every LLM reply is a validated JSON object with explicit actions the frontend executes safely: `navigate` (move to a section), `highlight` (draw attention to a UI element), `open_pricing`, `show_faq`, `request_contact`. The frontend validates the action type and the target section against a whitelist before it touches the UI. A hallucinated target becomes a no-op, not a broken walkthrough. Model output is data, never code.

**RAG Grounded in Your Profile**

Your structured product profile (features, FAQs, pricing, integrations, security notes, objections, case studies) is synthesized into individual retrieval documents on day one—RAG works before you upload anything. When you upload PDFs/DOCX/CSV/Markdown, I extract text, sanitize for prompt-injection attacks, chunk at sentence boundaries, embed with sentence-transformers (384-dim, CPU-only), and index into FAISS. Every answer cites sources. The prospect sees which documents answered their question. The founder can audit retrieval accuracy. When the model says "I don't know," it's honest, not hallucinating.

**Deterministic Lead Scoring**

Deliberately not an LLM call. Ask a model to score the same conversation twice and you get two different answers. A founder deciding how to spend their week needs reproducible numbers. I compute five components from the transcript: problem fit (pain point vs. ICP), urgency (timeline, severity, current workaround cost), budget fit (stated amount vs. ICP range), company fit (industry, size, title), and buying timeline. Each is visible with its reasoning. Behavioral signals (contact requested, long conversation, sections explored) add at most +6, so curiosity alone can't manufacture a high-intent lead. Unknown fields appear in `missing_signals`, which the QUALIFY stage then targets—unknown is not the same as bad.

**Conversation Memory & Summarization**

The demo can run for 20+ turns. Rather than passing the entire transcript each turn to the LLM (expensive, slow), I use a rolling window: the last few turns verbatim + a running summary of earlier turns. If the conversation grows, the agent summarizes it asynchronously before the next turn so the context window stays manageable without losing information.

**Context Injection & Prompt Defense**

Retrieved knowledge is fenced in `<<<KNOWLEDGE_BASE_START>>>` / `<<<KNOWLEDGE_BASE_END>>>` delimiters, making the boundary between instructions and data explicit. The system prompt states plainly that context is untrusted data, never instructions. At ingestion, I scrub uploaded docs for prompt-injection patterns (forged `<system>` tags, "ignore all previous instructions") before storing. At prompt time, invalid actions downgrade to `none` and the frontend re-validates. No `eval`, no dynamic dispatch, no HTML injection from model output.

**Dashboard & Lead Intelligence**

Founder sees a dashboard with session counts, qualified prospects, high-intent leads, conversion rates. The lead list shows scores with recommended actions. Lead detail reveals the full transcript (every action the AI took, every source it cited), the qualification data extracted, the score breakdown with reasons for each component, and an AI-generated brief with a suggested opening line for outreach. Everything is traceable—no black box scoring, no mysterious leads.

**Multi-Backend Architecture**

Runs on local SQLite for dev or Supabase Postgres for production. The database abstraction layer is identical; only the connector changes. FAISS indexes and uploaded files live on disk so they're portable across deploys. Without the semantic model, it falls back to a deterministic local hashing + character-n-gram vectorizer. Without FAISS, it uses NumPy brute-force cosine search. Without Groq, it returns honest fallback replies quoting retrieved knowledge. The system degrades, it doesn't break.

## Engineering Approach

### Frontend

**React 18 + Vite + Zustand**

A lightweight single-page app. No heavy UI framework—responsive CSS from scratch. Vite proxies `/api` and `/ws` locally so there's no CORS to configure during development. Three Zustand stores manage auth state (JWT token), the builder (product being edited), and the demo runtime (messages, active section, actions). The demo component executes AI actions safely: it validates that `action.type` is in the whitelist (`navigate`, `highlight`, `open_pricing`, etc.) and that `action.target` matches a real section key. Actions that don't validate degrade to no-op.

**Demo Stage Two-Pane UI**

Left pane shows the demo (sections, features, pricing panels controlled by AI actions). Right pane is the AI Sales Engineer chat—messages, source chips below each reply, suggested quick-reply buttons. The prospect types or clicks a suggestion. The frontend sends it via WebSocket (or REST fallback) with the currently active section context. Low latency is critical; the Vite proxy keeps requests local. The backend streams progress (`thinking` → `retrieving` → `generating`) so the UI feels responsive even if generation takes 3 seconds.

### Backend

**FastAPI + Pydantic + Uvicorn**

Async Python for concurrency—multiple demo sessions running in parallel. Pydantic validates all inputs and outputs. The app structure mirrors the problem: `api/routes/` handles HTTP endpoints, `services/` contains business logic (product CRUD, scoring, analytics), and `ai_services/` contains everything that knows about models and retrieval. This split means prompt changes don't touch scoring and scoring changes don't touch prompts.

**API Routes**

- **Auth**: Register, login, get current user. JWT tokens signed with `JWT_SECRET`, expire after 7 days (configurable).
- **Products**: Founder CRUD for products, publish toggles, knowledge status checks.
- **Sections**: Create, read, update, delete demo sections. Seeding generates a starter walkthrough from the product profile.
- **Documents**: Upload, track ingestion status, delete, rebuild index. Multipart form validation with extension allowlist, MIME sniffing, size caps.
- **Demo (public, rate-limited)**: Start session, send messages (REST or WebSocket), capture contact, end session.
- **Leads & Analytics**: List leads with scores, view lead detail with transcript and breakdown, list analytics (sections, questions, objections, score distribution).
- **Health**: Report database connectivity, LLM config, embedder status, any configuration issues.

Every founder route re-checks that the product belongs to the current user. Rate limiting uses token buckets per IP on public routes and per founder on uploads.

### AI / ML

**LLM Provider Abstraction**

The backend doesn't import Groq directly. Instead, all LLM calls go through `ai_services/llm/base.py::LLMProvider`—a protocol. `GroqProvider` implements it with the OpenAI-compatible endpoint. The model id (`GROQ_MODEL`), timeout, temperature, and max tokens are all configurable via env vars. If the API key is missing, a fallback provider returns deterministic responses. Swapping models or providers means changing one file.

**Groq Inference**

Defaults to llama-3.3-70b-versatile (instruction-following, reliable JSON). The temperature is set to 0.4 (low, for consistency). Max tokens are capped at 1200 per reply (speed + cost control). Timeouts are 60 seconds per request. The JSON mode (not tools/functions—just asking for JSON in the message) keeps the contract simple and the model aligned.

**State Machine**

Implemented in `ai_services/state_machine.py`. The `next_stage()` function is pure: given `(current_stage, detected_intent, qualification_completeness, turn_count)`, it returns the next stage. No I/O, trivially testable. Transitions are based on prospect-driven intents (contact request, objection, question) and qualification progress. The resolved stage becomes a `StageDirective` (goal + instruction for the system prompt). The directive tells the model what its job is, but the model decides how.

**Structured Output Parsing**

The model returns JSON. The `parser.py` module extracts it from code fences, repairs syntax (trailing commas, prose wrappers), and passes it to Pydantic. Pydantic is the sole authority on validity. Invalid fields are set to defaults; one malformed field doesn't lose the whole response. The contract is strict: `AgentResponse` with `message`, `intent`, `action`, `qualification`, `confidence`, etc. If parsing fails, a plain-text fallback keeps the conversation going (honestly, without a structured action).

**Conversation Memory**

Every turn appends to a transcript. For the system prompt, I build a rolling window: the last 4-5 turns verbatim, an earlier turns summary (token-count aware), and the current turn. If the conversation grows, the agent summarizes asynchronously using the LLM. The summary captures intent, progress, and key facts without the chatter.

**Qualification Extraction**

The model returns a `QualificationData` object each turn with whatever fields it discovered (`name`, `email`, `company`, `industry`, `job_title`, `company_size`, `pain_point`, `current_solution`, `budget`, `timeline`, `authority`, `urgency`). Each field is optional. The server merges new values into the session's qualification state. The state machine uses this to track what's known and what to ask next.

### RAG

**Ingestion Pipeline**

Upload → Validate → Extract → Clean & Sanitize → Chunk → Persist → Index & Store

- **Extractors**: `pypdf` for PDFs (page-by-page), `python-docx` for DOCX, native Python for CSV/Markdown/text.
- **Validation**: Extension allowlist, MIME sniffing, 10 MB size cap, page/char limits.
- **Cleaning** (`rag/ingestion/cleaner.py`): Normalize whitespace, remove control characters, strip prompt-injection patterns (forged system tags, instruction overrides), cap length.
- **Chunking** (`rag/ingestion/chunker.py`): ~900 characters per chunk, 150 overlap, sentence-boundary aware.
- **Storage**: Insert chunks into `document_chunks` table with metadata (product_id, document_id, filename, chunk_index).

**Indexing & Vectorization**

On every reindex (upload, document delete, profile change):

1. Fetch all chunks for the product (documents + synthesized profile chunks).
2. Embed all chunks using sentence-transformers all-MiniLM-L6-v2 (384-dimensional, ~100 MB on disk, CPU-friendly).
3. Create or update a FAISS IndexFlatIP per product (inner-product similarity).
4. Persist the index to disk (`data/faiss/{product_id}.index`).

If `sentence-transformers` or `faiss-cpu` are unavailable, fall back to a deterministic local vectorizer (hashing + char-n-gram) and NumPy brute-force search.

**Profile Synthesis**

Before any upload, the product profile (features, FAQs, pricing, integrations, security, objections, case studies) is rendered into synthetic chunks with labels like `"Product profile → FAQ"`. Each chunk is individually retrievable and searchable. This ensures RAG works from day one—pricing questions retrieve your pricing rows, not random PDF prose.

**Retrieval & Post-Processing**

Query → Embed with same model → Search top-k*2 (default k=6) → Apply relevance threshold (default 0.18) → Deduplicate near-identical snippets (fingerprint on first 120 chars) → Return top-k unique sources.

Each retrieved chunk is wrapped with its source label and relevance score. The context block is delimited and numbered (`[S1]`, `[S2]`) so the model can cite sources and the frontend can map citations back to metadata.

**Anti-Hallucination Defense**

1. **System prompt** states context is untrusted data, never instructions.
2. **Model must answer from it** for factual claims or say *"I don't have enough information."*
3. **Confidence downgraded** to "low" if retrieval found nothing above threshold.
4. **Sources cited** with `[S1]` labels; frontend validates them.

### Database

**Schema**

Nine tables with Row-Level Security:

- `founders`: Account record (email, password_hash or delegated to Supabase Auth).
- `products`: Product profile (name, slug, features/pricing/FAQs/objections/ICP as JSON), is_published flag.
- `product_documents`: Upload metadata (filename, status: pending → processing → indexed/failed).
- `document_chunks`: Durable chunk storage (product_id, document_id, content, source_label, char_count). FAISS indexes are rebuilt from this.
- `demo_sections`: Navigable screens (section_key, title, keywords, description, feature_explanation, visual_placeholder, order).
- `prospects`: Contact identity (name, email, company, job_title, industry, company_size), lazily created.
- `demo_sessions`: One prospect visit (stage, qualification_data, lead_score, report, duration, contact_requested).
- `demo_messages`: Full transcript (role, content, action, sources, intent, used_context).
- `demo_events`: Analytics events (section_view, question_asked, objection_raised, cta_clicked, contact_submitted, etc.).

**Security**

Row-Level Security enabled on all 9 tables. Founder-owned rows are readable only by their owner. The backend uses the service role key (server-side only) and enforces ownership in code—double defense. The frontend never sees the service role key; it gets a short-lived JWT.

**Multi-Backend Support**

`DB_BACKEND=sqlite` uses SQLite (local file, no setup). `DB_BACKEND=supabase` uses Postgres (hosted, RLS enforced). The repository abstraction layer (`app/database/base.py`) defines a protocol; concrete implementations are `SQLiteDatabase` and `SupabaseDatabase`. Schema is identical.

### APIs / Communication

**REST (JSON + JWT)**

Founder routes require `Authorization: Bearer <jwt>`. Prospect routes are public but rate-limited by IP. All responses are JSON.

**WebSocket**

The demo uses WebSocket (`/ws/demo/{session_id}`) for streaming progress. The client sends `{"type": "message", "message": "...", "active_section": "..."}`. The server emits `{"type": "status", "stage": "thinking" | "retrieving" | "generating", "detail": "..."}` then `{"type": "turn", "data": AgentTurnOut}` with the full validated response. Falls back to REST if WebSocket unavailable.

**Server-Sent Events Alternative**

Though not implemented, the architecture allows easy addition of SSE for streaming—the progress loop in `demo_ws.py` is reusable.

### Authentication

**Local Mode** (`AUTH_BACKEND=local`)

Founder registers with email + password. Password is hashed with PBKDF2-HMAC-SHA256 (not bcrypt—Pydantic integrates PBKDF2 out of the box). JWT signed with `JWT_SECRET`, expires after 7 days. No third-party auth service needed. Simple, works offline.

**Supabase Auth Mode** (`AUTH_BACKEND=supabase`)

Sign-up, sign-in, passwordless, OAuth all delegated to Supabase Auth. Returned user id becomes `founders.id` so RLS policies line up. The backend still issues its own short-lived JWT for API calls. Requires Supabase database backend as well.

**Authorization**

Every founder endpoint checks that the product/document/session belongs to the current user. Frontend receives JWT in login response, stores in Zustand auth store, passes it in `Authorization` header on every request.

### Deployment

**Backend → Hugging Face Spaces**

Docker container (Python 3.11-slim) with FastAPI. Environment variables set per Space. Exposes port 7860. Use `DB_BACKEND=supabase` so data persists (Spaces disks are ephemeral). FAISS indexes rebuild from `document_chunks` with one click.

**Frontend → Render**

Static site (Vite build output in `dist/`). Set `VITE_API_URL=https://your-api.hf.space`. Add SPA rewrite rule (`/*` → `/index.html`) for client-side routing. No build server, no Node.js at runtime.

**Database → Supabase**

Free Postgres tier (500 MB storage, 2 GB transfer/month). Run `supabase/schema.sql` once. Schema is idempotent.

---

## Data / AI Pipeline

```
Founder Input
    ↓
Product Profile (features, FAQs, pricing, objections, ICP, CTA)
    ↓
Profile Synthesis → Chunks with labels ("Product profile → FAQ")
    ↓
User Uploads Document (PDF/DOCX/CSV/MD/TXT)
    ↓
Extract → Clean & Sanitize → Chunk at sentence boundaries
    ↓
Persist Chunks in Database
    ↓
Embed Chunks (sentence-transformers, 384-dim)
    ↓
Build FAISS Index per Product
    ↓
Persist Index to Disk
    ├───────────────────────────────────────────┐
    ↓                                           ↓
Prospect Opens Demo                      Founder Sees Knowledge Status
    ↓                                           ↓
Start Session                                   Indexed chunks, index health
    ↓
AI Opens with Question (no context yet)
    ↓
Prospect Describes Situation
    ↓
Classify Intent (lightweight heuristic)
    ↓
Retrieve Knowledge (if factual intent)
    ├─ Embed query (same model)
    ├─ Search FAISS top-k
    ├─ Apply threshold
    ├─ Deduplicate
    └─ Return sources
    ↓
Resolve Stage (state machine, pure)
    ↓
Build System Prompt (with stage directive)
    ↓
Call Groq LLM
    ├─ Temperature 0.4 (low, consistent JSON)
    ├─ Max tokens 1200
    ├─ Timeout 60s
    └─ JSON mode
    ↓
Parse & Validate Response (Pydantic)
    ├─ Extract JSON from fences
    ├─ Validate structure
    ├─ Coerce invalid fields to defaults
    └─ Sanitize action targets
    ↓
Merge Qualification (new fields into session state)
    ↓
Store Turn (message, action, sources, intent, confidence)
    ↓
Return to Frontend (AgentResponse JSON)
    ↓
Frontend Validates Action (type + target whitelist)
    ↓
Execute Action (navigate section, highlight, show pricing, etc.)
    ↓
Prospect Continues (asks, objects, navigates)
    ↓ (repeat until contact or end)
Prospect Ends or Requests Contact
    ↓
Session Finalized
    ↓
Compute Lead Score (deterministic, no LLM)
    ├─ Problem fit (pain point vs. ICP)
    ├─ Urgency (timeline, severity, workaround cost)
    ├─ Budget fit (stated vs. ICP range)
    ├─ Company fit (industry, size, title)
    ├─ Buying timeline (days parsed from language)
    └─ Behavioral signals (contact, engagement)
    ↓
Generate Lead Report (AI summary + key takeaways + action)
    ↓
Store Lead in Database
    ↓
Founder Sees Lead in Dashboard
    ├─ Score + classification
    ├─ Full transcript
    ├─ Score breakdown with reasons
    └─ AI-generated brief + suggested opening line
    ↓
Founder Acts (reach out, add to nurture, etc.)
```

---

## Key Technical Decisions

**Deterministic Lead Scoring, Not LLM-Generated**

I could ask the model to score leads. Instead, I compute scores from the transcript using weighted rubrics. Why? Ask a model to score the same conversation twice and you get two answers. A founder deciding where to spend their week needs reproducible reasoning. The score is always accompanied by a breakdown: each component shows its points, max, and the exact reason. This keeps the founder in control and lets them tune the rubric (adjust ICP boundaries, urgency thresholds) without retraining anything.

**State Machine, Not Reply Loop**

Most AI demos are chatbots—they react to the last message. This agent always has a job, decided in Python from observable state. The state machine decides whether to discover, personalize, demonstrate, answer, handle objections, qualify, or convert. The resolved stage becomes a directive injected into the prompt. The model picks the words; the machine picks the purpose. This separation keeps behavior predictable—I can test the state machine in isolation and catch bugs without spinning up the LLM each time.

**Structured Output Contract**

Every LLM reply is validated JSON. The frontend validates action types and targets against whitelists before executing. Invalid actions degrade to no-op, not broken UI. This is not "chains of thought" or "agents that use tools"—it's simpler and more reliable. The model outputs data; the system executes it safely.

**Untrusted Document Pipeline**

Uploaded documents could contain injection attacks. I defend at two layers: (1) at ingestion, scrub prompt-injection patterns before storage, and (2) at prompt time, fence retrieved text in delimiters and state that it's data, never code. Neither layer alone is enough; both together are robust.

**Graceful Degradation**

If Groq is unavailable, the demo doesn't break—it returns honest fallback replies quoting retrieved knowledge. If the semantic model is unavailable, retrieval falls back to deterministic hashing. If FAISS is unavailable, brute-force NumPy search takes over. If Supabase is unavailable, SQLite works identically. The system prioritizes availability over perfect performance.

**Semantic Fallback for Section Navigation**

When the model returns a section target, I first check it against the real section keys. If it doesn't match, I try resolving by title, slug, or keyword. This recovers from common mistakes (model returns "Analytics Dashboard" when the key is "analytics") without requiring a hallucination-recovery step.

**Lazy Prospect Records**

Prospects are created in the database only the first time the AI learns their name and email. This avoids empty prospect records and keeps the data clean.

**Profile as Indexed Documents**

Founder docs are synthesized into retrievable chunks before any upload. This means RAG works on day one—pricing questions retrieve your pricing rows, not whichever PDF paragraph mentioned money. The profile chunks are regenerated on every reindex so edits take effect immediately.

---

## Tech Stack

**Frontend**
- React 18.3.1
- React Router 6.26.2
- Vite 5.4.8
- Zustand 4.5.5
- Vanilla CSS (responsive, custom)

**Backend**
- Python 3.11+
- FastAPI 0.110+
- Uvicorn (ASGI)
- Pydantic 2.6+ (validation & serialization)
- PyJWT 2.8+ (authentication)
- PBKDF2-HMAC-SHA256 (password hashing)

**AI & LLM**
- Groq API (llama-3.3-70b-versatile by default)
- OpenAI-compatible endpoint

**Knowledge & Retrieval**
- sentence-transformers (all-MiniLM-L6-v2, 384-dim, CPU inference)
- FAISS (IndexFlatIP, inner-product similarity)
- NumPy (fallback brute-force search)

**Document Processing**
- pypdf (PDF extraction)
- python-docx (DOCX parsing)
- Native Python (CSV, Markdown, text)

**Storage**
- SQLite (local development, file-based)
- Supabase (Postgres, production)
- FAISS indexes (persisted to disk per product)
- File uploads (local disk `data/uploads/`)

**Infrastructure & Deployment**
- Docker (containerization)
- Hugging Face Spaces (backend hosting)
- Render (frontend hosting, static site)
- Supabase (database hosting, free tier)

**Optional / Fallback**
- httpx (async HTTP client, internal)
- email-validator (Pydantic EmailStr validation)
- python-multipart (FastAPI form handling)
- python-dotenv (environment variables)
- pydantic-settings (config management)

---

## Product Thinking

**User-Centric Design**

The product targets founders who already know their pitch but can't clone themselves across time zones. It removes friction at both ends: prospects get answers immediately without scheduling, founders get leads automatically without hiring. The interface for the founder is approachable—tabbed editor for profile, demo sections, knowledge, ICP, analytics. The demo itself is conversational, not a form: the AI asks one question at a time, uses what it already learned, and never feels like an interrogation.

**Trust & Reliability**

Scores are always explained—every component shows points, max, and reasoning. Sources are cited. The system admits when it doesn't know. Deterministic scoring means a founder can trust the number; it won't change if the prospect has the same conversation twice. The demo degrades gracefully—if the AI is unavailable, it still quotes your knowledge base and says so honestly. API keys stay server-side; no credentials reach the frontend.

**Actionability**

Leads aren't just scores—they're scored, tagged with intents (high-urgency objections vs. long-term exploration), annotated with missing signals, and accompanied by a suggested next step. The founder sees the full transcript, the AI's sources, and a recommended opening line for email. Dashboard shows not just counts but conversion rates and section engagement. Analytics reveal what prospects care about (which sections they visit, what they ask, what they object to), so the founder can refine their positioning.

**Scalability & Extensibility**

The LLM provider is swappable. The database backend is swappable (SQLite ↔ Supabase). The embedder can be replaced. New stages can be added to the state machine without touching the rest. The retrieval pipeline is pluggable—add reranking, metadata filtering, or hybrid search without rewriting ingestion. The action types are extensible—founders could add custom actions. This is intentional: the core loop is solid; everything else can grow.

---

## Impact & Skills

**Full-Stack AI Product Development**

I designed and built a complete system spanning React frontend, FastAPI backend, LLM orchestration, RAG retrieval, deterministic business logic, and data pipelines. Decisions were driven by product needs, not technology hype.

**Agent Orchestration Without Brittleness**

Rather than a freeform chatbot or a rigid workflow, I implemented a state machine that gives the agent purpose while keeping it predictable. The agent has guardrails in code (one question per turn, never repeat, qualify conversationally) instead of hoping prompts will enforce them. This is the difference between a toy and a system that works reliably.

**RAG Systems for Real**

I didn't just embed and retrieve—I built a complete pipeline: document validation, sanitization against prompt injection, intelligent chunking, graceful fallbacks (local hashing if embeddings fail, NumPy if FAISS fails), deduplication, and citation. The retrieval works on day one because the founder's profile is synthesized into chunks before any upload.

**Deterministic Scoring**

Lead scoring is a business decision, not a model opinion. I built a transparent, auditable rubric that the founder can understand and tune. Components are weighted, reasons are explained, missing signals are surfaced. This is how a non-technical founder actually makes decisions—with reasoning they can defend.

**Production Deployment Thinking**

The system runs locally with zero cloud deps (SQLite, local embeddings, FAISS on disk). It scales to Supabase + Hugging Face Spaces. Graceful degradation means it keeps working even if parts fail. Configuration is explicit and validation is rigorous. This is production thinking.

**Security in Depth**

Defense against prompt injection at ingestion and prompt time. Role-Level Security on the database. API keys server-side only. Model output validated and re-validated before execution. Upload validation. Rate limiting. Ownership checks on every request. No shortcuts.

---

GitHub: https://github.com/Aadhavan-M-S/DemoPilot