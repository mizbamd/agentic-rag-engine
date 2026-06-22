"""Hybrid retriever: dense (vector) + sparse (BM25), fused with RRF, then reranked."""
from __future__ import annotations

from .bm25 import BM25Okapi
from .documents import Document, tokenize
from .embeddings import Embedder, HashingEmbedder
from .fusion import reciprocal_rank_fusion
from .rerank import LexicalOverlapReranker, Reranker
from .vectorstore import InMemoryVectorStore, VectorStore


class HybridRetriever:
    def __init__(
        self,
        embedder: Embedder | None = None,
        vector_store: VectorStore | None = None,
        reranker: Reranker | None = None,
    ) -> None:
        self.embedder = embedder or HashingEmbedder()
        self.vector_store = vector_store or InMemoryVectorStore()
        self.reranker = reranker or LexicalOverlapReranker()
        self._documents: dict[str, Document] = {}
        self._bm25: BM25Okapi | None = None
        self._bm25_ids: list[str] = []

    def index(self, documents: list[Document]) -> None:
        self._documents = {doc.id: doc for doc in documents}
        self._bm25_ids = [doc.id for doc in documents]
        for doc in documents:
            self.vector_store.add(doc.id, self.embedder.embed(doc.text))
        self._bm25 = BM25Okapi([tokenize(doc.text) for doc in documents])

    def search(self, query: str, top_k: int = 5, candidate_k: int = 20) -> list[tuple[Document, float]]:
        if self._bm25 is None:
            raise RuntimeError("index() must be called before search()")

        dense = self.vector_store.search(self.embedder.embed(query), candidate_k)
        dense_ids = [doc_id for doc_id, _ in dense]

        lexical = self._bm25.rank(query, candidate_k)
        lexical_ids = [self._bm25_ids[i] for i, _ in lexical]

        fused = reciprocal_rank_fusion([dense_ids, lexical_ids])
        fused_docs = [self._documents[doc_id] for doc_id, _ in fused if doc_id in self._documents]

        return self.reranker.rerank(query, fused_docs, top_k)
