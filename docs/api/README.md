# API Documentation

AdmitGuard exposes a modular FastAPI backend designed to serve machine learning predictions reliably. 

## Endpoints

### Health Checks
- `GET /api/v1/health/`
  - **Returns**: `{"status": "healthy", "timestamp": "..."}`
  - Used for basic liveness probes.

### Predictions
Both prediction endpoints share an identical payload schema derived from 18 clinical features.

#### `POST /api/v1/readmission/predict`
Predicts the 30-day readmission risk for a patient.
- **Request Body**: `PredictionRequest`
- **Response**: `StandardResponse<ReadmissionResponse>`
  - Contains `risk_label` (Low, Medium, High), `risk_probability`, and strict disclaimers.

#### `POST /api/v1/claim/predict`
Estimates the financial claim amount.
- **Request Body**: `PredictionRequest`
- **Response**: `StandardResponse<ClaimResponse>`
  - Contains `predicted_claim_amount` in USD.

## Standardized Responses
All API responses are wrapped in a standard JSON envelope:
```json
{
  "status": "success",
  "data": { ... },
  "message": "...",
  "meta": { "timestamp": "..." }
}
```
In the event model artifacts are missing locally, endpoints gracefully degrade by returning a `503 Service Unavailable` with a clear operational error message instead of crashing the server.
