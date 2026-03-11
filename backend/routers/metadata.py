from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from models import Branch
from schemas import BranchOut
from typing import List

router = APIRouter()

@router.get("/metadata/branches", response_model=List[BranchOut])
def list_branches(db: Session = Depends(get_db)):
    return db.query(Branch).all()
