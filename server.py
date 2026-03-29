from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import os

app = FastAPI()

# Get the absolute path to the dist directory
dist_path = os.path.join(os.path.dirname(__file__), "dist")

# Mount static files from dist directory
app.mount("/assets", StaticFiles(directory=os.path.join(dist_path, "assets")), name="assets")
app.mount("/icons", StaticFiles(directory=os.path.join(dist_path, "icons")), name="icons")

@app.get("/music.svg")
async def get_music_svg():
    return FileResponse(os.path.join(dist_path, "music.svg"))

@app.get("/sw.js")
async def get_service_worker():
    return FileResponse(os.path.join(dist_path, "sw.js"))

@app.get("/manifest.json")
async def get_manifest():
    return FileResponse(os.path.join(dist_path, "manifest.json"))

# SPA fallback - serve index.html for all other routes
@app.get("/{path:path}")
async def spa_fallback(path: str):
    return FileResponse(os.path.join(dist_path, "index.html"))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
