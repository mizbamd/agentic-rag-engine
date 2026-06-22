from discovery.embeddings import HashingEmbedder, cosine_similarity
from discovery.fusion import reciprocal_rank_fusion


def test_embeddings_are_deterministic_and_normalized():
    embedder = HashingEmbedder(dim=64)
    v1 = embedder.embed("payment settlement reversal")
    v2 = embedder.embed("payment settlement reversal")

    assert v1 == v2
    assert abs(cosine_similarity(v1, v1) - 1.0) < 1e-9


def test_similar_text_scores_higher_than_unrelated():
    embedder = HashingEmbedder(dim=512)
    query = embedder.embed("compensating reversal in the ledger")
    related = embedder.embed("the ledger issues a compensating reversal")
    unrelated = embedder.embed("vector embeddings for semantic search")

    assert cosine_similarity(query, related) > cosine_similarity(query, unrelated)


def test_rrf_rewards_agreement_across_lists():
    fused = reciprocal_rank_fusion([["a", "b", "c"], ["b", "a", "d"]])
    top_id = fused[0][0]
    assert top_id in {"a", "b"}
