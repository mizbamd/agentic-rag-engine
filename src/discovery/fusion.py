"""Reciprocal Rank Fusion (RRF) for combining lexical and dense rankings.

RRF is robust because it fuses on *rank position*, not raw scores, so the BM25 and cosine score
scales never need to be calibrated against each other.
"""
from __future__ import annotations


def reciprocal_rank_fusion(
    ranked_lists: list[list[str]], k: int = 60
) -> list[tuple[str, float]]:
    scores: dict[str, float] = {}
    for ranked in ranked_lists:
        for rank, doc_id in enumerate(ranked):
            scores[doc_id] = scores.get(doc_id, 0.0) + 1.0 / (k + rank + 1)
    fused = sorted(scores.items(), key=lambda pair: pair[1], reverse=True)
    return fused
