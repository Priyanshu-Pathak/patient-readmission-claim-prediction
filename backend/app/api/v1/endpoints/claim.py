from fastapi import APIRouter, HTTPException, status
from app.schemas.claim import ClaimRequest, ClaimPredictionResponse
from app.core.responses import StandardResponse, success_response, error_response
from app.services.claim_service import claim_service

router = APIRouter()

@router.post("/predict", response_model=StandardResponse[ClaimPredictionResponse])
async def predict_claim(request: ClaimRequest):
    """
    Predict total claim amount for a patient encounter.
    """
    try:
        prediction = claim_service.predict(request)
        
        if prediction.model_status == "not_configured":
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="Claim model artifact is not configured."
            )
            
        return success_response(data=prediction)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An internal error occurred during claim prediction."
        )
