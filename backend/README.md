# Campaigns Mock API (FastAPI)

This is a minimal FastAPI backend that serves a mock `campaigns` endpoint backed by a local SQLite database (for simplicity). The repository also includes `create_campaigns.sql` which contains the SQL schema and 10 sample rows.

Run locally (recommended):

1. Create a virtual environment and install requirements:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

2. Start the server:

```powershell
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

3. Open the API docs in your browser:

http://localhost:8000/docs

Notes:
- The code uses SQLite at `backend/campaigns.db` and seeds the table on startup from `create_campaigns.sql`.
- For production you can switch to PostgreSQL and run the included SQL script against your Postgres DB.

Troubleshooting
-----------------
- If you see an error about Pydantic "ForwardRef._evaluate() missing 1 required keyword-only argument: 'recursive_guard'" when starting uvicorn, it's caused by an incompatible Pydantic version (Pydantic v1 vs v2). This repo pins Pydantic to v2 in `requirements.txt`.

To fix (PowerShell):

```powershell
# from backend folder
.\.venv\Scripts\Activate.ps1   # activate your venv if you created one
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The key point: use Pydantic v2 with FastAPI 0.99+. The `requirements.txt` in this folder already pins `pydantic==2.5.2`.
