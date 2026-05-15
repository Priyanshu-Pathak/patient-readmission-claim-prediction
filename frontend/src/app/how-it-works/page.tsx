import React from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SurfaceCard } from "@/components/ui/SurfaceCard";
import { StatusBadge } from "@/components/ui/StatusBadge";

export default function HowItWorksPage() {
  const steps = [
    { title: "Data Validation & Preprocessing", desc: "Incoming patient records are strictly validated via Pydantic schemas. Missing values are imputed, and categorical variables are encoded using the identical Scikit-learn pipelines used during model training." },
    { title: "Readmission Risk Modeling", desc: "An XGBoost classifier evaluates the patient's vitals, lab results, and encounter history to output a calibrated probability of 30-day readmission." },
    { title: "Claim Forecasting", desc: "A secondary regression model (or actuarial baseline) estimates the potential financial claim burden associated with the predicted readmission risk." },
    { title: "Explainability Layer", desc: "SHAP (SHapley Additive exPlanations) values are computed to identify exactly which patient features (e.g., elevated A1C, number of diagnoses) drove the specific risk score." },
    { title: "Report Generation", desc: "The insights are bundled into an immutable, professional PDF report stored securely and accessible only to authorized analysts." },
  ];

  return (
    <AppShell>
      <Container className="space-y-12 pb-16">
        <section className="pt-12 pb-8 max-w-3xl mx-auto text-center">
          <StatusBadge status="info" label="Architecture & Workflow" className="mb-6" />
          <h1 className="text-4xl font-extrabold tracking-tight mb-6">
            How AdmitGuard Works
          </h1>
          <p className="text-lg text-muted-foreground">
            A transparent look into the machine learning pipeline, data flow, and deployment architecture powering the analytics engine.
          </p>
        </section>

        <section className="max-w-4xl mx-auto space-y-8">
          <SectionHeader title="The Inference Pipeline" description="Step-by-step execution for patient risk scoring." />
          
          <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
            {steps.map((step, idx) => (
              <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-background bg-primary text-primary-foreground font-bold shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-md">
                  {idx + 1}
                </div>
                <SurfaceCard className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] hoverEffect">
                  <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.desc}</p>
                </SurfaceCard>
              </div>
            ))}
          </div>
        </section>

        <section className="max-w-4xl mx-auto pt-12">
          <SectionHeader title="Deployment Architecture" />
          <SurfaceCard className="bg-muted/30">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
              <div>
                <h4 className="font-semibold text-foreground mb-2">Frontend (Next.js)</h4>
                <p className="text-muted-foreground">Deployed on Vercel. Handles UI rendering, Google OAuth state, and responsive data visualizations via Tailwind CSS.</p>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-2">Backend (FastAPI)</h4>
                <p className="text-muted-foreground">Deployed on Render/Railway. Manages RBAC, API versioning, input validation, and executes the Joblib ML artifacts.</p>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-2">Database (PostgreSQL)</h4>
                <p className="text-muted-foreground">Managed relational store containing user profiles, batch job states, prediction history, and tamper-evident audit logs.</p>
              </div>
            </div>
          </SurfaceCard>
        </section>
      </Container>
    </AppShell>
  );
}
