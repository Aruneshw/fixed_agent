from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime

class UserBase(BaseModel):
    email: str
    role: str = "admin"
    is_active: bool = True

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int
    class Config:
        from_attributes = True

class RuleBase(BaseModel):
    name: str
    event_type: str
    conditions: Dict[str, Any]
    actions: List[str]
    enabled: bool = True

class RuleCreate(RuleBase):
    pass

class RuleResponse(RuleBase):
    id: int
    class Config:
        from_attributes = True

class EventBase(BaseModel):
    event_type: str
    source: str
    details: Dict[str, Any]
    severity: str = "info"

class EventCreate(EventBase):
    pass

class EventResponse(EventBase):
    id: int
    timestamp: datetime
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str
