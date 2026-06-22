"""FastAPI surface for hybrid search, RAG answers, and the agent."""
from __future__ import annotations

import os
from functools import lru_cache

from fastapi import FastAPI
from pydantic import BaseModel

from .agent import SimpleAgent
from .documents import load_corpus
from .rag import RagPipeline
from .retriever import HybridRetriever

app = FastAPI(title="agentic-rag-engine", version="1.0.0")


@lru_cache
def _pipeline() -> RagPipeline:
    corpus_dir = os.environ.get(
        "CORPUS_DIR",
        os.path.join(os.path.dirname(__file__), "..", "..", "data", "corpus"),
    )
    retriever = HybridRetriever()
    retriever.index(load_corpus(os.path.abspath(corpus_dir)))
    return RagPipeline(retriever)


class Query(BaseModel):
    query: str
    top_k: int = 5


@app.get("/healthz")
def healthz() -> dict:
    return {"status": "ok"}


@app.post("/search")
def search(request: Query) -> dict:
    results = _pipeline().retriever.search(request.query, top_k=request.top_k)
    return {
        "query": request.query,
        "results": [
            {"id": doc.id, "score": round(score, 4), "snippet": doc.text[:200]}
            for doc, score in results
        ],
    }


@app.post("/answer")
def answer(request: Query) -> dict:
    result = _pipeline().answer(request.query, top_k=request.top_k)
    return {
        "query": request.query,
        "answer": result.answer.text,
        "citations": result.answer.citations,
        "grounded": result.answer.grounded,
    }


@app.post("/agent")
def agent(request: Query) -> dict:
    state = SimpleAgent(_pipeline()).run(request.query)
    return {
        "query": request.query,
        "intent": state.intent,
        "answer": state.answer,
        "citations": state.citations,
        "grounded": state.grounded,
        "trace": state.trace,
    }
