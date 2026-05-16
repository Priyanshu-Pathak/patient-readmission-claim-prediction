"use client";

import React, { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Container } from "@/components/ui/Container";
import { api, ApiError } from "@/lib/api";
import type { AnalyticsSummary } from "@/lib/types";

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
        <section className="max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full surface-panel mb-6 border border-border">
            <span className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">Hospital Benchmarking</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight mb-4 text-foreground">
            HRRP <span className="text-primary font-bold">Analytics</span>
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl mb-4">
            Aggregate hospital-level performance benchmarks derived from the CMS Hospital Readmissions Reduction Program dataset.
          </p>
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-warning bg-warning/10 border border-warning/20 px-3 py-2 rounded">
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            This is not patient-level or claim prediction data.
          </div>
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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* ── Condition Summary Table ──────────────────────────── */}
              <section className="surface-panel rounded border border-border flex flex-col overflow-hidden">
                <div className="p-6 border-b border-border/50 bg-muted/20">
                  <h2 className="text-sm font-semibold uppercase tracking-widest text-foreground">Condition Performance</h2>
                </div>
                <div className="p-0 overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-border bg-muted/10">
                        <th className="py-3 px-6 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Condition</th>
                        <th className="py-3 px-6 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Records</th>
                        <th className="py-3 px-6 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Avg ERR</th>
                        <th className="py-3 px-6 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">High Risk %</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50 text-sm">
                      {conditions.map((row) => (
                        <tr key={row.condition_code} className="hover:bg-muted/20 transition-colors">
                          <td className="py-3 px-6 font-medium text-foreground">{row.condition_label}</td>
                          <td className="py-3 px-6 text-muted-foreground tabular-nums">
                            {row.record_count.toLocaleString()}
                          </td>
                          <td className="py-3 px-6">
                            <ErrBadge value={row.average_err} />
                          </td>
                          <td className="py-3 px-6 min-w-[120px]">
                            <InlineBar pct={row.percent_above_benchmark} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              {/* ── State Summary Table ──────────────────────────────── */}
              <section className="surface-panel rounded border border-border flex flex-col overflow-hidden">
                <div className="p-6 border-b border-border/50 bg-muted/20">
                  <h2 className="text-sm font-semibold uppercase tracking-widest text-foreground">State Concentration</h2>
                </div>
                <div className="p-0 overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-border bg-muted/10">
                        <th className="py-3 px-6 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">State</th>
                        <th className="py-3 px-6 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Records</th>
                        <th className="py-3 px-6 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Avg ERR</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50 text-sm">
                      {states.slice(0, 7).map((row) => (
                        <tr key={row.state} className="hover:bg-muted/20 transition-colors">
                          <td className="py-3 px-6 font-medium text-foreground">
                            {row.state}
                          </td>
                          <td className="py-3 px-6 text-muted-foreground tabular-nums">
                            {row.record_count.toLocaleString()}
                          </td>
                          <td className="py-3 px-6">
                            <ErrBadge value={row.average_err} />
                          </td>
                        </tr>
                      ))}
                      {states.length > 7 && (
                        <tr>
                          <td
                            colSpan={3}
                            className="py-3 px-6 text-center text-[10px] uppercase tracking-widest text-muted-foreground font-bold"
                          >
                            + {states.length - 7} More States
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </section>
            </div>

            {/* ── Top Outliers Table ───────────────────────────────── */}
            <section className="surface-panel rounded border border-border flex flex-col overflow-hidden">
              <div className="p-6 border-b border-border/50 bg-muted/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-sm font-semibold uppercase tracking-widest text-foreground">Critical Outliers</h2>
                  <p className="text-xs text-muted-foreground mt-1">
                    Facilities with an Excess Readmission Ratio (ERR) &gt; 1.2
                  </p>
                </div>
                <div className="text-[10px] font-bold uppercase tracking-widest px-2 py-1 bg-danger/10 text-danger rounded border border-danger/30">
                  Needs Review
                </div>
              </div>
              <div className="p-0 overflow-x-auto">
                {outliers.length === 0 ? (
                  <div className="p-10 text-center text-muted-foreground">
                    No critical outliers (ERR &gt; 1.2) found in this dataset subset.
                  </div>
                ) : (
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-border bg-muted/10">
                        <th className="py-3 px-6 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Facility Name</th>
                        <th className="py-3 px-6 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">State</th>
                        <th className="py-3 px-6 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Condition</th>
                        <th className="py-3 px-6 text-[10px] font-bold uppercase tracking-wider text-muted-foreground text-right">ERR</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50 text-sm">
                      {outliers.map((row, i) => (
                        <tr key={i} className="hover:bg-muted/20 transition-colors">
                          <td className="py-3 px-6 font-medium text-foreground max-w-[200px] truncate" title={row.facility_name}>
                            {row.facility_name}
                          </td>
                          <td className="py-3 px-6 text-muted-foreground">
                            {row.state}
                          </td>
                          <td className="py-3 px-6 text-muted-foreground">
                            {row.condition_label}
                          </td>
                          <td className="py-3 px-6 text-right">
                            <ErrBadge value={row.excess_readmission_ratio} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </section>
          </div>
        )}
      </Container>
    </AppShell>
  );
}
