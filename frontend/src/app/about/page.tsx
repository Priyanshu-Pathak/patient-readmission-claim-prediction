import React from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SurfaceCard } from "@/components/ui/SurfaceCard";
import { StatusBadge } from "@/components/ui/StatusBadge";

export default function AboutPage() {
  return (
    <AppShell>
      <Container className="space-y-12 pb-12">
        <section className="pt-12 pb-8 max-w-3xl mx-auto text-center">
          <StatusBadge status="neutral" label="About AdmitGuard" className="mb-6" />
          <h1 className="text-4xl font-extrabold tracking-tight mb-6">
            Educational Healthcare Analytics
          </h1>
          <p className="text-lg text-muted-foreground">
            AdmitGuard Intelligence is a full-stack data science platform designed to demonstrate modern machine learning integration in a secure, healthcare-style environment.
          </p>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <SurfaceCard className="space-y-4">
            <h3 className="text-xl font-semibold">Project Purpose</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              This platform serves as a resume-grade portfolio project showcasing end-to-end ML engineering. It covers data preprocessing, predictive modeling, explainable AI (XAI), and secure API design within a Next.js and FastAPI architecture.
            </p>
          </SurfaceCard>

          <SurfaceCard className="space-y-4">
            <h3 className="text-xl font-semibold">Dataset & Scope</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              The models are trained on publicly available, de-identified diabetes datasets (such as the UCI Diabetes dataset). The scope includes predicting 30-day readmission likelihood and forecasting estimated claim burdens for cohort analysis.
            </p>
          </SurfaceCard>

          <SurfaceCard className="space-y-4">
            <h3 className="text-xl font-semibold">Security Design</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Built with a "secure-by-default" mindset, the system employs strict Role-Based Access Control (RBAC), enforces Google OAuth for authentication, and validates all analytical inputs to prevent data poisoning or unauthorized access.
            </p>
          </SurfaceCard>

          <SurfaceCard className="space-y-4 border-warning/30 bg-warning/5">
            <div className="flex items-center gap-3">
              <span className="text-warning text-xl">⚠️</span>
              <h3 className="text-xl font-semibold text-warning">Important Limitations</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              This system is strictly for educational and analytical demonstration. It is not HIPAA compliant, does not provide medical diagnoses, and must never be used to replace professional clinical judgment or real hospital production systems.
            </p>
          </SurfaceCard>
        </section>
      </Container>
    </AppShell>
  );
}
