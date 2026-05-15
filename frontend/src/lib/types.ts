// Shared request fields for both ML models
export interface PredictionRequest {
  age: string;
  gender: string;
  weight: number;
  bmi: number;
  no_of_dependents: number;
  "heart rate": number; // Using quotes for spaces
  time_in_hospital: number;
  payer_code: string;
  num_lab_procedures: number;
  num_procedures: number;
  num_medications: number;
  number_outpatient: number;
  number_emergency: number;
  number_inpatient: number;
  number_diagnoses: number;
  insulin: string;
  change: string;
  diabetesMed: string;
}

export interface ReadmissionResponse {
  risk_label: string;
  risk_probability: number | null;
  confidence_note: string | null;
  model_status: string;
  explanation: Record<string, any> | null;
  timestamp: string;
  disclaimer: string;
}

export interface ClaimResponse {
  predicted_claim_amount: number;
  currency: string;
  model_status: string;
  confidence_note: string;
  timestamp: string;
  disclaimer: string;
}

export interface ApiResponse<T> {
  status: "success" | "error";
  message: string;
  data?: T;
  error?: any;
}
