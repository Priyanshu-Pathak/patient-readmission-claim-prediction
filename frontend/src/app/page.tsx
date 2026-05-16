import React from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SurfaceCard } from "@/components/ui/SurfaceCard";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { MetricCard } from "@/components/ui/MetricCard";
import { Button } from "@/components/ui/Button";

export default function Home() {
  return (
    <AppShell>
      <Container className="space-y-16 pb-16">
        {/* Hero Section */}
        <section className="pt-10 pb-8 md:pt-24 md:pb-20 text-center max-w-4xl mx-auto flex flex-col items-center">
          <StatusBadge status="info" label="AdmitGuard Clinical Intelligence v1.0" className="mb-6 md:mb-8 px-4 py-1" />
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl mb-6 md:mb-8 leading-tight">
            Intelligent Risk Estimation for <br className="hidden md:block"/> Healthcare Workflows
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground mb-8 md:mb-10 max-w-2xl leading-relaxed">
            A modern decision-support analytics prototype designed to forecast patient readmission risk and estimate insurance claim amounts using task-specific clinical datasets. 
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 w-full sm:w-auto px-4 sm:px-0">
            <Button variant="primary" className="w-full sm:w-auto h-12 px-8 text-base rounded-lg shadow-[0_0_20px_rgba(20,184,166,0.3)]">Launch Dashboard</Button>
            <Button variant="secondary" className="w-full sm:w-auto h-12 px-8 text-base rounded-lg">View Batch Upload</Button>
          </div>
        </section>

        {/* Analytics Preview Metrics */}
        <section className="max-w-6xl mx-auto">
          <SectionHeader 
            title="Hospital Benchmarking" 
            description="Aggregate hospital-level metrics (HRRP-style) for clinical performance review." 
            className="text-center md:text-left mb-10"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard 
              title="Total Analyzed" 
              value="1,248" 
              trend={{ value: "+12%", isPositive: true }} 
              description="Patients this month"
            />
            <MetricCard 
              title="Avg. Readmission Rate" 
              value="14.2%" 
              trend={{ value: "+1.1%", isPositive: false }} 
              description="National Benchmarking"
            />
            <MetricCard 
              title="Avg. Claim Amount" 
              value="$13.4k" 
              trend={{ value: "-$200", isPositive: true }} 
              description="Historical Claims Data"
            />
            <MetricCard 
              title="Model Confidence" 
              value="92.4%" 
              description="Average SHAP validity"
            />
          </div>
        </section>

        {/* Prediction Cards */}
        <section className="max-w-6xl mx-auto">
          <SectionHeader 
            title="Core Capabilities" 
            description="Deep insights powered by explainable AI." 
            className="text-center md:text-left mb-10"
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <SurfaceCard hoverEffect className="flex flex-col gap-5 border-t-2 border-t-danger/50">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-xl">Readmission Risk</h3>
                <StatusBadge status="danger" label="High Risk" />
              </div>
              <p className="text-sm text-muted-foreground flex-1 leading-relaxed">
                Identify systemic drivers for 30-day readmission risk using explainable AI models and task-specific datasets.
              </p>
              <div className="pt-5 border-t border-border/50">
                <Button variant="outline" className="w-full text-sm h-10 border-primary/20 hover:border-primary/50 hover:text-primary">View Patient Profile</Button>
              </div>
            </SurfaceCard>

            <SurfaceCard hoverEffect className="flex flex-col gap-5 border-t-2 border-t-warning/50">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-xl">Claim Forecast</h3>
                <StatusBadge status="warning" label="Elevated" />
              </div>
              <p className="text-sm text-muted-foreground flex-1 leading-relaxed">
                Estimate insurance claim amounts based on historical patient demographics and clinical history features.
              </p>
              <div className="pt-5 border-t border-border/50">
                <Button variant="outline" className="w-full text-sm h-10 border-primary/20 hover:border-primary/50 hover:text-primary">Analyze Cost Drivers</Button>
              </div>
            </SurfaceCard>

            <SurfaceCard hoverEffect className="flex flex-col gap-5 border-t-2 border-t-primary/50">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-xl">Triage Workflow</h3>
                <StatusBadge status="success" label="Active" />
              </div>
              <p className="text-sm text-muted-foreground flex-1 leading-relaxed">
                Case forwarded to care management team for immediate preventative intervention scheduling.
              </p>
              <div className="pt-5 border-t border-border/50">
                <Button variant="outline" className="w-full text-sm h-10 border-primary/20 hover:border-primary/50 hover:text-primary">Review Protocol</Button>
              </div>
            </SurfaceCard>
          </div>
        </section>

        {/* Security & Privacy Note (Stitch Recommended Compliance Section) */}
        <section className="pt-12 max-w-4xl mx-auto">
          <SurfaceCard className="bg-gradient-to-r from-primary/10 to-transparent border-primary/30 shadow-[0_0_30px_rgba(20,184,166,0.05)] p-8">
            <div className="flex flex-col sm:flex-row gap-6 items-start">
              <div className="h-14 w-14 rounded-2xl bg-primary/20 flex items-center justify-center shrink-0 border border-primary/40 shadow-[0_0_15px_rgba(20,184,166,0.2)]">
                <span className="text-primary text-2xl">🔒</span>
              </div>
              <div>
                <h4 className="text-xl font-bold mb-2 text-foreground tracking-tight">Compliance & Security Disclaimer</h4>
                <p className="text-base text-muted-foreground leading-relaxed">
                  This application uses role-based access control and strict data validation. It is intended strictly for 
                  analytical demonstration and educational decision-support. Do not use these ML risk estimations 
                  as a substitute for professional medical diagnosis or clinical judgment. Not HIPAA compliant.
                </p>
              </div>
            </div>
          </SurfaceCard>
        </section>
      </Container>
    </AppShell>
  );
}
