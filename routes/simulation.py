from flask import Blueprint, render_template

simulation_bp = Blueprint("simulation_bp", __name__)


@simulation_bp.get("/")
def simulation():
    return render_template("simulation.html")

