import os
import sys
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
import json

# Add project root to sys.path to import ml.src
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..')))

from ml.src.data_validation import clean_data, generate_profile
from ml.src.preprocessing import get_preprocessor, get_feature_schema, save_feature_schema
from ml.src.model_training import get_model
from ml.src.metrics import save_metrics
from ml.src.artifact_io import save_model

def main():
    print("Loading dataset...")
    df = pd.read_excel('data/raw/final_adjusted_healthcare_dataset.xlsx')
    
    print("Cleaning data...")
    df = clean_data(df)
    generate_profile(df, 'ml/reports/readmission_data_profile.json')
    
    features, numeric_features, categorical_features = get_feature_schema(df, target_col='readmitted')
    
    print(f"Selected {len(features)} features.")
    save_feature_schema(features, numeric_features, categorical_features, 'ml/artifacts/readmission_features.json')
    
    # Save metadata
    metadata = {
        "target_column": "readmitted",
        "positive_class": 1,
        "negative_class": 0,
        "description": "<30 maps to 1, >30/NO maps to 0"
    }
    with open('ml/artifacts/readmission_metadata.json', 'w') as f:
        json.dump(metadata, f, indent=4)

    X = df[features]
    y = df['readmitted']
    
    print("Splitting dataset...")
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
    
    preprocessor = get_preprocessor(numeric_features, categorical_features)
    model = get_model()
    
    pipeline = Pipeline(steps=[
        ('preprocessor', preprocessor),
        ('classifier', model)
    ])
    
    print("Training model...")
    pipeline.fit(X_train, y_train)
    
    print("Evaluating model...")
    y_pred = pipeline.predict(X_test)
    y_prob = pipeline.predict_proba(X_test)[:, 1] if hasattr(pipeline, "predict_proba") else None
    
    metrics = save_metrics(y_test, y_pred, y_prob, prefix="readmission")
    print("Metrics:", metrics)
    
    print("Exporting artifacts...")
    # Since we use a pipeline, we save the entire pipeline as the model artifact
    save_model(pipeline, 'ml/artifacts/readmission_model.joblib')
    print("Pipeline trained and exported successfully to ml/artifacts/readmission_model.joblib.")

if __name__ == "__main__":
    main()
