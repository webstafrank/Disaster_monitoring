"""Contract for the narrative service. Input is the deterministic analytics plus the
location/indicator; output is a plain-language Narrative (mirrors the API's Narrative).
"""

from __future__ import annotations

from typing import Any

from pydantic import BaseModel


class NarrativeRequest(BaseModel):
    location: dict[str, Any]
    indicator: dict[str, Any]
    analytics: dict[str, Any]


class Narrative(BaseModel):
    summary: str
    recommendation: str
    generated: bool
    model: str


class Health(BaseModel):
    status: str = "ok"
    llm_mode: str
