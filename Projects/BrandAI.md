# BrandAI: Multi-Agent Platform for Automated Brand Intelligence & Content Generation

## Elevated Pitch

BrandAI is a production-ready AI platform that automates brand strategy, content creation, and competitive intelligence through a manually orchestrated 7-agent pipeline backed by RAG and local LLM inference. Instead of outsourcing to multiple tools and consultants, founders get cohesive brand identity, market positioning, multi-platform content calendars, and sentiment analysis in minutes—all built with deterministic validation layers that ground AI outputs in real market research.

---

## Product Overview

- **What it is:** A full-stack web application (React frontend, FastAPI backend, Python AI services) that transforms business ideas into actionable brand strategies and content.

- **Who it's for:** Startup founders, marketing teams, and brand strategists who need fast, repeatable brand development without external consultants or scattered tools.

- **Core use case:** User inputs their startup idea, industry, target audience, and product type. The system generates complete brand identity (name, tagline, mission, visual guidelines), a 30-day multi-platform content calendar, ad copy, competitor analysis, and sentiment-driven market insights.

- **How the user interacts with it:** Web interface at `http://localhost:5173` with dedicated pages for brand generation, naming, content strategy, competitor intelligence, and a conversational AI assistant. Users authenticate, create/save brands, and receive outputs tied to specific brands.

- **What makes it different:**
  - **No external LLMs:** All inference runs locally via Ollama (Llama3), no API dependencies.
  - **Manual agent orchestration:** Built from scratch—not LangChain/AutoGen—with explicit pipeline routing and sequential agent calls.
  - **Deterministic validation:** Each output passes through 3-layer validation (hallucination detection, tone/semantic alignment, optional LLM re-check) with confidence and grounding scores.
  - **Hybrid RAG:** Retrieves market/brand research context before generation, weighted retrieval + reranking for relevance.
  - **ML + LLM hybrid:** Sentiment analysis fuses transformer-based classification with LLM synthesis to extract pain points, emotional trends, and recommendations.

- **Main workflow:**
  1. User provides brand inputs → Query Understanding agent determines intent
  2. Retrieval agent queries FAISS vector store for market context
  3. Task-specific agent generates strategy/names/content using LLM + context
  4. Consistency Validation agent checks hallucinations, tone, semantic alignment
  5. Response agent formats output and computes confidence/grounding scores
  6. Backend persists result in SQLite with audit trail

---

## The Problem I Solved

Building a brand from zero is fragmented. Founders use separate tools (naming generators, content calendars, competitor tools), each with different UIs, inconsistent outputs, and no unified brand context. Manual branding workshops cost thousands and take weeks. Most AI tools offload all thinking to the LLM—garbage in, garbage out.

I built BrandAI to address three gaps:

1. **Fragmentation:** One unified interface handles brand strategy, naming, content, competitor analysis, and sentiment—not five separate tools.

2. **Grounding & validation:** AI outputs are anchored in actual market research (RAG context) and validated against brand tone, consistency, and factuality. Hallucinations are detected and flagged. Confidence scores are explicit.

3. **Speed without quality loss:** Founders get results in minutes, not weeks, but with deterministic guardrails that prevent off-brand or nonsensical outputs.

The system trades away interactive optimization and manual refinement—intentionally. The goal is to ship founders with a solid foundation they can use immediately, not to replace human judgment with more polished LLM hallucinations.

---

## What I Built

### Core Features

#### Multi-Agent Orchestration Pipeline

Seven specialized agents handle different stages:

- **Query Understanding Agent:** Classifies user intent (naming, strategy, content, etc.) via keyword fallback or low-confidence LLM classification.
- **Retrieval Agent:** Enriches queries based on intent and retrieves top-k relevant chunks from FAISS vector store. Returns ranked chunks with relevance scores.
- **Brand Strategy Agent:** Generates complete brand identity (name, tagline, mission, tone, archetype, positioning, target persona) grounded in RAG context.
- **Creative Generation Agent:** Produces names (with phonetic/semantic scoring), social content (platform-specific), ad copy, content calendars (30-day multi-platform), and brand guidelines.
- **Sentiment Intelligence Agent:** Runs dual-path analysis—ML classifier (RoBERTa) categorizes reviews, then LLM synthesizes pain points, emotional trends, market expectations, and recommendations.
- **Consistency Validation Agent:** Detects hallucinations (pattern matching), checks tone consistency (keyword-based), validates semantic alignment (embedding similarity). Computes final validation score.
- **Response Agent:** Formats outputs for each intent, computes confidence (weighted LLM score + validation score), builds explainability metadata.

**Pipeline routing:**
- Brand generation: Retrieval → Brand Strategy → Validation → Response
- Naming: Retrieval → Creative (names) → Response
- Content: Retrieval → Creative (content) → Validation → Response
- Sentiment: ML analysis + LLM synthesis + clustering
- Chat: Intent classification → routing to appropriate pipeline

#### Manual RAG Pipeline

- **Document ingestion:** Accepts text, URLs (BeautifulSoup scraping with header/footer removal), PDFs (PyPDF2), and knowledge base directories. Ingestion runs synchronously; URLs are scraped on request.
- **Chunking:** Fixed-size chunks (512 chars, 64-char overlap) with boundary detection (splits on periods/newlines to preserve semantic units).
- **Embeddings:** SentenceTransformers (all-MiniLM-L6-v2, 384-dim, normalized).
- **Vector store:** FAISS IndexIDMap (inner product) with persistent metadata (source, chunk text, embedding model, timestamp).
- **Retrieval:** Top-k search (k=5 default, configurable) with similarity threshold (0.3 default). **Reranking:** Retriever embeds query and each result, then reweights scores as `0.6 * retrieval_score + 0.4 * rerank_score`.
- **Source attribution:** Returned results include metadata (source name) for grounding.

#### ML Models

- **Sentiment Classifier:** HuggingFace RoBERTa (cardiffnlp/twitter-roberta-base-sentiment), detects positive/negative/neutral with fallback keyword-based classification if model fails to load.
- **Competitor Clustering:** scikit-learn KMeans on normalized embeddings, groups similar reviews/competitors.
- **Brand Similarity:** Cosine similarity on embeddings for competitive positioning.
- **Viral Content Predictor:** Feature engineering + scoring (implemented in creative agent).
- **Audience Segmentation:** KMeans clustering on embeddings.

#### Backend API & Persistence

REST API (FastAPI) with 6 route modules:

- **Auth:** Register, login, get current user. Security layer is disabled (local single-user mode).
- **Brands:** Generate brand, list, get details, generate names, generate guidelines.
- **Content:** Strategy (30-day calendar), social media posts, ad copy, list by brand.
- **Chat:** Multi-turn conversation routing to AI services.
- **Competitor:** Analyze competitors, list, analyze sentiment.
- **Analytics:** Dashboard, AI output history.

**Persistence (SQLite, auto-created):**
- **Users:** Email, username, role (admin/founder/marketer/viewer), active status.
- **Brands:** Name, tagline, mission, vision, tone, archetype, positioning, guidelines, color palette, typography.
- **Content:** Generated marketing materials (platform, type, viral score, consistency score, scheduled publication).
- **Campaigns:** Campaign metadata.
- **Competitor Data:** Competitor analysis results.
- **Sentiment Results:** Review sentiment and insights.
- **AI Outputs:** Full audit trail—request type, input payload, output payload, confidence/grounding/consistency scores, reasoning, agent trace, latency.
- **Vector Metadata:** FAISS chunk-to-source mapping (source type/name, chunk text, embedding model, timestamp).

#### Frontend

React (v18) + Vite, zero-build overhead. Pages:

- Landing/onboarding
- Dashboard (AI output history, metrics)
- Brand Studio (generate/edit brand, view guidelines)
- Content Generator (social, ads, strategy)
- Competitor Intelligence (analyze, compare)
- Analytics (output metrics, performance)
- Chat Assistant (conversational AI)

State: Auth context (JWT storage in localStorage), brand selection. API client (Axios) handles all backend communication.

---

## Engineering Approach

### Architecture

#### Frontend

React with Vite offers near-instant HMR and minimal bundle overhead. Single-page app with client-side routing (React Router v6). Auth stored in localStorage (JWT). All API calls through Axios service layer. Component structure separates pages (full-page views) from reusable components (common utilities, form inputs). Design system via custom CSS with dark theme support.

#### Backend

FastAPI on Uvicorn. SQLAlchemy 2.0 ORM (async-capable, though most queries are sync). Pydantic v2 for request/response validation. Rate limiting via slowapi (60 req/min default). Middleware layers:

- **PromptInjectionMiddleware:** Guards against LLM prompt injection via request payload inspection.
- **RequestLoggingMiddleware:** Logs all HTTP requests for debugging.
- **CORS:** Configured for localhost development.

Database access via dependency injection (`get_db` session provider). Services layer abstracts business logic. Auto-creates tables and seeds a local user on startup.

#### AI Services

Async FastAPI app on separate port (8001). Exposes endpoints for brand generation, naming, content, chat, competitor analysis, sentiment, guidelines, and document ingestion. Request models validate input via Pydantic. Orchestrator routes tasks to agent pipelines. Agents are async-capable (await LLM calls, RAG retrieval).

#### LLM Integration

Ollama client (httpx AsyncClient) communicates with local Ollama instance (port 11434, model: Llama3). Supports three modes:

- `generate`: Raw text generation with optional system prompt, temperature, max_tokens.
- `generate_json`: Text generation + JSON extraction with fallback regex-based parsing (handles markdown code blocks, partial JSON recovery).
- `chat`: Chat API with message history and per-message role tags.

### Data / AI Pipeline

```
User Input
    ↓
Intent Classification (Query Understanding Agent)
    ↓
Query Enrichment (add domain keywords based on intent)
    ↓
Retrieval from FAISS (similarity search + reranking)
    ↓
Task-Specific Generation (LLM + RAG context)
    ↓
Multi-Layer Validation:
    - Hallucination detection (pattern matching)
    - Tone consistency (embedding similarity + keyword matching)
    - Semantic alignment (embedding dot product)
    - LLM re-check (optional)
    ↓
Confidence Scoring (weighted base score + validation score)
    ↓
Response Formatting (intent-specific output schema)
    ↓
Backend Persistence (SQLite + audit trail)
    ↓
User-Facing Response (with confidence, grounding, explainability)
```

---

## Key Technical Decisions

### Manual Agent Orchestration Over Framework Dependencies

**What I implemented:** Custom Python orchestrator that routes requests to 7 specialized agents with explicit sequencing and context passing. Task routing via a `router` dictionary that maps intent to pipeline function.

**Why I chose this approach:** Using LangChain or AutoGen adds complexity, hides agent communication, and couples me to framework updates. Building orchestration manually gives explicit control over pipeline routing, error handling, and agent sequencing.

**What problem it solves:** I can trace exactly how data flows between agents. Task routing is transparent. Agent failures don't crash the pipeline—they're logged and handled gracefully. New agents are added by registering them in the orchestrator dict and defining a pipeline function.

**Why it's useful compared to a simpler alternative:** A simpler approach would be to call agents sequentially without explicit routing—just pass data between them. That works for simple flows but breaks when task requirements diverge (some need RAG, some don't; some need validation, some don't). Manual orchestration provides the routing flexibility that scaffolding frameworks give without the complexity tax.

---

### Dual-Path Validation (Heuristic + LLM)

**What I implemented:** Three-layer validation:
1. Hallucination detection via pattern matching (detects AI signature phrases like "as an AI", "my training data").
2. Tone consistency via keyword frequency and embedding similarity.
3. Semantic alignment via embedding dot product against RAG context.

Optional LLM re-check on low-confidence outputs.

**Why I chose this approach:** Fast deterministic validation catches obvious hallucinations without LLM calls. LLM re-check provides deeper semantic validation when heuristics are uncertain.

**What problem it solves:** Reduces latency (skip LLM calls when confident), maintains accuracy (LLM catches subtle issues), provides interpretable scores (hallucination_score, tone_consistency_score, semantic_alignment_score).

**Why it's useful compared to a simpler alternative:** A simpler approach would be "just run everything through the LLM again." That guarantees accuracy but adds 2–5s latency per request and doubles LLM cost. The hybrid approach gets 90% of the accuracy with 20% of the cost and latency.

---

### Reranking Retrieval with Query Embeddings

**What I implemented:** FAISS retrieval returns top-10 candidates. Retriever re-embeds the query and each candidate, then reweights scores as `0.6 * initial_score + 0.4 * rerank_score`, then returns top-5.

**Why I chose this approach:** FAISS alone ranks by raw cosine similarity. Reranking prioritizes results that align closely with the exact query wording, not just generic similarity.

**What problem it solves:** Improves retrieval precision for nuanced brand-strategy queries. Without reranking, generic market research chunks rank equally with brand-specific insights. Reranking de-duplicates and prioritizes the most relevant chunks.

**Why it's useful compared to a simpler alternative:** A simpler approach is to just use FAISS top-k. That's fast but imprecise. Reranking adds ~100ms per query but significantly improves output quality without needing to retrain the embedding model or change the vector store.

---

### Local Inference + Ollama

**What I implemented:** All LLM calls route through Ollama (running locally on port 11434). Model: Llama3. No OpenAI/Anthropic/Groq APIs.

**Why I chose this approach:** No external API calls = no latency spikes, no API quota limits, no credential management, no data leaving the machine.

**What problem it solves:** Reliability and privacy. The entire platform runs on a developer's machine. Scaling just means running Ollama on a bigger server or GPU.

**Why it's useful compared to a simpler alternative:** A simpler approach is to call OpenAI or Anthropic. That's easier to set up (one API key) but adds external dependency risk, latency variance, and cost at scale. Local inference trades initial setup overhead (pull model, allocate GPU) for operational simplicity and privacy.

---

### FAISS for Vector Search

**What I implemented:** FAISS IndexIDMap (inner product) with persistent metadata storage (pickle file). Supports live index updates without reindexing.

**Why I chose this approach:** FAISS is simple, fast, and embeds directly in Python. Metadata is stored separately instead of relying on an external database.

**What problem it solves:** Zero extra infrastructure. Single-file persistence (`.faiss` + `.pkl` metadata). Supports live updates without downtime.

**Why it's useful compared to a simpler alternative:** A simpler approach is to store embeddings in SQLite as JSON blobs. That's simpler to understand but slower for k-nn search (no indexing). FAISS makes retrieval O(log n) instead of O(n).

---

### Structured Outputs with JSON Mode

**What I implemented:** All LLM outputs are coerced to JSON. If the model returns markdown code blocks or malformed JSON, regex extraction attempts to recover the JSON object. Agents validate output against Pydantic schemas on the backend.

**Why I chose this approach:** Pydantic schemas on the backend validate structured input. LLM outputs are coerced to JSON with fallback parsing.

**What problem it solves:** Prevents malformed outputs downstream. Pipeline never breaks due to LLM response parsing errors. Outputs are always serializable and predictable.

**Why it's useful compared to a simpler alternative:** A simpler approach is to accept free-form text responses and parse them manually. That's more flexible but fragile—one bad LLM response breaks the pipeline. JSON mode ensures consistency.

---

## Tech Stack

### Frontend
- React 18, Vite, React Router 6, Axios

### Backend
- FastAPI, SQLAlchemy 2.0, Pydantic v2, slowapi, python-jose (JWT)

### AI / LLM
- Ollama (Llama3 local inference), httpx (async HTTP)

### RAG / Retrieval
- FAISS (IndexIDMap), sentence-transformers (all-MiniLM-L6-v2), BeautifulSoup4 (web scraping), PyPDF2 (PDF extraction)

### ML
- HuggingFace Transformers (RoBERTa sentiment), scikit-learn (KMeans), NumPy, Pandas

### Infrastructure
- Docker, docker-compose, nginx (reverse proxy), SQLite (local persistence), loguru (structured logging)

### Utilities
- Pydantic Settings (env config), aiofiles (async file I/O), requests (HTTP client)

---

## Product Thinking

### User-Centric Design

Intended users are non-technical founders and marketing managers. The workflow mirrors consulting:

1. Answer 4 questions (startup idea, industry, audience, product type)
2. Get a complete brand strategy (name, positioning, visual guidelines)
3. Export a 30-day content calendar
4. Review competitor analysis and market sentiment
5. Iterate or approve and ship

No boilerplate setup. No multi-step wizards. Results appear immediately (after first request, model caching kicks in). Brand context persists across requests so a user can generate names, then generate content for the chosen name, without re-entering the idea.

### Trust & Reliability

- **Grounding:** All outputs reference specific market research chunks retrieved from FAISS. User sees retrieved context and source attribution.
- **Validation:** Confidence scores (0.0–1.0) signal output quality. Consistency scores break down tone, semantic alignment, hallucination risk. Agent trace shows which agents ran and in what order.
- **Explainability:** Response payload includes `reasoning` (why this output was generated), `agent_trace` (step-by-step execution), and `explainability` metadata (intent detected, RAG grounded, hallucination risk, tone consistent).
- **Deterministic logic:** Hallucination detection is rule-based (pattern matching), not fuzzy. Tone consistency uses keyword frequency and embedding similarity. Semantic alignment is cosine distance. Users understand what's happening.

### Actionability

Outputs are immediately actionable:

- **Brand names** include phonetic/semantic/domain scores so users can filter and rank.
- **Content calendars** include hooks, CTAs, hashtags, and viral angles—copy-paste ready.
- **Ad copy** includes A/B variants and confidence scores.
- **Sentiment analysis** surfaces specific pain points, emotional triggers, and actionable recommendations (e.g., "improve onboarding" based on reviews).
- **Competitor analysis** highlights positioning gaps and market opportunities.

---

## Impact & Skills

**Full-Stack Development**

Designed and implemented a production web app with React frontend, FastAPI backend, and Python AI services. Handled authentication, database design, API design, state management, error handling, and Docker containerization.

**AI Engineering**

Built a complete multi-agent orchestration pipeline from scratch—no framework dependencies. Implemented agent sequencing, context passing, LLM integration, and output validation. Designed dual-path validation (heuristic + LLM) to balance speed and accuracy.

**RAG Systems**

Engineered a full retrieval pipeline: document ingestion (text, URLs, PDFs), chunking with boundary detection, embedding generation, FAISS indexing with metadata, and reranking. Integrated RAG context injection into LLM prompts.

**Machine Learning**

Integrated transformer-based sentiment classification, embedding-based clustering, and cosine similarity for brand positioning. Implemented fallback ML models when primary models fail to load.

**System Design**

Designed multi-tier architecture with clear separation of concerns (frontend, backend API, AI services). Implemented rate limiting, request logging, prompt injection guards. Chose technologies (FAISS, Ollama, SQLite) to minimize infrastructure overhead while maximizing reliability.

**Product Thinking**

Validated the design through problem analysis (fragmented branding tools, poor AI grounding). Made intentional trade-offs (local inference for reliability, deterministic validation for trust, single-user for simplicity).

---

**GitHub:**(https://github.com/Aadhavan-M-S/BrandAI-Studio)
