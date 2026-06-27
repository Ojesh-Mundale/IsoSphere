from __future__ import annotations

from flask import Blueprint, jsonify, request

from simulation.comparison_engine import compare_sector

compare_api_bp = Blueprint("compare_api_bp", __name__)


@compare_api_bp.post("/compare/run")
def compare_run():
    payload = request.get_json(silent=True) or {}
    sector = payload.get("sector")
    if not sector:
        return jsonify({"error": "sector is required"}), 400

    try:
        return jsonify(compare_sector(sector=sector))
    except Exception as e:
        return jsonify({"error": str(e)}), 500

