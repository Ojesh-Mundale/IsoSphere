from __future__ import annotations

from flask import Blueprint, jsonify, request

from simulation.engine import run_simulation

simulation_api_bp = Blueprint("simulation_api_bp", __name__)


@simulation_api_bp.post("/simulation/run")
def simulation_run():
    payload = request.get_json(silent=True) or {}
    sector = payload.get("sector")
    scenario = payload.get("scenario")
    tech_id = payload.get("tech_id")

    if not sector or not scenario or not tech_id:
        return jsonify({"error": "sector, scenario, tech_id are required"}), 400

    try:
        result = run_simulation(sector=sector, scenario=scenario, tech_id=tech_id)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

    return jsonify(result)

