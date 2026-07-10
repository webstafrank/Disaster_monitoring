"""Deterministic month arithmetic for monthly ("YYYY-MM") series.

Kept out of the model so date math never happens implicitly. Same input, same
output, no timezone, no `datetime.now`.
"""

from __future__ import annotations


def parse_month(t: str) -> tuple[int, int]:
    """'2024-03' -> (2024, 3). Raises ValueError on anything else."""
    y, _, m = t.partition("-")
    year, month = int(y), int(m)
    if not 1 <= month <= 12:
        raise ValueError(f"month out of range: {t}")
    return year, month


def format_month(year: int, month: int) -> str:
    return f"{year}-{month:02d}"


def add_months(t: str, k: int) -> str:
    """Advance 'YYYY-MM' by k months (k may be negative)."""
    year, month = parse_month(t)
    idx = (year * 12 + (month - 1)) + k
    return format_month(idx // 12, idx % 12 + 1)


def future_months(last: str, horizon: int) -> list[str]:
    """The `horizon` month labels strictly after `last`."""
    return [add_months(last, i) for i in range(1, horizon + 1)]
