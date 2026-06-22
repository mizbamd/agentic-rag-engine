"""discovery-ai: a hybrid retrieval + RAG + agentic search reference implementation.

The core (embeddings, BM25, fusion, reranking, retrieval, RAG) is intentionally pure-Python with
no heavy ML dependencies so it is fully unit-testable and easy to reason about. Production swaps --
real embedding models, pgvector, a cross-encoder reranker, an LLM generator -- are isolated behind
small interfaces so they can be injected without touching the orchestration logic.
"""

__version__ = "1.0.0"
