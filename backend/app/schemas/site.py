# app/schemas/site.py
from pydantic import BaseModel
from typing import Optional

class SiteBase(BaseModel):
    name: str
    address: str

class SiteCreate(SiteBase):
    pass

class SiteUpdate(BaseModel):
    name: Optional[str] = None
    address: Optional[str] = None

class SiteRead(SiteBase):
    id: int
    
    class Config:
        from_attributes = True