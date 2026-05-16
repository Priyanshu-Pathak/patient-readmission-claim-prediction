from fastapi import APIRouter
from app.api.v1.endpoints import health, readmission, claim, analytics

api_router = APIRouter()
api_router.include_router(health.router, prefix="/health", tags=["health"])
api_router.include_router(readmission.router, prefix="/readmission", tags=["readmission"])
api_router.include_router(claim.router, prefix="/claim", tags=["claim"])
api_router.include_router(analytics.router, prefix="/analytics", tags=["analytics"])
