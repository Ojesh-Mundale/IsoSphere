from flask import Flask

from routes.home import home_bp
from routes.dashboard import dashboard_bp
from routes.simulation import simulation_bp
from routes.compare import compare_bp
from routes.ai_advisor import ai_advisor_bp
from routes.reports import reports_bp
from routes.about import about_bp

from routes.api_simulation import simulation_api_bp
from routes.api_compare import compare_api_bp
from routes.api_ai import ai_api_bp



def create_app() -> Flask:
    app = Flask(__name__, template_folder="templates", static_folder="static")

    # Blueprints
    app.register_blueprint(home_bp, url_prefix="")
    app.register_blueprint(dashboard_bp, url_prefix="/dashboard")
    app.register_blueprint(simulation_bp, url_prefix="/simulation")
    app.register_blueprint(compare_bp, url_prefix="/compare")
    app.register_blueprint(ai_advisor_bp, url_prefix="/ai")
    app.register_blueprint(reports_bp, url_prefix="/reports")
    app.register_blueprint(about_bp, url_prefix="/about")

    # API Blueprints
    app.register_blueprint(simulation_api_bp)
    app.register_blueprint(compare_api_bp)
    app.register_blueprint(ai_api_bp)


    @app.get("/healthz")
    def healthz():
        return {"status": "ok"}

    return app


if __name__ == "__main__":
    app = create_app()
    app.run(host="0.0.0.0", port=5000, debug=True)

