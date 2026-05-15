# ML Artifacts Directory

This directory is intended to store the compiled machine learning artifacts required by the backend FastAPI service to perform readmission and claim risk predictions.

## Current Status
**Trained models have been successfully generated and exported via the Phase 8 Model Engineering pipeline.**
The backend readmission prediction service will automatically lazily load these artifacts and route incoming `predict` traffic through the trained Scikit-Learn pipeline.

## Exported Artifacts
The following files are now generated and maintained in this directory:
1. `readmission_model.joblib`: The trained scikit-learn Pipeline (combining `ColumnTransformer` preprocessing and `LogisticRegression` classification).
2. `readmission_features.json`: A JSON list defining the exact 18 expected feature names used by the `ColumnTransformer`.
3. `readmission_metadata.json`: Contains target mapping logic (`<30` -> 1, `>30`/`NO` -> 0).

## Important Note
**Do NOT commit binary model artifacts (`*.joblib`, `*.pkl`, `*.h5`) to version control.**
Ensure these extensions remain in the `.gitignore` policy.
