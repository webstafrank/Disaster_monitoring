# LLM narrative service

Turns the deterministic analytics into a plain-language briefing for a county officer.
This is the only service that touches a model, and it uses **local Claude Code** (the
`claude` CLI on the server), never a hosted API, per project rule.

## Endpoint

`POST /narrative` — body `{ location, indicator, analytics }`, returns
`{ summary, recommendation, generated, model }`. `generated` is `true` only when Claude
produced the text; `false` marks the templated fallback.

## Modes (`LLM_MODE`)

- `stub` (default) — templated narrative, no model call. Used by gate tests and when
  Claude Code is not authenticated.
- `claude` — shells to `claude -p` with a strict-JSON prompt (`app/prompt.py`), parses the
  reply (`app/claude_runner.py`). Falls back to the template on any failure, so the
  service always returns a narrative.

## Deploy on the server

Claude Code must be authenticated for whatever user runs this service. Two options:

- **Host run (recommended):** run the venv + uvicorn under systemd as a user whose
  `~/.claude` is authenticated. Simplest, no container auth.
- **Container:** `Dockerfile` installs Node + Claude Code; mount the authenticated config
  read-only (`/home/svc/.claude:/root/.claude:ro`). Without the mount, use `LLM_MODE=stub`.

## Test

```bash
cd services/llm && python -m pytest                 # gate (free, stub mode)
LLM_MODE=claude python -m pytest evals              # paid, real model, quality threshold
```

Proven working: a `claude`-mode call for Turkana VCI=12 (severe) returns a grounded,
county-specific briefing with `generated: true`.
