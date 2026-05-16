"use client";

import React, { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Container } from "@/components/ui/Container";
import { api, ApiError } from "@/lib/api";
import type { AnalyticsSummary } from "@/lib/types";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { AnalyticsReportPDF } from "@/components/analytics/AnalyticsReportPDF";

// ─── ERR badge helper ────────────────────────────────────────────────────────

function ErrBadge({ value }: { value: number }) {
  if (value > 1.1) {
    return <div className="inline-block text-[10px] px-2 py-0.5 rounded bg-danger/20 text-danger border border-danger/30 font-bold uppercase tracking-widest">{value.toFixed(4)}</div>;
  }
  if (value > 1.0) {
    return <div className="inline-block text-[10px] px-2 py-0.5 rounded bg-warning/20 text-warning border border-warning/30 font-bold uppercase tracking-widest">{value.toFixed(4)}</div>;
  }
  return <div className="inline-block text-[10px] px-2 py-0.5 rounded bg-primary/20 text-primary border border-primary/30 font-bold uppercase tracking-widest">{value.toFixed(4)}</div>;
}

// ─── Inline bar (no library) ──────────────────────────────────────────────────

function InlineBar({ pct }: { pct: number }) {
  const clamped = Math.min(100, Math.max(0, pct));
  const color =
    clamped > 60
      ? "var(--danger)"
      : clamped > 40
      ? "var(--warning)"
      : "var(--primary)";
  return (
    <div className="flex items-center gap-2">
      <div
        className="h-1.5 rounded-full flex-1 bg-muted overflow-hidden"
      >
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${clamped}%`, background: color }}
        />
      </div>
      <span className="text-[10px] font-medium tabular-nums text-foreground w-8 text-right">
        {clamped.toFixed(1)}%
      </span>
    </div>
  );
}

// ─── Loading skeleton ─────────────────────────────────────────────────────────

function LoadingSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="surface-panel rounded p-6 h-28 border-border">
            <div className="h-3 w-24 rounded bg-muted mb-4" />
            <div className="h-8 w-20 rounded bg-muted/60" />
          </div>
        ))}
      </div>
      <div className="surface-panel rounded p-6 h-64 border-border">
        <div className="h-4 w-40 rounded bg-muted mb-6" />
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-3 w-full rounded bg-muted/40 mb-3" />
        ))}
      </div>
    </div>
  );
}

// ─── Error state ──────────────────────────────────────────────────────────────

function ErrorState({ message }: { message: string }) {
  return (
    <div className="surface-panel flex flex-col items-center gap-4 py-12 border-danger/30 rounded">
      <span className="text-4xl">⚠️</span>
      <div className="text-center">
        <h3 className="font-semibold text-lg mb-1 text-foreground">Analytics Unavailable</h3>
        <p className="text-sm text-muted-foreground max-w-md leading-relaxed">
          {message}
        </p>
        <p className="text-xs text-muted-foreground mt-4">
          Ensure the backend is running at <code className="text-primary bg-primary/10 px-1 py-0.5 rounded">http://127.0.0.1:8000</code> and the HRRP dataset is present.
        </p>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AnalyticsPage() {
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    api
      .getAnalyticsSummary()
      .then((res) => {
        if (!cancelled) {
          if (res.success && res.data) {
            setSummary(res.data);
          } else {
            setError(res.error ?? "Unexpected response from analytics endpoint.");
          }
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          const msg =
            err instanceof ApiError
              ? err.message
              : "Failed to connect to the analytics service.";
          setError(msg);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const conditions = summary?.condition_summary ?? [];
  const states = summary?.state_summary ?? [];
  const outliers = summary?.top_outlier_hospitals ?? [];

  return (
    <AppShell>
      <Container className="space-y-12 pb-16 pt-12">
        {/* ── Page Header ─────────────────────────────────────────── */}
        <section className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full surface-panel mb-6 border border-border">
              <span className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">Hospital Benchmarking</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight mb-4 text-foreground">
              HRRP <span className="text-primary font-bold">Analytics</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed mb-4">
              Aggregate hospital-level performance benchmarks derived from the CMS Hospital Readmissions Reduction Program dataset.
            </p>
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-warning bg-warning/10 border border-warning/20 px-3 py-2 rounded">
              <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              This is not patient-level or claim prediction data.
            </div>
          </div>
          
          {mounted && summary && !loading && !error && (
            <div className="flex-shrink-0">
              <PDFDownloadLink
                document={<AnalyticsReportPDF summary={summary} />}
                fileName={`AdmitGuard_HRRP_Analytics_Report_${new Date().getTime()}.pdf`}
                className="inline-flex items-center gap-2 px-4 py-3 text-xs font-bold uppercase tracking-widest bg-primary/10 text-primary border border-primary/30 rounded hover:bg-primary/20 transition-colors"
              >
                {/* @ts-ignore */}
                {({ loading: pdfLoading }) => (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                    {pdfLoading ? "Preparing PDF..." : "Download Analytics Report"}
                  </>
                )}
              </PDFDownloadLink>
            </div>
          )}
        </section>

        {/* ── Loading / Error ──────────────────────────────────────── */}
        {loading && <LoadingSkeleton />}
        {!loading && error && <ErrorState message={error} />}

        {/* ── Main content (only rendered when data is present) ────── */}
        {!loading && !error && summary && (
          <div className="space-y-12">
            {/* ── KPI Metric Cards ─────────────────────────────────── */}
            <section>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="surface-panel p-6 rounded border-border flex flex-col gap-1">
                  <div className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase mb-2">Total Hospitals</div>
                  <div className="text-3xl font-bold text-foreground">{summary.total_hospitals.toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground mt-1">Unique facility entries</div>
                </div>
                <div className="surface-panel p-6 rounded border-border flex flex-col gap-1">
                  <div className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase mb-2">Total Records</div>
                  <div className="text-3xl font-bold text-foreground">{summary.total_records.toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground mt-1">Hospital × condition rows</div>
                </div>
                <div className="surface-panel p-6 rounded border-border flex flex-col gap-1">
                  <div className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase mb-2">States Covered</div>
                  <div className="text-3xl font-bold text-foreground">{summary.total_states}</div>
                  <div className="text-xs text-muted-foreground mt-1">Of 50 US states (partial)</div>
                </div>
                <div className="surface-panel p-6 rounded border-border flex flex-col gap-1">
                  <div className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase mb-2">Average ERR</div>
                  <div className="text-3xl font-bold text-foreground">{summary.average_excess_readmission_ratio.toFixed(4)}</div>
                  <div className="text-xs text-muted-foreground mt-1">Global excess ratio</div>
                </div>
              </div>
            </section>

            {/* ── Dashboard Context & Benchmark Split ──────────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Context Panel */}
              <section className="surface-panel rounded border border-border p-6 flex flex-col gap-4 lg:col-span-1">
                <h2 className="text-[10px] font-bold uppercase tracking-widest text-primary mb-2">How to Read This Dashboard</h2>
                <ul className="space-y-3 text-xs text-muted-foreground">
                  <li className="flex gap-2 items-start"><span className="text-primary mt-0.5">▪</span><span><strong>ERR</strong> = Excess Readmission Ratio.</span></li>
                  <li className="flex gap-2 items-start"><span className="text-primary mt-0.5">▪</span><span><strong>ERR &gt; 1.0</strong> indicates readmissions are <em>worse</em> than expected.</span></li>
                  <li className="flex gap-2 items-start"><span className="text-primary mt-0.5">▪</span><span><strong>ERR ≤ 1.0</strong> indicates readmissions are <em>at or better</em> than expected.</span></li>
                  <li className="flex gap-2 items-start"><span className="text-primary mt-0.5">▪</span><span>CMS-derived aggregate statistics, not AdmitGuard patient predictions.</span></li>
                  <li className="flex gap-2 items-start"><span className="text-primary mt-0.5">▪</span><span>Dataset covers exactly 34 states, not complete national coverage.</span></li>
                </ul>
              </section>

              {/* Benchmark Gauge */}
              <section className="surface-panel rounded border border-border p-6 flex flex-col gap-5 lg:col-span-2 justify-center">
                <div className="flex flex-col gap-1">
                  <h2 className="text-sm font-semibold uppercase tracking-widest text-foreground">Aggregate Benchmark Distribution</h2>
                  <p className="text-xs text-muted-foreground">ERR &gt; 1.0 indicates higher-than-expected readmissions for the aggregate measure.</p>
                </div>
                <div className="w-full bg-primary/20 rounded-full h-6 flex overflow-hidden border border-border/50">
                  <div className="bg-danger h-full transition-all duration-1000" style={{ width: `${summary.percent_above_benchmark}%` }} title="Above Benchmark (Worse)" />
                  <div className="bg-primary h-full transition-all duration-1000" style={{ width: `${100 - summary.percent_above_benchmark}%` }} title="At/Below Benchmark (Better)" />
                </div>
                <div className="flex flex-col sm:flex-row justify-between text-[10px] sm:text-xs font-bold text-muted-foreground uppercase tracking-widest gap-2">
                  <span className="text-danger flex items-center gap-2">
                    <span className="w-3 h-3 rounded-sm bg-danger shadow-[0_0_8px_rgba(220,38,38,0.5)]"></span> 
                    {summary.percent_above_benchmark.toFixed(1)}% Above Benchmark
                  </span>
                  <span className="text-primary flex items-center gap-2">
                    <span className="w-3 h-3 rounded-sm bg-primary shadow-[0_0_8px_rgba(13,148,136,0.5)]"></span> 
                    {(100 - summary.percent_above_benchmark).toFixed(1)}% At/Below Benchmark
                  </span>
                </div>
              </section>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              {/* ── Condition Visual Cards ──────────────────────────── */}
              <section className="flex flex-col gap-4">
                <h2 className="text-sm font-semibold uppercase tracking-widest text-foreground pl-1">Condition Performance</h2>
                <div className="space-y-3">
                  {conditions.map((row) => (
                    <div key={row.condition_code} className="surface-panel p-5 rounded border border-border hover-card-elevation flex flex-col gap-3 transition-colors">
                      <div className="flex justify-between items-start">
                        <div className="font-semibold text-foreground text-sm">{row.condition_label}</div>
                        <ErrBadge value={row.average_err} />
                      </div>
                      <div className="flex items-center gap-4 text-xs">
                        <div className="flex-1">
                          <div className="flex justify-between text-[10px] text-muted-foreground uppercase tracking-widest mb-1">
                            <span>Above Benchmark %</span>
                            <span className="font-bold text-foreground">{row.percent_above_benchmark.toFixed(1)}%</span>
                          </div>
                          <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                            <div className={`h-full rounded-full transition-all ${row.percent_above_benchmark > 50 ? 'bg-danger' : 'bg-primary'}`} style={{ width: `${row.percent_above_benchmark}%` }} />
                          </div>
                        </div>
                        <div className="flex flex-col items-end w-16 border-l border-border/50 pl-4">
                          <span className="text-lg font-bold text-foreground leading-none">{row.record_count.toLocaleString()}</span>
                          <span className="text-[9px] text-muted-foreground uppercase tracking-widest mt-1">Records</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* ── State Ranking Bars ──────────────────────────────── */}
              <section className="flex flex-col gap-4">
                <div className="flex justify-between items-end pl-1">
                  <h2 className="text-sm font-semibold uppercase tracking-widest text-foreground">Top States by Average ERR</h2>
                  <span className="text-[9px] uppercase tracking-widest text-muted-foreground">Only 34 states represented</span>
                </div>
                <div className="surface-panel p-6 rounded border border-border">
                  <div className="space-y-5">
                    {states.slice(0, 7).map((row, i) => (
                      <div key={row.state} className="flex items-center gap-3 sm:gap-4">
                        <div className="w-4 sm:w-8 text-xs font-bold text-muted-foreground text-right">{i + 1}.</div>
                        <div className="w-8 sm:w-12 text-sm font-bold text-foreground">{row.state}</div>
                        <div className="flex-1 flex items-center gap-2 sm:gap-3">
                          <div className="h-6 flex-1 bg-muted/30 rounded overflow-hidden relative">
                             {/* Base this bar on ERR, scaled. Max visual scale ~ 1.15 */}
                             <div className={`h-full transition-all duration-700 ${row.average_err > 1.0 ? 'bg-danger/80' : 'bg-primary/80'} absolute left-0 top-0`} style={{ width: `${Math.min(100, (row.average_err / 1.15) * 100)}%` }} />
                             {/* Benchmark Line at 1.0 */}
                             <div className="absolute top-0 bottom-0 border-l border-dashed border-foreground/30 z-10" style={{ left: `${(1.0 / 1.15) * 100}%` }} title="Benchmark 1.0"></div>
                          </div>
                          <div className="w-10 sm:w-12 text-right">
                            <span className={`text-xs font-bold ${row.average_err > 1.0 ? 'text-danger' : 'text-primary'}`}>{row.average_err.toFixed(3)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                    {states.length > 7 && (
                      <div className="pt-4 border-t border-border/50 text-center text-[10px] uppercase tracking-widest text-muted-foreground font-bold">
                        + {states.length - 7} More States Not Shown
                      </div>
                    )}
                  </div>
                </div>
              </section>
            </div>

            {/* ── Top Outlier Cards ───────────────────────────────── */}
            <section className="flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row justify-between sm:items-end pl-1 gap-2">
                <div>
                  <h2 className="text-sm font-semibold uppercase tracking-widest text-foreground">Critical Outliers</h2>
                  <p className="text-xs text-muted-foreground mt-1">
                    Highest ERR observations in this historical dataset.
                  </p>
                </div>
                <div className="self-start sm:self-auto text-[10px] font-bold uppercase tracking-widest px-2 py-1 bg-danger/10 text-danger rounded border border-danger/30">
                  High ERR Observation
                </div>
              </div>
              
              {outliers.length === 0 ? (
                <div className="surface-panel p-10 rounded border border-border text-center text-muted-foreground">
                  No critical outliers (ERR &gt; 1.2) found in this dataset subset.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {outliers.map((row, i) => (
                    <div key={i} className="surface-panel p-5 rounded border border-border hover-card-elevation flex flex-col justify-between min-h-[140px]">
                      <div className="flex justify-between items-start mb-4 gap-2">
                        <div className="font-semibold text-foreground text-sm line-clamp-2" title={row.facility_name}>{row.facility_name}</div>
                        <div className="flex-shrink-0 text-xl font-extrabold text-danger tabular-nums leading-none">
                          {row.excess_readmission_ratio.toFixed(3)}
                        </div>
                      </div>
                      <div className="flex justify-between items-end mt-auto">
                        <div className="flex flex-col gap-1">
                          <span className="text-[9px] uppercase tracking-widest text-muted-foreground">Condition</span>
                          <span className="text-[11px] text-foreground font-medium">{row.condition_label}</span>
                        </div>
                        <span className="px-2 py-1 bg-muted/30 rounded text-xs border border-border uppercase tracking-widest text-muted-foreground font-bold shrink-0 ml-2">{row.state}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        )}
      </Container>
    </AppShell>
  );
}
