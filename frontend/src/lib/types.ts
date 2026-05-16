// ─── Readmission Request ────────────────────────────────────────────────────
// 32-feature schema matching backend/app/schemas/readmission.py
// Source dataset: diabetic_data.csv (UCI Diabetes 130-US Hospitals)
export interface ReadmissionRequest {
  // Demographics
  race: string;
  gender: string;
  age: string; // bracket e.g. "[70-80)"

  // Encounter context (sent as string, treated categorically)
  admission_type_id: string;
  admission_source_id: string;

  // Utilization (numeric)
  time_in_hospital: number;
  num_lab_procedures: number;
  num_procedures: number;
  num_medications: number;
  number_outpatient: number;
  number_emergency: number;
  number_inpatient: number;
  number_diagnoses: number;

  // ICD-9 diagnosis codes
  diag_1: string;
  diag_2: string;
  diag_3: string;

  // Lab results
  max_glu_serum: string | null;
  A1Cresult: string | null;

  // Medication dosage changes
  metformin: string;
  repaglinide: string;
  nateglinide: string;
  chlorpropamide: string;
  glimepiride: string;
  glipizide: string;
  glyburide: string;
  pioglitazone: string;
  rosiglitazone: string;
  acarbose: string;
  miglitol: string;
  insulin: string;

  // Summary flags
  change: string;
  diabetesMed: string;
}

// ─── Claim Request ───────────────────────────────────────────────────────────
// 12-feature schema matching backend/app/schemas/claim.py
// Source dataset: healthinsurance_claims.csv
export interface ClaimRequest {
  age: number;
  sex: string;
  weight: number;
  bmi: number;
  no_of_dependents: number;

  // Binary int flags (1=yes, 0=no)
  smoker: number;
  diabetes: number;
  regular_ex: number;

  bloodpressure: number;

  hereditary_diseases: string;
  city: string;
  job_title: string;
}

// ─── Readmission Response ────────────────────────────────────────────────────
export interface ReadmissionResponse {
  risk_label: string;
  risk_probability: number | null;
  predicted_class: number | null;
  threshold: number;
  confidence_note: string | null;
  model_status: string;
  explanation: Record<string, unknown> | null;
  timestamp: string;
  disclaimer: string;
}

// ─── Claim Response ──────────────────────────────────────────────────────────
export interface ClaimResponse {
  predicted_claim_amount: number;
  currency: string;
  model_status: string;
  confidence_note: string;
  timestamp: string;
  disclaimer: string;
}

// ─── Shared API wrapper ──────────────────────────────────────────────────────
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string | null;
  meta?: Record<string, unknown>;
}

// ─── Analytics — HRRP Hospital Benchmarking ──────────────────────────────────
// Mirrors backend/app/schemas/analytics.py
// Source: CMS HRRP aggregate dataset (static, Jul 2019 – Jun 2022)
// NOT patient-level prediction. NOT claim prediction. NOT real-time monitoring.

export interface ConditionSummary {
  condition_code: string;
  condition_label: string;
  record_count: number;
  average_err: number;
  percent_above_benchmark: number;
}

export interface StateSummary {
  state: string;
  record_count: number;
  average_err: number;
  percent_above_benchmark: number;
}

export interface OutlierHospital {
  facility_name: string;
  state: string;
  condition_code: string;
  condition_label: string;
  excess_readmission_ratio: number;
}

export interface AnalyticsSummary {
  total_records: number;
  total_hospitals: number;
  total_states: number;
  period_label: string;
  average_excess_readmission_ratio: number;
  percent_above_benchmark: number;
  condition_summary: ConditionSummary[];
  state_summary: StateSummary[];
  top_outlier_hospitals: OutlierHospital[];
  data_source?: string;
  coverage_note?: string;
  disclaimer?: string;
}
