from pydantic import BaseModel, field_validator
from typing import Any, Optional, List, Literal
from uuid import UUID
from datetime import datetime

# ---------- Branch ----------
class BranchOut(BaseModel):
    id: UUID
    name: str
    location: str

    class Config:
        from_attributes = True

# ---------- Field Schema Types ----------
class LogicRule(BaseModel):
    when: str
    operator: Literal["eq", "neq", "gte", "lte", "gt", "lt"]
    value: Any
    action: Literal["show", "hide", "require", "highlight"]
    color: Optional[str] = None

class FieldDefinition(BaseModel):
    id: str
    label: str
    type: Literal["text", "number", "select", "radio_group", "video_upload"]
    required: bool = False
    options: Optional[List[str]] = None        # for static select / radio_group
    dataSource: Optional[str] = None           # e.g. "/metadata/branches"
    logicRules: Optional[List[LogicRule]] = [] # bonus logic engine rules

class FieldSchemaBody(BaseModel):
    fields: List[FieldDefinition]

# ---------- Form Definition ----------
class FormDefinitionCreate(BaseModel):
    title: str
    description: Optional[str] = None
    field_schema: FieldSchemaBody

class FormDefinitionOut(BaseModel):
    id: UUID
    title: str
    description: Optional[str]
    field_schema: dict
    version: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# ---------- Form Submission ----------
class FormSubmissionCreate(BaseModel):
    branch_id: UUID
    submission_data: dict[str, Any]

class FormSubmissionOut(BaseModel):
    id: UUID
    form_id: UUID
    branch_id: UUID
    submission_data: dict
    submitted_at: datetime

    class Config:
        from_attributes = True
