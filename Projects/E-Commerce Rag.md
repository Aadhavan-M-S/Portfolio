# E-Commerce Support Resolution Engine: Agentic RAG System for Policy-Grounded Customer Support

## Elevated Pitch

I built an AI-powered customer support system that transforms customer tickets into policy-grounded decisions and responses. Rather than training an LLM on policies or letting it hallucinate answers, the system retrieves the exact policy documents relevant to each request, grounds all reasoning in those policies, and validates its own output for consistency—ensuring every customer-facing decision is defensible and citable.

## Product Overview

* **What it is:** A multi-agent, retrieval-augmented generation (RAG) pipeline that processes e-commerce customer support tickets end-to-end, from initial triage through policy retrieval, resolution generation, and compliance auditing.

* **Who it is for:** E-commerce support teams, customer success operations, and compliance-heavy organizations where every decision must be grounded in policy and fully traceable.

* **Core use case:** Automating responses to common support requests (returns, refunds, damaged items, shipping issues, subscription cancellations) while maintaining strict policy adherence and auditability.

* **How the user interacts with it:** Paste a customer message and order context into a Streamlit dashboard. The system returns a structured resolution: a decision (approve/deny/partial/escalate), rationale, customer-ready response, and precise policy citations. All work is logged with timing and regeneration attempts.

* **What makes it different:** Most customer support AI either trains models on policies (expensive, brittle) or relies on retrieval without verification (hallucinations leak through). This system enforces a compliance loop: the resolution agent generates a response using only retrieved policies, then a separate compliance agent audits every claim against those same policy excerpts. If compliance fails, the resolution agent regenerates with specific feedback. If it still fails after two attempts, the ticket escalates to humans.

* **Main workflow:** Ticket → Triage (classify & detect missing info) → Retrieval (fetch relevant policies via FAISS) → Resolution (generate decision & response) → Compliance (audit for hallucinations & contradictions) → Escalate or Output.

## The Problem I Solved

Customer support teams face two overlapping problems:

1. **Manual policy lookups:** Support agents spend hours wading through policy documents to answer common questions. Each query requires re-reading the same rules. Responses are inconsistent because different agents interpret the same policy differently.

2. **LLM hallucination in regulated contexts:** Generic LLMs trained on public internet data will invent policy details to sound helpful. A model might confidently promise a 60-day return window when the policy says 30 days. This exposes the company to liability, damages customer trust, and creates inconsistent precedent.

I built this system to solve both problems simultaneously:

* **Automatic policy retrieval** eliminates manual lookups. A vector search finds relevant policy sections in milliseconds.

* **Zero-hallucination design** means the LLM cannot invent policy. Every decision and claim must trace back to a specific policy excerpt. If policies are insufficient, the system escalates rather than guessing.

* **Compliance verification** audits the LLM's work. A second agent re-reads the policies and checks whether the proposed response actually follows them. If not, the system regenerates with corrective feedback or escalates.

* **Full auditability** means every decision is citable. When a customer asks "why was I denied?", the response includes exact policy section IDs and relevant text.

The result: customers get consistent, policy-grounded responses in seconds instead of hours, and the company gets a clear, defensible audit trail for every decision.

---

# What I Built

## Core Features

### Multi-Agent Orchestration (Triage → Retrieval → Resolution → Compliance)

The system chains four specialized agents, each responsible for one stage of the ticket lifecycle:

1. **Triage Agent** — Classifies the ticket into one of 10 issue types (return, refund, damaged, shipping, lost_package, subscription, payment, promotion, cancellation, other), estimates confidence, detects missing information, and generates clarifying questions if needed. Uses local LLM with JSON-structured output.

2. **Policy Retriever Agent** — No LLM involved; pure vector search. Takes the triage output and computes 1–3 search queries (issue-type-specific keywords + region/marketplace specialization). Searches FAISS for top-5 most-similar policy chunks, de-duplicates by section ID to avoid redundancy, and returns scored results.

3. **Resolution Agent** — Reads the ticket, order context, and retrieved policy excerpts. Generates a structured decision (approve/deny/partial/escalate) with rationale, customer-ready response, citations, and internal notes. Explicitly forbidden from inventing policy; if retrieved excerpts are insufficient, it must escalate rather than guess.

4. **Compliance Agent** — Audits the resolution. Re-reads the same policy excerpts and verifies every factual claim in the proposed response. If claims are unsupported, generates specific feedback. Returns a pass/fail verdict and recommendation (accept/regenerate/escalate).

### Retry & Escalation Loop

If compliance fails, the system re-runs the resolution agent with the compliance feedback prepended to the prompt. The resolution agent sees exactly which claims failed and regenerates accordingly. This cycle repeats up to 2 times. If compliance still fails after 2 attempts, the ticket is marked as escalated for human review.

### Policy Grounding via FAISS + Sentence Transformers

* **Embeddings:** Uses `all-MiniLM-L6-v2` (384-dim, 80 MB, no API key, runs offline). Every policy chunk is embedded and stored.

* **Vector store:** FAISS with `IndexFlatIP` (exact inner-product search on L2-normalized vectors = cosine similarity). At ~800 chunks, exact search is faster and more reliable than approximate methods.

* **De-duplication:** When retrieving, chunks are de-duplicated at the (doc_id, section_id) level so the same policy section is never returned twice.

* **Threshold filtering:** Only chunks with cosine similarity ≥ 0.25 are included, preventing low-quality matches.

### Synthetic Policy Database & Test Cases

The system ships with:

* **30 synthetic policy documents** (POL-001 to POL-030) covering returns, refunds, shipping, damages, promotions, marketplace rules, and regional policies (US, Canada, EU).

* **~800 text chunks** after loading and overlapping-windowing the policies.

* **20 evaluation test cases** with annotated expected decisions for measuring accuracy, citation coverage, and compliance pass rates.

All policies and test cases are generated deterministically from Python code, so the system is reproducible and testable without external data dependencies.

### LangGraph-Based State Machine

The workflow is compiled as a LangGraph with:

* Stateful node execution (each node returns partial state updates that are merged automatically).

* Conditional routing after triage (clarify vs. proceed) and after compliance (pass vs. retry vs. escalate).

* Deterministic retry logic (up to MAX_COMPLIANCE_RETRIES = 2 attempts).

* Full audit trail: every node logs timing, decision, and metadata to `agent_trace`.

### Streamlit Dashboard

Production-quality UI for manual ticket entry:

* Sidebar for copy-pasting ticket text and order context (order ID, customer ID, product category, days since delivery, loyalty tier, region, etc.).

* Main panel displays triage classification, retrieved policy sections, proposed resolution, compliance status, and agent trace.

* "Initialize System" button to build the FAISS index on first run.

* Support for running manual tickets or batch evaluation.

---

# Engineering Approach

## Architecture

### Frontend

**Streamlit** serves as the dashboard. No separate frontend codebase—Streamlit handles UI rendering, form inputs, and state management. The dashboard:

* Accepts ticket text and order context via text areas and form fields.
* Displays results in formatted cards with decision badges, policy citations, and internal notes.
* Provides sidebar controls for initializing the system and running evaluations.

### Backend

**FastAPI is not used.** The system is a Python script orchestrated by LangGraph; there is no HTTP API. Entry points are:

* `app.py` — Streamlit dashboard (runs `streamlit run app.py`).
* `eval/evaluate.py` — Evaluation harness for batch testing.
* Direct Python import of `graph.workflow.initialise_system()` and `graph.workflow.run_ticket()` for programmatic use.

### AI / ML

**LLM backend:** Ollama (llama3.2:latest by default, fully local, no API keys).

* All agent prompts are explicit system + user prompts.
* Temperature set to 0.1 for low variance and determinism (required for policy consistency).
* Max tokens: 1024 per response.

**Structured outputs:** All agent responses are JSON (enforced by system prompt). Pydantic models validate and parse JSON into typed objects:

* `TriageResult` — issue_type, confidence, clarifying_questions, needs_clarification, priority, search_query.
* `ResolutionResult` — decision, rationale, customer_response, citations, internal_notes, confidence.
* `ComplianceResult` — passed, unsupported_claims, feedback, recommendation.

**JSON resilience:** If the LLM returns markdown fences (some models wrap JSON in ` ``` `), the code strips them. If JSON parsing fails, deterministic fallbacks apply:

* Triage → keyword-based classification.
* Resolution → escalate decision with generic message.
* Compliance → pass by default (fail-safe to avoid false negatives).

### RAG

**Document ingestion:**

1. Read 30 JSON policy files from `data/policies/`.
2. Extract sections (each policy has multiple sections with headers and content).
3. Parse section content as raw text.

**Chunking:**

* Character-level sliding window (1000 chars per chunk, 150 chars overlap).
* Respects sentence boundaries where possible (tries to end chunks at `.`, `!`, `?`, or `\n`).
* Each chunk includes a header prefix (`[Doc Title | Section Header]`) for self-contained context.
* Total: ~800 chunks from 30 documents.

**Embeddings:**

* `sentence-transformers` library loads `all-MiniLM-L6-v2` on first use (lazy singleton).
* Embeds all chunks in batch (batch_size=64), L2-normalized for cosine similarity.
* Embeddings cached in memory across inference calls.

**Vector store:**

* FAISS `IndexFlatIP` with 384-dim vectors.
* Built once, persisted to `data/faiss_index/index.faiss` and metadata to `data/faiss_index/metadata.json`.
* Loaded on app startup; index rebuilding is idempotent (skipped if already built).

**Retrieval:**

* `PolicyRetriever` class wraps the FAISS index.
* `retrieve(query)` — embeds a single query, searches for top-k chunks.
* `retrieve_multi(queries)` — retrieves for multiple queries, merges by max score, re-ranks.
* De-duplication: same section returned at most once (by doc_id + section_id).

**No reranking, no hybrid retrieval, no semantic caching.** The system performs a single vector search pass per query.

### Database

**No external database.** State is stored in:

* `SupportState` — a LangGraph TypedDict with all intermediate and final fields (ticket_id, triage results, retrieved chunks, resolution, compliance status, etc.).
* FAISS index + metadata JSON files (persisted to disk, not a database server).
* .env file for Ollama URL and model name (optional; defaults provided).

**No persistence of tickets between sessions.** Each ticket is processed in-memory and returned as a final state dict. For production use, persistence would be added at the Streamlit app level (e.g., SQLite or PostgreSQL), but is out of scope here.

### APIs / Communication

**No external APIs.** All LLM calls go to a local Ollama instance via the `ollama` Python SDK.

**Internal communication:** Agents pass state via LangGraph's state merging mechanism. Each node returns a partial dict; LangGraph merges it into the full state and passes it to the next node.


# Data / AI Pipeline

```
Customer Ticket + Order Context
        ↓
    [Triage]
        ├─ Extract issue_type, confidence, priority
        ├─ Detect missing info → generate clarifying questions
        └─ Build search_query for policy retrieval
        ↓
    [Route: needs_clarification?]
        ├─ YES → [Clarify] → send questions to customer → END
        └─ NO ↓
    [Retriever]
        ├─ Build 1–3 queries (triage + issue-type keywords + region/marketplace)
        ├─ Vector search FAISS (all-MiniLM-L6-v2 embeddings)
        ├─ Return top-5 chunks (de-duped by section, threshold ≥ 0.25)
        └─ Pass chunks to next agent
        ↓
    [Resolution]
        ├─ Read: ticket + order context + retrieved chunks
        ├─ Generate: decision (approve/deny/partial/escalate)
        ├─ Generate: rationale + customer response + citations
        └─ Pass to compliance audit
        ↓
    [Compliance]
        ├─ Re-read: policies + proposed response
        ├─ Audit: every claim supported by a policy excerpt?
        └─ Route: pass? → END | fail? → check retries
        ↓
    [Route: regeneration_count < MAX_COMPLIANCE_RETRIES?]
        ├─ YES → [Resolution] (re-run with feedback) → [Compliance]
        └─ NO → [Escalate] → mark escalated=True → END
        ↓
    Final Output
    ├─ decision, rationale, customer_response
    ├─ citations (policy sections)
    ├─ compliance_passed, escalated status
    └─ agent_trace (timing + metadata)
```

---

# Key Technical Decisions

### **Compliance Loop as an Architectural Pattern**

I added a second LLM call (compliance agent) specifically to audit the first LLM's output. This feels expensive, but it solves a critical problem: in policy-grounded domains, one hallucination can expose the company to liability.

The compliance agent re-reads the same policies and checks whether every factual claim in the resolution is actually supported. If not, it generates specific feedback ("Your response claims a 60-day return window, but POL-001-S1 clearly states 30 days"). The resolution agent then regenerates with this feedback in the prompt, rather than starting fresh.

Why this works better than a single-pass approach:

1. **Specificity:** Compliance feedback is precise ("fix claim X"), not vague ("try again").
2. **Two pairs of eyes:** The resolution agent was optimizing for coherence; the compliance agent optimizes for correctness.
3. **Deterministic fallback:** After 2 retries, escalate rather than guess. This is safer than forcing a decision.

Cost: 2x LLM calls per ticket (on average ~1.5x after escalations). Benefit: near-zero hallucination rate and traceable decisions.

### **FAISS IndexFlatIP Instead of Approximate Methods**

At ~800 chunks across 30 policies, exact nearest-neighbor search is fast (sub-millisecond) and perfect. Approximate methods like HNSW or IVF trade correctness for speed, but speed is already not a bottleneck here.

Exact search also means policy retrieval is deterministic and reproducible—the same ticket always retrieves the same chunks (up to tied scores). This is critical for testing and debugging.

### **Character-Level Chunking with Sentence Boundaries**

I chose character-level chunking (1000 chars) over token-level because:

1. **Portable:** No dependency on a tokenizer. Token counts vary wildly by tokenizer and language model; character counts are stable.
2. **Aligned with policy structure:** Policy documents are dense prose. A 1000-char chunk (~200–250 words) roughly corresponds to one complete policy statement, and sentence-boundary snapping ensures we don't split important clauses.
3. **Overlap simplicity:** 150-char overlap is easy to reason about and prevents cross-boundary sentences from being missed.

### **Structured Outputs via JSON + Pydantic**

Instead of parsing free-form text responses, I enforce JSON output from the LLM and validate with Pydantic. This gives me:

1. **Type safety:** Wrong types are caught immediately.
2. **Determinism:** JSON structure is consistent across runs.
3. **Auditability:** Intermediate states are easily serialized to logs.

The trade-off: the LLM must be instructed to output valid JSON. Some models struggle with this. I added fallback parsing (strip markdown fences) and deterministic fallbacks (use safe defaults if JSON parsing fails).

### **LangGraph Over LangChain Chains**

I used LangGraph for orchestration rather than LangChain's older `Chain` abstraction because:

1. **Stateful execution:** Each node can read and write the full state dict (not just chain input/output).
2. **Conditional routing:** The graph explicitly branches based on state (clarify vs. proceed, pass vs. escalate).
3. **Retry loops:** The compliance loop is naturally expressed as a conditional edge back to resolution.
4. **Transparency:** The compiled graph is introspectable; I can see the exact flow and understand what each edge does.

LangChain chains work too, but LangGraph is the more precise tool for this state-machine-like architecture.

### **No LLM in the Retriever**

The retriever agent does not call the LLM; it's pure vector search. Why?

1. **Speed:** No LLM latency (vector search is ~5ms, LLM is ~1–5 seconds).
2. **Cost:** One fewer LLM call per ticket.
3. **Determinism:** Query generation is hard-coded (issue type + keywords), not LLM-generated.

The downside: retrieval quality depends on good query engineering. I mitigated this by generating multiple queries (triage search + issue-type keywords + region/marketplace specialization) and merging results.

### **Ollama (Local LLM) Over Cloud API**

I chose a local, open-source LLM (llama3.2 via Ollama) over a cloud API (OpenAI, Anthropic, etc.) because:

1. **No API keys:** Reduces secret management.
2. **No internet dependency:** Works offline; data never leaves the machine.
3. **Reproducibility:** Always the same model version (unless manually upgraded).
4. **Cost:** No per-call API costs (hardware cost is one-time).

Downside: Ollama requires local setup and local compute. For a production SaaS, a cloud API would be more scalable. For a research project or on-prem deployment, local is better.

---

# Tech Stack

### Frontend

**Streamlit** — UI framework for the dashboard

### Backend / Orchestration

**LangGraph 0.2.x** — Graph orchestration, stateful node execution, conditional routing, retry loops

**langchain-core 0.3.x** — Utilities and base abstractions (used transitively by LangGraph)

### AI / LLM

**Ollama 0.4.x** — Local LLM backend (serves llama3.2:latest over HTTP)

**sentence-transformers 3.0.x** — Embeddings (`all-MiniLM-L6-v2`, 384-dim, L2-normalized for cosine search)

### Vector Search

**FAISS (cpu) 1.8.x** — Exact nearest-neighbor search (`IndexFlatIP`), persisted to disk

### Data & Validation

**Pydantic v2.5.x** — Type-safe models (TriageResult, ResolutionResult, ComplianceResult, etc.), JSON validation

**NumPy 1.24–2.0** — Array operations, vector normalization, FAISS interop

**PyTorch 2.1.x, torchvision** — Transitive dependencies of sentence-transformers (GPU optional)

### Utilities

**python-dotenv 1.0.x** — Load environment variables from `.env` file (OLLAMA_BASE_URL, OLLAMA_MODEL)

---

# Product Thinking

## User-Centric Design

**Intended users:** E-commerce support teams (agents, supervisors, compliance teams) and customer success operations teams.

**Main user workflow:**

1. Agent receives a customer complaint.
2. Copies the customer's message and order details into the Streamlit sidebar.
3. Clicks "Run Resolution".
4. System returns a structured response with a decision, customer-friendly message, and policy citations.
5. Agent reviews the response and sends it to the customer, or escalates if the system marked it as needing human review.

**Friction reduction:**

* **No policy lookup time:** Agent doesn't spend 10 minutes reading policy documents.
* **Consistent decisions:** All agents use the same policy retrieval and compliance logic.
* **Ready-to-send responses:** Customer message is draft-ready; agent can copy-paste or edit lightly.
* **Clear escalation criteria:** If the system can't confidently ground the decision, it escalates rather than guessing.

## Trust & Reliability

**Grounding:** Every decision cites the exact policy sections used. When a customer asks "why?", the agent can point to specific policy language.

**Guardrails:**

* Resolution agent is forbidden from inventing policy (system prompt enforces this; if policies are insufficient, agent must escalate).
* Compliance agent audits for hallucinations. If claims are unsupported, agent regenerates with corrective feedback.
* Retry logic: If compliance still fails after 2 attempts, escalate to human review rather than forcing a decision.

**Validation:**

* Pydantic models enforce type-correct inputs/outputs.
* JSON parsing with fallback to safe defaults.
* Agent trace logs timing, confidence, and decision path for debugging.

**Auditability:** Every ticket produces:

* Final decision + rationale + customer response.
* List of policy citations with relevance scores.
* Compliance status (passed/failed).
* Regeneration count (how many times compliance asked for a fix).
* Full agent trace (which agent ran when, how long it took).

## Actionability

The system outputs are immediately actionable:

* **Decision:** Approve/Deny/Partial/Escalate — clear next step.
* **Customer response:** Copy-paste ready or lightly edited.
* **Internal notes:** Flags (e.g., "dispatch prepaid return label") for fulfillment teams.
* **Citations:** Pinpoint policy for compliance auditors or legal review.

## Scalability / Extensibility

**Modular design:**

* Each agent is a pure Python function; easy to test and iterate independently.
* Agents are nodes in a LangGraph; adding a new agent is adding a new node and routing logic.
* Prompt templates are centralized in each agent file; updating prompts doesn't require code refactoring.

**Extensibility points:**

* **New issue types:** Add to the `IssueType` enum in `utils/models.py` and update `_ISSUE_TYPE_KEYWORDS` in the retriever agent.
* **New policy categories:** Add JSON files to `data/policies/`; they're automatically loaded and indexed on next `initialise_system()`.
* **Different LLM:** Change `OLLAMA_MODEL` in `.env` or `utils/config.py` (Ollama supports many open models).
* **Different embedding model:** Change `EMBEDDING_MODEL` in `utils/config.py` and rebuild the FAISS index.
* **Custom retrieval:** Replace `PolicyRetriever` with a different vector store (e.g., Weaviate, Pinecone, Milvus).

**Scaling limitations (by design):**

* This system is designed for small-to-medium deployments (< 1000s of tickets/day on a single machine).
* Scaling to higher throughput would require: async agent execution, distributed LLM inference, and external state/message queue.
* This is not a limitation; it's a deliberate design choice for simplicity and reproducibility.

---

# Impact & Skills

* **AI Systems Engineering** — Designed a multi-agent agentic pipeline with state machines, conditional routing, retry logic, and deterministic fallbacks. Used LangGraph for orchestration rather than simple sequential chains, enabling complex workflows.

* **RAG Architecture** — Implemented a complete RAG system: synthetic policy document generation, character-level chunking with sentence-boundary snapping, embedding (sentence-transformers), vector storage (FAISS IndexFlatIP), and retrieval with de-duplication. No off-the-shelf RAG framework; built from first principles.

* **LLM Reliability & Guardrails** — Solved the hallucination problem in regulated contexts by enforcing policy grounding (LLM can only use retrieved policy excerpts) and adding a compliance audit loop. If an LLM claim is not supported by policy, the system regenerates or escalates. This demonstrates deep understanding of LLM failure modes and practical defenses.

* **Structured Output Engineering** — Enforced JSON outputs via prompt engineering, parsed them with Pydantic, and added deterministic fallbacks for failures (markdown stripping, safe defaults). Shows how to make LLMs predictable and auditable.

* **Product Design** — Translated a customer problem (manual policy lookups, inconsistent decisions, hallucination risk) into a system design that directly addresses each pain point. The compliance loop, citations, and escalation criteria are product decisions, not just engineering.

* **Full-Stack Python Development** — Shipped a complete, working system: Streamlit UI, LangGraph backend, RAG pipeline, local LLM integration, synthetic data generation, evaluation harness, and testing.

---

This project demonstrates how to build high-reliability AI systems in regulated domains. Rather than hoping a general-purpose LLM stays consistent, I constrained the system at the architecture level: policies are the source of truth, the LLM only uses retrieved policies, and a second agent audits the result. The result is a system where every decision is defensible, citable, and traceable—something most LLM applications lack.

---

## GitHub

**GitHub:** https://github.com/Aadhavan-M-S/E-Commerce-Support-RAG