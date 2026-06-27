from __future__ import annotations

from typing import Any, Dict

from services.ollama_client import chat


SYSTEM_PROMPT = (
    "You are IsoSphere AI Advisor, an expert decision intelligence assistant. "
    "Explain the economics of non-energy nuclear technologies clearly and concisely. "
    "Use a structured response with headings: Summary, Economic Analysis, Advantages, "
    "Limitations, Recommendations. Avoid long paragraphs."
)


def _safe_context(context: Any) -> Dict[str, Any]:
    """Ensure prompt context cannot crash prompt building."""
    if not isinstance(context, dict):
        return {"raw": str(context)}

    safe: Dict[str, Any] = {}
    for k, v in context.items():
        try:
            # Keep as-is when possible; at minimum ensure it can be stringified.
            _ = str(v)
            safe[k] = v
        except Exception:
            safe[k] = str(v)

    return safe


def build_prompt(context: Dict[str, Any], question: str) -> str:
    context = _safe_context(context)
    return (
        f"User question:\n{question}\n\n"
        f"Context (JSON):\n{context}\n\n"
        "Now produce the structured response as requested."
    )


def explain_with_ai(model: str, context: Dict[str, Any], question: str) -> str:
    prompt = build_prompt(context=context, question=question)
    return chat(model=model, prompt=prompt, system=SYSTEM_PROMPT)


# Backwards-compatible alias (some code imports this name)
explain_with_ai = explain_with_ai


