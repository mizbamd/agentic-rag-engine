# Retrieval-Augmented Generation Architecture

Retrieval-Augmented Generation grounds a language model in an external knowledge base. A hybrid
retriever combines dense vector search with sparse BM25 lexical search, fuses the two rankings with
reciprocal rank fusion, and reranks the candidates with a cross-encoder for precision. The top
contexts are passed to a generator that must cite its sources. A guardrail rejects ungrounded answers
so the system refuses to hallucinate when the knowledge base lacks the answer. An evaluation harness
measures retrieval quality with precision at k and mean reciprocal rank.
