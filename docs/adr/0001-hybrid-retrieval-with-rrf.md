# ADR-0001: Hybrid retrieval (dense + sparse) fused with RRF

- Status: Accepted
- Date: 2026-06-22

## Context
Pure vector search misses exact-match tokens (codes, IDs, SKUs); pure keyword search misses
paraphrase and semantics. Enterprise queries need both.

## Decision
Run dense (vector) and sparse (BM25) retrieval in parallel and fuse with Reciprocal Rank Fusion.
RRF fuses on rank position, so the two incomparable score scales never need calibration. A reranking
stage then maximizes precision on the fused candidate set.

## Consequences
- Positive: robust recall and precision; no score normalization headaches; each retriever swappable.
- Negative: two retrieval paths to operate and index; slightly higher query cost (mitigated by
  bounding candidate_k).
