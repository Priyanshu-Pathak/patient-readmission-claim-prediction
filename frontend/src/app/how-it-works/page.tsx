import React from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Container } from "@/components/ui/Container";

export default function HowItWorksPage() {
  const steps = [
    { title: "Data Validation", desc: "Incoming patient records are strictly validated via Pydantic schemas. Missing values are imputed, and categorical variables are encoded using leakage-safe pipelines." },
    { title: "Readmission Modeling", desc: "A Logistic Regression model evaluates the patient's vitals, lab results, and encounter history to output a probability of 30-day readmission." },
    { title: "Claim Estimation", desc: "An independent Random Forest Regressor estimates potential insurance claim amounts based on demographic and historical features." },
    { title: "Explainability", desc: "SHAP values are computed to identify exactly which patient features drove the specific risk score." }
  ];

  return (
    <AppShell>
      <Container className="space-y-16 pb-16 pt-12">
        <section className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full surface-panel mb-6 border border-border">
            <span className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">Architecture</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight mb-6 leading-tight text-foreground">
            How <span className="text-primary font-bold">AdmitGuard</span> Works
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed mb-10">
            A transparent look into the machine learning pipeline, data flow, and deployment architecture powering the analytics engine.
          </p>
        </section>

        <section className="max-w-4xl">
          <h2 className="text-2xl font-semibold mb-6 text-foreground">The Inference Pipeline</h2>
          
          <div className="space-y-4">
            {steps.map((step, idx) => (
              <div key={idx} className="surface-panel p-6 rounded border-border flex items-start gap-6 hover-card-elevation">
                <div className="flex items-center justify-center w-8 h-8 rounded bg-primary/10 border border-primary/20 text-primary font-bold shrink-0">
                  {idx + 1}
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-foreground mb-1">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="max-w-4xl pt-8">
          <h2 className="text-2xl font-semibold mb-6 text-foreground">Deployment Architecture</h2>
          <div className="surface-panel p-8 rounded border-border">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col gap-2">
                <div className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">Frontend</div>
                <h4 className="font-semibold text-foreground">Next.js on Vercel</h4>
                <p className="text-sm text-muted-foreground">Handles UI rendering, state, and responsive data visualizations via Tailwind CSS.</p>
              </div>
              <div className="flex flex-col gap-2">
                <div className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">Backend</div>
                <h4 className="font-semibold text-foreground">FastAPI on Render</h4>
                <p className="text-sm text-muted-foreground">Manages API versioning, input validation, and executes the Joblib ML artifacts.</p>
              </div>
              <div className="flex flex-col gap-2">
                <div className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">Models</div>
                <h4 className="font-semibold text-foreground">Scikit-Learn Joblib</h4>
                <p className="text-sm text-muted-foreground">Pre-trained on historical CSV dumps, serialized, and loaded into backend memory.</p>
              </div>
            </div>
          </div>
        </section>
      </Container>
    </AppShell>
  );
}
