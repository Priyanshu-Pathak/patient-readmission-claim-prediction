from datetime import datetime, timezone
import logging
from pathlib import Path
import joblib
import pandas as pd
import json

from app.core.config import settings, PROJECT_ROOT
from app.schemas.claim import ClaimRequest, ClaimPredictionResponse

logger = logging.getLogger(__name__)


class ClaimService:
    def __init__(self):
        path = Path(settings.CLAIM_MODEL_PATH)
        self.model_path = path if path.is_absolute() else PROJECT_ROOT / path
        self.model_loaded = False
        self.model = None
        self.baseline_context = None
        self._initialize_model()
        self._load_baseline()

    def _load_baseline(self):
        try:
            baseline_path = PROJECT_ROOT / "ml" / "artifacts" / "claim_baseline_summary.json"
            if baseline_path.exists():
                with open(baseline_path, "r") as f:
                    self.baseline_context = json.load(f)
                logger.info("Claim baseline loaded.")
        except Exception as exc:
            logger.error("Failed to load baseline: %s", exc)

    def _initialize_model(self):
        """
        Lazily load the model pipeline at startup.
        Returns clean 503 if artifacts are missing rather than crashing.
        """
        try:
            if self.model_path.exists():
                self.model = joblib.load(self.model_path)
                self.model_loaded = True
                logger.info("Claim model loaded from %s", self.model_path)
            else:
                logger.info(
                    "Claim model artifact not found at %s. "
                    "Service running in not_configured mode.",
                    self.model_path,
                )
        except Exception as exc:
            logger.error("Failed to load claim model: %s", exc)

    def predict(self, request: ClaimRequest) -> ClaimPredictionResponse:
        """Run claim amount regression prediction."""
        if not self.model_loaded:
            return ClaimPredictionResponse(
                predicted_claim_amount=0.0,
                model_status="not_configured",
                confidence_note="Claim model artifact is missing. Train the model first.",
                timestamp=datetime.now(timezone.utc).isoformat(),
                baseline_context=self.baseline_context,
            )

        try:
            req_dict = request.model_dump()
            df = pd.DataFrame([req_dict])

            predicted_amount = float(self.model.predict(df)[0])
            # Clamp to non-negative (regression can occasionally produce tiny negatives)
            predicted_amount = max(0.0, predicted_amount)

            return ClaimPredictionResponse(
                predicted_claim_amount=round(predicted_amount, 2),
                model_status="active",
                confidence_note=(
                    "Estimate from RandomForestRegressor trained on health insurance data. "
                    "Unseen cities/job titles fall back to ensemble average."
                ),
                timestamp=datetime.now(timezone.utc).isoformat(),
                baseline_context=self.baseline_context,
            )

        except Exception as exc:
            logger.error("Claim prediction processing error: %s", exc)
            raise


# Singleton
claim_service = ClaimService()
