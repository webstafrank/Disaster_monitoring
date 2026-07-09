"""Narrative service. Every other service calls this contract for LLM text; nothing
in the codebase calls a hosted LLM API directly.
"""

from __future__ import annotations

from fastapi import FastAPI

from . import claude_runner
from .schemas import Health, Narrative, NarrativeRequest

app = FastAPI(title="KSA Narrative Service", version="0.1.0")


@app.get("/health", response_model=Health)
def health() -> Health:
    return Health(llm_mode=claude_runner.llm_mode())


@app.post("/narrative", response_model=Narrative)
def narrative(req: NarrativeRequest) -> Narrative:
    out = claude_runner.generate(req.location, req.indicator, req.analytics)
    return Narrative(**out)
