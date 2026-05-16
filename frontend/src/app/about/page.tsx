import React from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Container } from "@/components/ui/Container";

export default function AboutPage() {
  return (
    <AppShell>
      <Container className="space-y-16 pb-16 pt-12">
        <section className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full surface-panel mb-6 border border-border">
            <span className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">Project Motivation</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight mb-6 leading-tight text-foreground">
            The Motivation for <span className="text-primary font-bold">AdmitGuard</span>
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed mb-10">
            AdmitGuard Intelligence is a full-stack data science platform designed to demonstrate modern machine learning integration in a secure, healthcare-style environment. It bridges the gap between raw clinical data and actionable administrative insights.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-6 text-foreground">The Clinical Conundrum</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="surface-panel p-8 rounded border-border hover-card-elevation flex flex-col gap-4">
              <div className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">Problem Overview</div>
              <h3 className="text-xl font-semibold text-foreground">Reactive vs. Proactive Care</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Hospital systems often rely on lagging indicators to identify at-risk populations. By the time a 30-day readmission occurs, the opportunity for preventative intervention has passed, resulting in poorer patient outcomes and significant financial penalties under the HRRP framework.
              </p>
            </div>
            <div className="surface-panel p-8 rounded border-border hover-card-elevation flex flex-col gap-4">
              <div className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">Data Necessity</div>
              <h3 className="text-xl font-semibold text-foreground">Integrating Disparate Signals</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Effective risk stratification requires the synthesis of demographics, historical diagnoses, laboratory results, and previous encounter metrics. Traditional rules-based engines fail to capture the complex, non-linear relationships inherent in multi-morbid patient populations.
              </p>
            </div>
          </div>
        </section>

        <section className="surface-panel rounded p-8 border-border">
          <div className="flex items-center gap-3 mb-6">
            <svg className="w-5 h-5 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            <h2 className="text-xl font-semibold text-foreground">Technical Note: Prototype Dataset Limitations</h2>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed mb-8 max-w-3xl">
            This platform serves as a resume-grade portfolio project showcasing end-to-end ML engineering. To ensure data integrity and avoid target leakage, this application uses strictly segregated, independent public datasets for each predictive task. <strong>The legacy "fused dataset" architecture has been fully deprecated.</strong>
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="surface-panel p-5 rounded border-border/50 bg-background/50">
              <div className="flex justify-between items-start mb-2">
                <div className="font-mono text-xs text-primary bg-primary/10 px-2 py-1 rounded">diabetic_data.csv</div>
                <div className="text-[10px] font-bold text-muted-foreground uppercase">Readmissions</div>
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                Used exclusively to train the Logistic Regression model for 30-day readmission classification. Contains 100k+ clinical encounters.
              </p>
            </div>
            
            <div className="surface-panel p-5 rounded border-border/50 bg-background/50">
              <div className="flex justify-between items-start mb-2">
                <div className="font-mono text-xs text-secondary bg-secondary/10 px-2 py-1 rounded">healthinsurance_claims.csv</div>
                <div className="text-[10px] font-bold text-muted-foreground uppercase">Financial</div>
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                Used exclusively to train the Random Forest model for claim amount estimation. Focuses on demographic and lifestyle factors.
              </p>
            </div>
          </div>
        </section>
      </Container>
    </AppShell>
  );
}
