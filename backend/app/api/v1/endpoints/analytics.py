from typing import Optional
from fastapi import APIRouter, HTTPException, status, Query

from app.schemas.analytics import AnalyticsSummary, AnalyticsExploreResponse
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

@router.get("/explore", response_model=StandardResponse[AnalyticsExploreResponse])
async def get_analytics_explore(
    state: Optional[str] = Query(None, description="Filter by state abbreviation (e.g., CA)"),
    condition: Optional[str] = Query(None, description="Filter by HRRP measure code"),
    top_n: int = Query(10, description="Number of top outliers to return", ge=1, le=100)
):
    """
    Returns dynamically filtered hospital benchmarking statistics for the
    interactive dashboard.
    """
    explore_data = analytics_service.get_explore_data(state=state, condition=condition, top_n=top_n)

    if explore_data is None:
        error_detail = (
            analytics_service.load_error
            or "HRRP analytics data is unavailable. Ensure hrrp_readmissions.csv is present."
        )
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=error_detail,
        )

    return success_response(
        data=explore_data,
        meta={
            "data_type": "aggregate_hospital_benchmarking",
            "source": "CMS HRRP (static historical data)",
            "period": "Jul 2019 – Jun 2022",
            "patient_level": False,
            "ml_model_output": False,
            "filters_applied": {
                "state": state,
                "condition": condition,
                "top_n": top_n
            }
        },
    )
