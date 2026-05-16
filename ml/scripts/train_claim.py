"""
Phase 11A.3: Claim Model Rebuild
Training script using data/raw/claims/healthinsurance_claims.csv

Run from project root:
  .venv\Scripts\python.exe ml/scripts/train_claim.py
"""
import os
import sys
import json
import pandas as pd
import numpy as np
from pathlib import Path
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.ensemble import RandomForestRegressor

PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent
sys.path.insert(0, str(PROJECT_ROOT))

from ml.src.metrics import save_metrics
from ml.src.artifact_io import save_model

# -----------------------------------------------------------------------------
# Configuration
# -----------------------------------------------------------------------------
DATASET_PATH  = PROJECT_ROOT / 'data/raw/claims/healthinsurance_claims.csv'
ARTIFACTS_DIR = PROJECT_ROOT / 'ml/artifacts'
REPORTS_DIR   = PROJECT_ROOT / 'ml/reports'
MODEL_PATH    = ARTIFACTS_DIR / 'claim_model.joblib'
FEATURES_PATH = ARTIFACTS_DIR / 'claim_features.json'
METADATA_PATH = ARTIFACTS_DIR / 'claim_metadata.json'

TARGET_COL = 'claim'

# Features to use (all pre-claim; no post-outcome columns in this dataset)
NUMERIC_FEATURES = [
    'age',
    'weight',
    'bmi',
    'no_of_dependents',
    'bloodpressure',
]
# Binary int columns — safe to use as numeric (0/1 verified in audit)
BINARY_NUMERIC_FEATURES = [
    'smoker',
    'diabetes',
    'regular_ex',
]
CATEGORICAL_FEATURES = [
    'sex',
    'hereditary_diseases',
    'city',
    'job_title',
]

ALL_NUMERIC = NUMERIC_FEATURES + BINARY_NUMERIC_FEATURES


def load_and_prepare(path: Path) -> pd.DataFrame:
    print(f"Loading {path} ...")
    df = pd.read_csv(path, low_memory=False)
    print(f"  Raw shape: {df.shape}")

    # Drop duplicate rows
    before = len(df)
    df = df.drop_duplicates()
    print(f"  Removed {before - len(df)} duplicate rows. Remaining: {len(df)}")

    # Drop rows where target is null
    df = df.dropna(subset=[TARGET_COL])
    print(f"  After target null drop: {len(df)} rows")

    return df


def main():
    ARTIFACTS_DIR.mkdir(parents=True, exist_ok=True)
    REPORTS_DIR.mkdir(parents=True, exist_ok=True)

    # -- Load ------------------------------------------------------------------
    df = load_and_prepare(DATASET_PATH)

    print(f"\n  Target ({TARGET_COL}) stats:")
    print(f"    min={df[TARGET_COL].min():.2f}  median={df[TARGET_COL].median():.2f}"
          f"  mean={df[TARGET_COL].mean():.2f}  max={df[TARGET_COL].max():.2f}")

    # -- Features & target -----------------------------------------------------
    all_features = ALL_NUMERIC + CATEGORICAL_FEATURES
    X = df[all_features].copy()
    y = df[TARGET_COL]

    print(f"\n  Selected {len(all_features)} features:")
    print(f"    Numeric  ({len(ALL_NUMERIC)}): {ALL_NUMERIC}")
    print(f"    Categorical ({len(CATEGORICAL_FEATURES)}): {CATEGORICAL_FEATURES}")

    # -- Train / test split ----------------------------------------------------
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )
    print(f"\n  Train: {len(X_train)} | Test: {len(X_test)}")

    # -- Pipeline --------------------------------------------------------------
    numeric_transformer = Pipeline([
        ('imputer', SimpleImputer(strategy='median')),
        ('scaler', StandardScaler()),
    ])
    categorical_transformer = Pipeline([
        ('imputer', SimpleImputer(strategy='most_frequent')),
        ('onehot', OneHotEncoder(handle_unknown='ignore', sparse_output=False)),
    ])
    preprocessor = ColumnTransformer([
        ('num', numeric_transformer, ALL_NUMERIC),
        ('cat', categorical_transformer, CATEGORICAL_FEATURES),
    ])
    model = RandomForestRegressor(
        n_estimators=200,
        max_depth=None,
        min_samples_leaf=2,
        random_state=42,
        n_jobs=-1,
    )
    pipeline = Pipeline([
        ('preprocessor', preprocessor),
        ('regressor', model),
    ])

    # -- Train -----------------------------------------------------------------
    print("\nTraining RandomForestRegressor ...")
    pipeline.fit(X_train, y_train)

    # -- Evaluate --------------------------------------------------------------
    print("Evaluating ...")
    y_pred = pipeline.predict(X_test)

    # Safe MAPE — only where y_test != 0
    nonzero_mask = y_test != 0
    mape_val = float(np.mean(np.abs((y_test[nonzero_mask] - y_pred[nonzero_mask]) / y_test[nonzero_mask])) * 100)

    metrics = save_metrics(y_test, y_pred, prefix="claim", is_regression=True)
    metrics['mape_pct'] = round(mape_val, 4)
    # Re-save with mape included
    with open(REPORTS_DIR / 'claim_metrics.json', 'w') as f:
        json.dump(metrics, f, indent=4)
    print("Metrics:", json.dumps(metrics, indent=2))

    # -- Save feature schema ---------------------------------------------------
    feature_schema = {
        "features": all_features,
        "numeric_features": ALL_NUMERIC,
        "categorical_features": CATEGORICAL_FEATURES,
        "binary_numeric_features": BINARY_NUMERIC_FEATURES,
        "dropped_columns": [TARGET_COL],
        "notes": {
            "smoker": "Binary int: 1=smoker, 0=non-smoker",
            "diabetes": "Binary int: 1=has diabetes, 0=does not",
            "regular_ex": "Binary int: 1=exercises regularly, 0=does not",
            "city": "91 unique cities -- high-cardinality; OneHotEncoder with handle_unknown=ignore",
            "job_title": "35 unique job titles; OneHotEncoder with handle_unknown=ignore",
        }
    }
    with open(FEATURES_PATH, 'w') as f:
        json.dump(feature_schema, f, indent=4)
    print(f"Feature schema saved: {FEATURES_PATH}")

    # -- Save metadata ---------------------------------------------------------
    metadata = {
        "target_column": TARGET_COL,
        "model_type": "regression",
        "algorithm": "RandomForestRegressor(n_estimators=200, min_samples_leaf=2)",
        "dataset": "healthinsurance_claims.csv",
        "rows_after_dedup": int(len(df)),
        "target_stats": {
            "min": float(df[TARGET_COL].min()),
            "median": float(df[TARGET_COL].median()),
            "mean": float(df[TARGET_COL].mean()),
            "max": float(df[TARGET_COL].max()),
            "std": float(df[TARGET_COL].std()),
        },
        "evaluation_metrics": metrics,
        "limitations": [
            "Dataset is synthetic/educational; not from a real insurer.",
            "city column has 91 unique values — unseen cities fall back to zeros via handle_unknown='ignore'.",
            "Prediction is an estimate for decision-support only, not financial advice.",
        ]
    }
    with open(METADATA_PATH, 'w') as f:
        json.dump(metadata, f, indent=4)
    print(f"Metadata saved: {METADATA_PATH}")

    # -- Export model ----------------------------------------------------------
    save_model(pipeline, str(MODEL_PATH))
    print(f"Model pipeline saved: {MODEL_PATH}")

    print("\n=== Claim training complete ===")


if __name__ == "__main__":
    main()
