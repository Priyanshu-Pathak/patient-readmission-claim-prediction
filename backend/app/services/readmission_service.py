from typing import Optional
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
        Lazily load the model pipeline at startup.
        Returns clean 503 if artifacts are missing rather than crashing.
        """
        try:
            if self.model_path.exists():
                self.model = joblib.load(self.model_path)
                self.model_loaded = True
                logger.info("Readmission model loaded from %s", self.model_path)
            else:
                logger.info(
                    "Readmission model artifact not found at %s. "
                    "Service running in not_configured mode.",
                    self.model_path,
                )
        except Exception as exc:
            logger.error("Failed to load readmission model: %s", exc)

    def predict(self, request: ReadmissionRequest) -> ReadmissionPredictionResponse:
        """Run readmission risk prediction."""
        if not self.model_loaded:
            return ReadmissionPredictionResponse(
                risk_label="Unavailable",
                risk_probability=None,
                predicted_class=None,
                threshold=0.5,
                confidence_note="Model artifacts are missing. Train the model first.",
                model_status="not_configured",
                timestamp=datetime.now(timezone.utc).isoformat(),
            )

        try:
            # Build DataFrame from request
            # admission_type_id and admission_source_id must be strings (cast in training)
            req_dict = request.model_dump()
            req_dict["admission_type_id"] = str(req_dict["admission_type_id"])
            req_dict["admission_source_id"] = str(req_dict["admission_source_id"])

            df = pd.DataFrame([req_dict])

            # Predict
            probability = float(self.model.predict_proba(df)[0, 1])
            predicted_class = int(self.model.predict(df)[0])

            # Risk label thresholds
            if probability >= 0.60:
                risk_label = "High"
            elif probability >= 0.35:
                risk_label = "Medium"
            else:
                risk_label = "Low"

            return ReadmissionPredictionResponse(
                risk_label=risk_label,
                risk_probability=round(probability, 4),
                predicted_class=predicted_class,
                threshold=0.5,
                confidence_note=(
                    f"Predicted class: {predicted_class} at threshold 0.5. "
                    "Model: LogisticRegression(class_weight='balanced')."
                ),
                model_status="active",
                timestamp=datetime.now(timezone.utc).isoformat(),
            )

        except Exception as exc:
            logger.error("Prediction processing error: %s", exc)
            raise


# Singleton
readmission_service = ReadmissionService()
