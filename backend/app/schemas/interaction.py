from pydantic import BaseModel
from datetime import datetime
from typing import Optional

# Base properties shared across creation and reading
class InteractionBase(BaseModel):
    hcp_name: str
    discussion_topic: Optional[str] = None
    summary: Optional[str] = None
    next_steps: Optional[str] = None

# What the frontend sends when filling out the standard form manually
class InteractionCreate(InteractionBase):
    pass

# What the API returns back to the frontend
class InteractionResponse(InteractionBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

# Schema for the chat endpoint
class ChatRequest(BaseModel):
    message: str