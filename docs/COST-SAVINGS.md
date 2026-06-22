# Cost Savings Analysis: discovery-ai

Illustrative model of how the architecture reduces both operating (inference/infra) cost and the
business cost of manual knowledge work. Figures are representative ranges, not a specific company's.

## 1. Operating-cost levers (run cost)
| Lever | Mechanism | Typical impact |
|---|---|---|
| Hybrid retrieval before generation | Send only top-k grounded chunks to the LLM, not whole docs | 50% - 80% fewer prompt tokens |
| Reranking small candidate sets | Rerank ~20-50 candidates, not the corpus | Bounded rerank cost |
| Extractive fallback | Serve cheap extractive answers when an LLM is unnecessary | Avoids per-token LLM cost |
| Pluggable backends | Use smaller/cheaper models where quality allows | Right-size $/query |
| Caching frequent queries | Reuse answers for repeated questions | Lower token spend |

## 2. Business-cost levers (value)
| Lever | Mechanism | Typical impact |
|---|---|---|
| Self-service answers | Staff find answers in seconds vs. manual document search | Hours/week recovered per knowledge worker |
| Fewer escalations | Grounded answers deflect tickets to subject-matter experts | Lower support/SME load |
| Faster diligence/research | Citable Q&A over large corpora | Compressed cycle time |

## 3. Worked illustration (run cost per 1,000 answered questions)
| Approach | Prompt tokens/query | Relative cost |
|---|---|---|
| Naive "stuff whole docs into LLM" | ~12,000 | 1.0x (baseline) |
| Hybrid retrieval + rerank + top-k | ~2,500 | ~0.2x |

A ~5x reduction in tokens-per-answer at constant quality is the core operating-cost saving; the
groundedness guardrail also avoids the rework cost of acting on a hallucinated answer.

## 4. Notes
All figures are illustrative planning ranges to demonstrate methodology. Calibrate token counts and
$/token against the chosen model and measured corpus before building a business case.
