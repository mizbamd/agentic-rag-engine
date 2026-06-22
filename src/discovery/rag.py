"""RAG pipeline: retrieve -> rerank (inside retriever) -> generate grounded answer with citations."""
from __future__ import annotations

from dataclasses import dataclass

from .documents import Document
from .generator import Answer, ExtractiveGenerator, Generator
from .retriever import HybridRetriever


@dataclass
class RagResult:
    answer: Answer
    contexts: list[Document]


class RagPipeline:
    def __init__(self, retriever: HybridRetriever, generator: Generator | None = None) -> None:
        self.retriever = retriever
        self.generator = generator or ExtractiveGenerator()

    def answer(self, query: str, top_k: int = 4) -> RagResult:
        retrieved = self.retriever.search(query, top_k=top_k)
        contexts = [doc for doc, _ in retrieved]
        answer = self.generator.generate(query, contexts)
        return RagResult(answer=answer, contexts=contexts)
