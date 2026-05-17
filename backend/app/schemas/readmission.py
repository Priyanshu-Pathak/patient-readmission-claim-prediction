from typing import Optional
from pydantic import BaseModel, Field


class ReadmissionRequest(BaseModel):
    """
    Schema for readmission prediction using the UCI Diabetes 130-US Hospitals dataset.
    32 features selected from diabetic_data.csv after leakage-safe feature engineering.

    Model type: Admission-time risk estimator (NOT a discharge-time model).
    discharge_disposition_id is intentionally excluded.
    """
    # Demographics
    race: str = Field(..., description="Race category, e.g., 'Caucasian', 'AfricanAmerican'")
    gender: str = Field(..., description="Gender: 'Male', 'Female', or 'Unknown/Invalid'")
    age: str = Field(..., description="Age group bracket, e.g., '[70-80)'")

    # Encounter context (coded as strings; treated as categorical)
    admission_type_id: str = Field(..., description="Type of admission (coded integer as string), e.g., '1'")
    admission_source_id: str = Field(..., description="Source of admission (coded integer as string), e.g., '7'")

    # Utilization metrics (numeric)
    time_in_hospital: float = Field(..., description="Number of days between admission and discharge (1-14)")
    num_lab_procedures: float = Field(..., description="Number of lab procedures performed during encounter")
    num_procedures: float = Field(..., description="Number of procedures other than lab tests")
    num_medications: float = Field(..., description="Number of distinct generic drugs administered")
    number_outpatient: float = Field(..., description="Number of outpatient visits in prior year")
    number_emergency: float = Field(..., description="Number of emergency visits in prior year")
    number_inpatient: float = Field(..., description="Number of inpatient visits in prior year")
    number_diagnoses: float = Field(..., description="Number of diagnoses entered to the system")

    # Diagnoses (ICD-9 codes as strings)
    diag_1: str = Field(..., description="Primary diagnosis ICD-9 code (as string)")
    diag_2: str = Field(..., description="Secondary diagnosis ICD-9 code (as string)")
    diag_3: str = Field(..., description="Third diagnosis ICD-9 code (as string)")

    # Lab results
    max_glu_serum: Optional[str] = Field(None, description="Max glucose serum result: 'None', 'Norm', '>200', '>300'")
    A1Cresult: Optional[str] = Field(None, description="A1C test result: 'None', 'Norm', '>7', '>8'")

    # Medications (all categorical: 'No', 'Steady', 'Up', 'Down')
    metformin: str = Field(..., description="Metformin dosage change")
    repaglinide: str = Field(..., description="Repaglinide dosage change")
    nateglinide: str = Field(..., description="Nateglinide dosage change")
    chlorpropamide: str = Field(..., description="Chlorpropamide dosage change")
    glimepiride: str = Field(..., description="Glimepiride dosage change")
    glipizide: str = Field(..., description="Glipizide dosage change")
    glyburide: str = Field(..., description="Glyburide dosage change")
    pioglitazone: str = Field(..., description="Pioglitazone dosage change")
    rosiglitazone: str = Field(..., description="Rosiglitazone dosage change")
    acarbose: str = Field(..., description="Acarbose dosage change")
    miglitol: str = Field(..., description="Miglitol dosage change")
    insulin: str = Field(..., description="Insulin dosage change: 'No', 'Steady', 'Up', 'Down'")

    # Summary medication flags
    change: str = Field(..., description="Was there a change in diabetic medications: 'Ch' or 'No'")
    diabetesMed: str = Field(..., description="Was any diabetic medication prescribed: 'Yes' or 'No'")

    model_config = {"populate_by_name": True}


class ReadmissionPredictionResponse(BaseModel):
    """
    Structured response for readmission risk estimation.
    """
    risk_label: str = Field(..., description="Risk label: 'High', 'Medium', 'Low', or 'Unavailable'")
    risk_probability: Optional[float] = Field(None, description="Probability of 30-day readmission (0.0 to 1.0)")
    predicted_class: Optional[int] = Field(None, description="Predicted class: 1 = at risk, 0 = not at risk")
    threshold: float = Field(0.5, description="Classification threshold used")
    confidence_note: Optional[str] = Field(None, description="Note on model confidence")
    model_status: str = Field(..., description="Status: 'active', 'not_configured'")
    explanation: Optional[dict] = Field(None, description="Placeholder for explainable AI outputs")
    timestamp: str = Field(..., description="UTC timestamp of prediction")
    disclaimer: str = Field(
        "This is an educational decision-support prototype output and not medical advice. "
        "Do not use for clinical diagnosis or treatment decisions.",
        description="Mandatory medical disclaimer"
    )
    baseline_context: Optional[dict] = Field(None, description="Descriptive dataset baseline comparisons")

