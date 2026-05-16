# Readmission Dataset Audit Report

**Phase**: 11A.2  
**Date**: 2026-05-16  
**Dataset**: `data/raw/readmission/diabetic_data.csv`  
**Source**: UCI Diabetes 130-US Hospitals Dataset (1999–2008)

---

## 1. Basic Statistics

| Property | Value |
|---|---|
| Rows | 101,766 |
| Columns | 50 |
| Duplicate rows | 0 |
| Unique encounter IDs | 101,766 |
| Unique patient IDs (`patient_nbr`) | 71,518 |

> Note: More encounters than patients — some patients appear multiple times. We use each encounter row independently (no patient-level deduplication, consistent with the literature).

---

## 2. Target Distribution — `readmitted`

| Value | Count | % |
|---|---|---|
| `NO` | 54,864 | 53.9% |
| `>30` | 35,545 | 34.9% |
| `<30` | 11,357 | 11.2% |

**Binary mapping applied:**
- `<30` → **1** (positive class: readmitted within 30 days)
- `>30` → **0**
- `NO` → **0**

**Class imbalance**: ~1:8 ratio of positive to negative. Class weight balancing applied in LogisticRegression.

---

## 3. Missing Values

| Column | Missing Count | % Missing |
|---|---|---|
| `max_glu_serum` | 96,420 | 94.8% |
| `A1Cresult` | 84,748 | 83.3% |
| `weight` | ~97,000 | ~96% |

No `?` placeholder values found in this version of the dataset (numeric IDs and some fields were already cleaned). NaN imputation applied via `SimpleImputer(strategy='most_frequent')` for categorical and `median` for numeric.

---

## 4. ID Columns (Excluded)

- `encounter_id` — primary key, excluded (no signal)
- `patient_nbr` — patient ID, excluded (no signal)

---

## 5. Leakage and Post-Outcome Analysis

### `discharge_disposition_id` — EXCLUDED
This column captures what happened to the patient at discharge (e.g., discharged home, transferred, died). It is determined at discharge time and therefore constitutes a **post-admission outcome variable** that would cause data leakage in an admission-time risk model.

Additionally, certain codes represent death or hospice outcomes:
- **Codes 11, 13, 14, 19, 20, 21** — Expired / Hospice / Not mapped

These 2,423 rows were **removed entirely** before training because readmission within 30 days is logically impossible for deceased or hospice patients. Retaining them would corrupt the negative class distribution.

---

## 6. Selected Features (32 total)

### Numeric Features (8)
`time_in_hospital`, `num_lab_procedures`, `num_procedures`, `num_medications`, `number_outpatient`, `number_emergency`, `number_inpatient`, `number_diagnoses`

### Categorical Features (24)
`race`, `gender`, `age`, `admission_type_id`*, `admission_source_id`*, `diag_1`, `diag_2`, `diag_3`, `max_glu_serum`, `A1Cresult`, `metformin`, `repaglinide`, `nateglinide`, `chlorpropamide`, `glimepiride`, `glipizide`, `glyburide`, `pioglitazone`, `rosiglitazone`, `acarbose`, `miglitol`, `insulin`, `change`, `diabetesMed`

> *`admission_type_id` and `admission_source_id` are integer codes but treated as categorical strings to prevent ordinal misinterpretation.

---

## 7. Dropped Features and Reasons

| Column | Reason |
|---|---|
| `encounter_id` | Primary key — no predictive signal |
| `patient_nbr` | Patient ID — no predictive signal |
| `weight` | ~96% missing — imputation would be unreliable |
| `payer_code` | ~40% missing — administrative, low clinical value |
| `medical_specialty` | ~49% missing — too sparse |
| `discharge_disposition_id` | Post-admission outcome — leakage risk |
| `acetohexamide`, `tolbutamide`, `troglitazone`, `tolazamide`, `examide`, `citoglipton` | Near-zero variance (rarely prescribed drugs) |
| `glimepiride-pioglitazone`, `metformin-rosiglitazone`, `metformin-pioglitazone`, `glipizide-metformin`, `glyburide-metformin` | Near-zero variance combination drugs |

---

## 8. Honest Model Metrics

**Model**: Logistic Regression (class_weight='balanced', lbfgs solver)  
**Train/Test split**: 80/20 stratified  
**Training rows**: 79,474 | **Test rows**: 19,869

| Metric | Value |
|---|---|
| Accuracy | 0.648 |
| Precision (positive class) | 0.170 |
| Recall (positive class) | 0.538 |
| Macro-F1 | 0.514 |
| ROC-AUC | 0.637 |

### Interpretation
These are **honest, non-inflated metrics** for a clinically imbalanced task:
- **Accuracy 0.648** is not a useful metric here due to class imbalance (if we predicted "no readmission" always, we'd get ~88% accuracy).
- **Recall 0.538** means the model catches ~54% of actual 30-day readmissions — meaningful but improvable.
- **ROC-AUC 0.637** — better than random (0.5), but a baseline. Random Forest or gradient boosting would likely improve this.
- **Precision 0.170** — expected for a highly imbalanced class; the model deliberately favors recall over precision due to class weighting.

---

## 9. Limitations

- Logistic regression is a linear baseline — the relationship between medication dosage changes and readmission is likely non-linear.
- diag_1/2/3 ICD-9 codes are treated as unordered categories — grouping into clinical chapters could improve signal.
- `max_glu_serum` and `A1Cresult` are almost entirely missing — contributing very little.
- The model is trained on 1999–2008 data; clinical practice and drug availability have changed significantly.

---

## 10. Next Steps (Phase 11A.3+)

- Experiment with `RandomForestClassifier` for potential AUC improvement
- Apply ICD-9 chapter grouping to `diag_1/2/3`
- Tune decision threshold for optimal recall/precision tradeoff
- Rebuild claim prediction model from `data/raw/claims/healthinsurance_claims.csv`
