"""
API backend for Claude Code Workshop.
Runs as a Vercel serverless function (Python) or locally via uvicorn.

Storage:
  - Local dev:  SQLite at ./workshop.db  (or /tmp/workshop.db on Vercel)
  - Production: set DATABASE_URL=postgres://... to use PostgreSQL
"""
import os
import uuid
import datetime
from pathlib import Path

import jwt
from fastapi import FastAPI, Request, HTTPException, Depends
from fastapi.responses import JSONResponse
from pydantic import BaseModel

SECRET_KEY   = os.environ.get("JWT_SECRET",    "913963f15cfefdae56a21a8976f56018b82f8312094eb892cd6f20c9a8b369a1")
ADMIN_PW     = os.environ.get("ADMIN_PASSWORD", "A6N10cg_H7EMWBH6NESeOg")
ADMIN_SECRET = os.environ.get("ADMIN_SECRET",  "dd9fb921c6c4cd58d72aee29c84532096510abc3fd8cb2415ec4f8ff2443b6d1")
DATABASE_URL = os.environ.get("DATABASE_URL",  "")

app = FastAPI()

# ── Database layer (SQLite or PostgreSQL) ─────────────────────────────────────

def _sqlite_path() -> str:
    if os.environ.get("VERCEL"):
        return "/tmp/workshop.db"
    return str(Path(__file__).parent.parent / "workshop.db")


if DATABASE_URL and DATABASE_URL.startswith("postgres"):
    import psycopg2
    import psycopg2.extras

    def get_conn():
        return psycopg2.connect(DATABASE_URL, cursor_factory=psycopg2.extras.RealDictCursor)

    def init_db():
        with get_conn() as conn:
            with conn.cursor() as cur:
                cur.execute("""
                    CREATE TABLE IF NOT EXISTS workshops (
                        id TEXT PRIMARY KEY, alias TEXT UNIQUE NOT NULL,
                        created_at TIMESTAMPTZ DEFAULT NOW()
                    );
                    CREATE TABLE IF NOT EXISTS users (
                        id TEXT PRIMARY KEY, name TEXT NOT NULL, workshop_id TEXT NOT NULL,
                        created_at TIMESTAMPTZ DEFAULT NOW(),
                        FOREIGN KEY (workshop_id) REFERENCES workshops(id)
                    );
                    CREATE TABLE IF NOT EXISTS task_completions (
                        id TEXT PRIMARY KEY, user_id TEXT NOT NULL,
                        task_id TEXT NOT NULL, points INT NOT NULL DEFAULT 0,
                        completed_at TIMESTAMPTZ DEFAULT NOW(),
                        UNIQUE(user_id, task_id),
                        FOREIGN KEY (user_id) REFERENCES users(id)
                    );
                """)
                for alias in _default_aliases():
                    cur.execute(
                        "INSERT INTO workshops (id, alias) VALUES (%s, %s) ON CONFLICT DO NOTHING",
                        (str(uuid.uuid4()), alias),
                    )

    def db_fetchone(sql, params=()):
        with get_conn() as conn:
            with conn.cursor() as cur:
                cur.execute(sql.replace("?", "%s"), params)
                row = cur.fetchone()
                return dict(row) if row else None

    def db_fetchall(sql, params=()):
        with get_conn() as conn:
            with conn.cursor() as cur:
                cur.execute(sql.replace("?", "%s"), params)
                return [dict(r) for r in cur.fetchall()]

    def db_execute(sql, params=()):
        with get_conn() as conn:
            with conn.cursor() as cur:
                cur.execute(sql.replace("?", "%s"), params)

else:
    import sqlite3

    def get_conn():
        conn = sqlite3.connect(_sqlite_path(), check_same_thread=False)
        conn.row_factory = sqlite3.Row
        return conn

    def init_db():
        conn = get_conn()
        conn.executescript("""
            CREATE TABLE IF NOT EXISTS workshops (
                id TEXT PRIMARY KEY, alias TEXT UNIQUE NOT NULL,
                created_at TEXT DEFAULT (datetime('now'))
            );
            CREATE TABLE IF NOT EXISTS users (
                id TEXT PRIMARY KEY, name TEXT NOT NULL, workshop_id TEXT NOT NULL,
                created_at TEXT DEFAULT (datetime('now')),
                FOREIGN KEY (workshop_id) REFERENCES workshops(id)
            );
            CREATE TABLE IF NOT EXISTS task_completions (
                id TEXT PRIMARY KEY, user_id TEXT NOT NULL,
                task_id TEXT NOT NULL, points INT NOT NULL DEFAULT 0,
                completed_at TEXT DEFAULT (datetime('now')),
                UNIQUE(user_id, task_id),
                FOREIGN KEY (user_id) REFERENCES users(id)
            );
        """)
        for alias in _default_aliases():
            conn.execute(
                "INSERT OR IGNORE INTO workshops (id, alias) VALUES (?, ?)",
                (str(uuid.uuid4()), alias),
            )
        conn.commit()
        conn.close()

    def db_fetchone(sql, params=()):
        conn = get_conn()
        row = conn.execute(sql, params).fetchone()
        conn.close()
        return dict(row) if row else None

    def db_fetchall(sql, params=()):
        conn = get_conn()
        rows = conn.execute(sql, params).fetchall()
        conn.close()
        return [dict(r) for r in rows]

    def db_execute(sql, params=()):
        conn = get_conn()
        conn.execute(sql, params)
        conn.commit()
        conn.close()


def _default_aliases():
    return [
        "partner-basecamp-london01",
        "partner-basecamp-london02",
        "partner-basecamp-london03",
        "partner-basecamp-london04",
        "partner-basecamp-london",
        "partner-basecamp",
        "partner",
        "demo",
    ]


init_db()


# ── JWT helpers ───────────────────────────────────────────────────────────────

def make_token(payload: dict, secret: str = SECRET_KEY) -> str:
    payload = {
        **payload,
        "iat": datetime.datetime.utcnow(),
        "exp": datetime.datetime.utcnow() + datetime.timedelta(days=1),
    }
    return jwt.encode(payload, secret, algorithm="HS256")


def decode_token(token: str, secret: str = SECRET_KEY) -> dict:
    return jwt.decode(token, secret, algorithms=["HS256"])


def get_current_user(request: Request) -> dict:
    auth = request.headers.get("Authorization", "")
    if not auth.startswith("Bearer "):
        raise HTTPException(401, "Missing token")
    try:
        return decode_token(auth.split(" ", 1)[1])
    except Exception:
        raise HTTPException(401, "Invalid token")


def get_admin_user(request: Request) -> dict:
    auth = request.headers.get("Authorization", "")
    if not auth.startswith("Bearer "):
        raise HTTPException(403, "Admin access required.")
    try:
        payload = decode_token(auth.split(" ", 1)[1], secret=ADMIN_SECRET)
        if payload.get("role") != "admin":
            raise HTTPException(403, "Admin access required.")
        return payload
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(403, "Admin access required.")


# ── Request models ────────────────────────────────────────────────────────────

class LoginRequest(BaseModel):
    name: str
    workshop_alias: str

class TaskRequest(BaseModel):
    task_id: str
    points: int = 0

class AdminLoginRequest(BaseModel):
    password: str


# ── API endpoints ─────────────────────────────────────────────────────────────

@app.post("/api/login")
async def login(body: LoginRequest):
    name = body.name.strip()
    alias = body.workshop_alias.strip().lower()
    if not name or not alias:
        return JSONResponse({"error": "Name and workshop code are required."})

    ws = db_fetchone("SELECT id FROM workshops WHERE alias = ?", (alias,))
    if not ws:
        ws_id = str(uuid.uuid4())
        db_execute("INSERT INTO workshops (id, alias) VALUES (?, ?)", (ws_id, alias))
    else:
        ws_id = ws["id"]

    user = db_fetchone(
        "SELECT id FROM users WHERE name = ? AND workshop_id = ?", (name, ws_id)
    )
    if not user:
        user_id = str(uuid.uuid4())
        db_execute(
            "INSERT INTO users (id, name, workshop_id) VALUES (?, ?, ?)",
            (user_id, name, ws_id),
        )
    else:
        user_id = user["id"]

    token = make_token({
        "id": user_id, "name": name,
        "workshop_id": ws_id, "workshop_alias": alias,
    })
    return {"token": token, "name": name, "id": user_id, "workshop_alias": alias}


@app.get("/api/tasks")
async def get_tasks(user=Depends(get_current_user)):
    rows = db_fetchall(
        "SELECT task_id, points, completed_at FROM task_completions WHERE user_id = ?",
        (user["id"],),
    )
    return {"tasks": rows}


@app.post("/api/tasks/complete")
async def complete_task(body: TaskRequest, user=Depends(get_current_user)):
    db_execute(
        "INSERT OR REPLACE INTO task_completions (id, user_id, task_id, points) VALUES (?, ?, ?, ?)",
        (str(uuid.uuid4()), user["id"], body.task_id, body.points),
    )
    return {"ok": True}


@app.post("/api/tasks/uncomplete")
async def uncomplete_task(body: TaskRequest, user=Depends(get_current_user)):
    db_execute(
        "DELETE FROM task_completions WHERE user_id = ? AND task_id = ?",
        (user["id"], body.task_id),
    )
    return {"ok": True}


@app.get("/api/leaderboard")
async def leaderboard(workshop: str = "", user=Depends(get_current_user)):
    if not workshop:
        return JSONResponse({"error": "Workshop parameter is required."}, status_code=400)
    ws = db_fetchone("SELECT id FROM workshops WHERE alias = ?", (workshop,))
    if not ws:
        return {"leaderboard": []}
    rows = db_fetchall(
        """
        SELECT u.id, u.name, u.workshop_id,
               COALESCE(SUM(tc.points), 0) AS total_points,
               COUNT(tc.task_id)           AS tasks_completed,
               MAX(tc.completed_at)        AS last_activity
        FROM users u
        LEFT JOIN task_completions tc ON tc.user_id = u.id
        WHERE u.workshop_id = ?
        GROUP BY u.id
        ORDER BY total_points DESC
        LIMIT 50
        """,
        (ws["id"],),
    )
    return {"leaderboard": rows}


@app.post("/api/admin/login")
async def admin_login(body: AdminLoginRequest):
    if body.password != ADMIN_PW:
        return JSONResponse({"error": "Invalid admin password."})
    token = make_token({"role": "admin"}, secret=ADMIN_SECRET)
    return {"token": token}


@app.get("/api/admin/workshops")
async def admin_workshops(_admin=Depends(get_admin_user)):
    rows = db_fetchall(
        """
        SELECT w.alias,
               COUNT(DISTINCT u.id) AS participant_count
        FROM workshops w
        LEFT JOIN users u ON u.workshop_id = w.id
        GROUP BY w.id, w.alias
        ORDER BY participant_count DESC, w.alias
        """
    )
    return {"workshops": rows}


@app.get("/api/admin/participants")
async def admin_participants(workshop: str = "", _admin=Depends(get_admin_user)):
    if workshop:
        ws = db_fetchone("SELECT id FROM workshops WHERE alias = ?", (workshop,))
        if not ws:
            return {"participants": []}
        rows = db_fetchall(
            """
            SELECT u.id, u.name, u.workshop_id,
                   COALESCE(SUM(tc.points), 0) AS total_points,
                   GROUP_CONCAT(tc.task_id)    AS task_ids_csv
            FROM users u
            LEFT JOIN task_completions tc ON tc.user_id = u.id
            WHERE u.workshop_id = ?
            GROUP BY u.id
            ORDER BY total_points DESC
            """,
            (ws["id"],),
        )
    else:
        rows = db_fetchall(
            """
            SELECT u.id, u.name, u.workshop_id,
                   COALESCE(SUM(tc.points), 0) AS total_points,
                   GROUP_CONCAT(tc.task_id)    AS task_ids_csv
            FROM users u
            LEFT JOIN task_completions tc ON tc.user_id = u.id
            GROUP BY u.id
            ORDER BY total_points DESC
            """
        )
    participants = []
    for r in rows:
        participants.append({
            "id": r["id"], "name": r["name"], "workshop_id": r["workshop_id"],
            "total_points": r["total_points"],
            "completed_task_ids": r["task_ids_csv"].split(",") if r.get("task_ids_csv") else [],
        })
    return {"participants": participants}
