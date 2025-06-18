# app/schemas/media.py
from pydantic import BaseModel
from typing import List

class MediaFile(BaseModel):
    filename: str
    site_name: str

class MediaList(BaseModel):
    files: List[MediaFile]