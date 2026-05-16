"""
Phase 11A.2: Readmission Model Rebuild
Training script using data/raw/readmission/diabetic_data.csv (UCI Diabetes 130-US Hospitals)

Run from project root:
  .venv\Scripts\python.exe ml/scripts/train_readmission.py
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
from sklearn.linear_model import LogisticRegression

# Add project root to path
PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent
sys.path.insert(0, str(PROJECT_ROOT))

from ml.src.metrics import save_metrics
from ml.src.artifact_io import save_model

# ─────────────────────────────────────────────
# 1. Configuration
# ─────────────────────────────────────────────
DATASET_PATH       = PROJECT_ROOT / 'data/raw/readmission/diabetic_data.csv'
ARTIFACTS_DIR      = PROJECT_ROOT / 'ml/artifacts'
REPORTS_DIR        = PROJECT_ROOT / 'ml/reports'
MODEL_PATH         = ARTIFACTS_DIR / 'readmission_model.joblib'
FEATURES_PATH      = ARTIFACTS_DIR / 'readmission_features.json'
METADATA_PATH      = ARTIFACTS_DIR / 'readmission_metadata.json'

# death / hospice discharge disposition IDs — these are post-outcome leakage
# Codes 11, 13, 14, 19, 20, 21 imply patient died or was discharged to hospice.
# We EXCLUDE these rows from training entirely because they represent encounters
# where readmission within 30 days is logically impossible.
DEATH_HOSPICE_CODES = {11, 13, 14, 19, 20, 21}

# Columns to drop entirely (ID leakage or irrelevant)
DROP_ALWAYS = [
    'encounter_id',   # primary key, no signal
    'patient_nbr',    # patient ID, no signal
]

# High-missing or low-value columns to exclude from features
# weight: >96% missing in this dataset
# payer_code: >40% missing; administrative, low clinical value
# medical_specialty: >49% missing; too sparse
HIGH_MISSING_DROP = ['weight', 'payer_code', 'medical_specialty']

# Rarely-used combination drugs — near-zero variance across dataset
NEAR_ZERO_VARIANCE_DROP = [
    'acetohexamide', 'tolbutamide', 'troglitazone', 'tolazamide',
    'examide', 'citoglipton', 'glimepiride-pioglitazone',
    'metformin-rosiglitazone', 'metformin-pioglitazone',
    'glipizide-metformin', 'glyburide-metformin',
]

def load_and_prepare(path: Path) -> pd.DataFrame:
    print(f"Loading {path} ...")
    df = pd.read_csv(path, low_memory=False)
    print(f"  Raw shape: {df.shape}")

    # 1. Remove death / hospice discharges (leakage: readmission impossible)
    before = len(df)
    df = df[~df['discharge_disposition_id'].isin(DEATH_HOSPICE_CODES)].copy()
    print(f"  Removed {before - len(df)} death/hospice rows. Remaining: {len(df)}")

    # 2. Map target
    # <30 → 1 (readmitted within 30 days, positive class)
    # >30 → 0
    # NO  → 0
    df['readmitted'] = df['readmitted'].apply(
        lambda x: 1 if str(x).strip() == '<30' else 0
    )
    print(f"  Target distribution:\n{df['readmitted'].value_counts().to_dict()}")

    return df


def select_features(df: pd.DataFrame):
    """
    Returns (X, y, feature_list, numeric_features, categorical_features)
    
    Decision on discharge_disposition_id:
      We EXCLUDE discharge_disposition_id from features entirely.
      Rationale: Although death/hospice rows are removed, discharge disposition
      is determined at discharge time — it is a post-admission outcome variable
      that can encode the severity trajectory of the current visit in ways that
      create subtle leakage. To keep the model usable as an admission-time or
      mid-stay risk estimator, we treat it as post-outcome.
    """
    exclude = (
        DROP_ALWAYS
        + HIGH_MISSING_DROP
        + NEAR_ZERO_VARIANCE_DROP
        + ['readmitted', 'discharge_disposition_id']
    )

    # Treat ID-type numeric columns (admission_type_id, admission_source_id) as categorical
    id_as_cat = ['admission_type_id', 'admission_source_id']
    for col in id_as_cat:
        if col in df.columns:
            df[col] = df[col].astype(str)

    features = [c for c in df.columns if c not in exclude]

    numeric_features = df[features].select_dtypes(
        include=[np.number]
    ).columns.tolist()

    categorical_features = df[features].select_dtypes(
        include='object'
    ).columns.tolist()

    print(f"\n  Selected {len(features)} features")
    print(f"    Numeric  ({len(numeric_features)}): {numeric_features}")
    print(f"    Categorical ({len(categorical_features)}): {categorical_features}")

    X = df[features]
    y = df['readmitted']
    return X, y, features, numeric_features, categorical_features


def build_pipeline(numeric_features, categorical_features):
    numeric_transformer = Pipeline([
        ('imputer', SimpleImputer(strategy='median')),
        ('scaler', StandardScaler()),
    ])
    categorical_transformer = Pipeline([
        ('imputer', SimpleImputer(strategy='most_frequent')),
        ('onehot', OneHotEncoder(handle_unknown='ignore', sparse_output=False)),
    ])
    preprocessor = ColumnTransformer([
        ('num', numeric_transformer, numeric_features),
        ('cat', categorical_transformer, categorical_features),
    ])
    model = LogisticRegression(
        max_iter=1000,
        random_state=42,
        class_weight='balanced',
        solver='lbfgs',
    )
    pipeline = Pipeline([
        ('preprocessor', preprocessor),
        ('classifier', model),
    ])
    return pipeline


def main():
    ARTIFACTS_DIR.mkdir(parents=True, exist_ok=True)
    REPORTS_DIR.mkdir(parents=True, exist_ok=True)

    # ── Load & prepare ─────────────────────────────────────────────────────
    df = load_and_prepare(DATASET_PATH)

    # ── Feature selection ──────────────────────────────────────────────────
    X, y, features, numeric_features, categorical_features = select_features(df)

    # ── Train / test split ─────────────────────────────────────────────────
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )
    print(f"\n  Train: {len(X_train)} | Test: {len(X_test)}")

    # ── Build & train pipeline ─────────────────────────────────────────────
    print("\nTraining pipeline ...")
    pipeline = build_pipeline(numeric_features, categorical_features)
    pipeline.fit(X_train, y_train)

    # ── Evaluate ───────────────────────────────────────────────────────────
    print("Evaluating ...")
    y_pred = pipeline.predict(X_test)
    y_prob = pipeline.predict_proba(X_test)[:, 1]
    metrics = save_metrics(y_test, y_pred, y_prob, prefix="readmission")
    print("Metrics:", json.dumps(metrics, indent=2))

    # ── Save feature schema ────────────────────────────────────────────────
    feature_schema = {
        "features": features,
        "numeric_features": numeric_features,
        "categorical_features": categorical_features,
        "dropped_always": DROP_ALWAYS,
        "dropped_high_missing": HIGH_MISSING_DROP,
        "dropped_near_zero_variance": NEAR_ZERO_VARIANCE_DROP,
        "dropped_post_outcome": ["discharge_disposition_id"],
        "discharge_disposition_note": (
            "discharge_disposition_id excluded: it is determined at discharge time "
            "and acts as a post-admission outcome variable. Death/hospice rows "
            "(codes 11,13,14,19,20,21) were also removed before training."
        ),
    }
    with open(FEATURES_PATH, 'w') as f:
        json.dump(feature_schema, f, indent=4)
    print(f"Feature schema saved: {FEATURES_PATH}")

    # -- Save metadata ----------------------------------------------------------
    metadata = {
        "target_column": "readmitted",
        "positive_class_value": "<30",
        "positive_class_label": 1,
        "negative_class_values": [">30", "NO"],
        "negative_class_label": 0,
        "description": "<30 maps to 1 (positive), >30 and NO map to 0 (negative)",
        "model_type": "LogisticRegression(class_weight='balanced')",
        "dataset": "UCI Diabetes 130-US Hospitals (diabetic_data.csv)",
        "model_use": "Admission-time readmission risk estimation -- NOT clinical diagnosis",
    }
    with open(METADATA_PATH, 'w') as f:
        json.dump(metadata, f, indent=4)
    print(f"Metadata saved: {METADATA_PATH}")

    # -- Export model -----------------------------------------------------------
    save_model(pipeline, str(MODEL_PATH))
    print(f"Model pipeline saved: {MODEL_PATH}")

    print("\n=== Training complete ===")


if __name__ == "__main__":
    main()
