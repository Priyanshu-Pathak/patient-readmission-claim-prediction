import React from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SurfaceCard } from "@/components/ui/SurfaceCard";
import { StatusBadge } from "@/components/ui/StatusBadge";

export default function AboutPage() {
  return (
    <AppShell>
      <Container className="space-y-16 pb-16">
        <section className="pt-16 pb-12 max-w-4xl mx-auto text-center flex flex-col items-center">
          <StatusBadge status="neutral" label="About AdmitGuard" className="mb-8 px-4 py-1" />
          <h1 className="text-5xl font-extrabold tracking-tight mb-8">
            Educational Healthcare Analytics
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl leading-relaxed">
            AdmitGuard Intelligence is a full-stack data science platform designed to demonstrate modern machine learning integration in a secure, healthcare-style environment.
          </p>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <SurfaceCard className="space-y-5 border-t-2 border-t-primary/50">
            <h3 className="text-2xl font-semibold tracking-tight">Project Purpose</h3>
            <p className="text-base text-muted-foreground leading-relaxed">
              This platform serves as a resume-grade portfolio project showcasing end-to-end ML engineering. It covers data preprocessing, predictive modeling, explainable AI (XAI), and secure API design within a Next.js and FastAPI architecture.
            </p>
          </SurfaceCard>

          <SurfaceCard className="space-y-5 border-t-2 border-t-secondary/50">
            <h3 className="text-2xl font-semibold tracking-tight">Dataset & Scope</h3>
            <p className="text-base text-muted-foreground leading-relaxed">
              The platform utilizes independent, de-identified datasets for clinical research. The scope includes separate tasks for predicting 30-day readmission risk (Logistic Regression) and estimating insurance claim amounts (Random Forest) using task-specific clinical data.
            </p>
          </SurfaceCard>

          <SurfaceCard className="space-y-5 border-t-2 border-t-primary/30">
            <h3 className="text-2xl font-semibold tracking-tight">Security Design</h3>
            <p className="text-base text-muted-foreground leading-relaxed">
              Built with a "secure-by-default" mindset, the system employs strict Role-Based Access Control (RBAC), enforces Google OAuth for authentication, and validates all analytical inputs to prevent data poisoning or unauthorized access.
            </p>
          </SurfaceCard>

          <SurfaceCard className="space-y-5 border-t-2 border-t-warning/70 bg-gradient-to-br from-warning/10 to-transparent">
            <div className="flex items-center gap-3">
              <span className="text-warning text-2xl">⚠️</span>
              <h3 className="text-2xl font-semibold text-warning tracking-tight">Important Limitations</h3>
            </div>
            <p className="text-base text-muted-foreground leading-relaxed">
              This system is strictly for educational and analytical demonstration. It is not HIPAA compliant, does not provide medical diagnoses, and must never be used to replace professional clinical judgment or real hospital production systems.
            </p>
          </SurfaceCard>
        </section>
      </Container>
    </AppShell>
  );
}
