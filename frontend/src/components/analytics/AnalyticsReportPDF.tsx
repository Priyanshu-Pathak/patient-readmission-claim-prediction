import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import type { AnalyticsSummary } from "@/lib/types";

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
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  kpiCard: {
    width: "31%", // ~3 columns
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
  table: {
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: {
    margin: "auto",
    flexDirection: "row",
  },
  tableColHeader: {
    width: "25%",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderLeftWidth: 0,
    borderTopWidth: 0,
    backgroundColor: "#f3f4f6",
  },
  tableCol: {
    width: "25%",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableCellHeader: {
    margin: 5,
    fontSize: 8,
    fontWeight: "bold",
    color: "#4b5563",
    textTransform: "uppercase",
  },
  tableCell: {
    margin: 5,
    fontSize: 9,
    color: "#1f2937",
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: "#e5e7eb",
    borderRadius: 2,
    overflow: "hidden",
    flexDirection: "row",
    width: "100%",
    marginTop: 2,
  },
  progressBarFill: {
    height: "100%",
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
  summary: AnalyticsSummary;
}

export function AnalyticsReportPDF({ summary }: AnalyticsReportPDFProps) {
  const generatedAt = new Date().toISOString();

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>AdmitGuard Hospital Analytics Report</Text>
          <Text style={styles.headerSubtitle}>Clinical Intelligence Platform</Text>
          <View style={styles.metadataRow}>
            <Text style={styles.metadataItem}><Text style={styles.metadataLabel}>Dataset:</Text> HRRP aggregate hospital benchmarking</Text>
            <Text style={styles.metadataItem}><Text style={styles.metadataLabel}>Period:</Text> {summary.period_label || "Historical"}</Text>
            <Text style={styles.metadataItem}><Text style={styles.metadataLabel}>Generated:</Text> {generatedAt}</Text>
          </View>
        </View>

        {/* KPI Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Overview KPIs</Text>
          <View style={styles.grid}>
            <View style={styles.kpiCard}>
              <Text style={styles.kpiLabel}>Total Records</Text>
              <Text style={styles.kpiValue}>{summary.total_records.toLocaleString()}</Text>
            </View>
            <View style={styles.kpiCard}>
              <Text style={styles.kpiLabel}>Total Hospitals</Text>
              <Text style={styles.kpiValue}>{summary.total_hospitals.toLocaleString()}</Text>
            </View>
            <View style={styles.kpiCard}>
              <Text style={styles.kpiLabel}>Total States</Text>
              <Text style={styles.kpiValue}>{summary.total_states}</Text>
            </View>
            <View style={styles.kpiCard}>
              <Text style={styles.kpiLabel}>Average ERR</Text>
              <Text style={styles.kpiValue}>{summary.average_excess_readmission_ratio.toFixed(4)}</Text>
            </View>
            <View style={styles.kpiCard}>
              <Text style={styles.kpiLabel}>Above Benchmark</Text>
              <Text style={styles.kpiValue}>{summary.percent_above_benchmark.toFixed(1)}%</Text>
            </View>
          </View>
        </View>

        {/* Condition Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Condition Summary</Text>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <View style={[styles.tableColHeader, { width: "40%" }]}><Text style={styles.tableCellHeader}>Condition</Text></View>
              <View style={[styles.tableColHeader, { width: "20%" }]}><Text style={styles.tableCellHeader}>Records</Text></View>
              <View style={[styles.tableColHeader, { width: "20%" }]}><Text style={styles.tableCellHeader}>Avg ERR</Text></View>
              <View style={[styles.tableColHeader, { width: "20%" }]}><Text style={styles.tableCellHeader}>Above Bmk %</Text></View>
            </View>
            {summary.condition_summary.map((row, i) => (
              <View style={styles.tableRow} key={i}>
                <View style={[styles.tableCol, { width: "40%" }]}><Text style={styles.tableCell}>{row.condition_label}</Text></View>
                <View style={[styles.tableCol, { width: "20%" }]}><Text style={styles.tableCell}>{row.record_count.toLocaleString()}</Text></View>
                <View style={[styles.tableCol, { width: "20%" }]}>
                  <Text style={[styles.tableCell, { color: row.average_err > 1.0 ? "#dc2626" : "#0d9488" }]}>
                    {row.average_err.toFixed(4)}
                  </Text>
                </View>
                <View style={[styles.tableCol, { width: "20%" }]}>
                  <View style={{ margin: 5 }}>
                    <Text style={{ fontSize: 8 }}>{row.percent_above_benchmark.toFixed(1)}%</Text>
                    <View style={styles.progressBarContainer}>
                      <View style={[styles.progressBarFill, { width: `${Math.min(100, Math.max(0, row.percent_above_benchmark))}%`, backgroundColor: row.percent_above_benchmark > 50 ? "#dc2626" : "#0d9488" }]} />
                    </View>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* State Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Top States by Average ERR</Text>
          <Text style={{ fontSize: 8, color: "#6b7280", marginBottom: 5 }}>Note: Data covers {summary.total_states} states. Do not imply national completeness beyond these.</Text>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <View style={[styles.tableColHeader, { width: "40%" }]}><Text style={styles.tableCellHeader}>State</Text></View>
              <View style={[styles.tableColHeader, { width: "30%" }]}><Text style={styles.tableCellHeader}>Records</Text></View>
              <View style={[styles.tableColHeader, { width: "30%" }]}><Text style={styles.tableCellHeader}>Avg ERR</Text></View>
            </View>
            {summary.state_summary.slice(0, 5).map((row, i) => (
              <View style={styles.tableRow} key={i}>
                <View style={[styles.tableCol, { width: "40%" }]}><Text style={styles.tableCell}>{row.state}</Text></View>
                <View style={[styles.tableCol, { width: "30%" }]}><Text style={styles.tableCell}>{row.record_count.toLocaleString()}</Text></View>
                <View style={[styles.tableCol, { width: "30%" }]}>
                  <Text style={[styles.tableCell, { color: row.average_err > 1.0 ? "#dc2626" : "#0d9488" }]}>
                    {row.average_err.toFixed(4)}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

      </Page>
      
      {/* Top Outliers Page */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Critical Outlier Hospitals</Text>
          <Text style={styles.headerSubtitle}>Facilities with highest observed ERR</Text>
        </View>

        <View style={styles.section}>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <View style={[styles.tableColHeader, { width: "40%" }]}><Text style={styles.tableCellHeader}>Facility Name</Text></View>
              <View style={[styles.tableColHeader, { width: "15%" }]}><Text style={styles.tableCellHeader}>State</Text></View>
              <View style={[styles.tableColHeader, { width: "30%" }]}><Text style={styles.tableCellHeader}>Condition</Text></View>
              <View style={[styles.tableColHeader, { width: "15%" }]}><Text style={styles.tableCellHeader}>ERR</Text></View>
            </View>
            {summary.top_outlier_hospitals.map((row, i) => (
              <View style={styles.tableRow} key={i}>
                <View style={[styles.tableCol, { width: "40%" }]}><Text style={styles.tableCell}>{row.facility_name}</Text></View>
                <View style={[styles.tableCol, { width: "15%" }]}><Text style={styles.tableCell}>{row.state}</Text></View>
                <View style={[styles.tableCol, { width: "30%" }]}><Text style={styles.tableCell}>{row.condition_label}</Text></View>
                <View style={[styles.tableCol, { width: "15%" }]}>
                  <Text style={[styles.tableCell, { color: "#dc2626", fontWeight: "bold" }]}>
                    {row.excess_readmission_ratio.toFixed(4)}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Disclaimer */}
        <View style={styles.disclaimerBox}>
          <Text style={{ fontWeight: "bold", marginBottom: 4 }}>Important Prototype Disclaimer</Text>
          <Text>This report contains static historical aggregate data derived from CMS (Centers for Medicare & Medicaid Services) datasets. It is not patient-level prediction, not claim prediction, and not real-time monitoring. These values are benchmark statistics and are NOT AdmitGuard ML model outputs. Do not imply clinical fault, medical negligence, or use this for active hospital routing. Prototype use only.</Text>
        </View>
      </Page>
    </Document>
  );
}
