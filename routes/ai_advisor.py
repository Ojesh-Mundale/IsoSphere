from flask import Blueprint, render_template

ai_advisor_bp = Blueprint("ai_advisor_bp", __name__)


@ai_advisor_bp.get("/")
def ai_advisor():
    return render_template("ai_advisor.html")

