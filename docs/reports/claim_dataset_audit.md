# Claim Dataset Audit Report

**Phase**: 11A.3  
**Date**: 2026-05-16  
**Dataset**: `data/raw/claims/healthinsurance_claims.csv`  
**Task**: Regression — predict insurance claim amount

---

## 1. Basic Statistics

| Property | Value |
|---|---|
| Rows (raw) | 15,000 |
| Columns | 13 |
| Duplicate rows | 1,096 |
| Rows after deduplication | 13,904 |

---

## 2. Target Variable — `claim`

| Statistic | Value |
|---|---|
| Min | $1,121.90 |
| Median | $9,545.65 |
| Mean | $13,401.44 |
| Max | $63,770.40 |
| Std | $12,148.24 |
| Null count | 0 |

---

## 3. Missing Values

| Column | Missing Count | % Missing |
|---|---|---|
| `age` | 396 | 2.6% |
| `bmi` | 956 | 6.4% |

Both handled via `SimpleImputer(strategy='median')` in the pipeline.

---

## 4. Column Inventory

### Numeric Features (continuous)
`age`, `weight`, `bmi`, `no_of_dependents`, `bloodpressure`

### Binary / Flag Features (int: 0 or 1)
| Column | Meaning | Distribution |
|---|---|---|
| `smoker` | 1=smoker | 0: 12,028 / 1: 2,972 |
| `diabetes` | 1=has diabetes | 0: 3,345 / 1: 11,655 |
| `regular_ex` | 1=exercises regularly | 0: 11,638 / 1: 3,362 |

These are kept as numeric integers (0/1) — no encoding required.

### Categorical Features
| Column | Unique Values | Notes |
|---|---|---|
| `sex` | 2 (`male`, `female`) | Standard binary category |
| `hereditary_diseases` | 10 | Clinical conditions; `NoDisease` is most common |
| `city` | 91 | High-cardinality; unseen cities handled via `handle_unknown='ignore'` |
| `job_title` | 35 | Moderate cardinality |

### Target (excluded from features)
- `claim` — continuous float (USD); regression target

---

## 5. Leakage Analysis

This dataset contains **no post-outcome leakage** — all 12 selected features are pre-claim patient characteristics:
- No claim history features
- No treatment/procedure features derived from the current claim
- No derived or transformed versions of `claim`

The only column dropped is `claim` itself (the target).

---

## 6. Selected Features (12 total)

**Numeric (8):** `age`, `weight`, `bmi`, `no_of_dependents`, `bloodpressure`, `smoker`, `diabetes`, `regular_ex`

**Categorical (4):** `sex`, `hereditary_diseases`, `city`, `job_title`

---

## 7. Dropped Columns and Reasons

| Column | Reason |
|---|---|
| `claim` | Target variable — not a feature |

No other columns required removal; the dataset is clean and purpose-built.

---

## 8. Honest Model Metrics

**Model**: RandomForestRegressor (n_estimators=200, min_samples_leaf=2)  
**Train/Test split**: 80/20  
**Training rows**: 11,123 | **Test rows**: 2,781  
**Deduplication**: 1,096 duplicate rows removed before split

| Metric | Value |
|---|---|
| MAE | $558.89 |
| RMSE | $2,047.77 |
| R² | 0.972 |
| MAPE | 6.31% |

### Interpretation
- **R² = 0.972** — the model explains 97.2% of variance in claim amounts; strong performance for a regression task.
- **MAE = $559** — on average, predictions are off by about $559 from the true claim.
- **MAPE = 6.31%** — mean absolute percentage error; reasonable for a wide-range target ($1,121 to $63,770).
- **RMSE = $2,048** — higher than MAE indicates some larger outlier errors, expected for high-value claims.

---

## 9. Limitations

- Dataset appears synthetic/educational (clean round-number city names, even distributions) — not from a real insurer.
- `city` has 91 unique values — predictions for unseen cities fall back to ensemble averages via `handle_unknown='ignore'`.
- `hereditary_diseases` is a single-label field; in reality a patient may have multiple conditions.
- The model does not account for coverage type, plan tier, or deductible — significant real-world claim drivers.

---

## 10. Next Steps (Phase 11A.4+)

- Rebuild the frontend `/predict` page to use the new dual-schema (readmission vs claim are now separate datasets with different features)
- Update `frontend/src/lib/types.ts` to reflect the two separate request schemas
- Consider implementing a tabbed UI on the predict page (one tab per model)
