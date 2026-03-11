from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.staticfiles import StaticFiles
from routers import metadata, forms, uploads
from database import engine, Base
from models import Branch, FormDefinition, FormSubmission
from pathlib import Path

# Create all tables
Base.metadata.create_all(bind=engine)

# Create uploads directory
UPLOAD_DIR = Path("uploads/videos")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

app = FastAPI(title="Safety Form Engine")

# Add compression middleware (compresses responses > 500 bytes)
app.add_middleware(GZipMiddleware, minimum_size=500)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # tighten this in production
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files for video uploads
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

app.include_router(metadata.router)
app.include_router(forms.router)
app.include_router(uploads.router)
