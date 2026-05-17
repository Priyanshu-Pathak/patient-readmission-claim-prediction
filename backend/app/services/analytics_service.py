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

import numpy as np
import pandas as pd

from app.core.config import PROJECT_ROOT
from app.schemas.analytics import (
    AnalyticsSummary,
    ConditionSummary,
    OutlierHospital,
    StateSummary,
    FilterOptions,
    HistogramBin,
    AnalyticsExploreResponse
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

    def get_explore_data(
        self, state: Optional[str] = None, condition: Optional[str] = None, top_n: int = 10
    ) -> Optional[AnalyticsExploreResponse]:
        """
        Return the dynamically filtered analytics dashboard data.
        """
        if self._df is None:
            self._df = self._load_csv()

        if self._df is None:
            return None

        # Base filter options from the FULL dataset
        all_states = sorted(self._df["State"].unique().tolist())
        all_conditions = sorted(self._df["Measure Name"].unique().tolist())
        filter_options = FilterOptions(states=all_states, conditions=all_conditions)

        # Apply filters
        df_filtered = self._df.copy()
        if state and state in all_states:
            df_filtered = df_filtered[df_filtered["State"] == state]
        if condition and condition in all_conditions:
            df_filtered = df_filtered[df_filtered["Measure Name"] == condition]

        # Handle empty filtered dataframe gracefully
        if df_filtered.empty:
            # We still return the base schema but with 0 values
            return AnalyticsExploreResponse(
                total_records=0,
                total_hospitals=0,
                total_states=0,
                period_label="Jul 2019 \u2013 Jun 2022",
                average_excess_readmission_ratio=0.0,
                percent_above_benchmark=0.0,
                condition_summary=[],
                state_summary=[],
                top_outlier_hospitals=[],
                filter_options=filter_options,
                err_distribution=[],
            )

        # Compute Summary Stats based on filtered dataframe
        err_col = "Excess Readmission Ratio"
        total_records = len(df_filtered)
        total_hospitals = df_filtered["Facility Name"].nunique()
        total_states = df_filtered["State"].nunique()
        avg_err = round(float(df_filtered[err_col].mean()), 4)
        pct_above = round(float((df_filtered[err_col] > 1.0).mean() * 100), 2)

        # Condition summary
        cond_groups = df_filtered.groupby("Measure Name")
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

        # State summary
        state_groups = df_filtered.groupby("State")
        state_rows = []
        for s, grp in state_groups:
            above = float((grp[err_col] > 1.0).mean() * 100)
            state_rows.append(
                StateSummary(
                    state=s,
                    record_count=len(grp),
                    average_err=round(float(grp[err_col].mean()), 4),
                    percent_above_benchmark=round(above, 2),
                )
            )
        state_summary = sorted(state_rows, key=lambda x: x.average_err, reverse=True)

        # Top N Outliers
        safe_top_n = max(1, min(100, top_n))
        top_rows = df_filtered.nlargest(safe_top_n, err_col)[
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

        # Histogram Distribution
        # Use 20 bins. Default range 0.80 to 1.30, expand if data exceeds.
        min_val = min(0.80, df_filtered[err_col].min())
        max_val = max(1.30, df_filtered[err_col].max())
        
        # Avoid creating zero-width bins if all values are exactly identical
        if min_val == max_val:
            min_val -= 0.1
            max_val += 0.1

        counts, bin_edges = np.histogram(df_filtered[err_col].dropna(), bins=20, range=(min_val, max_val))
        err_distribution = [
            HistogramBin(
                bin_start=round(float(bin_edges[i]), 3),
                bin_end=round(float(bin_edges[i + 1]), 3),
                count=int(counts[i]),
            )
            for i in range(len(counts))
        ]

        return AnalyticsExploreResponse(
            total_records=total_records,
            total_hospitals=total_hospitals,
            total_states=total_states,
            period_label="Jul 2019 \u2013 Jun 2022",
            average_excess_readmission_ratio=avg_err,
            percent_above_benchmark=pct_above,
            condition_summary=condition_summary,
            state_summary=state_summary,
            top_outlier_hospitals=top_outliers,
            filter_options=filter_options,
            err_distribution=err_distribution,
        )

# Singleton — loaded once per backend process lifetime
analytics_service = AnalyticsService()
