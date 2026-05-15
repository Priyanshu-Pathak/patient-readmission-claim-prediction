from typing import Optional, List
from pydantic import BaseModel, Field

class ReadmissionRequest(BaseModel):
    """
    Provisional schema for readmission prediction.
    Compatible with future model artifacts (e.g., based on UCI Diabetes Dataset).
    """
    age: str = Field(..., description="Age group, e.g., '[70-80)'")
    gender: str = Field(..., description="Gender: 'Male', 'Female', or 'Unknown'")
    time_in_hospital: int = Field(..., ge=1, le=14, description="Days in hospital (1-14)")
    num_lab_procedures: int = Field(0, ge=0, description="Number of lab procedures performed")
    num_procedures: int = Field(0, ge=0, description="Number of procedures (other than lab tests)")
    num_medications: int = Field(1, ge=1, description="Number of distinct generic names administered")
    number_outpatient: int = Field(0, ge=0, description="Number of outpatient visits in year preceding encounter")
    number_emergency: int = Field(0, ge=0, description="Number of emergency visits in year preceding encounter")
    number_inpatient: int = Field(0, ge=0, description="Number of inpatient visits in year preceding encounter")
    diag_1: str = Field(..., description="Primary diagnosis code or category")
    a1cresult: Optional[str] = Field("None", description="A1C result: '>8', '>7', 'Norm', or 'None'")
    diabetesMed: str = Field(..., description="Indicates if any diabetic medication was prescribed: 'Yes' or 'No'")

class ReadmissionPredictionResponse(BaseModel):
    """
    Structured response for readmission risk.
    """
    risk_label: str = Field(..., description="Risk label, e.g., 'High', 'Medium', 'Low', or 'Unavailable'")
    risk_probability: Optional[float] = Field(None, description="Probability of readmission within 30 days (0.0 to 1.0)")
    confidence_note: Optional[str] = Field(None, description="Note on model confidence or validity")
    model_status: str = Field(..., description="Status of the ML model, e.g., 'active', 'offline', 'not_configured'")
    explanation: Optional[dict] = Field(None, description="Placeholder for explainable AI (SHAP) outputs")
    timestamp: str = Field(..., description="Timestamp of the prediction")
    disclaimer: str = Field(
        "This is an educational decision-support output and not medical advice. "
        "Do not use for clinical diagnosis.",
        description="Mandatory medical disclaimer"
    )
