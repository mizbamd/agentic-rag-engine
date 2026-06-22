# Standard Operating Procedure (SOP): discovery-ai

Operational runbook for the discovery service. Audience: AI platform / ML ops.

## 1. Service
| Component | Detail |
|---|---|
| API | FastAPI app (`src/discovery/api.py`), default port 8000 |
| Endpoints | `POST /search`, `POST /answer`, `POST /agent` |
| Backends | Embeddings, vector store, reranker, generator (all pluggable) |

## 2. Bring-up
1. `pip install -r requirements.txt`.
2. Optional: start pgvector via `docker compose up` for persistent vectors.
3. `uvicorn discovery.api:app --reload`. Confirm `GET /` (health) is OK.
4. Smoke test: `POST /answer` with a known question; verify citations are returned.

## 3. Indexing / corpus refresh
1. Upstream pipeline publishes the curated corpus (see `data/corpus/`).
2. Re-embed and upsert into the vector store; rebuild the BM25 index.
3. Run the eval harness (section 5) before promoting the new index.

## 4. Routine operations
- **Monitor**: query latency (p99), retrieval count, guardrail refusal rate, LLM token cost.
- **Cost watch**: track tokens/query and rerank calls; alert on anomalies (see COST-SAVINGS.md).
- **Quality watch**: track refusal rate; a spike often signals index/corpus problems.

## 5. Evaluation gate
Run `python eval/evaluate.py`. Release only if precision@5 and MRR meet thresholds (see NFR.md). This
is wired into CI and must pass before deploy.

## 6. Incident response
| Symptom | First action | Remediation |
|---|---|---|
| Answers lack citations | Check guardrail config | Re-enable groundedness guardrail; block release |
| Refusal rate spikes | Inspect retrieval hits | Rebuild/repair index; verify corpus freshness |
| Latency high | Check reranker/LLM backend | Scale or fall back to extractive generator |
| Eval regression | Diff index + config vs last good | Roll back index/config |

## 7. Rollback
Vector index and config are versioned; revert to the last index that passed the eval gate. The
extractive generator is a deterministic fallback if the LLM backend is unavailable.

## 8. Change management
Backend swaps (embeddings/store/reranker/LLM) are config changes recorded as ADRs and must re-pass the
eval gate.
