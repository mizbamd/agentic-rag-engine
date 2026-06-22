import os

from discovery.agent import SimpleAgent
from discovery.documents import load_corpus
from discovery.rag import RagPipeline
from discovery.retriever import HybridRetriever

CORPUS_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "data", "corpus"))


def build_pipeline() -> RagPipeline:
    retriever = HybridRetriever()
    retriever.index(load_corpus(CORPUS_DIR))
    return RagPipeline(retriever)


def test_hybrid_retrieval_finds_the_right_document():
    pipeline = build_pipeline()
    results = pipeline.retriever.search("deductible coinsurance claim audit trail", top_k=3)
    top_ids = [doc.id for doc, _ in results]
    assert "claims-adjudication.md" in top_ids[:1]


def test_rag_answer_is_grounded_with_citations():
    pipeline = build_pipeline()
    result = pipeline.answer("how is a payment reversed when the rail fails")
    assert result.answer.grounded
    assert result.answer.citations
    assert "payments-settlement.md" in result.answer.citations


def test_agent_guardrail_refuses_when_ungrounded():
    pipeline = build_pipeline()
    state = SimpleAgent(pipeline).run("zzzzz qqqqq wwwww nonsense token")
    assert state.grounded is False
    assert "can't answer" in state.answer.lower()
    assert any("guardrail" in step for step in state.trace)


def test_agent_happy_path_traces_all_nodes():
    pipeline = build_pipeline()
    state = SimpleAgent(pipeline).run("summarize trade settlement and position book of record")
    assert state.intent == "summarize"
    assert len(state.trace) == 3
