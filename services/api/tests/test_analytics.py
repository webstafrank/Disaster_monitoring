"""Gate tests for the deterministic analytics. No LLM, no network, < 1s."""

from app import analytics as an


def test_linreg_slope():
    assert an.linreg_slope([1, 2, 3, 4]) == 1.0
    assert an.linreg_slope([4, 3, 2, 1]) == -1.0
    assert an.linreg_slope([5]) == 0.0
    assert an.linreg_slope([5, 5, 5]) == 0.0


def test_pct_change():
    assert an.pct_change(10, 15) == 50.0
    assert an.pct_change(10, 5) == -50.0
    assert an.pct_change(0, 5) == 0.0  # guarded


def test_zscore():
    # [10,10,10,10,20]: mean 12, pstdev 4 -> z of last = 2.0
    assert an.zscore(20, [10, 10, 10, 10, 20]) == 2.0
    assert an.zscore(5, [5, 5, 5]) == 0.0


def test_trend_direction_higher_is_better():
    assert an.compute_trend([10, 20, 30, 40], higher_is_better=True).direction == "improving"
    assert an.compute_trend([40, 30, 20, 10], higher_is_better=True).direction == "declining"
    assert an.compute_trend([10.0, 10.2], higher_is_better=True).direction == "stable"


def test_trend_direction_lower_is_better():
    # Flood rising = condition worsening = declining.
    assert an.compute_trend([10, 20, 30], higher_is_better=False).direction == "declining"
    assert an.compute_trend([30, 20, 10], higher_is_better=False).direction == "improving"


def test_anomaly_flag():
    a = an.compute_anomaly([10, 10, 10, 10, 20])
    assert a.z_score == 2.0
    assert a.is_anomalous is True
    b = an.compute_anomaly([10, 11, 10, 9, 10])
    assert b.is_anomalous is False


def test_vci_severity_classes():
    assert an.classify_severity("vci", [9], higher_is_better=True).cls == "emergency"
    assert an.classify_severity("vci", [15], higher_is_better=True).cls == "severe"
    assert an.classify_severity("vci", [34], higher_is_better=True).cls == "warning"
    assert an.classify_severity("vci", [45], higher_is_better=True).cls == "watch"
    assert an.classify_severity("vci", [60], higher_is_better=True).cls == "normal"


def test_spi_severity_classes():
    assert an.classify_severity("spi", [-2.1], higher_is_better=True).cls == "emergency"
    assert an.classify_severity("spi", [-1.6], higher_is_better=True).cls == "severe"
    assert an.classify_severity("spi", [-1.2], higher_is_better=True).cls == "warning"
    assert an.classify_severity("spi", [-0.7], higher_is_better=True).cls == "watch"
    assert an.classify_severity("spi", [0.3], higher_is_better=True).cls == "normal"


def test_ndvi_severity_classes():
    assert an.classify_severity("ndvi", [0.18], higher_is_better=True).cls == "emergency"
    assert an.classify_severity("ndvi", [0.25], higher_is_better=True).cls == "severe"
    assert an.classify_severity("ndvi", [0.35], higher_is_better=True).cls == "warning"
    assert an.classify_severity("ndvi", [0.45], higher_is_better=True).cls == "watch"
    assert an.classify_severity("ndvi", [0.60], higher_is_better=True).cls == "normal"


def test_anomaly_fallback_severity():
    # rainfall has no absolute scale -> anomaly-based, higher_is_better.
    dry = [100, 100, 100, 100, 100, 100, 100, 100, 100, 60]
    sev = an.classify_severity("rainfall", dry, higher_is_better=True)
    assert sev.cls in {"watch", "warning", "severe", "emergency"}
    assert sev.rationale_code.startswith("anomaly")


def test_analyze_empty_series():
    r = an.analyze([], indicator_id="ndvi", higher_is_better=True)
    assert r.latest_value is None
    assert r.n_points == 0
    assert r.severity.cls == "normal"
    assert r.severity.rationale_code == "no_data"


def test_analyze_full():
    r = an.analyze([0.6, 0.5, 0.45, 0.4, 0.35], indicator_id="ndvi", higher_is_better=True)
    assert r.latest_value == 0.35
    assert r.n_points == 5
    assert r.severity.cls == "warning"  # 0.35 < 0.40
    assert r.trend.direction == "declining"
