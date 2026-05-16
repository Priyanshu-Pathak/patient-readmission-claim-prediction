"""
Phase 11A.2 runtime integration test.
Run from project root:
  .venv\Scripts\python.exe ml/scripts/test_readmission_endpoint.py
"""
import sys, os
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent.parent / "backend"))

from fastapi.testclient import TestClient
from app.main import app

# Realistic demo payload matching the 32-feature schema
DEMO_PAYLOAD = {
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

    # ── Health ──────────────────────────────────────────────────────────────
    r = client.get("/api/v1/health/")
    assert r.status_code == 200, f"Health check failed: {r.text}"
    print("Health check: PASS")

    # ── Readmission valid payload ───────────────────────────────────────────
    r = client.post("/api/v1/readmission/predict", json=DEMO_PAYLOAD)
    print(f"\nReadmission predict: HTTP {r.status_code}")
    body = r.json()
    print("Response:", body)
    assert r.status_code == 200, f"Expected 200, got {r.status_code}: {body}"
    data = body["data"]
    assert data["model_status"] == "active", f"Model not active: {data}"
    assert data["risk_probability"] is not None
    assert data["predicted_class"] in (0, 1)
    print("Readmission endpoint: PASS")

    # ── Readmission invalid payload (missing required fields) ───────────────
    r_bad = client.post("/api/v1/readmission/predict", json={"race": "Caucasian"})
    assert r_bad.status_code == 422, f"Expected 422 validation error, got {r_bad.status_code}"
    print("Readmission invalid payload validation: PASS")

    # -- Claim endpoint still registered (may return 422/503 until schema rebuilt) --
    r_claim = client.post("/api/v1/claim/predict", json=DEMO_PAYLOAD)
    print(f"\nClaim predict: HTTP {r_claim.status_code} (422/503 expected until Phase 11A.3 rebuild)")
    # 422 = claim schema still uses old fused-dataset fields (will be rebuilt)
    # 503 = model missing  | 200 = model active
    assert r_claim.status_code in (200, 422, 503), f"Unexpected status: {r_claim.status_code}"
    print("Claim endpoint registration: PASS")

    print("\n=== All runtime tests passed ===")


if __name__ == "__main__":
    run_tests()
