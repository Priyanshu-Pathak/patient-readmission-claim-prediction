# AdmitGuard Intelligence

> A clinical decision-support and analytics prototype providing patient readmission risk estimation and estimated insurance claim analytics.

## 📌 Problem Statement
Hospital readmissions are a critical quality metric and financial liability for healthcare organizations. Accurately identifying high-risk patients prior to discharge allows clinical teams to intervene with targeted care plans, reducing the likelihood of avoidable readmissions. Simultaneously, understanding estimated insurance claim amounts helps financial planning and resource allocation. AdmitGuard serves as a foundational prototype to bridge clinical operational data with machine learning, enabling proactive risk management.

## ✨ Key Features
- **Readmission Risk Estimation**: Predicts 30-day readmission probability using 18 pre-outcome clinical features.
- **Claim Analytics**: Estimates financial claim amounts based on patient demographics and utilization history.
- **Unified Dashboard**: A polished, responsive web interface built with modern glassmorphism UI for clear presentation.
- **Robust Architecture**: Modular FastAPI backend supporting dual-model concurrent inference, strictly decoupled from the Next.js frontend.
- **Safe ML Pipeline**: Fully reproducible `scikit-learn` pipeline with rigorous anti-leakage guards (ensuring post-outcome variables do not corrupt training).

## 🛠 Tech Stack
- **Frontend**: Next.js 16 (App Router), React, Tailwind CSS, TypeScript
- **Backend**: FastAPI, Python 3.12, Pydantic, SQLAlchemy 2.0
- **Machine Learning**: Scikit-Learn, Pandas, NumPy, Joblib

## 🏗 Architecture Overview
AdmitGuard operates on a segregated Client-Server architecture:
1. **Next.js Client**: Provides the recruiter-ready UI. Requests are routed via `src/lib/api.ts` concurrently using `Promise.allSettled`.
2. **FastAPI Microservice**: Handles inference via two distinct routes: `/api/v1/readmission/predict` and `/api/v1/claim/predict`.
3. **ML Pipeline**: A local `ml/` environment that processes the raw dataset, maps variables, scales features, and exports `.joblib` binary artifacts consumed by the FastAPI service.

*(See [Architecture Docs](docs/architecture/README.md) for more details)*

## 🧠 ML Models Used
The system trains on a structured healthcare dataset of **14,000 rows**.

### Readmission Risk Model (Classification)
- **Algorithm**: Logistic Regression (with class weight balancing and robust scaling)
- **Metrics**: 
  - Accuracy: 0.930
  - Macro-F1: 0.930
  - ROC-AUC: 0.985

### Claim Prediction Model (Regression)
- **Algorithm**: Random Forest Regressor
- **Metrics**: 
  - MAE: 212.76
  - RMSE: 372.78
  - R2: 0.972
  - MAPE: 3.31%

## ⚠️ Important Notes
- **Dataset Note**: The raw dataset (`final_adjusted_healthcare_dataset.xlsx`) is strictly local and explicitly ignored by Git. It is **not committed** to the repository.
- **Artifact Note**: Large binary `.joblib` model artifacts are also ignored by `.gitignore`. They must be generated locally using the training scripts before running the backend.
- **Disclaimer**: This platform is a *prototype/decision-support tool*. It is **not** HIPAA compliant, does **not** have clinical approval, and does **not** provide medical or financial advice.

## 🚀 Local Setup Instructions

### 1. Training the Models (Required First)
Because artifacts are not committed, you must build the models locally.
1. Place the dataset `final_adjusted_healthcare_dataset.xlsx` into `data/raw/`.
2. Open a terminal at the project root and activate the environment:
   ```bash
   .venv\Scripts\activate
   ```
3. Run the training scripts:
   ```bash
   python ml/scripts/train_readmission.py
   python ml/scripts/train_claim.py
   ```
   *(This generates the `.joblib` files inside `ml/artifacts/`)*

### 2. Running the Backend
1. Ensure the virtual environment is activated.
2. From the project root, start FastAPI:
   ```bash
   cd backend
   uvicorn app.main:app --reload --port 8000
   ```

### 3. Running the Frontend
1. Open a new terminal at the project root.
2. Install dependencies (if not done) and start Next.js:
   ```bash
   cd frontend
   pnpm install
   pnpm dev
   ```
3. Navigate to `http://localhost:3000` to view the dashboard.

## 📡 API Endpoint Summary
- `GET /api/v1/health/` - Backend health check
- `POST /api/v1/readmission/predict` - Accepts 18 features and returns risk probability/label.
- `POST /api/v1/claim/predict` - Accepts 18 features and returns estimated USD claim amount.

*(See [API Docs](docs/api/README.md) for payload definitions)*

## 🔮 Limitations & Future Improvements
- **Limitations**: The model currently assumes structured tabular data and is trained on a static, limited dataset (14,000 rows).
- **Improvements**: Integration with live FHIR/HL7 streams, Dockerization for cloud deployment, and implementing user authentication/RBAC for secure provider access.

---

## 📸 Screenshots
*(Manual screenshots pending)*

![Landing Page](docs/screenshots/landing-page.png)
![Prediction Dashboard](docs/screenshots/predict-dashboard.png)
![Prediction Results](docs/screenshots/prediction-results.png)
