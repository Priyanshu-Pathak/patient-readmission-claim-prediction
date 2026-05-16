"""
Phase 11A.3 runtime integration test.
Run from project root:
  .venv\Scripts\python.exe ml/scripts/test_claim_endpoint.py
"""
import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent.parent / "backend"))

from fastapi.testclient import TestClient
from app.main import app

# Realistic demo payload matching the 12-feature claim schema
CLAIM_PAYLOAD = {
    "age": 35.0,
    "sex": "male",
    "weight": 72,
    "bmi": 28.5,
    "no_of_dependents": 2,
    "smoker": 0,
    "diabetes": 1,
    "regular_ex": 0,
    "bloodpressure": 80,
    "hereditary_diseases": "NoDisease",
    "city": "NewYork",
    "job_title": "Engineer",
}

# Readmission payload for cross-check
READMISSION_PAYLOAD = {
    "race": "Caucasian",
    "gender": "Female",
    "age": "[70-80)",
    "admission_type_id": "1",
    "admission_source_id": "7",
    "time_in_hospital": 5,
    "num_lab_procedures": 44,
    "num_procedures": 1,
    "num_medications": 14,
    "number_outpatient": 0,
    "number_emergency": 0,
    "number_inpatient": 0,
    "number_diagnoses": 9,
    "diag_1": "428",
    "diag_2": "250",
    "diag_3": "401",
    "max_glu_serum": "None",
    "A1Cresult": "None",
    "metformin": "No",
    "repaglinide": "No",
    "nateglinide": "No",
    "chlorpropamide": "No",
    "glimepiride": "No",
    "glipizide": "No",
    "glyburide": "No",
    "pioglitazone": "No",
    "rosiglitazone": "No",
    "acarbose": "No",
    "miglitol": "No",
    "insulin": "Steady",
    "change": "No",
    "diabetesMed": "Yes",
}


def run_tests():
    client = TestClient(app)

    # -- Health ----------------------------------------------------------------
    r = client.get("/api/v1/health/")
    assert r.status_code == 200, f"Health check failed: {r.text}"
    print("Health check: PASS")

    # -- Claim: valid payload --------------------------------------------------
    r = client.post("/api/v1/claim/predict", json=CLAIM_PAYLOAD)
    print(f"\nClaim predict: HTTP {r.status_code}")
    body = r.json()
    print("Response:", body)
    assert r.status_code == 200, f"Expected 200, got {r.status_code}: {body}"
    data = body["data"]
    assert data["model_status"] == "active", f"Claim model not active: {data}"
    assert data["predicted_claim_amount"] > 0
    print("Claim endpoint: PASS")

    # -- Claim: invalid payload (missing required field) -----------------------
    r_bad = client.post("/api/v1/claim/predict", json={"age": 35})
    assert r_bad.status_code == 422, f"Expected 422, got {r_bad.status_code}"
    print("Claim invalid payload validation: PASS")

    # -- Readmission still works -----------------------------------------------
    r_re = client.post("/api/v1/readmission/predict", json=READMISSION_PAYLOAD)
    print(f"\nReadmission predict: HTTP {r_re.status_code}")
    assert r_re.status_code == 200, f"Readmission broken: {r_re.text}"
    assert r_re.json()["data"]["model_status"] == "active"
    print("Readmission endpoint still active: PASS")

    print("\n=== All runtime tests passed ===")


if __name__ == "__main__":
    run_tests()
