from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import FormDefinition, FormSubmission, Branch
from schemas import FormDefinitionCreate, FormDefinitionOut, FormSubmissionCreate, FormSubmissionOut
from uuid import UUID

router = APIRouter()

@router.post("/forms/definitions", response_model=FormDefinitionOut)
def create_form(payload: FormDefinitionCreate, db: Session = Depends(get_db)):
    form = FormDefinition(
        title=payload.title,
        description=payload.description,
        field_schema=payload.field_schema.model_dump()
    )
    db.add(form)
    db.commit()
    db.refresh(form)
    return form

@router.get("/forms/definitions", response_model=list[FormDefinitionOut])
def list_forms(db: Session = Depends(get_db)):
    forms = db.query(FormDefinition).all()
    return forms

@router.get("/forms/definitions/{form_id}", response_model=FormDefinitionOut)
def get_form(form_id: UUID, db: Session = Depends(get_db)):
    form = db.query(FormDefinition).filter(FormDefinition.id == form_id).first()
    if not form:
        raise HTTPException(status_code=404, detail="Form not found")
    return form

@router.post("/forms/{form_id}/submission", response_model=FormSubmissionOut)
def submit_form(form_id: UUID, payload: FormSubmissionCreate, db: Session = Depends(get_db)):
    # 1. Check form exists
    form = db.query(FormDefinition).filter(FormDefinition.id == form_id).first()
    if not form:
        raise HTTPException(status_code=404, detail="Form not found")

    # 2. Check branch exists
    branch = db.query(Branch).filter(Branch.id == payload.branch_id).first()
    if not branch:
        raise HTTPException(status_code=400, detail="Invalid branch_id")

    # 3. Validate submission data against field schema
    fields = form.field_schema.get("fields", [])
    for field in fields:
        fid   = field["id"]
        ftype = field["type"]
        flabel = field.get("label", fid)
        value = payload.submission_data.get(fid)

        # Check required fields
        if field.get("required") and (value is None or value == ""):
            raise HTTPException(
                status_code=422, 
                detail=f"Field '{flabel}' is required"
            )

        # Skip further validation if value is empty/None
        if value is None or value == "":
            continue

        # Type-specific validation
        if ftype == "number":
            try:
                float(value)  # Ensure it's a valid number
            except (ValueError, TypeError):
                raise HTTPException(
                    status_code=422, 
                    detail=f"Field '{flabel}' must be a valid number"
                )
        
        elif ftype == "text":
            if not isinstance(value, str):
                raise HTTPException(
                    status_code=422, 
                    detail=f"Field '{flabel}' must be a text string"
                )
        
        elif ftype == "select" or ftype == "radio_group":
            # Validate against options if using static options
            if field.get("options") and isinstance(field["options"], list):
                if value not in field["options"]:
                    raise HTTPException(
                        status_code=422,
                        detail=f"Field '{flabel}' has invalid value. Must be one of: {', '.join(field['options'])}"
                    )
        
        elif ftype == "video_upload":
            # Validate that it's a valid file path/URL
            if not isinstance(value, str) or not value.startswith("/uploads/"):
                raise HTTPException(
                    status_code=422,
                    detail=f"Field '{flabel}' must be a valid uploaded video file"
                )

    submission = FormSubmission(
        form_id=form_id,
        branch_id=payload.branch_id,
        submission_data=payload.submission_data
    )
    db.add(submission)
    db.commit()
    db.refresh(submission)
    return submission

@router.get("/forms/submissions", response_model=list[FormSubmissionOut])
def list_submissions(db: Session = Depends(get_db)):
    submissions = db.query(FormSubmission).all()
    return submissions
