"""Embeddings.

Default is a dependency-free hashing embedder (the "hashing trick"): deterministic, offline, and
good enough to demonstrate dense retrieval and tests. The Embedder protocol lets you swap in a real
model (sentence-transformers, OpenAI, Azure OpenAI, Bedrock) in production without code changes
elsewhere.
"""
from __future__ import annotations

import hashlib
import math
from typing import Protocol

from .documents import tokenize


def _stable_hash(token: str) -> int:
    """Process-independent hash so embeddings are reproducible across runs and machines."""
    digest = hashlib.md5(token.encode("utf-8")).digest()
    return int.from_bytes(digest[:8], "big")


class Embedder(Protocol):
    dim: int

    def embed(self, text: str) -> list[float]:
        ...


class HashingEmbedder:
    """Maps tokens into a fixed-dimensional vector via feature hashing with TF weighting."""

    def __init__(self, dim: int = 256) -> None:
        self.dim = dim

    def embed(self, text: str) -> list[float]:
        vector = [0.0] * self.dim
        for token in tokenize(text):
            token_hash = _stable_hash(token)
            index = token_hash % self.dim
            sign = 1.0 if (token_hash & 1) == 0 else -1.0
            vector[index] += sign
        return _l2_normalize(vector)


def _l2_normalize(vector: list[float]) -> list[float]:
    norm = math.sqrt(sum(value * value for value in vector))
    if norm == 0.0:
        return vector
    return [value / norm for value in vector]


def cosine_similarity(a: list[float], b: list[float]) -> float:
    return sum(x * y for x, y in zip(a, b))
