# AdmitGuard — Data Manifest

> This document describes all datasets used in the AdmitGuard project, their intended use, and their current status.
> All raw CSV files are ignored by Git and must be sourced locally.

---

## 1. Readmission Dataset (Primary — Model Training)

| Field | Value |
|---|---|
| **File** | `data/raw/readmission/diabetic_data.csv` |
| **Lookup** | `data/raw/readmission/IDs_mapping.csv` |
| **Source** | UCI Diabetes 130-US Hospitals Dataset (1999–2008) |
| **Target column** | `readmitted` |
| **Positive class** | `<30` (readmitted within 30 days) |
| **Task** | Binary classification |
| **Use** | Primary training and evaluation dataset for the readmission risk model |

### Notes
- `IDs_mapping.csv` provides human-readable mappings for coded categorical fields (e.g., `admission_type_id`, `discharge_disposition_id`, `admission_source_id`).
- Post-outcome leakage columns (e.g., `discharge_disposition_id` codes implying death/hospice) must be dropped during preprocessing.

---

## 2. Claims Dataset (Primary — Claim Prediction Model)

| Field | Value |
|---|---|
| **File** | `data/raw/claims/healthinsurance_claims.csv` |
| **Target column** | `claim` (insurance claim amount in USD) |
| **Task** | Regression |
| **Use** | Training and evaluation dataset for the insurance claim amount prediction model |

### Notes
- Only pre-outcome patient demographic and utilization features should be selected as predictors.
- The `claim` column is the regression target and must never appear as a feature.

---

## 3. Hospital Analytics Dataset (Aggregate Analytics Only)

| Field | Value |
|---|---|
| **File** | `data/raw/hospital_analytics/hrrp_readmissions.csv` |
| **Source** | CMS Hospital Readmissions Reduction Program (HRRP) public data |
| **Task** | Aggregate analytics / dashboard visualization |
| **Use** | Hospital-level readmission rate benchmarking. NOT used for patient-level prediction. |

### Notes
- This dataset contains aggregate statistics per hospital (e.g., excess readmission ratios, payment adjustments).
- It is not patient-level data and cannot be used directly as a training dataset for ML models.

---

## 4. Optional Baseline Dataset (Demo / Simple Baseline)

| Field | Value |
|---|---|
| **File** | `data/raw/optional_baselines/hospital_readmissions_small.csv` |
| **Task** | Simple baseline modeling / demo |
| **Use** | Lightweight alternative for quick demos and sanity checks only. NOT used for final production models. |

---

## ⚠️ Deprecated Dataset

| Field | Value |
|---|---|
| **File** | `final_adjusted_healthcare_dataset.xlsx` |
| **Status** | **REMOVED** |
| **Reason** | This file was created by an unsuccessful row-level fusion of the readmission and claims datasets. Because these two datasets have no shared patient identifiers, the fusion produced nonsensical noisy values and lost all category meaning (e.g., mixed categorical encodings, implausible numeric ranges). All model artifacts generated from this dataset are invalidated and have been removed. |

---

*Last updated: Phase 11A.1 — Dataset Recovery Reset*
