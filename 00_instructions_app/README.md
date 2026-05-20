# Claude Code Workshop — Self-hosted

A full local/self-hosted clone of [claude-code-workshop.netlify.app](https://claude-code-workshop.netlify.app/).

## Structure

```
00_instructions_app/
├── public/              # Static frontend (HTML/CSS/JS/assets)
│   ├── index.html
│   ├── css/styles.css
│   ├── js/app.js
│   ├── js/tasks-data.js
│   └── assets/
├── api/
│   └── index.py         # FastAPI backend (also the Vercel serverless function)
├── vercel.json          # Vercel deployment config
├── requirements.txt     # Python dependencies
└── run_local.py         # Local dev launcher (API + static on one port)
```

## Local development

```bash
pip install -r requirements.txt
python run_local.py
# → http://localhost:8080
```

## Deploy to Vercel

1. Push this folder to a GitHub repo (or use the Vercel CLI directly).
2. Import the project in [vercel.com](https://vercel.com) — point root to this folder.
3. Set environment variables:

| Variable | Required | Description |
|---|---|---|
| `JWT_SECRET` | Yes | Random 32+ char string for user tokens |
| `ADMIN_SECRET` | Yes | Random 32+ char string for admin tokens |
| `ADMIN_PASSWORD` | Yes | Password for the admin panel |
| `DATABASE_URL` | Optional | `postgres://...` for persistent storage; omit to use SQLite in `/tmp` |

> **Note on persistence:** Vercel serverless functions have ephemeral `/tmp` storage — data resets between cold starts. For a real workshop with persistent leaderboards, set `DATABASE_URL` to a [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres) or [Supabase](https://supabase.com) connection string and uncomment `psycopg2-binary` in `requirements.txt`.

```bash
# One-command deploy (Vercel CLI)
npm i -g vercel
vercel --prod
```

## Workshop codes (default seeded)

- `partner-basecamp-london01` through `london04`
- `partner-basecamp-london`
- `partner-basecamp`
- `partner`
- `demo`

Add more by inserting into the `workshops` table, or by simply having participants log in with any alias (the backend auto-creates unknown codes).
