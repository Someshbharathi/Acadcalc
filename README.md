# AcadCalc

Modern, responsive starter for **AcadCalc** — a Flask web app ready for local development and deployment on [Render](https://render.com).

## Project layout

```text
Acadcalc/
├── app.py              # Flask app + routes
├── requirements.txt    # Python dependencies
├── runtime.txt         # Python version for Render
├── Procfile            # Render/Heroku-style web process (gunicorn)
├── .gitignore
├── README.md
├── templates/
│   └── index.html
└── static/
    ├── style.css
    ├── script.js
    └── assets/
        ├── images/
        └── icons/
```

## Virtual environment (recommended)

### Windows (PowerShell)

```powershell
cd D:\Projects\Acadcalc
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
pip install -r requirements.txt
```

### macOS / Linux

```bash
cd /path/to/Acadcalc
python3 -m venv .venv
source .venv/bin/activate
python -m pip install --upgrade pip
pip install -r requirements.txt
```

Deactivate anytime with `deactivate`.

## `requirements.txt`

- **Install everything the app needs:** `pip install -r requirements.txt`
- **Refresh after you add packages:** `pip freeze > requirements.txt` (review the file so you do not commit secrets or local-only tools you do not need)

Core dependencies: **Flask**, **gunicorn** (Render), and **livereload** (local browser refresh).

## Run locally (with auto-refresh)

With the virtual environment activated:

```bash
pip install -r requirements.txt
python app.py
```

Then open **http://127.0.0.1:5000**. When you save files in `templates/` or `static/`, the browser refreshes automatically.

| Setting | Default | Purpose |
|--------|---------|---------|
| `PORT` | `5000` | Local server port |
| `FLASK_DEBUG` | `1` | Flask debug mode (error pages, Python reload) |
| `LIVERELOAD` | `1` | Browser auto-refresh (`0` = plain Flask only) |

**Windows (disable livereload):** `set LIVERELOAD=0` then `python app.py`

**macOS / Linux:** `LIVERELOAD=0 python app.py`

## Continuous integration (GitHub Actions)

On every **push** or **pull request** to `main`, the workflow in `.github/workflows/ci.yml` will:

1. Install dependencies from `requirements.txt`
2. Check `app.py` for syntax errors
3. Smoke-test `/` and `/health` with Flask’s test client

After you push to GitHub, open the **Actions** tab to see CI results.

## Deploy on Render (summary)

1. Push this repo to GitHub (or GitLab / Bitbucket).
2. On Render: **New → Web Service**, connect the repo.
3. **Build command:** `pip install -r requirements.txt`
4. **Start command:** Render will use the **`Procfile`** (`web: gunicorn app:app`) if detected; otherwise set **Start command** to `gunicorn app:app` yourself.
5. **Environment:** add `SECRET_KEY` (a long random string). Optionally `FLASK_DEBUG=0`.
6. Render reads **`runtime.txt`** to pick the Python version.

**Note:** Gunicorn targets Linux servers (like Render). On Windows, run the app with `python app.py` or `flask run` for local development.

That is enough for a minimal public deployment; add a database or background workers when your features need them.

## Security note

Never commit API keys or `.env` files. Use Render **Environment** variables for secrets.
