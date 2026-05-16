# AdmitGuard Intelligence — Final Demo Script & Handoff Guide

> This guide provides a structured walkthrough for demonstrating AdmitGuard Intelligence. It ensures all technical features, data framing, and safety disclaimers are communicated clearly during a live presentation.

---

## 🚀 Live Demo URLs
- **Platform**: [https://admitguard.site](https://admitguard.site)
- **API Docs**: [https://admitguard-api.onrender.com/docs](https://admitguard-api.onrender.com/docs)
- **Analytics JSON**: [https://admitguard-api.onrender.com/api/v1/analytics/summary](https://admitguard-api.onrender.com/api/v1/analytics/summary)

*Note: The backend may take 30-60s to wake up on the first request due to free-tier hibernation.*

---

## 🎙️ Elevator Pitch
AdmitGuard is a clinical decision-support and analytics prototype designed to improve hospital operational efficiency. It provides dual-model predictive insights—estimating 30-day readmission risk for diabetic patients and forecasting insurance claim amounts based on patient demographics. Built with a modern glassmorphism interface, it also features a comprehensive hospital benchmarking dashboard using historical CMS HRRP data.

---

## 🗺️ Demo Route Order
1. **/** (Landing Page)
2. **/about** (Motivation & Scope)
3. **/how-it-works** (Architecture & Model Pipeline)
4. **/predict** (Inference Dashboard)
5. **/analytics** (Hospital Benchmarking)

---

## 🗣️ Talking Points per Route

### 1. Landing Page (Home)
- **Overview**: Introduce AdmitGuard as a "Clinical Decision Support" prototype.
- **Value Proposition**: Highlight the transition from raw data to actionable clinical and financial insights.
- **Design**: Mention the professional "medical-HUD" aesthetic designed for clinical environments.

### 2. About Page
- **The Problem**: Discuss the high cost of avoidable readmissions and financial unpredictability in healthcare.
- **Motivation**: Explain that AdmitGuard bridges the gap between clinical data and predictive modeling.
- **Framing**: Emphasize that this is a **prototype** for demonstration, not for direct clinical use.

### 3. How It Works
- **Dual-Model Architecture**: Explain that we use two separate, task-specific datasets to ensure data integrity and avoid leakage.
- **Data Integrity**: Mention the removal of post-outcome variables (like discharge disposition) that could artificially inflate metrics.
- **Technology**: Built with Next.js 16, FastAPI, and Scikit-Learn.

### 4. Predict Page (Inference)
- **Readmission Risk**:
  - **Model**: Logistic Regression (Balanced).
  - **Feature Set**: 32 clinical features (labs, procedures, medications).
  - **Metrics**: 0.648 Accuracy, 0.538 Recall (Realistic performance after removing leakage).
- **Claim Estimate**:
  - **Model**: Random Forest Regressor.
  - **Feature Set**: 12 demographic and history features.
  - **Metrics**: 0.972 R2 (Highly accurate for this specific dataset).
- **Live Form**: Demonstrate entering patient data and receiving real-time results.

### 5. Analytics Page (Benchmarking)
- **Dataset**: CMS HRRP historical data (Jul 2019 – Jun 2022).
- **Coverage**: 7,890 records across 1,960 hospitals in 34 states.
- **Key Metric**: Excess Readmission Ratio (ERR).
- **Framing**: This page shows **aggregate historical statistics**, not individual ML predictions.

---

### Local Development (Optional)
If running locally for development:
- **Backend**: `http://127.0.0.1:8000`
- **Frontend**: `http://localhost:3000`

---

## 🛡️ Safety & Compliance
- **Not Medical Advice**: The system is a decision-support tool, not a diagnostic one.
- **Not HIPAA Compliant**: This prototype uses public/sample data and does not meet HIPAA security standards for production use.
- **Static Analytics**: The HRRP benchmarking data is based on a historical window and is not a real-time monitor.
- **Educational Prototype**: Built specifically for technical demonstration and portfolio use.

---

## ✅ Final Demo Checklist
- [ ] **Backend Status**: Ensure FastAPI is running and logs "Application startup complete".
- [ ] **Frontend Status**: Ensure Next.js dev server is active.
- [ ] **Data Check**: Verify `/analytics` renders the summary cards (1,960 hospitals).
- [ ] **Model Check**: Run one test prediction in `/predict` to confirm the `.joblib` artifacts are loaded.
- [ ] **No Errors**: Check browser console (F12) for any red hydration or fetch errors.
- [ ] **Ready to WOW**: Ensure browser is in full-screen mode for the best visual impact.
