# Business Requirements Document (BRD): discovery-ai

| Field | Value |
|---|---|
| Document | Business Requirements Document |
| Product | discovery-ai (hybrid search + RAG + agent) |
| Version | 1.0 |
| Status | Baselined |
| Owner | AI Platform / Knowledge Engineering |

## 1. Purpose
Define business requirements for an enterprise discovery capability that provides precise search and
grounded, citable answers over an organization's knowledge base, safely usable in regulated contexts.

## 2. Background and problem statement
Knowledge is fragmented across documents and systems. Keyword search misses meaning; pure semantic
search misses exact identifiers; and ungoverned LLMs hallucinate. The business needs accurate
retrieval and answers that are grounded, cited, and that refuse when the knowledge base is insufficient.

## 3. Business objectives
| ID | Objective | Measure of success |
|---|---|---|
| OBJ-1 | Improve answer accuracy | MRR >= 0.8, precision@5 >= 0.7 on the eval set |
| OBJ-2 | Eliminate ungrounded answers | 100% of answers cite sources or explicitly refuse |
| OBJ-3 | Reduce time-to-answer for staff | Self-service answers vs. manual document search |
| OBJ-4 | Avoid vendor lock-in | Pluggable embeddings/vector store/LLM |

## 4. Scope
### In scope
- Hybrid retrieval (dense + sparse), reciprocal rank fusion, reranking.
- Grounded generation with citations and a groundedness guardrail.
- Agentic orchestration (classify -> retrieve -> generate -> guardrail).
- Retrieval evaluation harness (precision@k, MRR) in CI.

### Out of scope
- Document ingestion/ETL (provided by the lakehouse/feature store).
- Identity and document-level access control (delegated to the platform).
- Model training/fine-tuning.

## 5. Stakeholders
| Stakeholder | Interest |
|---|---|
| Business users | Fast, accurate answers |
| Compliance / Legal | No hallucinations; auditable citations |
| Knowledge owners | Findability and correctness |
| AI platform team | Quality, cost, operability |

## 6. Business requirements
| ID | Requirement | Priority |
|---|---|---|
| BR-1 | The system shall combine semantic and keyword retrieval for recall and precision. | Must |
| BR-2 | Every answer shall include source citations. | Must |
| BR-3 | The system shall refuse to answer when retrieved context is insufficient. | Must |
| BR-4 | Retrieval quality shall be measured automatically and gate releases. | Should |
| BR-5 | Embedding model, vector store, reranker, and LLM shall be swappable. | Should |
| BR-6 | The system shall operate offline/deterministically for testing. | Could |

## 7. Assumptions and constraints
- A curated, access-controlled corpus is supplied by upstream pipelines.
- Generation backend may be an internal or hosted LLM; the contract (grounded + cited) is fixed.

## 8. Risks
| Risk | Mitigation |
|---|---|
| Hallucination | Groundedness guardrail; mandatory citations |
| Retrieval regression | CI eval gate (precision@k, MRR) |
| Sensitive data exposure | Access control upstream; no secrets in the index |
