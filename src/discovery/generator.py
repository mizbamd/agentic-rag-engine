"""Answer generation.

Default is an extractive generator that stitches the most query-relevant sentences from retrieved
context and always attaches citations -- so the service runs fully offline and is deterministic for
tests. Swap in LLMGenerator (OpenAI/Azure OpenAI/Bedrock) for abstractive answers; the contract
(grounded answer + citations) is identical, which keeps the RAG guardrails meaningful either way.
"""
from __future__ import annotations

import os
import re
from dataclasses import dataclass
from typing import Protocol

from .documents import Document, tokenize


@dataclass
class Answer:
    text: str
    citations: list[str]
    grounded: bool


class Generator(Protocol):
    def generate(self, query: str, contexts: list[Document]) -> Answer:
        ...


_SENTENCE_RE = re.compile(r"(?<=[.!?])\s+")


class ExtractiveGenerator:
    def __init__(self, max_sentences: int = 3) -> None:
        self.max_sentences = max_sentences

    def generate(self, query: str, contexts: list[Document]) -> Answer:
        if not contexts:
            return Answer("I don't have enough information to answer that.", [], grounded=False)

        query_terms = set(tokenize(query))
        scored_sentences: list[tuple[float, str, str]] = []
        for doc in contexts:
            for sentence in _SENTENCE_RE.split(doc.text):
                sentence = sentence.strip()
                if not sentence:
                    continue
                overlap = len(query_terms & set(tokenize(sentence)))
                if overlap:
                    scored_sentences.append((overlap, sentence, doc.id))

        scored_sentences.sort(key=lambda item: item[0], reverse=True)
        top = scored_sentences[: self.max_sentences]
        if not top:
            return Answer("I don't have enough information to answer that.", [], grounded=False)

        text = " ".join(sentence for _, sentence, _ in top)
        citations = list(dict.fromkeys(doc_id for _, _, doc_id in top))
        return Answer(text=text, citations=citations, grounded=True)


class LLMGenerator:
    """Optional abstractive generator. Requires OPENAI_API_KEY and the openai package."""

    def __init__(self, model: str = "gpt-4o-mini") -> None:
        self.model = model
        if not os.environ.get("OPENAI_API_KEY"):
            raise RuntimeError("OPENAI_API_KEY required for LLMGenerator")

    def generate(self, query: str, contexts: list[Document]) -> Answer:  # pragma: no cover
        from openai import OpenAI

        client = OpenAI()
        context_block = "\n\n".join(f"[{doc.id}]\n{doc.text}" for doc in contexts)
        prompt = (
            "Answer the question using ONLY the context. Cite sources by their [id]. "
            "If the context is insufficient, say so.\n\n"
            f"Context:\n{context_block}\n\nQuestion: {query}"
        )
        response = client.chat.completions.create(
            model=self.model,
            messages=[{"role": "user", "content": prompt}],
            temperature=0,
        )
        text = response.choices[0].message.content or ""
        citations = [doc.id for doc in contexts if f"[{doc.id}]" in text]
        return Answer(text=text, citations=citations, grounded=bool(citations))
