"""
Analytics service for HRRP hospital benchmarking data.

Reads data/raw/hospital_analytics/hrrp_readmissions.csv once and caches it in memory.
Returns aggregate hospital-level summary statistics.

IMPORTANT: This service uses static CMS aggregate data. It is NOT:
- Patient-level prediction
- Insurance claim prediction
- Real-time monitoring
- Output from the AdmitGuard readmission ML classifier
"""

import logging
from pathlib import Path
from typing import Optional

import pandas as pd

from app.core.config import PROJECT_ROOT
from app.schemas.analytics import (
    AnalyticsSummary,
    ConditionSummary,
    OutlierHospital,
    StateSummary,
)

logger = logging.getLogger(__name__)

# Mapping from CMS measure codes to human-readable labels
CONDITION_LABELS: dict[str, str] = {
    "READM-30-AMI-HRRP": "Acute Myocardial Infarction (AMI)",
    "READM-30-CABG-HRRP": "Coronary Artery Bypass Graft (CABG)",
    "READM-30-COPD-HRRP": "Chronic Obstructive Pulmonary Disease (COPD)",
    "READM-30-HF-HRRP": "Heart Failure (HF)",
    "READM-30-HIP-KNEE-HRRP": "Hip & Knee Arthroplasty",
    "READM-30-PN-HRRP": "Pneumonia (PN)",
}

HRRP_CSV_PATH = PROJECT_ROOT / "data" / "raw" / "hospital_analytics" / "hrrp_readmissions.csv"


class AnalyticsService:
    """
    Loads the HRRP CSV once on first access and caches the pre-computed
    summary in memory for the lifetime of the backend process.
    """

    def __init__(self) -> None:
        self._df: Optional[pd.DataFrame] = None
        self._summary: Optional[AnalyticsSummary] = None
        self._load_error: Optional[str] = None

    # ------------------------------------------------------------------
    # Internal helpers
    # ------------------------------------------------------------------

    def _load_csv(self) -> Optional[pd.DataFrame]:
        """Read the HRRP CSV and return a clean DataFrame, or None on failure."""
        if not HRRP_CSV_PATH.exists():
            msg = f"HRRP CSV not found at {HRRP_CSV_PATH}"
            logger.warning(msg)
            self._load_error = msg
            return None
        try:
            df = pd.read_csv(HRRP_CSV_PATH)
            # Validate required columns are present
            required = {
                "Facility Name",
                "Facility ID",
                "State",
                "Measure Name",
                "Number of Discharges",
                "Excess Readmission Ratio",
                "Number of Readmissions",
            }
            missing = required - set(df.columns)
            if missing:
                msg = f"HRRP CSV missing expected columns: {missing}"
                logger.error(msg)
                self._load_error = msg
                return None

            # Coerce numeric columns robustly
            df["Excess Readmission Ratio"] = pd.to_numeric(
                df["Excess Readmission Ratio"], errors="coerce"
            )
            df["Number of Discharges"] = pd.to_numeric(
                df["Number of Discharges"], errors="coerce"
            )
            df["Number of Readmissions"] = pd.to_numeric(
                df["Number of Readmissions"], errors="coerce"
            )

            # Drop rows where ERR is unparseable (shouldn't happen with clean data)
            before = len(df)
            df = df.dropna(subset=["Excess Readmission Ratio"])
            dropped = before - len(df)
            if dropped:
                logger.warning("Dropped %d rows with unparseable ERR values.", dropped)

            logger.info("HRRP CSV loaded: %d rows, %d columns.", len(df), len(df.columns))
            return df

        except Exception as exc:
            msg = f"Failed to read HRRP CSV: {exc}"
            logger.error(msg)
            self._load_error = msg
            return None

    def _build_summary(self, df: pd.DataFrame) -> AnalyticsSummary:
        """Compute all summary statistics from the clean DataFrame."""
        err_col = "Excess Readmission Ratio"
        total_records = len(df)
        total_hospitals = df["Facility Name"].nunique()
        total_states = df["State"].nunique()
        avg_err = round(float(df[err_col].mean()), 4)
        pct_above = round(float((df[err_col] > 1.0).mean() * 100), 2)

        # --- Condition summary ---
        cond_groups = df.groupby("Measure Name")
        condition_summary = []
        for code, grp in sorted(cond_groups):
            above = float((grp[err_col] > 1.0).mean() * 100)
            condition_summary.append(
                ConditionSummary(
                    condition_code=code,
                    condition_label=CONDITION_LABELS.get(code, code),
                    record_count=len(grp),
                    average_err=round(float(grp[err_col].mean()), 4),
                    percent_above_benchmark=round(above, 2),
                )
            )

        # --- State summary (sorted by avg ERR descending) ---
        state_groups = df.groupby("State")
        state_rows = []
        for state, grp in state_groups:
            above = float((grp[err_col] > 1.0).mean() * 100)
            state_rows.append(
                StateSummary(
                    state=state,
                    record_count=len(grp),
                    average_err=round(float(grp[err_col].mean()), 4),
                    percent_above_benchmark=round(above, 2),
                )
            )
        state_summary = sorted(state_rows, key=lambda x: x.average_err, reverse=True)

        # --- Top 10 outlier hospitals by ERR ---
        top_rows = df.nlargest(10, err_col)[
            ["Facility Name", "State", "Measure Name", err_col]
        ]
        top_outliers = [
            OutlierHospital(
                facility_name=row["Facility Name"],
                state=row["State"],
                condition_code=row["Measure Name"],
                condition_label=CONDITION_LABELS.get(row["Measure Name"], row["Measure Name"]),
                excess_readmission_ratio=round(float(row[err_col]), 4),
            )
            for _, row in top_rows.iterrows()
        ]

        return AnalyticsSummary(
            total_records=total_records,
            total_hospitals=total_hospitals,
            total_states=total_states,
            period_label="Jul 2019 \u2013 Jun 2022",
            average_excess_readmission_ratio=avg_err,
            percent_above_benchmark=pct_above,
            condition_summary=condition_summary,
            state_summary=state_summary,
            top_outlier_hospitals=top_outliers,
        )

    # ------------------------------------------------------------------
    # Public API
    # ------------------------------------------------------------------

    def get_summary(self) -> Optional[AnalyticsSummary]:
        """
        Return the cached analytics summary, computing it on first call.
        Returns None if the CSV is unavailable or unreadable.
        """
        if self._summary is not None:
            return self._summary

        if self._df is None:
            self._df = self._load_csv()

        if self._df is None:
            return None

        self._summary = self._build_summary(self._df)
        logger.info("HRRP analytics summary computed and cached.")
        return self._summary

    @property
    def load_error(self) -> Optional[str]:
        """Return any CSV loading error message."""
        return self._load_error


# Singleton — loaded once per backend process lifetime
analytics_service = AnalyticsService()
