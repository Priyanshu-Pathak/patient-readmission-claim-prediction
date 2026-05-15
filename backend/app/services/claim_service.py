from typing import Optional, Dict, Any
from datetime import datetime, timezone
import logging
from pathlib import Path
import joblib
import pandas as pd

from app.core.config import settings, PROJECT_ROOT
from app.schemas.claim import ClaimRequest, ClaimPredictionResponse

logger = logging.getLogger(__name__)

class ClaimService:
    def __init__(self):
        path = Path(settings.CLAIM_MODEL_PATH)
        self.model_path = path if path.is_absolute() else PROJECT_ROOT / path
        self.model_loaded = False
        self.model = None

        self._initialize_model()

    def _initialize_model(self):
        try:
            if Path(self.model_path).exists():
                self.model = joblib.load(self.model_path)
                self.model_loaded = True
                logger.info("Successfully loaded claim model.")
            else:
                logger.info(f"Model artifacts not found at {self.model_path}. Service will run in 'not_configured' mode.")
        except Exception as e:
            logger.error(f"Failed to load claim model: {e}")

    def predict(self, request: ClaimRequest) -> ClaimPredictionResponse:
        if not self.model_loaded:
            return ClaimPredictionResponse(
                predicted_claim_amount=0.0,
                model_status="not_configured",
                confidence_note="Claim model artifact is missing. Prediction cannot be fulfilled.",
                timestamp=datetime.now(timezone.utc).isoformat()
            )

        try:
            req_dict = request.model_dump(by_alias=True)
            df = pd.DataFrame([req_dict])
            
            # Predict
            predicted_claim_amount = float(self.model.predict(df)[0])
            
            return ClaimPredictionResponse(
                predicted_claim_amount=predicted_claim_amount,
                model_status="active",
                confidence_note="Regression prediction successful.",
                timestamp=datetime.now(timezone.utc).isoformat()
            )
        except Exception as e:
            logger.error(f"Claim prediction processing error: {e}")
            raise

claim_service = ClaimService()
