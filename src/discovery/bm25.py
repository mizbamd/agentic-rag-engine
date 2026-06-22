"""Pure-Python BM25 Okapi lexical ranker (the sparse half of hybrid retrieval)."""
from __future__ import annotations

import math
from collections import Counter

from .documents import tokenize


class BM25Okapi:
    def __init__(self, corpus_tokens: list[list[str]], k1: float = 1.5, b: float = 0.75) -> None:
        self.k1 = k1
        self.b = b
        self.corpus_tokens = corpus_tokens
        self.doc_count = len(corpus_tokens)
        self.doc_lengths = [len(tokens) for tokens in corpus_tokens]
        self.avg_doc_length = (sum(self.doc_lengths) / self.doc_count) if self.doc_count else 0.0
        self.doc_freqs: list[Counter] = [Counter(tokens) for tokens in corpus_tokens]
        self.idf = self._compute_idf()

    def _compute_idf(self) -> dict[str, float]:
        document_frequency: Counter = Counter()
        for tokens in self.corpus_tokens:
            for term in set(tokens):
                document_frequency[term] += 1
        idf: dict[str, float] = {}
        for term, freq in document_frequency.items():
            # BM25 idf with +1 smoothing to keep values non-negative.
            idf[term] = math.log(1 + (self.doc_count - freq + 0.5) / (freq + 0.5))
        return idf

    def score(self, query: str, doc_index: int) -> float:
        tokens = tokenize(query)
        freqs = self.doc_freqs[doc_index]
        doc_len = self.doc_lengths[doc_index]
        score = 0.0
        for term in tokens:
            if term not in freqs:
                continue
            tf = freqs[term]
            idf = self.idf.get(term, 0.0)
            denom = tf + self.k1 * (1 - self.b + self.b * doc_len / (self.avg_doc_length or 1))
            score += idf * (tf * (self.k1 + 1)) / denom
        return score

    def rank(self, query: str, top_k: int) -> list[tuple[int, float]]:
        scored = [(i, self.score(query, i)) for i in range(self.doc_count)]
        scored.sort(key=lambda pair: pair[1], reverse=True)
        return [pair for pair in scored[:top_k] if pair[1] > 0.0]
