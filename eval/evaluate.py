"""Retrieval evaluation harness: precision@k and mean reciprocal rank over a labeled dataset.

Run:  python -m eval.evaluate
"""
from __future__ import annotations

import json
import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "src"))

from discovery.documents import load_corpus  # noqa: E402
from discovery.retriever import HybridRetriever  # noqa: E402


def precision_at_k(retrieved: list[str], relevant: set[str], k: int) -> float:
    top = retrieved[:k]
    if not top:
        return 0.0
    hits = sum(1 for doc_id in top if doc_id in relevant)
    return hits / len(top)


def reciprocal_rank(retrieved: list[str], relevant: set[str]) -> float:
    for index, doc_id in enumerate(retrieved):
        if doc_id in relevant:
            return 1.0 / (index + 1)
    return 0.0


def run(k: int = 3) -> dict:
    base = os.path.dirname(__file__)
    corpus_dir = os.path.join(base, "..", "data", "corpus")
    dataset_path = os.path.join(base, "dataset.jsonl")

    retriever = HybridRetriever()
    retriever.index(load_corpus(os.path.abspath(corpus_dir)))

    precisions: list[float] = []
    rrs: list[float] = []
    with open(dataset_path, encoding="utf-8") as handle:
        for line in handle:
            line = line.strip()
            if not line:
                continue
            example = json.loads(line)
            retrieved = [doc.id for doc, _ in retriever.search(example["query"], top_k=k)]
            relevant = set(example["relevant"])
            precisions.append(precision_at_k(retrieved, relevant, k))
            rrs.append(reciprocal_rank(retrieved, relevant))

    return {
        f"precision@{k}": round(sum(precisions) / len(precisions), 4),
        "mrr": round(sum(rrs) / len(rrs), 4),
        "examples": len(precisions),
    }


if __name__ == "__main__":
    print(json.dumps(run(), indent=2))
