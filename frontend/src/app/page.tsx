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
      <Container className="space-y-12 pb-12">
        {/* Hero Section */}
        <section className="pt-12 pb-8 md:pt-20 md:pb-16 text-center max-w-3xl mx-auto">
          <StatusBadge status="info" label="AdmitGuard v1.0 Preview" className="mb-6" />
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl mb-6">
            Intelligent Risk Estimation for Healthcare Workflows
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            A modern decision-support analytics preview designed to forecast diabetes patient readmission likelihood and estimate associated claim burden. 
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button variant="primary">Launch Dashboard</Button>
            <Button variant="outline">View Batch Upload</Button>
          </div>
        </section>

        {/* Analytics Preview Metrics */}
        <section>
          <SectionHeader 
            title="Cohort Overview" 
            description="At-a-glance metrics for the current patient cohort." 
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard 
              title="Total Analyzed" 
              value="1,248" 
              trend={{ value: "+12%", isPositive: true }} 
              description="Patients this month"
            />
            <MetricCard 
              title="High Risk Readmission" 
              value="14.2%" 
              trend={{ value: "+1.1%", isPositive: false }} 
              description="Probability > 75%"
            />
            <MetricCard 
              title="Est. Claim Burden" 
              value="$4.2M" 
              trend={{ value: "-$200k", isPositive: true }} 
              description="Projected 30-day"
            />
            <MetricCard 
              title="Model Confidence" 
              value="92.4%" 
              description="Average SHAP validity"
            />
          </div>
        </section>

        {/* Prediction Cards */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <SurfaceCard hoverEffect className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg">Readmission Risk</h3>
              <StatusBadge status="danger" label="High Risk" />
            </div>
            <p className="text-sm text-muted-foreground flex-1">
              Patient #8271 exhibits a 78% likelihood of 30-day readmission driven by A1C levels and recent emergency visits.
            </p>
            <div className="pt-4 border-t border-border/50">
              <Button variant="outline" className="w-full text-xs">View Patient Profile</Button>
            </div>
          </SurfaceCard>

          <SurfaceCard hoverEffect className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg">Claim Forecast</h3>
              <StatusBadge status="warning" label="Elevated" />
            </div>
            <p className="text-sm text-muted-foreground flex-1">
              Estimated claim amount is projected at $12,450, exceeding the baseline cohort average by 24%.
            </p>
            <div className="pt-4 border-t border-border/50">
              <Button variant="outline" className="w-full text-xs">Analyze Cost Drivers</Button>
            </div>
          </SurfaceCard>

          <SurfaceCard hoverEffect className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg">Triage Workflow</h3>
              <StatusBadge status="success" label="Active" />
            </div>
            <p className="text-sm text-muted-foreground flex-1">
              Case forwarded to care management team for immediate preventative intervention scheduling.
            </p>
            <div className="pt-4 border-t border-border/50">
              <Button variant="outline" className="w-full text-xs">Review Protocol</Button>
            </div>
          </SurfaceCard>
        </section>

        {/* Security & Privacy Note */}
        <section className="pt-8">
          <SurfaceCard className="bg-primary/5 border-primary/20">
            <div className="flex gap-4 items-start">
              <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                <span className="text-primary text-xl">🔒</span>
              </div>
              <div>
                <h4 className="font-semibold mb-1">Security & Usage Disclaimer</h4>
                <p className="text-sm text-muted-foreground">
                  This application uses role-based access control and strict data validation. It is intended strictly for 
                  analytical demonstration and educational decision-support. Do not use these ML risk estimations 
                  as a substitute for professional medical diagnosis or clinical judgment.
                </p>
              </div>
            </div>
          </SurfaceCard>
        </section>
      </Container>
    </AppShell>
  );
}
