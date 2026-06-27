from flask import Blueprint, render_template

compare_bp = Blueprint("compare_bp", __name__)


@compare_bp.get("/")
def compare():
    return render_template("compare.html")

