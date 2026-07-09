"""Drift guard: the app's generated OpenAPI must stay in sync with the hand-written
contract at contracts/openapi.yaml. If someone adds an endpoint or renames a schema
in code without updating the contract (or vice versa), this fails.
"""

from pathlib import Path

import yaml

from app.main import app

CONTRACT = Path(__file__).resolve().parents[3] / "contracts" / "openapi.yaml"


def _load_contract():
    with open(CONTRACT) as f:
        return yaml.safe_load(f)


def test_contract_file_exists():
    assert CONTRACT.exists(), f"contract missing at {CONTRACT}"


def test_paths_match():
    contract = _load_contract()
    spec = app.openapi()
    contract_paths = set(contract["paths"])
    app_paths = set(spec["paths"])
    missing = contract_paths - app_paths
    assert not missing, f"contract paths not implemented: {missing}"


def test_methods_match():
    contract = _load_contract()
    spec = app.openapi()
    for path, ops in contract["paths"].items():
        for method in ops:
            assert method in spec["paths"].get(path, {}), f"{method.upper()} {path} missing"


def test_core_schemas_present():
    spec = app.openapi()
    generated = set(spec.get("components", {}).get("schemas", {}))
    core = {"Location", "Indicator", "ObservationSeries", "Insight", "Analytics", "Health"}
    missing = core - generated
    assert not missing, f"schemas missing from generated spec: {missing}"


def test_severity_uses_class_alias():
    spec = app.openapi()
    severity = spec["components"]["schemas"]["Severity"]
    assert "class" in severity["properties"], "Severity must serialize `class`, not `cls`"
