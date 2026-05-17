import os
import json
import pandas as pd
import numpy as np

def compute_stats(series):
    # Drop NaNs before computing stats just in case
    s = series.dropna()
    if len(s) == 0:
        return None
    return {
        "min": float(s.min()),
        "p25": float(s.quantile(0.25)),
        "median": float(s.median()),
        "p75": float(s.quantile(0.75)),
        "max": float(s.max()),
        "mean": float(s.mean()),
        "std": float(s.std()),
        "count": int(s.count())
    }

def main():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    ml_dir = os.path.dirname(script_dir)
    project_dir = os.path.dirname(ml_dir)
    
    # Readmission Baseline
    readmission_path = os.path.join(project_dir, "data", "raw", "readmission", "diabetic_data.csv")
    readmission_fields = [
        "time_in_hospital",
        "num_lab_procedures",
        "num_procedures",
        "num_medications",
        "number_outpatient",
        "number_emergency",
        "number_inpatient",
        "number_diagnoses"
    ]
    
    if os.path.exists(readmission_path):
        df_readmission = pd.read_csv(readmission_path, na_values=['?', 'Unknown'])
        readmission_stats = {}
        for field in readmission_fields:
            if field in df_readmission.columns:
                stats = compute_stats(df_readmission[field])
                if stats:
                    readmission_stats[field] = stats
        
        out_readmission = os.path.join(ml_dir, "artifacts", "readmission_baseline_summary.json")
        with open(out_readmission, "w") as f:
            json.dump(readmission_stats, f, indent=4)
        print(f"Saved {out_readmission}")
    else:
        print(f"Not found: {readmission_path}")

    # Claim Baseline
    claim_path = os.path.join(project_dir, "data", "raw", "claims", "healthinsurance_claims.csv")
    claim_fields = [
        "age",
        "weight",
        "bmi",
        "bloodpressure",
        "no_of_dependents",
        "claim"
    ]
    
    if os.path.exists(claim_path):
        df_claim = pd.read_csv(claim_path)
        claim_stats = {}
        for field in claim_fields:
            if field in df_claim.columns:
                stats = compute_stats(df_claim[field])
                if stats:
                    claim_stats[field] = stats
        
        out_claim = os.path.join(ml_dir, "artifacts", "claim_baseline_summary.json")
        with open(out_claim, "w") as f:
            json.dump(claim_stats, f, indent=4)
        print(f"Saved {out_claim}")
    else:
        print(f"Not found: {claim_path}")

if __name__ == "__main__":
    main()
