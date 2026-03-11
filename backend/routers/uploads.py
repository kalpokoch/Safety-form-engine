from fastapi import APIRouter, UploadFile, File, HTTPException
from pathlib import Path
import uuid
import os

router = APIRouter()

# Create uploads directory if it doesn't exist
UPLOAD_DIR = Path("uploads/videos")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

# Allowed video extensions
ALLOWED_EXTENSIONS = {".mp4", ".avi", ".mov", ".wmv", ".flv", ".webm", ".mkv"}
MAX_FILE_SIZE = 100 * 1024 * 1024  # 100MB

@router.post("/upload/video")
async def upload_video(file: UploadFile = File(...)):
    """
    Upload a video file
    Returns the file path that can be used in form submissions
    """
    
    # Validate file extension
    file_ext = Path(file.filename).suffix.lower()
    if file_ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid file type. Allowed: {', '.join(ALLOWED_EXTENSIONS)}"
        )
    
    # Generate unique filename
    unique_filename = f"{uuid.uuid4()}{file_ext}"
    file_path = UPLOAD_DIR / unique_filename
    
    # Save file in chunks to handle large files
    try:
        total_size = 0
        with open(file_path, "wb") as buffer:
            while chunk := await file.read(8192):  # Read in 8KB chunks
                total_size += len(chunk)
                if total_size > MAX_FILE_SIZE:
                    # Remove partially written file
                    os.remove(file_path)
                    raise HTTPException(
                        status_code=413,
                        detail="File too large. Maximum size is 100MB"
                    )
                buffer.write(chunk)
        
        return {
            "filename": unique_filename,
            "original_filename": file.filename,
            "path": f"/uploads/videos/{unique_filename}",
            "size": total_size
        }
    
    except Exception as e:
        # Clean up file if something went wrong
        if file_path.exists():
            os.remove(file_path)
        raise HTTPException(status_code=500, detail=f"File upload failed: {str(e)}")

@router.get("/uploads/videos/{filename}")
async def get_video(filename: str):
    """
    Retrieve uploaded video file
    """
    file_path = UPLOAD_DIR / filename
    
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="Video not found")
    
    from fastapi.responses import FileResponse
    return FileResponse(
        file_path,
        media_type="video/mp4",
        filename=filename
    )
