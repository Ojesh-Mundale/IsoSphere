from __future__ import annotations

from typing import Any, Dict


# TODO: Replace with JSON-backed knowledge base.
# For now we reuse the same demo numbers used in the frontend.
DUMMY = {
    "healthcare": {
        "MRI Upgrade": {
            "pet": {"invest": 60000000, "op": 9500000, "acc": 0.78, "success": 0.64, "env": -6},
            "mri": {"invest": 50000000, "op": 8500000, "acc": 0.72, "success": 0.58, "env": -4},
            "ct": {"invest": 42000000, "op": 7200000, "acc": 0.66, "success": 0.52, "env": -3},
        }
    },
    "agriculture": {
        "Pest Crop Decline": {
            "chem": {"invest": 9000000, "op": 5200000, "acc": 0.55, "success": 0.48, "env": -18},
            "sit": {"invest": 12500000, "op": 2900000, "acc": 0.62, "success": 0.55, "env": -9},
            "bio": {"invest": 10500000, "op": 2600000, "acc": 0.59, "success": 0.5, "env": -8},
        }
    },
    "food": {
        "Increase Shelf Life": {
            "cold": {"invest": 18000000, "op": 6200000, "acc": 0.68, "success": 0.57, "env": -11},
            "chem": {"invest": 9500000, "op": 4100000, "acc": 0.58, "success": 0.49, "env": -13},
            "irr": {"invest": 14000000, "op": 3600000, "acc": 0.74, "success": 0.61, "env": -7},
        }
    },
    "industry": {
        "Quality Inspection": {
            "manual": {"invest": 7000000, "op": 4800000, "acc": 0.52, "success": 0.4, "env": -4},
            "ultra": {"invest": 9800000, "op": 3600000, "acc": 0.64, "success": 0.52, "env": -6},
            "gamma": {"invest": 13200000, "op": 3000000, "acc": 0.7, "success": 0.58, "env": -7},
        }
    },
    "research": {
        "Isotope Production Planning": {
            "baseline": {"invest": 16000000, "op": 5200000, "acc": 0.6, "success": 0.51, "env": -10},
            "nuclear": {"invest": 21000000, "op": 4100000, "acc": 0.73, "success": 0.63, "env": -7},
            "hybrid": {"invest": 19000000, "op": 3800000, "acc": 0.68, "success": 0.57, "env": -8},
        }
    },
}


def _compute(t: Dict[str, Any]) -> Dict[str, Any]:
    investment_cost = t["invest"]
    operating_cost = t["op"]
    diagnosis_accuracy = t["acc"]
    treatment_success = t["success"]

    annual_benefit = investment_cost * (diagnosis_accuracy * 0.55 + treatment_success * 0.35)
    five_year_return = (annual_benefit * 5 - (investment_cost + operating_cost * 5)) / (
        investment_cost + operating_cost * 5
    )
    economic_benefit = max(0, annual_benefit * 5 - (operating_cost * 5))

    treatment_impact = (diagnosis_accuracy * 60 + treatment_success * 40)

    return {
        "investmentCost": investment_cost,
        "operatingCost": operating_cost,
        "diagnosisAccuracy": diagnosis_accuracy,
        "treatmentSuccess": treatment_success,
        "economicBenefit": economic_benefit,
        "environmentImpact": t["env"],
        "healthcareImpact": round(treatment_impact),
        "fiveYearRoiPct": round(five_year_return * 100),
    }


def run_simulation(sector: str, scenario: str, tech_id: str) -> Dict[str, Any]:
    sector_d = DUMMY.get(sector)
    if not sector_d:
        raise ValueError("Unknown sector")
    scenario_d = sector_d.get(scenario)
    if not scenario_d:
        raise ValueError("Unknown scenario")
    tech = scenario_d.get(tech_id)
    if not tech:
        raise ValueError("Unknown tech_id")
    return _compute(tech)

