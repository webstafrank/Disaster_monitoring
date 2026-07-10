#!/usr/bin/env bash
# Gate tests: deterministic, free, fast (< 2s). Run on every commit and in CI.
# Override the interpreter with PY=... (defaults to the local venv, then python3).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

PY="${PY:-$ROOT/.venv-test/bin/python}"
[[ -x "$PY" ]] || PY="$(command -v python3)"

echo "Interpreter: $PY"

echo "== API gate tests =="
( cd "$ROOT/services/api" && "$PY" -m pytest )

echo "== LLM gate tests =="
( cd "$ROOT/services/llm" && "$PY" -m pytest )

echo "== Forecast gate tests =="
( cd "$ROOT/services/forecast" && "$PY" -m pytest )

echo "All gate tests passed."
