from fastapi import APIRouter, HTTPException, status
from app.schemas.readmission import ReadmissionRequest, ReadmissionPredictionResponse
from app.core.responses import StandardResponse, success_response, error_response
from app.services.readmission_service import readmission_service

router = APIRouter()

@router.post("/predict", response_model=StandardResponse[ReadmissionPredictionResponse])
async def predict_readmission(request: ReadmissionRequest):
    """
    Predict 30-day hospital readmission risk for a patient.
    """
    try:
        prediction = readmission_service.predict(request)
        
        if prediction.model_status == "not_configured":
            # Return 503 if model is not configured per requirements
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="Readmission model artifact is not configured. Required: model, preprocessor, and feature schema."
            )
            
        return success_response(data=prediction)
    except HTTPException:
        raise
    except Exception as e:
        # Catch unexpected errors without exposing stack traces
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An internal error occurred during prediction processing."
        )
