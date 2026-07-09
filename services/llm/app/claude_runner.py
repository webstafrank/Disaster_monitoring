"""Runs local Claude Code (the `claude` CLI) in non-interactive print mode and parses
its JSON reply. This is the only place that touches the model. Per project rule, no
hosted LLM API is used; the CLI runs on the same server.

LLM_MODE:
  stub    (default) - templated narrative, no model call. Used by gate tests and
          when Claude Code is not authenticated on the box.
  claude  - shell out to `claude -p`. Falls back to the template if the call fails,
          so the service always returns a narrative.
"""

from __future__ import annotations

import json
import os
import subprocess
from typing import Any

from .prompt import build_prompt

CLAUDE_BIN = os.getenv("CLAUDE_BIN", "claude")
LLM_TIMEOUT_S = int(os.getenv("LLM_CALL_TIMEOUT_S", "120"))


def llm_mode() -> str:
    return os.getenv("LLM_MODE", "stub").lower()


def _strip_fences(text: str) -> str:
    t = text.strip()
    if t.startswith("```"):
        t = t.split("\n", 1)[1] if "\n" in t else t
        if t.endswith("```"):
            t = t[: t.rfind("```")]
        if t.lstrip().startswith("json"):
            t = t.lstrip()[4:]
    return t.strip()


def _template(location: dict[str, Any], indicator: dict[str, Any], analytics: dict[str, Any]) -> dict[str, str]:
    county = location.get("name", "the county")
    sev = analytics.get("severity", {}).get("class", "normal")
    trend = analytics.get("trend", {}).get("direction", "stable")
    latest = analytics.get("latest_value")
    name = indicator.get("name", "indicator")
    summary = (
        f"{name} in {county} is at {latest} and the condition is {sev} "
        f"({trend} over the reporting window)."
    )
    rec = {
        "emergency": f"Trigger emergency response for {county} and prioritize resources now.",
        "severe": f"Escalate monitoring in {county} and pre-position drought resources.",
        "warning": f"Raise monitoring cadence in {county} and brief county officers.",
        "watch": f"Keep {county} under routine watch; no action required yet.",
        "normal": f"Conditions in {county} are within the normal range.",
    }.get(sev, f"Review the {county} data with a county officer.")
    return {"summary": summary, "recommendation": rec}


def _run_claude(prompt: str) -> dict[str, str]:
    proc = subprocess.run(
        [CLAUDE_BIN, "-p", prompt],
        capture_output=True,
        text=True,
        timeout=LLM_TIMEOUT_S,
    )
    if proc.returncode != 0:
        raise RuntimeError(f"claude exited {proc.returncode}: {proc.stderr[:200]}")
    data = json.loads(_strip_fences(proc.stdout))
    if "summary" not in data or "recommendation" not in data:
        raise ValueError("claude reply missing required keys")
    return {"summary": str(data["summary"]), "recommendation": str(data["recommendation"])}


def generate(location: dict[str, Any], indicator: dict[str, Any], analytics: dict[str, Any]) -> dict[str, Any]:
    if llm_mode() == "stub":
        out = _template(location, indicator, analytics)
        return {**out, "generated": False, "model": "stub-template"}

    prompt = build_prompt(location, indicator, analytics)
    try:
        out = _run_claude(prompt)
        return {**out, "generated": True, "model": "claude-code"}
    except (subprocess.SubprocessError, OSError, ValueError, RuntimeError):
        out = _template(location, indicator, analytics)
        return {**out, "generated": False, "model": "fallback-template"}
