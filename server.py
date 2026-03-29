from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
import re
from pathlib import Path
from pytubefix import YouTube
import tempfile
import shutil
from starlette.responses import Response

app = FastAPI()

# Add CORS middleware to allow all origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["content-disposition"]
)

class YouTubeDownloadRequest(BaseModel):
    url: str

# Create downloads directory if it doesn't exist
downloads_dir = Path(os.path.dirname(__file__)) / "downloads"
downloads_dir.mkdir(exist_ok=True)

# Create output directory for MP3 files
output_dir = Path(os.path.dirname(__file__)) / "output"
output_dir.mkdir(exist_ok=True)

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

@app.post("/download-youtube")
async def download_youtube(request: YouTubeDownloadRequest):
    try:
        # Extract video ID from YouTube URL
        video_id_match = re.search(r'(?:youtube\.com/watch\?v=|youtu\.be/|youtube\.com/embed/)([a-zA-Z0-9_-]+)', request.url)
        if not video_id_match:
            raise HTTPException(status_code=400, detail="Invalid YouTube URL")
        
        video_id = video_id_match.group(1)
        
        # Create temporary directory for download
        temp_dir = tempfile.mkdtemp()
        
        try:
            # Download audio using pytubefix
            yt = YouTube(request.url)
            
            # Filter for audio-only streams and get the first one
            audio_stream = yt.streams.filter(only_audio=True).first()
            
            if not audio_stream:
                raise HTTPException(status_code=500, detail="No audio stream found for this video")
            
            # Download the file to temporary directory
            out_file = audio_stream.download(output_path=temp_dir)

 
            # Clean up the title for use as filename (remove invalid characters)
            clean_title = re.sub(r'[<>:"/\\|?*]', '', yt.title)
            clean_title = re.sub(r'\s+', '_', clean_title.strip())
            
            print(f"Clean title: {clean_title}")
            print(f"Original title: {yt.title}")
            
            # Save the file with the YouTube title as filename
            new_file = os.path.join(temp_dir, f"{clean_title}.mp3")
            os.rename(out_file, new_file)
            
            # Return the file for download
            def cleanup():
                shutil.rmtree(temp_dir, ignore_errors=True)
            
            # Read the file content
            with open(new_file, 'rb') as f:
                file_content = f.read()
            
            # Create response with proper headers
            from fastapi.responses import Response
            response = Response(
                content=file_content,
                media_type='audio/mpeg'
            )
            
            # Set headers directly on response object
            content_disposition = f'attachment; filename="{clean_title}.mp3"'
            print(f"Setting content-disposition header: {content_disposition}")
            
            response.headers["content-disposition"] = content_disposition
            response.headers["content-length"] = str(len(file_content))
            
            print(f"Response headers: {dict(response.headers)}")
            
            # Schedule cleanup after response is sent
            import asyncio
            async def delayed_cleanup():
                await asyncio.sleep(5)
                cleanup()
            
            asyncio.create_task(delayed_cleanup())
            
            return response
            
        except Exception as e:
            # Clean up temp directory if download fails
            shutil.rmtree(temp_dir, ignore_errors=True)
            raise HTTPException(status_code=500, detail=f"Download failed: {str(e)}")
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Download failed: {str(e)}")

# SPA fallback - serve index.html for all other routes
@app.get("/{path:path}")
async def spa_fallback(path: str):
    return FileResponse(os.path.join(dist_path, "index.html"))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
