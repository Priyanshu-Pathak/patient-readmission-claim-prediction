from fastapi import APIRouter
from datetime import datetime, timezone
from app.core.config import settings
from app.core.responses import success_response, StandardResponse
from app.schemas.common import HealthCheckResponse, ReadinessResponse

router = APIRouter()

@router.get("/", response_model=StandardResponse[HealthCheckResponse])
async def health_check():
    """
    Basic health check to ensure the API is running.
    """
    data = HealthCheckResponse(
        status="ok",
        environment=settings.ENVIRONMENT,
        version="1.0.0",
        timestamp=datetime.now(timezone.utc).isoformat()
    )
    return success_response(data=data)

@router.get("/ready", response_model=StandardResponse[ReadinessResponse])
async def readiness_check():
    """
    Check if downstream dependencies (DB, Redis) are ready.
    Currently returns placeholders as full setup is pending.
    """
    data = ReadinessResponse(
        status="ready",
        database="not_checked",
        redis="not_checked",
        timestamp=datetime.now(timezone.utc).isoformat()
    )
    return success_response(data=data)
