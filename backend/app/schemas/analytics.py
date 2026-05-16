from typing import List
from pydantic import BaseModel, Field


class ConditionSummary(BaseModel):
    """Aggregate statistics for a single HRRP condition/measure."""
    condition_code: str = Field(..., description="CMS HRRP measure code, e.g. 'READM-30-HF-HRRP'")
    condition_label: str = Field(..., description="Human-readable condition label, e.g. 'Heart Failure'")
    record_count: int = Field(..., description="Number of hospital-condition records")
    average_err: float = Field(..., description="Average Excess Readmission Ratio for this condition")
    percent_above_benchmark: float = Field(..., description="Percentage of records with ERR > 1.0")


class StateSummary(BaseModel):
    """Aggregate statistics for a single US state."""
    state: str = Field(..., description="US state abbreviation, e.g. 'CA'")
    record_count: int = Field(..., description="Number of hospital-condition records in this state")
    average_err: float = Field(..., description="Average Excess Readmission Ratio for this state")
    percent_above_benchmark: float = Field(..., description="Percentage of records with ERR > 1.0")


class OutlierHospital(BaseModel):
    """A hospital with elevated Excess Readmission Ratio."""
    facility_name: str = Field(..., description="Name of the hospital facility")
    state: str = Field(..., description="US state abbreviation")
    condition_code: str = Field(..., description="CMS HRRP condition code for this record")
    condition_label: str = Field(..., description="Human-readable condition label")
    excess_readmission_ratio: float = Field(..., description="Excess Readmission Ratio (ERR)")


class AnalyticsSummary(BaseModel):
    """
    Aggregate hospital benchmarking summary derived from the CMS HRRP dataset.

    IMPORTANT: This data is aggregate hospital-level performance data. It is:
    - NOT patient-level prediction data.
    - NOT insurance claim prediction.
    - NOT real-time monitoring.
    - NOT output from the AdmitGuard readmission ML model.
    The 'Predicted Readmission Rate' is a CMS statistical field, not the AdmitGuard classifier output.
    """
    # Top-level KPI metrics
    total_records: int = Field(..., description="Total number of hospital-condition records in the dataset")
    total_hospitals: int = Field(..., description="Number of unique hospital facilities")
    total_states: int = Field(..., description="Number of unique US states represented")
    period_label: str = Field(..., description="Data measurement period, e.g. 'Jul 2019 – Jun 2022'")
    average_excess_readmission_ratio: float = Field(
        ..., description="Mean Excess Readmission Ratio across all records"
    )
    percent_above_benchmark: float = Field(
        ..., description="Percentage of records where ERR > 1.0 (worse than expected)"
    )

    # Breakdowns
    condition_summary: List[ConditionSummary] = Field(
        ..., description="Aggregate statistics grouped by HRRP condition/measure"
    )
    state_summary: List[StateSummary] = Field(
        ..., description="Aggregate statistics grouped by US state, sorted by average ERR descending"
    )
    top_outlier_hospitals: List[OutlierHospital] = Field(
        ..., description="Top hospitals by Excess Readmission Ratio (highest first)"
    )

    # Metadata and disclaimers
    data_source: str = Field(
        "CMS Hospital Readmissions Reduction Program (HRRP) — Static Aggregate Dataset",
        description="Source attribution for the underlying data"
    )
    coverage_note: str = Field(
        "Dataset covers 34 of 50 US states. Results do not represent national completeness.",
        description="Geographic coverage caveat"
    )
    disclaimer: str = Field(
        "This dashboard presents aggregate hospital-level performance benchmarks from static CMS data. "
        "It is not patient-level prediction, not insurance claim estimation, and not real-time monitoring. "
        "The 'Predicted Readmission Rate' column is a CMS statistical field and is not produced by the "
        "AdmitGuard readmission classifier. Not for clinical use.",
        description="Mandatory data framing disclaimer"
    )
