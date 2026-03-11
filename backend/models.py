from sqlalchemy import Column, String, Text, Integer, ForeignKey
from sqlalchemy.dialects.postgresql import UUID, JSONB, TIMESTAMP
from sqlalchemy.sql import func
from database import Base
import uuid

class Branch(Base):
    __tablename__ = "branches"
    id         = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name       = Column(String(255), nullable=False)
    location   = Column(String(255), nullable=False)
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now())

class FormDefinition(Base):
    __tablename__ = "form_definitions"
    id           = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title        = Column(String(255), nullable=False)
    description  = Column(Text)
    field_schema = Column(JSONB, nullable=False)
    version      = Column(Integer, default=1)
    created_at   = Column(TIMESTAMP(timezone=True), server_default=func.now())
    updated_at   = Column(TIMESTAMP(timezone=True), server_default=func.now(), onupdate=func.now())

class FormSubmission(Base):
    __tablename__ = "form_submissions"
    id              = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    form_id         = Column(UUID(as_uuid=True), ForeignKey("form_definitions.id"), nullable=False)
    branch_id       = Column(UUID(as_uuid=True), ForeignKey("branches.id"), nullable=False)
    submission_data = Column(JSONB, nullable=False)
    submitted_at    = Column(TIMESTAMP(timezone=True), server_default=func.now())
