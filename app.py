"""
AcadCalc — Flask application entry point.

Run locally:  python app.py          (livereload + debug on port 5000)
Production:   gunicorn app:app       (Render — no livereload)
"""

import os

from flask import Flask, render_template

# Project root (folder that contains app.py)
BASE_DIR = os.path.dirname(os.path.abspath(__file__))


def create_app() -> Flask:
    """Application factory (easy to extend with blueprints and config later)."""
    app = Flask(__name__)

    # Production: set SECRET_KEY in Render dashboard or a .env file (never commit secrets).
    app.config["SECRET_KEY"] = os.environ.get("SECRET_KEY", "dev-only-change-me")
    app.config["JSON_SORT_KEYS"] = False

    @app.route("/")
    def index() -> str:
        """Serve the main AcadCalc page."""
        return render_template("index.html")

    @app.route("/health")
    def health() -> tuple[str, int]:
        """Simple health check for uptime monitors (optional)."""
        return "ok", 200

    return app


# Gunicorn on Render imports this object — livereload is never started in production.
app = create_app()


def run_dev_server() -> None:
    """
    Local development only.
    - livereload: browser refreshes when HTML, CSS, or JS changes
    - Flask debug: helpful error pages; reloads when Python files change
    """
    from livereload import Server

    port = int(os.environ.get("PORT", 5000))
    debug = os.environ.get("FLASK_DEBUG", "1") == "1"
    app.debug = debug

    server = Server(app.wsgi_app)

    # Watch templates, static assets, and app code
    server.watch(os.path.join(BASE_DIR, "templates"))
    server.watch(os.path.join(BASE_DIR, "static"))
    server.watch(os.path.join(BASE_DIR, "app.py"))

    print(f"\n  AcadCalc dev server → http://127.0.0.1:{port}")
    print("  Auto-refresh: templates/ and static/ (save a file to test)")
    print("  Press Ctrl+C to stop\n")

    server.serve(port=port, host="0.0.0.0", debug=debug)


if __name__ == "__main__":
    # LIVERELOAD=0 uses plain Flask (no browser refresh). Default is on for local dev.
    if os.environ.get("LIVERELOAD", "1") == "1":
        try:
            run_dev_server()
        except ImportError:
            print("livereload not installed. Run: pip install livereload")
            port = int(os.environ.get("PORT", 5000))
            debug = os.environ.get("FLASK_DEBUG", "1") == "1"
            app.run(host="0.0.0.0", port=port, debug=debug)
    else:
        port = int(os.environ.get("PORT", 5000))
        debug = os.environ.get("FLASK_DEBUG", "1") == "1"
        app.run(host="0.0.0.0", port=port, debug=debug)
