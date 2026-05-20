"""
Local development server — serves both static files and the API on one port.
Usage:  python run_local.py
"""
import sys
from pathlib import Path

import uvicorn
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

# Import the API app
sys.path.insert(0, str(Path(__file__).parent))
from api.index import app

BASE = Path(__file__).parent

# Mount static dirs under the API app
app.mount("/assets", StaticFiles(directory=str(BASE / "public" / "assets")), name="assets")
app.mount("/css",    StaticFiles(directory=str(BASE / "public" / "css")),    name="css")
app.mount("/js",     StaticFiles(directory=str(BASE / "public" / "js")),     name="js")


@app.get("/{full_path:path}", include_in_schema=False)
async def serve_spa(full_path: str = ""):
    return FileResponse(str(BASE / "public" / "index.html"))


if __name__ == "__main__":
    uvicorn.run("run_local:app", host="0.0.0.0", port=8080, reload=True)
