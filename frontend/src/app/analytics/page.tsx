"use client";

import React, { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SurfaceCard } from "@/components/ui/SurfaceCard";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { MetricCard } from "@/components/ui/MetricCard";
import { api, ApiError } from "@/lib/api";
import type { AnalyticsSummary } from "@/lib/types";

// ─── ERR badge helper ────────────────────────────────────────────────────────

function ErrBadge({ value }: { value: number }) {
  if (value > 1.1) {
    return <StatusBadge status="danger" label={value.toFixed(4)} />;
  }
  if (value > 1.0) {
    return <StatusBadge status="warning" label={value.toFixed(4)} />;
  }
  return <StatusBadge status="success" label={value.toFixed(4)} />;
}

// ─── Inline bar (no library) ──────────────────────────────────────────────────

function InlineBar({ pct }: { pct: number }) {
  const clamped = Math.min(100, Math.max(0, pct));
  const color =
    clamped > 60
      ? "var(--danger)"
      : clamped > 40
      ? "var(--warning)"
      : "var(--success)";
  return (
    <div className="flex items-center gap-2">
      <div
        className="h-1.5 rounded-full flex-1"
        style={{ background: "var(--border)" }}
      >
        <div
          className="h-1.5 rounded-full transition-all"
          style={{ width: `${clamped}%`, background: color }}
        />
      </div>
      <span className="text-xs tabular-nums text-muted-foreground w-10 text-right">
        {clamped.toFixed(1)}%
      </span>
    </div>
  );
}

// ─── Loading skeleton ─────────────────────────────────────────────────────────

function LoadingSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="glass-effect rounded-xl p-6 h-28">
            <div className="h-3 w-24 rounded bg-muted mb-4" />
            <div className="h-8 w-20 rounded bg-muted/60" />
          </div>
        ))}
      </div>
      <div className="glass-effect rounded-xl p-6 h-64">
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
    <SurfaceCard className="flex flex-col items-center gap-4 py-12 border-danger/30">
      <span className="text-4xl">⚠️</span>
      <div className="text-center">
        <h3 className="font-semibold text-lg mb-1">Analytics Unavailable</h3>
        <p className="text-sm text-muted-foreground max-w-md leading-relaxed">
          {message}
        </p>
        <p className="text-xs text-muted-foreground mt-2">
          Ensure the backend is running at{" "}
          <code className="text-primary">http://127.0.0.1:8000</code> and the
          HRRP dataset is present at{" "}
          <code className="text-primary">data/raw/hospital_analytics/hrrp_readmissions.csv</code>.
        </p>
      </div>
    </SurfaceCard>
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
      <Container className="space-y-12 pb-16">
        {/* ── Page Header ─────────────────────────────────────────── */}
        <section className="pt-10 max-w-4xl">
          <div className="flex items-center gap-3 mb-4">
            <StatusBadge status="info" label="Aggregate Hospital Analytics" />
            <StatusBadge status="neutral" label="Static · Historical · CMS HRRP" />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight mb-3">
            Hospital Analytics
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed max-w-3xl">
            Aggregate hospital-level performance benchmarks derived from the{" "}
            <span className="text-foreground font-medium">
              CMS Hospital Readmissions Reduction Program (HRRP)
            </span>{" "}
            dataset. This page shows facility-level Excess Readmission Ratios
            across conditions and states.{" "}
            <span className="text-warning font-medium">
              This is not patient-level prediction, claim prediction, or
              real-time monitoring.
            </span>
          </p>
        </section>

        {/* ── Loading / Error ──────────────────────────────────────── */}
        {loading && <LoadingSkeleton />}
        {!loading && error && <ErrorState message={error} />}

        {/* ── Main content (only rendered when data is present) ────── */}
        {!loading && !error && summary && (
          <>
            {/* ── KPI Metric Cards ─────────────────────────────────── */}
            <section>
              <SectionHeader
                title="Dataset Overview"
                description="Aggregate snapshot of the static HRRP historical dataset."
                className="mb-6"
              />
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <MetricCard
                  title="Total Hospitals"
                  value={summary.total_hospitals.toLocaleString()}
                  description="Unique facility entries"
                />
                <MetricCard
                  title="Total Records"
                  value={summary.total_records.toLocaleString()}
                  description="Hospital × condition rows"
                />
                <MetricCard
                  title="States Covered"
                  value={summary.total_states}
                  description="Of 50 US states (partial)"
                />
                <MetricCard
                  title="Average ERR"
                  value={summary.average_excess_readmission_ratio.toFixed(4)}
                  description="Excess Readmission Ratio (1.0 = expected)"
                />
                <MetricCard
                  title="Above Benchmark"
                  value={`${summary.percent_above_benchmark.toFixed(1)}%`}
                  description="Records with ERR > 1.0"
                />
                <MetricCard
                  title="Data Period"
                  value={summary.period_label}
                  description="Static historical window"
                />
              </div>
            </section>

            {/* ── Condition Summary ─────────────────────────────────── */}
            <section>
              <SectionHeader
                title="Condition Breakdown"
                description="Excess Readmission Ratio aggregated by HRRP condition / measure."
                className="mb-6"
              />
              {conditions.length === 0 ? (
                <SurfaceCard>
                  <p className="text-muted-foreground text-sm text-center py-6">
                    No condition data available.
                  </p>
                </SurfaceCard>
              ) : (
                <SurfaceCard className="overflow-x-auto p-0">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border/40">
                        <th className="text-left px-5 py-3 text-muted-foreground font-medium">
                          Condition
                        </th>
                        <th className="text-right px-5 py-3 text-muted-foreground font-medium">
                          Records
                        </th>
                        <th className="text-center px-5 py-3 text-muted-foreground font-medium">
                          Avg ERR
                        </th>
                        <th className="px-5 py-3 text-muted-foreground font-medium w-48">
                          % Above Benchmark
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {conditions.map((c) => (
                        <tr
                          key={c.condition_code}
                          className="border-b border-border/20 hover:bg-muted/20 transition-colors"
                        >
                          <td className="px-5 py-3">
                            <span className="font-medium">{c.condition_label}</span>
                            <span className="ml-2 text-xs text-muted-foreground font-mono">
                              {c.condition_code}
                            </span>
                          </td>
                          <td className="px-5 py-3 text-right tabular-nums text-muted-foreground">
                            {c.record_count.toLocaleString()}
                          </td>
                          <td className="px-5 py-3 text-center">
                            <ErrBadge value={c.average_err} />
                          </td>
                          <td className="px-5 py-3">
                            <InlineBar pct={c.percent_above_benchmark} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </SurfaceCard>
              )}
            </section>

            {/* ── State Summary ─────────────────────────────────────── */}
            <section>
              <SectionHeader
                title="State Summary"
                description={`Sorted by average ERR (highest first). ${summary.total_states} of 50 US states are represented — results do not reflect national completeness.`}
                className="mb-6"
              />
              {states.length === 0 ? (
                <SurfaceCard>
                  <p className="text-muted-foreground text-sm text-center py-6">
                    No state data available.
                  </p>
                </SurfaceCard>
              ) : (
                <SurfaceCard className="overflow-x-auto p-0">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border/40">
                        <th className="text-left px-5 py-3 text-muted-foreground font-medium">
                          State
                        </th>
                        <th className="text-right px-5 py-3 text-muted-foreground font-medium">
                          Records
                        </th>
                        <th className="text-center px-5 py-3 text-muted-foreground font-medium">
                          Avg ERR
                        </th>
                        <th className="px-5 py-3 text-muted-foreground font-medium w-48">
                          % Above Benchmark
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {states.map((s) => (
                        <tr
                          key={s.state}
                          className="border-b border-border/20 hover:bg-muted/20 transition-colors"
                        >
                          <td className="px-5 py-3 font-semibold">{s.state}</td>
                          <td className="px-5 py-3 text-right tabular-nums text-muted-foreground">
                            {s.record_count.toLocaleString()}
                          </td>
                          <td className="px-5 py-3 text-center">
                            <ErrBadge value={s.average_err} />
                          </td>
                          <td className="px-5 py-3">
                            <InlineBar pct={s.percent_above_benchmark} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </SurfaceCard>
              )}
            </section>

            {/* ── Top Outlier Hospitals ─────────────────────────────── */}
            <section>
              <SectionHeader
                title="Top Outlier Hospitals"
                description="Hospitals with the highest Excess Readmission Ratio across all conditions."
                className="mb-6"
              />
              {outliers.length === 0 ? (
                <SurfaceCard>
                  <p className="text-muted-foreground text-sm text-center py-6">
                    No outlier hospital data available.
                  </p>
                </SurfaceCard>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {outliers.map((h, idx) => (
                    <SurfaceCard
                      key={`${h.facility_name}-${h.condition_code}-${idx}`}
                      hoverEffect
                      className="flex flex-col gap-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="font-semibold text-sm leading-snug truncate">
                            {h.facility_name}
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {h.state} · {h.condition_label}
                          </p>
                        </div>
                        <div className="shrink-0">
                          <ErrBadge value={h.excess_readmission_ratio} />
                        </div>
                      </div>
                      <div className="pt-1 border-t border-border/30">
                        <p className="text-xs text-muted-foreground font-mono">
                          {h.condition_code}
                        </p>
                      </div>
                    </SurfaceCard>
                  ))}
                </div>
              )}
            </section>

            {/* ── Disclaimer / Metadata Block ───────────────────────── */}
            <section>
              <SurfaceCard className="bg-gradient-to-r from-warning/5 to-transparent border-warning/20 p-6 md:p-8">
                <div className="flex flex-col sm:flex-row gap-5 items-start">
                  <div className="h-12 w-12 rounded-xl bg-warning/10 border border-warning/20 flex items-center justify-center shrink-0">
                    <span className="text-xl">📋</span>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-bold text-base text-foreground">
                      Data Framing &amp; Disclaimer
                    </h4>
                    <ul className="text-sm text-muted-foreground space-y-1 leading-relaxed list-none">
                      <li>
                        <span className="text-foreground font-medium">Static historical data</span>{" "}
                        — measurement period{" "}
                        <span className="text-foreground">{summary.period_label}</span>. Not
                        updated in real time.
                      </li>
                      <li>
                        <span className="text-foreground font-medium">
                          Not patient-level prediction
                        </span>{" "}
                        — these are aggregate hospital performance metrics.
                      </li>
                      <li>
                        <span className="text-foreground font-medium">
                          Not insurance claim prediction
                        </span>{" "}
                        — no financial claim estimates are presented here.
                      </li>
                      <li>
                        <span className="text-foreground font-medium">
                          Not real-time monitoring
                        </span>{" "}
                        — no live patient or hospital feeds are connected.
                      </li>
                      <li>
                        <span className="text-foreground font-medium">CMS-derived statistics</span>{" "}
                        — the Excess Readmission Ratio and related fields are computed by CMS.
                        They are <em>not</em> outputs of the AdmitGuard ML model.
                      </li>
                      <li>
                        <span className="text-foreground font-medium">Partial coverage</span>{" "}
                        — {summary.total_states} of 50 US states are present in this dataset.
                        National completeness cannot be inferred.
                      </li>
                    </ul>
                    {summary.data_source && (
                      <p className="text-xs text-muted-foreground pt-1 border-t border-border/30 mt-3">
                        Source: {summary.data_source}
                      </p>
                    )}
                  </div>
                </div>
              </SurfaceCard>
            </section>
          </>
        )}
      </Container>
    </AppShell>
  );
}
