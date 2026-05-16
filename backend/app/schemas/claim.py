from typing import Optional
from pydantic import BaseModel, Field


class ClaimRequest(BaseModel):
    """
    Schema for claim amount prediction using the health insurance claims dataset.
    12 features from healthinsurance_claims.csv — all pre-claim patient demographics
    and health indicators.
    """
    # Demographics
    age: float = Field(..., description="Age in years (18-64)")
    sex: str = Field(..., description="Biological sex: 'male' or 'female'")
    weight: float = Field(..., description="Weight in kg (34-95)")
    bmi: float = Field(..., description="Body Mass Index")
    no_of_dependents: int = Field(..., description="Number of dependents (0-5)")

    # Health indicators (binary int: 1=yes, 0=no)
    smoker: int = Field(..., description="Smoker status: 1=smoker, 0=non-smoker")
    diabetes: int = Field(..., description="Diabetes: 1=has diabetes, 0=does not")
    regular_ex: int = Field(..., description="Regular exercise: 1=yes, 0=no")

    # Clinical measurement
    bloodpressure: int = Field(..., description="Blood pressure reading (integer)")

    # Categorical context
    hereditary_diseases: str = Field(
        ...,
        description="Hereditary disease: one of 'NoDisease', 'Epilepsy', 'EyeDisease', "
                    "'Alzheimer', 'Arthritis', 'HeartDisease', 'Diabetes', 'Cancer', 'High BP', 'Obesity'",
    )
    city: str = Field(..., description="City of residence, e.g., 'NewYork', 'Boston'")
    job_title: str = Field(
        ...,
        description="Occupation, e.g., 'Engineer', 'Doctor', 'Student'",
    )

    model_config = {"populate_by_name": True}


class ClaimPredictionResponse(BaseModel):
    """
    Structured response for insurance claim amount estimation.
    """
    predicted_claim_amount: float = Field(
        ..., description="Predicted total insurance claim amount"
    )
    currency: str = Field("USD", description="Currency unit of the predicted claim")
    model_status: str = Field(..., description="Status: 'active' or 'not_configured'")
    confidence_note: str = Field(..., description="Note on model confidence and limitations")
    timestamp: str = Field(..., description="UTC timestamp of prediction")
    disclaimer: str = Field(
        "This is an educational decision-support prototype output and not financial or medical advice. "
        "Do not use for actual insurance underwriting or pricing decisions.",
        description="Mandatory disclaimer",
    )
