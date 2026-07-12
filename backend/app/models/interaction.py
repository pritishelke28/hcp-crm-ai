from sqlalchemy import Column, Integer, String, Text, DateTime
from sqlalchemy.ext.declarative import declarative_base
import datetime

Base = declarative_base()

class HCPInteraction(Base):
    __tablename__ = "hcp_interactions"
    
    id = Column(Integer, primary_key=True, index=True)
    hcp_name = Column(String(100), nullable=False)
    discussion_topic = Column(String(255))
    summary = Column(Text)
    next_steps = Column(Text)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    