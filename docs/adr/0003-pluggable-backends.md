# ADR-0003: Pluggable backends behind narrow interfaces

- Status: Accepted
- Date: 2026-06-22

## Context
The interesting engineering (fusion, reranking, orchestration, guardrails) is independent of which
embedding model, vector DB, reranker, or LLM is used. Coupling to a vendor would make the code hard
to test and migrate.

## Decision
Define small protocols -- `Embedder`, `VectorStore`, `Reranker`, `Generator` -- with dependency-free
default implementations for tests/local, and production adapters (sentence-transformers/OpenAI,
pgvector/Qdrant, cross-encoder, LLM) injected at the edges.

## Consequences
- Positive: the core is unit-testable offline and deterministic; vendors are swappable; no lock-in.
- Negative: a thin abstraction layer to maintain; defaults are intentionally simple, not SOTA.
