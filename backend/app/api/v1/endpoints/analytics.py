from fastapi import APIRouter, HTTPException, status

from app.schemas.analytics import AnalyticsSummary
from app.core.responses import StandardResponse, success_response
from app.services.analytics_service import analytics_service

router = APIRouter()


@router.get("/summary", response_model=StandardResponse[AnalyticsSummary])
async def get_analytics_summary():
    """
    Returns aggregate hospital benchmarking statistics derived from the
    CMS Hospital Readmissions Reduction Program (HRRP) dataset.

    This endpoint serves static historical aggregate data.
    It is NOT patient-level prediction, NOT insurance claim estimation,
    and NOT real-time monitoring. The data covers the period Jul 2019 – Jun 2022.
    """
    summary = analytics_service.get_summary()

    if summary is None:
        error_detail = (
            analytics_service.load_error
            or "HRRP analytics data is unavailable. Ensure hrrp_readmissions.csv is present."
        )
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=error_detail,
        )

    return success_response(
        data=summary,
        meta={
            "data_type": "aggregate_hospital_benchmarking",
            "source": "CMS HRRP (static historical data)",
            "period": "Jul 2019 – Jun 2022",
            "patient_level": False,
            "ml_model_output": False,
        },
    )
