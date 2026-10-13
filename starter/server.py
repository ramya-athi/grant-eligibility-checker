"""Serves the built Green Home Grant checker (the Vite build in dist/) on 0.0.0.0:5002 (override with the PORT environment variable).

Build first with `npm run build`, then start with `python3 server.py`.
Any address that is not a built file (and not under /assets/) gets index.html, so reloads and typed
addresses such as /income work.
"""
import os
from pathlib import Path

from flask import Flask, abort, send_from_directory

DIST = Path(__file__).resolve().parent / "dist"

app = Flask(__name__, static_folder=None)


@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve(path):
    if not DIST.is_dir():
        abort(503, description="The front end has not been built. Run `npm run build` first.")
    requested = DIST / path
    if path and requested.is_file():
        return send_from_directory(DIST, path)
    if path.startswith("assets/"):
        abort(404)
    return send_from_directory(DIST, "index.html")


if __name__ == "__main__":
    # Default 5002; set PORT=5000 to run on the port the lab "app" address expects.
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 5002)))
