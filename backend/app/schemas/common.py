from typing import Any
from pydantic import BaseModel

class HealthCheckResponse(BaseModel):
    status: str
    environment: str
    version: str
    timestamp: str

class ReadinessResponse(BaseModel):
    status: str
    database: str
    redis: str
    timestamp: str
