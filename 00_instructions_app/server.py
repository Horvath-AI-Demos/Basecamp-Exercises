"""
Local backend for the Claude Code Workshop app.
Implements all API endpoints to mirror claude-code-workshop.netlify.app
"""
import os
import uuid
import sqlite3
import hashlib
import datetime
import json
from pathlib import Path

import jwt
from fastapi import FastAPI, Request, HTTPException, Depends
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, JSONResponse
from pydantic import BaseModel

BASE_DIR = Path(__file__).parent
DB_PATH = BASE_DIR / "workshop.db"
SECRET_KEY     = os.environ.get("JWT_SECRET",    "913963f15cfefdae56a21a8976f56018b82f8312094eb892cd6f20c9a8b369a1")
ADMIN_PASSWORD = os.environ.get("ADMIN_PASSWORD", "A6N10cg_H7EMWBH6NESeOg")
ADMIN_SECRET   = os.environ.get("ADMIN_SECRET",  "dd9fb921c6c4cd58d72aee29c84532096510abc3fd8cb2415ec4f8ff2443b6d1")

app = FastAPI()


# ── Database ─────────────────────────────────────────────────────────────────

def get_db():
    conn = sqlite3.connect(DB_PATH, check_same_thread=False)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    conn = get_db()
    conn.executescript("""
        CREATE TABLE IF NOT EXISTS workshops (
            id      TEXT PRIMARY KEY,
            alias   TEXT UNIQUE NOT NULL,
            created_at TEXT DEFAULT (datetime('now'))
        );
        CREATE TABLE IF NOT EXISTS users (
            id          TEXT PRIMARY KEY,
            name        TEXT NOT NULL,
            workshop_id TEXT NOT NULL,
            created_at  TEXT DEFAULT (datetime('now')),
            FOREIGN KEY (workshop_id) REFERENCES workshops(id)
        );
        CREATE TABLE IF NOT EXISTS task_completions (
            id          TEXT PRIMARY KEY,
            user_id     TEXT NOT NULL,
            task_id     TEXT NOT NULL,
            points      INTEGER NOT NULL DEFAULT 0,
            completed_at TEXT DEFAULT (datetime('now')),
            UNIQUE(user_id, task_id),
            FOREIGN KEY (user_id) REFERENCES users(id)
        );
    """)
    # Seed the known workshop aliases so participants can join
    for alias in [
        "partner-basecamp-london01",
        "partner-basecamp-london02",
        "partner-basecamp-london03",
        "partner-basecamp-london04",
        "partner-basecamp-london",
        "partner-basecamp",
        "partner",
        "demo",
    ]:
        conn.execute(
            "INSERT OR IGNORE INTO workshops (id, alias) VALUES (?, ?)",
            (str(uuid.uuid4()), alias),
        )
    conn.commit()
    conn.close()


init_db()


# ── JWT helpers ───────────────────────────────────────────────────────────────

def make_token(payload: dict, secret: str = SECRET_KEY) -> str:
    payload = {**payload, "iat": datetime.datetime.utcnow(),
               "exp": datetime.datetime.utcnow() + datetime.timedelta(days=1)}
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


# ── Models ────────────────────────────────────────────────────────────────────

class LoginRequest(BaseModel):
    name: str
    workshop_alias: str

class TaskRequest(BaseModel):
    task_id: str
    points: int = 0

class AdminLoginRequest(BaseModel):
    password: str


# ── API routes ─────────────────────────────────────────────────────────────────

@app.post("/api/login")
async def login(body: LoginRequest):
    name = body.name.strip()
    alias = body.workshop_alias.strip().lower()
    if not name or not alias:
        return JSONResponse({"error": "Name and workshop code are required."})

    conn = get_db()
    # Get or create workshop
    ws = conn.execute("SELECT id FROM workshops WHERE alias = ?", (alias,)).fetchone()
    if not ws:
        ws_id = str(uuid.uuid4())
        conn.execute("INSERT INTO workshops (id, alias) VALUES (?, ?)", (ws_id, alias))
    else:
        ws_id = ws["id"]

    # Get or create user (match by name + workshop)
    user = conn.execute(
        "SELECT id FROM users WHERE name = ? AND workshop_id = ?", (name, ws_id)
    ).fetchone()
    if not user:
        user_id = str(uuid.uuid4())
        conn.execute(
            "INSERT INTO users (id, name, workshop_id) VALUES (?, ?, ?)",
            (user_id, name, ws_id),
        )
    else:
        user_id = user["id"]
    conn.commit()
    conn.close()

    token = make_token({
        "id": user_id,
        "name": name,
        "workshop_id": ws_id,
        "workshop_alias": alias,
    })
    return {"token": token, "name": name, "id": user_id, "workshop_alias": alias}


@app.get("/api/tasks")
async def get_tasks(user=Depends(get_current_user)):
    conn = get_db()
    rows = conn.execute(
        "SELECT task_id, points, completed_at FROM task_completions WHERE user_id = ?",
        (user["id"],),
    ).fetchall()
    conn.close()
    return {"tasks": [dict(r) for r in rows]}


@app.post("/api/tasks/complete")
async def complete_task(body: TaskRequest, user=Depends(get_current_user)):
    conn = get_db()
    conn.execute(
        "INSERT OR REPLACE INTO task_completions (id, user_id, task_id, points) VALUES (?, ?, ?, ?)",
        (str(uuid.uuid4()), user["id"], body.task_id, body.points),
    )
    conn.commit()
    conn.close()
    return {"ok": True}


@app.post("/api/tasks/uncomplete")
async def uncomplete_task(body: TaskRequest, user=Depends(get_current_user)):
    conn = get_db()
    conn.execute(
        "DELETE FROM task_completions WHERE user_id = ? AND task_id = ?",
        (user["id"], body.task_id),
    )
    conn.commit()
    conn.close()
    return {"ok": True}


@app.get("/api/leaderboard")
async def leaderboard(workshop: str = "", user=Depends(get_current_user)):
    if not workshop:
        return JSONResponse({"error": "Workshop parameter is required."}, status_code=400)
    conn = get_db()
    ws = conn.execute("SELECT id FROM workshops WHERE alias = ?", (workshop,)).fetchone()
    if not ws:
        conn.close()
        return {"leaderboard": []}
    rows = conn.execute(
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
    ).fetchall()
    conn.close()
    return {"leaderboard": [dict(r) for r in rows]}


@app.post("/api/admin/login")
async def admin_login(body: AdminLoginRequest):
    if body.password != ADMIN_PASSWORD:
        return JSONResponse({"error": "Invalid admin password."})
    token = make_token({"role": "admin"}, secret=ADMIN_SECRET)
    return {"token": token}


@app.get("/api/admin/workshops")
async def admin_workshops(_admin=Depends(get_admin_user)):
    conn = get_db()
    rows = conn.execute(
        """
        SELECT w.alias,
               COUNT(DISTINCT u.id) AS participant_count
        FROM workshops w
        LEFT JOIN users u ON u.workshop_id = w.id
        GROUP BY w.id
        ORDER BY participant_count DESC, w.alias
        """
    ).fetchall()
    conn.close()
    return {"workshops": [dict(r) for r in rows]}


@app.get("/api/admin/participants")
async def admin_participants(workshop: str = "", _admin=Depends(get_admin_user)):
    conn = get_db()
    where = ""
    params: list = []
    if workshop:
        ws = conn.execute("SELECT id FROM workshops WHERE alias = ?", (workshop,)).fetchone()
        if ws:
            where = "WHERE u.workshop_id = ?"
            params = [ws["id"]]
        else:
            conn.close()
            return {"participants": []}

    rows = conn.execute(
        f"""
        SELECT u.id, u.name, u.workshop_id,
               COALESCE(SUM(tc.points), 0) AS total_points,
               GROUP_CONCAT(tc.task_id)    AS task_ids_csv
        FROM users u
        LEFT JOIN task_completions tc ON tc.user_id = u.id
        {where}
        GROUP BY u.id
        ORDER BY total_points DESC
        """,
        params,
    ).fetchall()
    conn.close()

    participants = []
    for r in rows:
        participants.append({
            "id": r["id"],
            "name": r["name"],
            "workshop_id": r["workshop_id"],
            "total_points": r["total_points"],
            "completed_task_ids": r["task_ids_csv"].split(",") if r["task_ids_csv"] else [],
        })
    return {"participants": participants}


# ── Static files (catch-all, must be last) ────────────────────────────────────

app.mount("/assets", StaticFiles(directory=str(BASE_DIR / "assets")), name="assets")
app.mount("/css",    StaticFiles(directory=str(BASE_DIR / "css")),    name="css")
app.mount("/js",     StaticFiles(directory=str(BASE_DIR / "js")),     name="js")


@app.get("/{full_path:path}")
async def serve_spa(_full_path: str = ""):
    return FileResponse(str(BASE_DIR / "index.html"))
