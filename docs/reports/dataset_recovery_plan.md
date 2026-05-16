# Dataset Recovery Plan

**Status**: Active  
**Phase**: 11A.1 — Dataset Recovery Reset

---

## 1. Why the Fused Dataset Was Removed

The previous dataset `final_adjusted_healthcare_dataset.xlsx` was created by a row-level join of two structurally unrelated datasets:
- The UCI Diabetes 130-US Hospitals readmission dataset
- A health insurance claims dataset

This fusion was fundamentally invalid because **neither dataset contains a shared patient identifier**. Without a common key (e.g., a unique patient or encounter ID that exists in both files), any row-level merge arbitrarily aligns unrelated patients' records, producing:

- **Impossible combinations**: A patient's readmission encounter data paired with a completely different patient's insurance claim amount.
- **Noisy/corrupted targets**: The `readmitted` and `claim` columns reflected different real-world patients and therefore had no meaningful joint signal.
- **Lost category meaning**: Categorical encodings from the two datasets used overlapping code spaces but meant entirely different things, making the merged columns uninterpretable.
- **Inflated/misleading metrics**: Any model trained on this fused data would learn spurious correlations and produce metrics that are technically high but scientifically meaningless.

All model artifacts (`*.joblib`, feature schemas, metadata, and evaluation reports) produced from this dataset are **invalidated** and have been removed from the repository.

---

## 2. Why Row-Level Fusion Is Not Valid Without Shared Patient IDs

In rigorous ML data engineering, a valid join requires:

1. A **shared unique key** (e.g., a patient encounter ID, claim ID, or SSN that exists in both tables).
2. A **known cardinality relationship** (one-to-one, one-to-many, etc.) that is semantically meaningful.

Without this, a row-level merge is equivalent to randomly shuffling and pairing unrelated records. The resulting "dataset" is not a reflection of reality and any model trained on it will:
- Learn statistical noise rather than clinical signal.
- Produce confidence intervals and metrics that cannot be trusted.
- Fail catastrophically when applied to real patient data.

---

## 3. New Dataset Strategy

AdmitGuard now uses a **task-specific, single-source strategy** for each ML model:

### Readmission Risk Model
- **Source**: `data/raw/readmission/diabetic_data.csv` (UCI Diabetes 130-US Hospitals)
- **Target**: `readmitted` — binary (`<30` = positive class, `>30` and `NO` = negative class)
- **Rationale**: This is a well-studied, peer-reviewed clinical dataset specifically designed for readmission prediction research. All features are pre-outcome clinical encounter data.

### Claim Amount Prediction Model
- **Source**: `data/raw/claims/healthinsurance_claims.csv`
- **Target**: `claim` (continuous USD amount)
- **Rationale**: This is a purpose-built insurance dataset where features are patient demographics and the target is the actual insurance claim. No cross-contamination with the readmission dataset.

### Hospital Analytics Dashboard
- **Source**: `data/raw/hospital_analytics/hrrp_readmissions.csv` (CMS HRRP public aggregate data)
- **Use**: Hospital-level aggregate analytics and benchmarking only. Not used for patient-level prediction.

---

## 4. Invalidated Artifacts

The following files were generated from the fused dataset and have been removed:

**Local binary artifacts** (Git-ignored):
- `ml/artifacts/readmission_model.joblib`
- `ml/artifacts/claim_model.joblib`

**Tracked metadata and reports** (removed from Git):
- `ml/artifacts/readmission_features.json`
- `ml/artifacts/readmission_metadata.json`
- `ml/artifacts/claim_features.json`
- `ml/artifacts/claim_metadata.json`
- `ml/reports/readmission_metrics.json`
- `ml/reports/readmission_data_profile.json`
- `ml/reports/readmission_classification_report.json`
- `ml/reports/readmission_confusion_matrix.json`
- `ml/reports/claim_metrics.json`
- `ml/reports/claim_data_profile.json`

---

## 5. Next Phase

**Phase 11A.2 — Readmission Model Rebuild**

Build a clean readmission prediction pipeline using `diabetic_data.csv`:
1. Explore and profile the raw dataset
2. Map `readmitted` to binary target
3. Apply leakage-safe feature selection (exclude post-outcome codes)
4. Use `IDs_mapping.csv` to decode categorical IDs where applicable
5. Train, evaluate, and export a new model with honest metrics
