from pydantic import BaseModel, Field

class ClaimRequest(BaseModel):
    """
    Schema for claim amount prediction aligned with the trained model features.
    """
    age: str = Field(..., description="Age group, e.g., '[70-80)'")
    gender: str = Field(..., description="Gender: 'Male', 'Female', etc.")
    weight: float = Field(..., description="Weight in lbs/kg")
    bmi: float = Field(..., description="Body Mass Index")
    no_of_dependents: float = Field(..., description="Number of dependents")
    heart_rate: float = Field(..., alias="heart rate", description="Heart rate in BPM")
    time_in_hospital: float = Field(..., description="Days in hospital")
    payer_code: str = Field(..., description="Payer code category")
    num_lab_procedures: float = Field(..., description="Number of lab procedures performed")
    num_procedures: float = Field(..., description="Number of procedures")
    num_medications: float = Field(..., description="Number of medications")
    number_outpatient: float = Field(..., description="Number of outpatient visits")
    number_emergency: float = Field(..., description="Number of emergency visits")
    number_inpatient: float = Field(..., description="Number of inpatient visits")
    number_diagnoses: float = Field(..., description="Number of diagnoses")
    insulin: str = Field(..., description="Insulin prescription status: 'Up', 'Down', 'Steady', 'No'")
    change: str = Field(..., description="Medication change status: 'Ch', 'No'")
    diabetesMed: str = Field(..., description="Indicates if any diabetic medication was prescribed: 'Yes' or 'No'")

    model_config = {
        "populate_by_name": True
    }

class ClaimPredictionResponse(BaseModel):
    """
    Structured response for claim prediction.
    """
    predicted_claim_amount: float = Field(..., description="Predicted total claim amount")
    currency: str = Field("USD", description="Currency unit of the claim")
    model_status: str = Field(..., description="Status of the ML model, e.g., 'active', 'not_configured'")
    confidence_note: str = Field(..., description="Note on model confidence or validity")
    timestamp: str = Field(..., description="Timestamp of the prediction")
    disclaimer: str = Field(
        "This is an educational decision-support output and not financial advice.",
        description="Mandatory disclaimer"
    )
