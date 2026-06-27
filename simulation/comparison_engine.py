from __future__ import annotations

from typing import Dict, Any


DUMMY_COMPARE: Dict[str, Any] = {
    "healthcare": {
        "labels": ["Traditional", "Nuclear"],
        "initCost": [42000000, 60000000],
        "opCost": [7800000, 9500000],
        "efficiency": [72, 81],
        "roi": [8, 18],
        "env": [62, 74],
    }
}


def compare_sector(sector: str) -> Dict[str, Any]:
    return DUMMY_COMPARE.get(sector, DUMMY_COMPARE["healthcare"])
