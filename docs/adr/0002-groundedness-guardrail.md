# ADR-0002: Groundedness guardrail and mandatory citations

- Status: Accepted
- Date: 2026-06-22

## Context
Hallucinated answers are unacceptable in regulated domains (healthcare, finance, legal). The system
must prefer refusal over a confident-but-unsupported answer.

## Decision
Every generated answer must be grounded in retrieved context and carry citations. A guardrail node
in the agent rejects ungrounded output and returns an explicit "can't answer from sources" response.
The contract is identical for the extractive and LLM generators, so swapping in an LLM never weakens
the safety property.

## Consequences
- Positive: safe-by-default; auditable answers; consistent behavior across generator backends.
- Negative: lower answer coverage (the system says "I don't know" more often) -- an intentional,
  correct trade-off for high-stakes use.
