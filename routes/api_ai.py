from __future__ import annotations

import os

from flask import Blueprint, jsonify, request

from services.ai_advisor_service import explain_with_ai

ai_api_bp = Blueprint("ai_api_bp", __name__)


@ai_api_bp.post("/ai/explain")
def ai_explain():
    payload = request.get_json(silent=True) or {}
    question = (payload.get("question") or "").strip()
    context = payload.get("context") or {}

    # Match installed Ollama model (adjust if you change models).
    model = os.getenv("OLLAMA_MODEL", "llama3")

    if not question:
        return jsonify({"error": "Missing question"}), 400

    try:
        text = explain_with_ai(model=model, context=context, question=question)
    except Exception as e:
        return jsonify({
            "error": str(e),
            "error_type": e.__class__.__name__,
        }), 500


    return jsonify({"text": text})

