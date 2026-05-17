import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import type { AnalyticsExploreResponse } from "@/lib/types";

const styles = StyleSheet.create({
  page: {
    padding: 40,
    backgroundColor: "#ffffff",
    fontFamily: "Helvetica",
    color: "#1f2937",
  },
  header: {
    marginBottom: 20,
    borderBottom: "2px solid #e5e7eb",
    paddingBottom: 15,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#0b1326",
  },
  headerSubtitle: {
    fontSize: 10,
    color: "#6b7280",
    marginTop: 5,
    textTransform: "uppercase",
  },
  metadataRow: {
    flexDirection: "row",
    marginTop: 15,
    gap: 20,
  },
  metadataItem: {
    fontSize: 9,
    color: "#4b5563",
  },
  metadataLabel: {
    fontWeight: "bold",
    color: "#111827",
  },
  filterBox: {
    marginTop: 10,
    padding: 8,
    backgroundColor: "#f3f4f6",
    borderRadius: 4,
    flexDirection: "row",
    gap: 15,
  },
  filterItem: {
    fontSize: 8,
    color: "#374151",
  },
  filterLabel: {
    fontWeight: "bold",
    color: "#111827",
    textTransform: "uppercase",
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#14b8a6",
    textTransform: "uppercase",
    marginBottom: 10,
    letterSpacing: 1,
  },
  sectionSubtitle: {
    fontSize: 8,
    color: "#6b7280",
    marginBottom: 10,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  kpiCard: {
    width: "31%",
    padding: 10,
    border: "1px solid #e5e7eb",
    borderRadius: 4,
    backgroundColor: "#f9fafb",
    marginBottom: 10,
  },
  kpiLabel: {
    fontSize: 8,
    color: "#6b7280",
    textTransform: "uppercase",
    marginBottom: 4,
  },
  kpiValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#0b1326",
  },
  // Visuals
  segmentedBarContainer: {
    height: 16,
    width: "100%",
    flexDirection: "row",
    borderRadius: 8,
    overflow: "hidden",
    marginBottom: 5,
    border: "1px solid #e5e7eb",
  },
  segmentedBarPrimary: {
    backgroundColor: "#0d9488",
    height: "100%",
  },
  segmentedBarDanger: {
    backgroundColor: "#dc2626",
    height: "100%",
  },
  legendContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 5,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  legendDotPrimary: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#0d9488",
  },
  legendDotDanger: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#dc2626",
  },
  legendText: {
    fontSize: 8,
    color: "#4b5563",
    fontWeight: "bold",
  },
  // Histograms
  histogramContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    height: 120,
    borderBottom: "1px solid #d1d5db",
    borderLeft: "1px solid #d1d5db",
    paddingLeft: 5,
    paddingRight: 5,
    marginTop: 10,
    gap: 2,
  },
  histogramBarWrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
    height: "100%",
  },
  histogramBar: {
    width: "100%",
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
  },
  histogramLabel: {
    fontSize: 5,
    color: "#6b7280",
    marginTop: 4,
  },
  // Horizontal Bar Charts
  hBarChartRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  hBarLabelBox: {
    width: "30%",
    paddingRight: 10,
  },
  hBarLabelText: {
    fontSize: 8,
    color: "#1f2937",
    fontWeight: "bold",
  },
  hBarSubText: {
    fontSize: 6,
    color: "#6b7280",
  },
  hBarContainerBox: {
    width: "60%",
    height: 10,
    backgroundColor: "#f3f4f6",
    borderRadius: 2,
    flexDirection: "row",
  },
  hBarFill: {
    height: "100%",
    borderRadius: 2,
  },
  hBarValueBox: {
    width: "10%",
    paddingLeft: 5,
    alignItems: "flex-end",
  },
  hBarValueText: {
    fontSize: 8,
    fontWeight: "bold",
  },
  // Outliers Grid
  outlierGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 15,
  },
  outlierCard: {
    width: "47%",
    padding: 12,
    border: "1px solid #e5e7eb",
    borderRadius: 4,
    backgroundColor: "#fff",
    marginBottom: 10,
  },
  outlierHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  outlierTitle: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#111827",
    width: "70%",
  },
  outlierValue: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#dc2626",
  },
  outlierFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginTop: "auto",
  },
  outlierSubLabel: {
    fontSize: 6,
    textTransform: "uppercase",
    color: "#6b7280",
  },
  outlierSubValue: {
    fontSize: 8,
    color: "#1f2937",
  },
  outlierStateTag: {
    fontSize: 7,
    fontWeight: "bold",
    padding: "2px 4px",
    backgroundColor: "#f3f4f6",
    borderRadius: 2,
    border: "1px solid #e5e7eb",
    color: "#4b5563",
  },
  disclaimerBox: {
    marginTop: "auto",
    padding: 12,
    backgroundColor: "#f0fdfa",
    borderLeft: "4px solid #14b8a6",
    fontSize: 8,
    lineHeight: 1.4,
    color: "#4b5563",
  },
});

interface AnalyticsReportPDFProps {
  summary: any; // Accept AnalyticsExploreResponse via cast
  filters?: {
    state?: string;
    condition?: string;
    top_n?: number;
  };
}

export function AnalyticsReportPDF({ summary, filters }: AnalyticsReportPDFProps) {
  const generatedAt = new Date().toISOString();

  // Safe checks
  const percentAbove = summary?.percent_above_benchmark ?? 0;
  const conditions = summary?.condition_summary ?? [];
  const states = summary?.state_summary ?? [];
  const outliers = summary?.top_outlier_hospitals ?? [];
  const errDist = summary?.err_distribution ?? [];

  // Histogram calculations
  const maxHistCount = errDist.length > 0 ? Math.max(...errDist.map((b: any) => b.count)) : 1;

  // Condition max calculations
  const maxCondErr = conditions.length > 0 ? Math.max(...conditions.map((c: any) => c.average_err), 1.5) : 1.5;

  // State max calculations
  const maxStateErr = states.length > 0 ? Math.max(...states.map((s: any) => s.average_err), 1.5) : 1.5;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>AdmitGuard Hospital Analytics Report</Text>
          <Text style={styles.headerSubtitle}>Clinical Intelligence Platform</Text>
          <View style={styles.metadataRow}>
            <Text style={styles.metadataItem}><Text style={styles.metadataLabel}>Dataset:</Text> HRRP aggregate hospital benchmarking</Text>
            <Text style={styles.metadataItem}><Text style={styles.metadataLabel}>Period:</Text> {summary?.period_label || "Historical"}</Text>
            <Text style={styles.metadataItem}><Text style={styles.metadataLabel}>Generated:</Text> {generatedAt}</Text>
          </View>

          {/* Filter Context */}
          <View style={styles.filterBox}>
             <Text style={styles.filterItem}><Text style={styles.filterLabel}>State:</Text> {filters?.state || "All States"}</Text>
             <Text style={styles.filterItem}><Text style={styles.filterLabel}>Condition:</Text> {filters?.condition || "All Conditions"}</Text>
             <Text style={styles.filterItem}><Text style={styles.filterLabel}>Top N Outliers:</Text> {filters?.top_n || "10"}</Text>
          </View>
        </View>

        {/* KPI Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Overview KPIs</Text>
          <View style={styles.grid}>
            <View style={styles.kpiCard}>
              <Text style={styles.kpiLabel}>Total Records</Text>
              <Text style={styles.kpiValue}>{summary?.total_records?.toLocaleString()}</Text>
            </View>
            <View style={styles.kpiCard}>
              <Text style={styles.kpiLabel}>Total Hospitals</Text>
              <Text style={styles.kpiValue}>{summary?.total_hospitals?.toLocaleString()}</Text>
            </View>
            <View style={styles.kpiCard}>
              <Text style={styles.kpiLabel}>Average ERR</Text>
              <Text style={[styles.kpiValue, { color: summary?.average_excess_readmission_ratio > 1.0 ? "#dc2626" : "#0d9488" }]}>{summary?.average_excess_readmission_ratio?.toFixed(4)}</Text>
            </View>
          </View>
        </View>

        {/* Benchmark Split Visual */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Benchmark Distribution</Text>
          <Text style={styles.sectionSubtitle}>Filtered records split: Higher-than-expected readmission ratio (Above Benchmark) vs At/Below Benchmark.</Text>
          <View style={styles.segmentedBarContainer}>
            <View style={[styles.segmentedBarPrimary, { width: `${100 - percentAbove}%` }]} />
            <View style={[styles.segmentedBarDanger, { width: `${percentAbove}%` }]} />
          </View>
          <View style={styles.legendContainer}>
            <View style={styles.legendItem}>
              <View style={styles.legendDotPrimary} />
              <Text style={styles.legendText}>At/Below Benchmark: {(100 - percentAbove).toFixed(1)}%</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={styles.legendDotDanger} />
              <Text style={styles.legendText}>Above Benchmark (Worse): {percentAbove.toFixed(1)}%</Text>
            </View>
          </View>
        </View>

        {/* ERR Distribution Histogram Visual */}
        {errDist.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>ERR Distribution (Histogram)</Text>
            <Text style={styles.sectionSubtitle}>Histogram of Excess Readmission Ratios. Benchmark reference: ERR = 1.0.</Text>
            <View style={styles.histogramContainer}>
              {errDist.map((bin: any, i: number) => (
                <View key={i} style={styles.histogramBarWrapper}>
                   <View style={[
                     styles.histogramBar, 
                     { height: `${(bin.count / maxHistCount) * 100}%`, backgroundColor: bin.bin_start > 1.0 ? "#fca5a5" : "#99f6e4" }
                   ]} />
                   {/* Simplify label for PDF to prevent overlap */}
                   <Text style={styles.histogramLabel}>{i % 2 === 0 ? bin.bin_start.toFixed(2) : ""}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

      </Page>
      
      {/* Page 2: Condition and State Visuals */}
      <Page size="A4" style={styles.page}>
        {/* Condition Comparison Visual */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Condition Comparison</Text>
          <Text style={styles.sectionSubtitle}>Average ERR by condition code. Bars scaled relative to max ERR. Benchmark reference = 1.0.</Text>
          <View style={{ marginTop: 10 }}>
            {conditions.map((c: any, i: number) => (
              <View key={i} style={styles.hBarChartRow}>
                <View style={styles.hBarLabelBox}>
                  <Text style={styles.hBarLabelText}>{c.condition_label || c.condition_code}</Text>
                  <Text style={styles.hBarSubText}>{c.record_count.toLocaleString()} records • {c.percent_above_benchmark.toFixed(1)}% above</Text>
                </View>
                <View style={styles.hBarContainerBox}>
                   <View style={[
                     styles.hBarFill, 
                     { width: `${Math.min(100, (c.average_err / maxCondErr) * 100)}%`, backgroundColor: c.average_err > 1.0 ? "#dc2626" : "#0d9488" }
                   ]} />
                </View>
                <View style={styles.hBarValueBox}>
                  <Text style={[styles.hBarValueText, { color: c.average_err > 1.0 ? "#dc2626" : "#0d9488" }]}>{c.average_err.toFixed(3)}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* State Ranking Visual */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Top States by Average ERR</Text>
          <Text style={styles.sectionSubtitle}>Only represented states in the filtered dataset are shown (top 15).</Text>
          <View style={{ marginTop: 10 }}>
            {states.slice(0, 15).map((s: any, i: number) => (
              <View key={i} style={styles.hBarChartRow}>
                <View style={[styles.hBarLabelBox, { width: "15%" }]}>
                  <Text style={styles.hBarLabelText}>{i + 1}. {s.state}</Text>
                  <Text style={styles.hBarSubText}>{s.record_count.toLocaleString()} rec</Text>
                </View>
                <View style={[styles.hBarContainerBox, { width: "75%" }]}>
                   <View style={[
                     styles.hBarFill, 
                     { width: `${Math.min(100, (s.average_err / maxStateErr) * 100)}%`, backgroundColor: s.average_err > 1.0 ? "#dc2626" : "#0d9488" }
                   ]} />
                </View>
                <View style={[styles.hBarValueBox, { width: "10%" }]}>
                  <Text style={[styles.hBarValueText, { color: s.average_err > 1.0 ? "#dc2626" : "#0d9488" }]}>{s.average_err.toFixed(3)}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </Page>

      {/* Page 3: Outliers and Disclaimers */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Critical Outlier Observations</Text>
          <Text style={styles.headerSubtitle}>Facilities with highest observed ERR in filtered selection</Text>
        </View>

        <View style={styles.section}>
          {outliers.length === 0 ? (
            <Text style={{ fontSize: 10, color: "#6b7280" }}>No critical outliers found in this dataset subset.</Text>
          ) : (
            <View style={styles.outlierGrid}>
              {outliers.map((row: any, i: number) => (
                <View key={i} style={styles.outlierCard}>
                  <View style={styles.outlierHeader}>
                    <Text style={styles.outlierTitle}>{row.facility_name}</Text>
                    <Text style={styles.outlierValue}>{row.excess_readmission_ratio.toFixed(4)}</Text>
                  </View>
                  <View style={styles.outlierFooter}>
                    <View>
                      <Text style={styles.outlierSubLabel}>Condition</Text>
                      <Text style={styles.outlierSubValue}>{row.condition_label || row.condition_code}</Text>
                    </View>
                    <Text style={styles.outlierStateTag}>{row.state}</Text>
                  </View>
                  <Text style={{ fontSize: 6, color: "#dc2626", marginTop: 4, fontStyle: "italic" }}>High ERR Observation</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Disclaimer */}
        <View style={styles.disclaimerBox}>
          <Text style={{ fontWeight: "bold", marginBottom: 4 }}>Important Prototype Disclaimer</Text>
          <Text>This report contains static historical aggregate data derived from CMS datasets. It is not patient-level prediction, not claim prediction, and not real-time monitoring. These values are benchmark statistics and are NOT AdmitGuard ML model outputs. Do not imply clinical fault, medical negligence, or use this for active hospital routing. Dataset may cover fewer than all US states depending on filtered context. Prototype use only.</Text>
        </View>
      </Page>

    </Document>
  );
}
