from typing import Optional, Dict, Any
from datetime import datetime, timezone
import logging
from pathlib import Path
import joblib
import pandas as pd

from app.core.config import settings, PROJECT_ROOT
from app.schemas.readmission import ReadmissionRequest, ReadmissionPredictionResponse

logger = logging.getLogger(__name__)

class ReadmissionService:
    def __init__(self):
        path = Path(settings.READMISSION_MODEL_PATH)
        self.model_path = path if path.is_absolute() else PROJECT_ROOT / path
        self.model_loaded = False
        self.model = None

        self._initialize_model()

    def _initialize_model(self):
        """
        Attempt to load the model lazily.
        Does not crash the app if missing.
        """
        try:
            if Path(self.model_path).exists():
                self.model = joblib.load(self.model_path)
                self.model_loaded = True
                logger.info("Successfully loaded readmission model.")
            else:
                logger.info(f"Model artifacts not found at {self.model_path}. Service will run in 'not_configured' mode.")
        except Exception as e:
            logger.error(f"Failed to load readmission model: {e}")

    def predict(self, request: ReadmissionRequest) -> ReadmissionPredictionResponse:
        """
        Perform risk prediction.
        """
        if not self.model_loaded:
            # Service is not configured with real artifacts yet
            return ReadmissionPredictionResponse(
                risk_label="Unavailable",
                risk_probability=None,
                confidence_note="Model artifacts are missing. Prediction cannot be fulfilled.",
                model_status="not_configured",
                timestamp=datetime.now(timezone.utc).isoformat()
            )

        try:
            # 1. Convert request to DataFrame
            # Pydantic by_alias ensures 'heart_rate' maps to 'heart rate' which the model expects
            req_dict = request.model_dump(by_alias=True)
            df = pd.DataFrame([req_dict])
            
            # 2. Predict probability (assuming class 1 is positive readmission risk)
            probability = float(self.model.predict_proba(df)[0, 1])
            predicted_class = int(self.model.predict(df)[0])
            
            # 3. Define Risk Label
            if probability >= 0.75:
                risk_label = "High"
            elif probability >= 0.40:
                risk_label = "Medium"
            else:
                risk_label = "Low"

            return ReadmissionPredictionResponse(
                risk_label=risk_label,
                risk_probability=probability,
                confidence_note=f"Predicted class: {predicted_class} (Threshold default 0.5)",
                model_status="active",
                timestamp=datetime.now(timezone.utc).isoformat()
            )
        except Exception as e:
            logger.error(f"Prediction processing error: {e}")
            raise

# Singleton instance
readmission_service = ReadmissionService()
