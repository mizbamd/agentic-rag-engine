"""Vector store abstraction.

Default is an in-memory cosine index for tests and local dev. The VectorStore protocol matches what
a pgvector or Qdrant adapter would implement, so swapping persistence does not change retrieval code.
"""
from __future__ import annotations

from typing import Protocol

from .embeddings import cosine_similarity


class VectorStore(Protocol):
    def add(self, doc_id: str, vector: list[float]) -> None:
        ...

    def search(self, query_vector: list[float], top_k: int) -> list[tuple[str, float]]:
        ...


class InMemoryVectorStore:
    def __init__(self) -> None:
        self._vectors: dict[str, list[float]] = {}

    def add(self, doc_id: str, vector: list[float]) -> None:
        self._vectors[doc_id] = vector

    def search(self, query_vector: list[float], top_k: int) -> list[tuple[str, float]]:
        scored = [
            (doc_id, cosine_similarity(query_vector, vector))
            for doc_id, vector in self._vectors.items()
        ]
        scored.sort(key=lambda pair: pair[1], reverse=True)
        return scored[:top_k]
