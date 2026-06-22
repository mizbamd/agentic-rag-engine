# Industry Applicability

Hybrid retrieval + grounded RAG is the same capability across every knowledge-intensive industry.
The corpus changes; the architecture does not.

| Capability | Product / SaaS | Healthcare / Claims | Financial Services / Private Equity | Retail / Restaurant |
|---|---|---|---|---|
| Hybrid search | Atlas Search-style product search | Clinical / formulary / policy search | Research, filings, deal-room search | Product / SKU / menu search |
| Grounded RAG with citations | Docs Q&A, support copilots | Care-guideline and claims-policy Q&A | Investment memo / due-diligence Q&A | Merchandising and ops knowledge Q&A |
| Groundedness guardrail | Trustworthy support answers | Patient-safety-critical refusal of unknowns | Compliance: no fabricated guidance | Accurate policy/price answers |
| Eval harness (precision@k, MRR) | Search relevance SLAs | Validated clinical retrieval quality | Auditable retrieval quality | Catalog search quality |
| LangGraph agent | Multi-step product assistants | Prior-auth / triage assistants | Diligence research agents | Store/ops assistants |

## Why the guardrail matters
In regulated and high-stakes settings the most important answer is sometimes "I don't know." The
groundedness guardrail -- refusing to answer when the knowledge base lacks support -- is what makes
enterprise RAG safe to deploy in healthcare, finance, and legal contexts.
