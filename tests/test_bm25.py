from discovery.bm25 import BM25Okapi
from discovery.documents import tokenize


def test_bm25_ranks_matching_document_first():
    corpus = [
        "the quick brown fox jumps over the lazy dog",
        "settlement reversal compensating ledger posting",
        "machine learning embeddings vector search",
    ]
    bm25 = BM25Okapi([tokenize(text) for text in corpus])

    ranked = bm25.rank("compensating reversal ledger", top_k=3)

    assert ranked, "expected at least one match"
    assert ranked[0][0] == 1


def test_bm25_returns_nothing_for_unrelated_query():
    bm25 = BM25Okapi([tokenize("alpha beta gamma")])
    assert bm25.rank("nonexistent terms", top_k=3) == []
