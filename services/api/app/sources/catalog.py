"""Shared reference data: the ASAL counties and the disaster indicators.

The catalog (which locations and indicators exist) is stable and identical across
data sources. Only the observation *values* differ by source. When GeoServer is
wired, it reuses this catalog and swaps in real series.
"""

from __future__ import annotations

from ..schemas import Indicator, LatLon, Location, ValueRange

# 10 ASAL counties. Centroids are approximate lat/lon.
LOCATIONS: list[Location] = [
    Location(id="turkana", name="Turkana", centroid=LatLon(lat=3.12, lon=35.60)),
    Location(id="marsabit", name="Marsabit", centroid=LatLon(lat=2.33, lon=37.99)),
    Location(id="mandera", name="Mandera", centroid=LatLon(lat=3.94, lon=41.87)),
    Location(id="wajir", name="Wajir", centroid=LatLon(lat=1.75, lon=40.06)),
    Location(id="garissa", name="Garissa", centroid=LatLon(lat=-0.45, lon=39.64)),
    Location(id="isiolo", name="Isiolo", centroid=LatLon(lat=0.35, lon=37.58)),
    Location(id="samburu", name="Samburu", centroid=LatLon(lat=1.17, lon=36.95)),
    Location(id="tana_river", name="Tana River", centroid=LatLon(lat=-1.50, lon=39.95)),
    Location(id="makueni", name="Makueni", centroid=LatLon(lat=-2.18, lon=37.62)),
    Location(id="kitui", name="Kitui", centroid=LatLon(lat=-1.37, lon=38.01)),
]

INDICATORS: list[Indicator] = [
    Indicator(
        id="ndvi", name="NDVI", full_name="Normalized Difference Vegetation Index",
        unit="index", category="vegetation", direction="higher_is_better",
        description="Greenness of vegetation. Lower means stressed or bare land.",
        value_range=ValueRange(min=-1, max=1),
    ),
    Indicator(
        id="vci", name="VCI", full_name="Vegetation Condition Index",
        unit="percent", category="vegetation", direction="higher_is_better",
        description="NDVI normalized against historical range. Below 35 signals drought.",
        value_range=ValueRange(min=0, max=100),
    ),
    Indicator(
        id="spi", name="SPI", full_name="Standardized Precipitation Index",
        unit="index", category="drought", direction="higher_is_better",
        description="Rainfall deviation from normal. Negative means dry.",
        value_range=ValueRange(min=-3, max=3),
    ),
    Indicator(
        id="rainfall", name="Rainfall", full_name="Monthly Rainfall",
        unit="mm", category="hydrology", direction="higher_is_better",
        description="Estimated monthly precipitation.",
        value_range=ValueRange(min=0, max=400),
    ),
    Indicator(
        id="flood", name="Flood Extent", full_name="Flood-Affected Area",
        unit="percent", category="hazard", direction="lower_is_better",
        description="Share of county area under standing water. Higher is worse.",
        value_range=ValueRange(min=0, max=100),
    ),
]

LOCATIONS_BY_ID = {loc.id: loc for loc in LOCATIONS}
INDICATORS_BY_ID = {ind.id: ind for ind in INDICATORS}
