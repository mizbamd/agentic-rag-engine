# Non-Functional Requirements (NFR): discovery-ai

## 1. Quality / accuracy
| ID | Requirement | Target |
|---|---|---|
| NFR-Q1 | Retrieval mean reciprocal rank (MRR) | >= 0.80 on eval set |
| NFR-Q2 | Precision@5 | >= 0.70 |
| NFR-Q3 | Grounded answers | 100% cite sources or refuse |
| NFR-Q4 | Hallucination rate | ~0 (guardrail-enforced) |

## 2. Performance
| ID | Requirement | Target |
|---|---|---|
| NFR-P1 | Retrieval latency (`/search`) | p99 < 300 ms |
| NFR-P2 | End-to-end answer latency (extractive) | p99 < 800 ms |
| NFR-P3 | End-to-end answer latency (LLM) | p99 < 4 s |
| NFR-P4 | Throughput | Horizontally scalable, stateless API |

## 3. Scalability
| ID | Requirement |
|---|---|
| NFR-S1 | Vector store scales to millions of chunks (pgvector/Qdrant). |
| NFR-S2 | API is stateless and scales horizontally behind a load balancer. |

## 4. Reliability / availability
| ID | Requirement | Target |
|---|---|---|
| NFR-A1 | Service availability | 99.9% |
| NFR-A2 | Graceful degradation | Fall back to extractive generation if LLM unavailable |

## 5. Security and privacy
| ID | Requirement |
|---|---|
| NFR-SEC1 | Document-level access control enforced upstream; index holds no secrets. |
| NFR-SEC2 | TLS in transit; prompts/responses logged without sensitive payloads. |
| NFR-SEC3 | No PII leakage in citations beyond source-authorized content. |

## 6. Observability
| ID | Requirement |
|---|---|
| NFR-O1 | Metrics: latency, retrieval count, refusal rate, token cost per query. |
| NFR-O2 | Each answer traces the retrieved chunk ids that grounded it. |

## 7. Portability / maintainability
| ID | Requirement |
|---|---|
| NFR-M1 | Embeddings, vector store, reranker, and LLM are swappable behind protocols. |
| NFR-M2 | Deterministic offline mode for reproducible tests and CI eval gate. |
