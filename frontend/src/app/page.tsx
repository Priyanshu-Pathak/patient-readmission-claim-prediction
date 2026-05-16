import React from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export default function Home() {
  return (
    <AppShell>
      <Container className="space-y-24 pb-16 pt-12">
        {/* Hero Section */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          <div className="flex flex-col items-start text-left max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full surface-panel mb-8 border border-border">
              <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
              <span className="text-xs font-bold tracking-widest text-muted-foreground uppercase">Research Prototype</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight mb-6 leading-tight text-foreground">
              Clinical Intelligence for <br className="hidden sm:block"/>
              <span className="text-primary font-bold">Modern Healthcare</span>
            </h1>
            
            <p className="text-lg text-muted-foreground mb-10 leading-relaxed">
              Patient readmission risk, claim estimation, and hospital benchmarking for data-driven decision support. Equip your administrative and clinical teams with authoritative insights to optimize care pathways and manage operational risks.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Button className="h-12 px-8 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded text-sm transition-colors flex items-center justify-center gap-2">
                TRY PREDICTION
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </Button>
              <Button className="h-12 px-8 bg-transparent border border-border hover:bg-muted/50 text-foreground font-semibold rounded text-sm transition-colors flex items-center justify-center gap-2">
                VIEW ANALYTICS
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
              </Button>
            </div>
          </div>
          
          {/* Abstract CSS Dashboard Mock */}
          <div className="w-full h-[400px] surface-panel rounded-xl overflow-hidden flex flex-col relative lg:ml-auto max-w-lg">
            {/* Mock Header */}
            <div className="h-10 border-b border-border flex items-center px-4 gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-muted-foreground/30"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-muted-foreground/30"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-muted-foreground/30"></div>
            </div>
            {/* Mock Content */}
            <div className="p-6 flex-1 flex flex-col gap-6">
              <div className="w-1/3 h-4 bg-muted rounded"></div>
              <div className="flex-1 surface-panel rounded flex items-end justify-around p-4 gap-2 border-border/50">
                <div className="w-full bg-secondary/80 h-[30%] rounded-t"></div>
                <div className="w-full bg-secondary/80 h-[45%] rounded-t"></div>
                <div className="w-full bg-secondary/80 h-[20%] rounded-t"></div>
                <div className="w-full bg-secondary/80 h-[60%] rounded-t"></div>
                <div className="w-full bg-danger/80 h-[85%] rounded-t"></div>
                <div className="w-full bg-secondary/80 h-[35%] rounded-t"></div>
              </div>
              <div className="h-10 flex justify-between gap-4">
                <div className="w-1/4 h-full bg-muted rounded"></div>
                <div className="w-1/4 h-full bg-secondary rounded"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Verified Metrics Strip (No Fake Stats) */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-6 py-8 border-y border-border">
          <div>
            <div className="text-3xl font-bold mb-1 text-foreground">Dual-Model</div>
            <div className="text-sm text-muted-foreground">Leakage-Safe Architecture</div>
          </div>
          <div>
            <div className="text-3xl font-bold mb-1 text-foreground">1,960</div>
            <div className="text-sm text-muted-foreground">Hospitals Benchmarked</div>
          </div>
          <div>
            <div className="text-3xl font-bold mb-1 text-foreground">7,890</div>
            <div className="text-sm text-muted-foreground">HRRP Records Analyzed</div>
          </div>
          <div>
            <div className="text-3xl font-bold mb-1 text-foreground">34</div>
            <div className="text-sm text-muted-foreground">States Covered</div>
          </div>
        </section>

        {/* Core Capabilities */}
        <section>
          <div className="mb-10">
            <h2 className="text-3xl font-semibold mb-3">Core Capabilities</h2>
            <p className="text-muted-foreground">Comprehensive analytical tools designed for hospital administration and clinical oversight.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="surface-panel p-8 flex flex-col gap-4 rounded-lg">
              <div className="h-10 w-10 bg-muted rounded flex items-center justify-center mb-2">
                <svg className="w-5 h-5 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
              </div>
              <h3 className="text-xl font-semibold text-foreground">Readmission Risk</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Evaluate individual patient profiles against historical clinical data to predict the likelihood of 30-day readmissions. Output includes risk stratification scoring and primary contributing factors.
              </p>
            </div>
            
            <div className="surface-panel p-8 flex flex-col gap-4 rounded-lg">
              <div className="h-10 w-10 bg-muted rounded flex items-center justify-center mb-2">
                <svg className="w-5 h-5 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              </div>
              <h3 className="text-xl font-semibold text-foreground">Claim Estimation</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Generate projected insurance claim costs based on primary diagnoses, patient demographics, and required interventions prior to formal billing cycles.
              </p>
            </div>
            
            <div className="surface-panel p-8 flex flex-col gap-4 rounded-lg">
              <div className="h-10 w-10 bg-muted rounded flex items-center justify-center mb-2">
                <svg className="w-5 h-5 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
              </div>
              <h3 className="text-xl font-semibold text-foreground">HRRP Analytics</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Macro-level dashboarding for Hospital Readmissions Reduction Program compliance. Compare internal metrics against national benchmarks across key condition categories.
              </p>
            </div>
          </div>
        </section>

        {/* Data Integrity */}
        <section className="surface-panel p-8 md:p-12 rounded-xl flex flex-col lg:flex-row gap-12 border-border">
          <div className="lg:w-1/3">
            <h2 className="text-2xl font-semibold mb-4 text-foreground">Data Integrity</h2>
            <p className="text-muted-foreground leading-relaxed text-sm mb-6">
              Our models are trained on distinct, segregated datasets ensuring robust generalizability across diverse clinical settings.
            </p>
            <a href="/how-it-works" className="text-primary text-sm font-semibold flex items-center gap-2 hover:underline">
              VIEW METHODOLOGY
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </a>
          </div>
          
          <div className="lg:w-2/3 flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 surface-panel p-5 rounded border-border/50">
                <div className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase mb-1">Source Scope</div>
                <div className="text-sm font-medium text-foreground">Clinical & Demographic Public Data</div>
              </div>
              <div className="flex-1 surface-panel p-5 rounded border-border/50">
                <div className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase mb-1">Model Architecture</div>
                <div className="text-sm font-medium text-foreground">Logistic Reg. & Random Forest</div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 surface-panel p-5 rounded border-border/50">
                <div className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase mb-1">Security Standard</div>
                <div className="text-sm font-medium text-foreground">Prototype Only (Not HIPAA Compliant)</div>
              </div>
              <div className="flex-1 surface-panel p-5 rounded border-border/50">
                <div className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase mb-1">Update Frequency</div>
                <div className="text-sm font-medium text-foreground">Static Demonstration Assets</div>
              </div>
            </div>
          </div>
        </section>

        {/* Disclaimer Strip */}
        <section className="surface-panel p-6 rounded-lg flex items-start gap-4">
          <div className="mt-0.5">
            <svg className="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            <strong className="text-foreground">Disclaimer:</strong> AdmitGuard Intelligence is currently a prototype developed for research and demonstration purposes. The predictions and financial estimations provided by this tool are generated by machine learning models and should not be used as the sole basis for clinical diagnosis, patient care decisions, or formal financial billing. Always consult qualified healthcare professionals and official CMS documentation.
          </p>
        </section>
      </Container>
    </AppShell>
  );
}
