from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from backend.database.session import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    is_active = Column(Boolean, default=True)
    role = Column(String, default="admin")

class Rule(Base):
    __tablename__ = "rules"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    event_type = Column(String, index=True)  # e.g., USB_INSERTED, FILE_MODIFIED
    conditions = Column(JSON)
    actions = Column(JSON)
    enabled = Column(Boolean, default=True)

class Event(Base):
    __tablename__ = "events"
    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    event_type = Column(String, index=True)
    source = Column(String)  # e.g., FileWatcher, USBWatcher
    details = Column(JSON)
    severity = Column(String, default="info")

class AuditLog(Base):
    __tablename__ = "audit_logs"
    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    action = Column(String)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    details = Column(JSON)
    user = relationship("User")
