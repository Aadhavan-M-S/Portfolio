export const projects = [
  {
    id: 'demopilot',
    title: 'DemoPilot',
    subtitle: 'AI Sales Engineer That Runs Product Demos',
    description: 'AI agent that runs asynchronous, interactive product demos grounded in documentation with deterministic lead scoring.',
    problem: 'B2B SaaS founders either take every demo call themselves or lose prospects who land outside business hours. Most AI demos hallucinate features and waste time.',
    solution: 'Built an AI agent that runs asynchronous, interactive product demos grounded in your docs. The system uses a state machine-driven agent, hybrid RAG retrieval, and deterministic lead scoring—no hallucinations, no cloud dependencies.',
    impact: [
      'State machine architecture ensures predictable agent behavior across stages',
      'Hybrid FAISS + BM25 retrieval grounds all answers in actual documentation',
      'Deterministic lead scoring provides reproducible, auditable qualification metrics',
      'Local Ollama inference eliminates API costs and ensures data privacy'
    ],
    tech: ['React', 'FastAPI', 'Python', 'Ollama', 'FAISS', 'sentence-transformers', 'WebSocket', 'Supabase'],
    github: 'https://github.com/Aadhavan-M-S/DemoPilot',
    featured: true,
    year: 2024
  },
  {
    id: 'brandai',
    title: 'BrandAI',
    subtitle: 'Multi-Agent Platform for Brand Intelligence',
    description: 'Production-ready platform with 7 specialized agents, manual orchestration, and dual-path validation for brand strategy.',
    problem: 'Brand development is fragmented across multiple tools with inconsistent outputs. AI tools hallucinate brand strategy instead of grounding decisions in market research.',
    solution: 'Built a production-ready platform with 7 specialized agents, manual orchestration pipeline, and dual-path validation. Every output is grounded in retrieved market research and validated for consistency before delivery.',
    impact: [
      'Manual agent orchestration provides explicit control over pipeline routing',
      'Three-layer validation catches hallucinations before they reach users',
      'Reranking retrieval improves precision for nuanced brand strategy queries',
      'Complete audit trail with confidence and grounding scores for every decision'
    ],
    tech: ['React', 'FastAPI', 'Python', 'Ollama', 'FAISS', 'RAG', 'SQLite', 'Pydantic'],
    github: 'https://github.com/Aadhavan-M-S/BrandAI-Studio',
    featured: true,
    year: 2024
  },
  {
    id: 'ecommerce-rag',
    title: 'E-Commerce Support Resolution',
    subtitle: 'Agentic RAG for Policy-Grounded Customer Support',
    description: 'Multi-agent RAG system with compliance validation loop for policy-grounded customer support decisions.',
    problem: 'Support teams spend hours reading policy documents manually. AI systems hallucinate policy details, creating liability and inconsistent decisions.',
    solution: 'Built a multi-agent RAG system with compliance validation loop. Resolution agent generates responses from retrieved policies, then compliance agent audits for hallucinations. Failed compliance triggers regeneration with specific feedback or escalation.',
    impact: [
      'Compliance loop eliminates hallucinations through iterative validation',
      'Hybrid retrieval balances semantic understanding with exact article citations',
      'Structured outputs with Pydantic ensure consistent, auditable decisions',
      'Every response cites specific policy sections for full traceability'
    ],
    tech: ['Python', 'LangGraph', 'Ollama', 'FAISS', 'sentence-transformers', 'Pydantic', 'Streamlit'],
    github: 'https://github.com/Aadhavan-M-S/E-Commerce-Support-RAG',
    featured: true,
    year: 2024
  },
  {
    id: 'spectra',
    title: 'SPECTRA',
    subtitle: 'Enterprise AI Market Intelligence Platform',
    description: 'Full-stack platform combining classical NLP, deep learning, and local LLM inference for market intelligence.',
    problem: 'Market research requires days of manual scraping and synthesis. Compliance audits involve reading entire documents by hand. Single NER models miss entities in specialized domains.',
    solution: 'Built a platform combining classical NLP with deep learning and local LLM inference. Multi-model NER ensemble, hybrid retrieval, and 8 specialized agents automate consultancy-level intelligence work with zero cloud costs.',
    impact: [
      'Multi-model NER ensemble achieves higher recall than single models',
      'Hybrid FAISS + BM25 retrieval handles both semantic queries and exact matches',
      'Local Ollama deployment ensures data privacy and eliminates API costs',
      'Complete NLP pipeline from ingestion through synthesis and visualization'
    ],
    tech: ['React', 'FastAPI', 'Python', 'Ollama', 'FAISS', 'spaCy', 'FLAIR', 'DeBERTa', 'Playwright'],
    github: 'https://github.com/Aadhavan-M-S/Market-research-AI',
    featured: true,
    year: 2024
  }
];
