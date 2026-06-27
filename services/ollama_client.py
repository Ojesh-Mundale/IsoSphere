import json
import os
from typing import Any, Dict, Optional

import requests


def get_ollama_base_url() -> str:
    return os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")


def chat(model: str, prompt: str, system: Optional[str] = None, timeout_s: int = 120) -> str:
    """Call local Ollama and return assistant content.

    Tries /api/chat first, then falls back to /api/generate for compatibility
    across Ollama versions / proxies.
    """

    base = get_ollama_base_url().rstrip('/')
    url_chat = f"{base}/api/chat"
    url_generate = f"{base}/api/generate"

    # ---- Try /api/chat first ----
    payload_chat: Dict[str, Any] = {
        "model": model,
        "messages": [],
        "stream": False,
    }
    if system:
        payload_chat["messages"].append({"role": "system", "content": system})
    payload_chat["messages"].append({"role": "user", "content": prompt})

    try:
        resp = requests.post(url_chat, json=payload_chat, timeout=timeout_s)
        # If the endpoint doesn't exist, this is often a 404/405.
        resp.raise_for_status()

        try:
            data = resp.json()
        except Exception:
            return resp.text

        if isinstance(data, dict):
            message = data.get("message") or {}
            content = message.get("content")
            if content:
                return content

        return json.dumps(data, ensure_ascii=False)

    except requests.RequestException as e:
        # Fall back to /api/generate on connection resets, 404/405, etc.
        last_err = e

    # ---- Fallback to /api/generate ----
    # Ollama /api/generate expects a single prompt string.
    joined_prompt = prompt
    if system:
        joined_prompt = f"{system}\n\n{prompt}"

    payload_generate: Dict[str, Any] = {
        "model": model,
        "prompt": joined_prompt,
        "stream": False,
    }

    resp2 = requests.post(url_generate, json=payload_generate, timeout=timeout_s)
    resp2.raise_for_status()

    try:
        data2 = resp2.json()
    except Exception:
        return resp2.text

    # Ollama generate typically returns {"response": "...", ...}
    if isinstance(data2, dict):
        content2 = data2.get("response") or data2.get("message")
        if isinstance(content2, str) and content2.strip():
            return content2
        if isinstance(data2.get("message"), dict):
            c3 = data2["message"].get("content")
            if isinstance(c3, str) and c3.strip():
                return c3

        # If Ollama returned an error object, surface it.
        if data2.get("error"):
            return str(data2.get("error"))

    # Final fallback
    try:
        return resp2.text
    except Exception:
        return json.dumps(data2, ensure_ascii=False)



