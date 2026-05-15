import os
import sys
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.ensemble import RandomForestRegressor
import json

# Add project root to sys.path to import ml.src
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..')))

from ml.src.preprocessing import get_preprocessor, get_feature_schema, save_feature_schema
from ml.src.metrics import save_metrics
from ml.src.artifact_io import save_model

def clean_claim_data(df: pd.DataFrame) -> pd.DataFrame:
    noisy_cols = ['smoker', 'regular_exercise']
    df = df.drop(columns=[col for col in noisy_cols if col in df.columns], errors='ignore')
    return df

def main():
    print("Loading dataset for claim prediction...")
    df = pd.read_excel('data/raw/final_adjusted_healthcare_dataset.xlsx')
    
    print("Cleaning data...")
    df = clean_claim_data(df)
    
    profile = {
        "rows": len(df),
        "columns": len(df.columns),
        "missing_values": df.isna().sum().to_dict(),
        "excluded_columns": ['smoker', 'regular_exercise'],
        "exclusion_reason": "Contains noisy decimal/negative values instead of clean binary labels."
    }
    with open('ml/reports/claim_data_profile.json', 'w') as f:
        json.dump(profile, f, indent=4)
    
    # We must exclude 'readmitted' to prevent leakage (unless specified otherwise, we assume pre-outcome).
    features, numeric_features, categorical_features = get_feature_schema(df, target_col='claim', exclude_cols=['readmitted'])
    
    print(f"Selected {len(features)} features.")
    save_feature_schema(features, numeric_features, categorical_features, 'ml/artifacts/claim_features.json')
    
    metadata = {
        "target_column": "claim",
        "description": "Continuous claim amount predicted from pre-outcome features"
    }
    with open('ml/artifacts/claim_metadata.json', 'w') as f:
        json.dump(metadata, f, indent=4)

    X = df[features]
    y = df['claim']
    
    print("Splitting dataset...")
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    preprocessor = get_preprocessor(numeric_features, categorical_features)
    
    pipeline = Pipeline(steps=[
        ('preprocessor', preprocessor),
        ('regressor', RandomForestRegressor(n_estimators=100, random_state=42))
    ])
    
    print("Training model...")
    pipeline.fit(X_train, y_train)
    
    print("Evaluating model...")
    y_pred = pipeline.predict(X_test)
    
    metrics = save_metrics(y_test, y_pred, prefix="claim", is_regression=True)
    print("Metrics:", metrics)
    
    print("Exporting artifacts...")
    save_model(pipeline, 'ml/artifacts/claim_model.joblib')
    print("Pipeline trained and exported successfully to ml/artifacts/claim_model.joblib.")

if __name__ == "__main__":
    main()
