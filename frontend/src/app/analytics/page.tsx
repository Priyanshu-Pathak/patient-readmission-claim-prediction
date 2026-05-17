"use client";

import React, { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Container } from "@/components/ui/Container";
import { api, ApiError } from "@/lib/api";
import type { AnalyticsExploreResponse } from "@/lib/types";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { AnalyticsReportPDF } from "@/components/analytics/AnalyticsReportPDF";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  ReferenceLine,
} from "recharts";

// ─── Custom Tooltip ─────────────────────────────────────────────────────────

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#0b1326] border border-border p-3 rounded shadow-lg text-xs">
        <p className="font-bold text-foreground mb-1">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} style={{ color: entry.color || "var(--primary)" }}>
            {entry.name}: <span className="font-bold">{entry.value.toLocaleString()}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// ─── Loading skeleton ─────────────────────────────────────────────────────────

function LoadingSkeleton() {
  return (
    <div className="space-y-8 animate-pulse mt-8">
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
    <div className="surface-panel flex flex-col items-center gap-4 py-12 border-danger/30 rounded mt-8">
      <span className="text-4xl">⚠️</span>
      <div className="text-center">
        <h3 className="font-semibold text-lg mb-1 text-foreground">Analytics Unavailable</h3>
        <p className="text-sm text-muted-foreground max-w-md leading-relaxed">
          {message}
        </p>
        <p className="text-xs text-muted-foreground mt-4">
          Ensure the backend is running and the HRRP dataset is present.
        </p>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AnalyticsPage() {
  const [summary, setSummary] = useState<AnalyticsExploreResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  // Filters state
  const [stateFilter, setStateFilter] = useState<string>("");
  const [conditionFilter, setConditionFilter] = useState<string>("");
  const [topNFilter, setTopNFilter] = useState<number>(10);

  // Options state from first load to populate dropdowns
  const [globalOptions, setGlobalOptions] = useState<{ states: string[]; conditions: string[] } | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    api
      .getAnalyticsExplore({
        state: stateFilter || undefined,
        condition: conditionFilter || undefined,
        top_n: topNFilter,
      })
      .then((res) => {
        if (!cancelled) {
          if (res.success && res.data) {
            setSummary(res.data);
            if (!globalOptions) {
              setGlobalOptions(res.data.filter_options);
            }
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
  }, [stateFilter, conditionFilter, topNFilter]);

  const handleResetFilters = () => {
    setStateFilter("");
    setConditionFilter("");
    setTopNFilter(10);
  };

  const conditions = summary?.condition_summary ?? [];
  const states = summary?.state_summary ?? [];
  const outliers = summary?.top_outlier_hospitals ?? [];
  const errDistribution = summary?.err_distribution ?? [];

  // Colors for dark theme
  const colors = {
    primary: "#0d9488", // teal-600 equivalent / cyan
    danger: "#dc2626", // red-600
    warning: "#d97706", // amber-600
    muted: "#4b5563",
    text: "#e5e7eb",
    grid: "rgba(75, 85, 99, 0.2)",
  };

  // Format data for benchmark split (Donut)
  const percentAbove = summary?.percent_above_benchmark ?? 0;
  const pieData = [
    { name: "At or Below Benchmark", value: 100 - percentAbove, color: colors.primary },
    { name: "Above Benchmark (Worse)", value: percentAbove, color: colors.danger },
  ];

  // Format histogram data
  const histData = errDistribution.map((bin) => ({
    label: `${bin.bin_start.toFixed(2)} - ${bin.bin_end.toFixed(2)}`,
    count: bin.count,
    bin_start: bin.bin_start,
  }));

  // Format condition comparison
  const condData = conditions.map((c) => ({
    name: c.condition_code,
    label: c.condition_label,
    "Average ERR": Number(c.average_err.toFixed(3)),
    "Records": c.record_count,
  }));

  // Format state ranking
  const stateData = states.slice(0, 10).map((s) => ({
    name: s.state,
    "Average ERR": Number(s.average_err.toFixed(3)),
  }));

  return (
    <AppShell>
      <Container className="space-y-8 pb-16 pt-12">
        {/* ── Page Header ─────────────────────────────────────────── */}
        <section className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full surface-panel mb-6 border border-border">
              <span className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">Interactive Benchmarking</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight mb-4 text-foreground">
              HRRP <span className="text-primary font-bold">Analytics Explore</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed mb-4">
              Explore dynamic hospital-level performance benchmarks. Discover trends across states and conditions.
            </p>
            <div className="inline-flex flex-wrap items-center gap-2 text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-warning bg-warning/10 border border-warning/20 px-3 py-2 rounded">
              <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              Static Historical Aggregate Data • Not Patient-Level Prediction
            </div>
          </div>
          
          {mounted && summary && !loading && !error && (
            <div className="flex-shrink-0">
              <PDFDownloadLink
                document={
                  <AnalyticsReportPDF 
                    summary={summary} 
                    filters={{ 
                      state: stateFilter, 
                      condition: conditionFilter, 
                      top_n: topNFilter 
                    }} 
                  />
                }
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

        {/* ── Filter Bar ───────────────────────────────────────────── */}
        <section className="surface-panel p-4 rounded border border-border flex flex-col md:flex-row gap-4 items-end">
          <div className="w-full md:w-auto flex-1">
            <label className="block text-[10px] font-bold tracking-widest text-muted-foreground uppercase mb-2">State</label>
            <select 
              value={stateFilter} 
              onChange={(e) => setStateFilter(e.target.value)}
              className="w-full bg-[#0b1326] border border-border rounded px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary"
            >
              <option value="">All States</option>
              {globalOptions?.states.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div className="w-full md:w-auto flex-[2]">
            <label className="block text-[10px] font-bold tracking-widest text-muted-foreground uppercase mb-2">Condition</label>
            <select 
              value={conditionFilter} 
              onChange={(e) => setConditionFilter(e.target.value)}
              className="w-full bg-[#0b1326] border border-border rounded px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary"
            >
              <option value="">All Conditions</option>
              {globalOptions?.conditions.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div className="w-full md:w-32">
            <label className="block text-[10px] font-bold tracking-widest text-muted-foreground uppercase mb-2">Top N Outliers</label>
            <select 
              value={topNFilter} 
              onChange={(e) => setTopNFilter(Number(e.target.value))}
              className="w-full bg-[#0b1326] border border-border rounded px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary"
            >
              <option value={5}>Top 5</option>
              <option value={10}>Top 10</option>
              <option value={20}>Top 20</option>
              <option value={50}>Top 50</option>
            </select>
          </div>
          <div className="w-full md:w-auto pt-2">
            <button 
              onClick={handleResetFilters}
              disabled={!stateFilter && !conditionFilter && topNFilter === 10}
              className="w-full md:w-auto px-6 py-2 text-xs font-bold uppercase tracking-widest bg-muted/20 text-muted-foreground border border-border rounded hover:bg-muted/30 hover:text-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Reset
            </button>
          </div>
        </section>

        {/* ── Loading / Error ──────────────────────────────────────── */}
        {loading && <LoadingSkeleton />}
        {!loading && error && <ErrorState message={error} />}

        {/* ── Main content (only rendered when data is present) ────── */}
        {!loading && !error && summary && (
          <div className="space-y-8">
            {/* ── KPI Metric Cards ─────────────────────────────────── */}
            <section>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="surface-panel p-6 rounded border-border flex flex-col gap-1 hover:border-primary/50 transition-colors">
                  <div className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase mb-2">Hospitals Filtered</div>
                  <div className="text-3xl font-bold text-foreground">{summary.total_hospitals.toLocaleString()}</div>
                </div>
                <div className="surface-panel p-6 rounded border-border flex flex-col gap-1 hover:border-primary/50 transition-colors">
                  <div className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase mb-2">Records Filtered</div>
                  <div className="text-3xl font-bold text-foreground">{summary.total_records.toLocaleString()}</div>
                </div>
                <div className="surface-panel p-6 rounded border-border flex flex-col gap-1 hover:border-primary/50 transition-colors">
                  <div className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase mb-2">Average ERR</div>
                  <div className={`text-3xl font-bold ${summary.average_excess_readmission_ratio > 1.0 ? 'text-danger' : 'text-primary'}`}>
                    {summary.average_excess_readmission_ratio.toFixed(4)}
                  </div>
                </div>
                <div className="surface-panel p-6 rounded border-border flex flex-col gap-1 hover:border-primary/50 transition-colors">
                  <div className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase mb-2">% Above Benchmark</div>
                  <div className={`text-3xl font-bold ${summary.percent_above_benchmark > 50 ? 'text-danger' : 'text-primary'}`}>
                    {summary.percent_above_benchmark.toFixed(1)}%
                  </div>
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
                  <li className="flex gap-2 items-start"><span className="text-primary mt-0.5">▪</span><span>Dataset covers 34 states. CMS-derived statistics.</span></li>
                </ul>
              </section>

              {/* Benchmark Donut */}
              <section className="surface-panel rounded border border-border p-6 flex flex-col gap-2 lg:col-span-2">
                <div className="flex justify-between items-start">
                  <h2 className="text-sm font-semibold uppercase tracking-widest text-foreground">Benchmark Split</h2>
                  <div className="text-[10px] text-muted-foreground uppercase">Filtered set distribution</div>
                </div>
                <div className="h-48 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={75}
                        paddingAngle={5}
                        dataKey="value"
                        stroke="none"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex justify-center gap-6 mt-2">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="w-3 h-3 rounded-full bg-primary shadow-[0_0_8px_rgba(13,148,136,0.5)]" />
                    <span className="text-muted-foreground">At/Below:</span>
                    <span className="font-bold text-foreground">{(100 - percentAbove).toFixed(1)}%</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="w-3 h-3 rounded-full bg-danger shadow-[0_0_8px_rgba(220,38,38,0.5)]" />
                    <span className="text-muted-foreground">Above:</span>
                    <span className="font-bold text-foreground">{percentAbove.toFixed(1)}%</span>
                  </div>
                </div>
              </section>
            </div>

            {/* ── ERR Distribution Histogram ──────────────────────── */}
            <section className="surface-panel rounded border border-border p-6">
               <div className="flex flex-col mb-6">
                <h2 className="text-sm font-semibold uppercase tracking-widest text-foreground mb-1">ERR Distribution</h2>
                <p className="text-xs text-muted-foreground">Histogram of Excess Readmission Ratios in current selection.</p>
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={histData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} vertical={false} />
                    <XAxis 
                      dataKey="label" 
                      stroke={colors.muted} 
                      fontSize={10} 
                      tickMargin={10}
                      angle={-45}
                      textAnchor="end"
                      interval="preserveStartEnd"
                    />
                    <YAxis stroke={colors.muted} fontSize={10} tickFormatter={(val) => val.toLocaleString()} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="count" fill={colors.primary} name="Records" radius={[2, 2, 0, 0]}>
                       {histData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.bin_start > 1.0 ? colors.danger : colors.primary} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </section>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              {/* ── Condition Comparison Bar Chart ──────────────────────── */}
              <section className="surface-panel rounded border border-border p-6">
                <h2 className="text-sm font-semibold uppercase tracking-widest text-foreground mb-6">Average ERR by Condition</h2>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={condData} layout="vertical" margin={{ top: 0, right: 30, left: 30, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} horizontal={false} />
                      <XAxis type="number" domain={[0.8, 'auto']} stroke={colors.muted} fontSize={10} />
                      <YAxis dataKey="name" type="category" stroke={colors.text} fontSize={10} width={80} />
                      <Tooltip content={<CustomTooltip />} />
                      <ReferenceLine x={1.0} stroke={colors.text} strokeDasharray="3 3" />
                      <Bar dataKey="Average ERR" fill={colors.primary} radius={[0, 2, 2, 0]}>
                        {condData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry["Average ERR"] > 1.0 ? colors.danger : colors.primary} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </section>

              {/* ── State Ranking Bar Chart ──────────────────────────────── */}
              <section className="surface-panel rounded border border-border p-6">
                <div className="flex justify-between items-end mb-6">
                  <h2 className="text-sm font-semibold uppercase tracking-widest text-foreground">Top States by Average ERR</h2>
                  <span className="text-[9px] uppercase tracking-widest text-muted-foreground">Showing Top 10</span>
                </div>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stateData} layout="vertical" margin={{ top: 0, right: 30, left: 10, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} horizontal={false} />
                      <XAxis type="number" domain={[0.8, 'auto']} stroke={colors.muted} fontSize={10} />
                      <YAxis dataKey="name" type="category" stroke={colors.text} fontSize={10} width={40} />
                      <Tooltip content={<CustomTooltip />} />
                      <ReferenceLine x={1.0} stroke={colors.text} strokeDasharray="3 3" />
                      <Bar dataKey="Average ERR" fill={colors.danger} radius={[0, 2, 2, 0]}>
                        {stateData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry["Average ERR"] > 1.0 ? colors.danger : colors.primary} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </section>
            </div>

            {/* ── Top Outlier Cards ───────────────────────────────── */}
            <section className="flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row justify-between sm:items-end pl-1 gap-2">
                <div>
                  <h2 className="text-sm font-semibold uppercase tracking-widest text-foreground">Critical Outliers in Filtered Set</h2>
                  <p className="text-xs text-muted-foreground mt-1">
                    Highest ERR observations based on current selection.
                  </p>
                </div>
                <div className="self-start sm:self-auto text-[10px] font-bold uppercase tracking-widest px-2 py-1 bg-danger/10 text-danger rounded border border-danger/30">
                  High ERR Observation
                </div>
              </div>
              
              {outliers.length === 0 ? (
                <div className="surface-panel p-10 rounded border border-border text-center text-muted-foreground">
                  No records found matching filters.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {outliers.map((row, i) => (
                    <div key={i} className="surface-panel p-5 rounded border border-border hover:border-danger/50 transition-colors flex flex-col justify-between min-h-[140px]">
                      <div className="flex justify-between items-start mb-4 gap-2">
                        <div className="font-semibold text-foreground text-sm line-clamp-2" title={row.facility_name}>{row.facility_name}</div>
                        <div className="flex-shrink-0 text-xl font-extrabold text-danger tabular-nums leading-none">
                          {row.excess_readmission_ratio.toFixed(3)}
                        </div>
                      </div>
                      <div className="flex justify-between items-end mt-auto">
                        <div className="flex flex-col gap-1">
                          <span className="text-[9px] uppercase tracking-widest text-muted-foreground">Condition</span>
                          <span className="text-[11px] text-foreground font-medium">{row.condition_label || row.condition_code}</span>
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
