"""Reranking stage.

Default reranker is a deterministic lexical-overlap scorer (a stand-in for a cross-encoder). The
Reranker protocol lets you drop in a real cross-encoder (e.g. bge-reranker, Cohere Rerank) for
production-grade precision without changing the pipeline.
"""
from __future__ import annotations

from typing import Protocol

from .documents import Document, tokenize


class Reranker(Protocol):
    def rerank(self, query: str, documents: list[Document], top_k: int) -> list[tuple[Document, float]]:
        ...


class LexicalOverlapReranker:
    def rerank(self, query: str, documents: list[Document], top_k: int) -> list[tuple[Document, float]]:
        query_terms = set(tokenize(query))
        scored: list[tuple[Document, float]] = []
        for document in documents:
            doc_terms = set(tokenize(document.text))
            if not query_terms:
                score = 0.0
            else:
                overlap = len(query_terms & doc_terms)
                score = overlap / len(query_terms)
            scored.append((document, score))
        scored.sort(key=lambda pair: pair[1], reverse=True)
        return scored[:top_k]
