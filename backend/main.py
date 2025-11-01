from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import sqlite3
from pathlib import Path
from typing import List, Optional

DB_PATH = Path(__file__).parent / "campaigns.db"
SQL_SCHEMA = Path(__file__).parent / "create_campaigns.sql"


class Campaign(BaseModel):
    id: int
    name: str
    status: str
    clicks: int
    cost: float
    impressions: int


def get_db_conn():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    # Create DB and seed from SQL file if not exists
    conn = get_db_conn()
    cur = conn.cursor()
    if SQL_SCHEMA.exists():
        sql = SQL_SCHEMA.read_text()
        cur.executescript(sql)
        conn.commit()
    conn.close()


app = FastAPI(title="Campaigns Mock API")

# Allow local frontend and production Vercel deployments to talk to this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://campaign-analytics-dashboard-kbbj.vercel.app",
        "https://*.vercel.app",  # Allow all Vercel preview deployments
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)


@app.on_event("startup")
def startup_event():
    init_db()


@app.get("/campaigns", response_model=List[Campaign])
def list_campaigns(status: Optional[str] = None):
    try:
        conn = get_db_conn()
        cur = conn.cursor()
        if status:
            cur.execute("SELECT * FROM campaigns WHERE status = ? ORDER BY id", (status,))
        else:
            cur.execute("SELECT * FROM campaigns ORDER BY id")
        rows = cur.fetchall()
        campaigns = [Campaign(**dict(r)) for r in rows]
        return campaigns
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        conn.close()
