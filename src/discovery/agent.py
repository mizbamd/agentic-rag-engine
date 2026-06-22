"""Agentic orchestration over the RAG pipeline.

The real orchestration uses LangGraph's StateGraph (see build_langgraph_agent). To keep the package
importable and testable without the dependency, SimpleAgent implements the identical node sequence
in pure Python. Both encode the same governed flow:

    classify_intent -> retrieve -> generate -> guardrail

The guardrail enforces that answers are grounded in retrieved context (refusing ungrounded output),
which is the core safety property for enterprise RAG.
"""
from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any

from .rag import RagPipeline


@dataclass
class AgentState:
    query: str
    intent: str = "search"
    answer: str = ""
    citations: list[str] = field(default_factory=list)
    grounded: bool = False
    trace: list[str] = field(default_factory=list)


class SimpleAgent:
    """Dependency-free orchestrator mirroring the LangGraph node sequence."""

    def __init__(self, pipeline: RagPipeline) -> None:
        self.pipeline = pipeline

    def classify_intent(self, state: AgentState) -> AgentState:
        lowered = state.query.lower()
        state.intent = "summarize" if lowered.startswith(("summarize", "summary")) else "search"
        state.trace.append(f"classify_intent -> {state.intent}")
        return state

    def retrieve_and_generate(self, state: AgentState) -> AgentState:
        result = self.pipeline.answer(state.query)
        state.answer = result.answer.text
        state.citations = result.answer.citations
        state.grounded = result.answer.grounded
        state.trace.append(f"retrieve+generate -> {len(result.contexts)} contexts")
        return state

    def guardrail(self, state: AgentState) -> AgentState:
        if not state.grounded:
            state.answer = "I can't answer that from the available sources."
            state.citations = []
        state.trace.append(f"guardrail -> grounded={state.grounded}")
        return state

    def run(self, query: str) -> AgentState:
        state = AgentState(query=query)
        state = self.classify_intent(state)
        state = self.retrieve_and_generate(state)
        state = self.guardrail(state)
        return state


def build_langgraph_agent(pipeline: RagPipeline) -> Any:  # pragma: no cover
    """Builds the same flow as a LangGraph StateGraph. Requires `langgraph` to be installed."""
    from langgraph.graph import END, START, StateGraph

    agent = SimpleAgent(pipeline)
    graph: StateGraph = StateGraph(AgentState)
    graph.add_node("classify_intent", agent.classify_intent)
    graph.add_node("retrieve_and_generate", agent.retrieve_and_generate)
    graph.add_node("guardrail", agent.guardrail)
    graph.add_edge(START, "classify_intent")
    graph.add_edge("classify_intent", "retrieve_and_generate")
    graph.add_edge("retrieve_and_generate", "guardrail")
    graph.add_edge("guardrail", END)
    return graph.compile()
