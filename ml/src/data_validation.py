import pandas as pd
import json

def clean_data(df: pd.DataFrame) -> pd.DataFrame:
    # Drop noisy columns
    noisy_cols = ['smoker', 'regular_exercise']
    df = df.drop(columns=[col for col in noisy_cols if col in df.columns], errors='ignore')
    
    # Map readmitted
    # Positive class = 1 (<30 days), Negative class = 0 (>30 days or NO)
    if 'readmitted' in df.columns:
        df['readmitted'] = df['readmitted'].apply(lambda x: 1 if str(x).strip() == '<30' else 0)
        
    return df

def generate_profile(df: pd.DataFrame, file_path: str):
    profile = {
        "rows": len(df),
        "columns": len(df.columns),
        "missing_values": df.isna().sum().to_dict(),
        "excluded_columns": ['smoker', 'regular_exercise'],
        "exclusion_reason": "Contains noisy decimal/negative values instead of clean binary labels."
    }
    with open(file_path, 'w') as f:
        json.dump(profile, f, indent=4)
