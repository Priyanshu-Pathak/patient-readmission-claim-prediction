import React from "react";
import { Document, Page, Text, View, StyleSheet, Font } from "@react-pdf/renderer";
import type { ReadmissionRequest, ReadmissionResponse, ClaimRequest, ClaimResponse } from "@/lib/types";

// Register fonts if needed, but we can use default standard fonts for simplicity.
// Standard fonts in PDF are Helvetica, Times-Roman, Courier.

const styles = StyleSheet.create({
  page: {
    padding: 40,
    backgroundColor: "#ffffff",
    fontFamily: "Helvetica",
    color: "#1f2937",
  },
  header: {
    marginBottom: 30,
    borderBottom: "2px solid #e5e7eb",
    paddingBottom: 15,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#0b1326", // Dark navy
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
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#14b8a6", // Teal accent
    textTransform: "uppercase",
    marginBottom: 10,
    letterSpacing: 1,
  },
  resultCard: {
    padding: 20,
    border: "1px solid #e5e7eb",
    borderRadius: 4,
    backgroundColor: "#f9fafb",
  },
  resultLabel: {
    fontSize: 10,
    color: "#6b7280",
    textTransform: "uppercase",
    marginBottom: 5,
  },
  resultValuePrimary: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#0b1326",
    marginBottom: 15,
  },
  riskHigh: { color: "#dc2626" },
  riskMedium: { color: "#d97706" },
  riskLow: { color: "#0d9488" },
  progressBarContainer: {
    height: 8,
    backgroundColor: "#e5e7eb",
    borderRadius: 4,
    overflow: "hidden",
    flexDirection: "row",
    marginTop: 5,
    marginBottom: 5,
  },
  progressBarFill: {
    height: "100%",
  },
  progressLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 8,
    color: "#6b7280",
  },
  explanationBox: {
    padding: 15,
    backgroundColor: "#f0fdfa", // Light teal
    borderLeft: "4px solid #14b8a6",
    fontSize: 10,
    lineHeight: 1.5,
    color: "#1f2937",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  gridItem: {
    width: "23%", // 4 columns roughly
    padding: 8,
    border: "1px solid #e5e7eb",
    borderRadius: 2,
    backgroundColor: "#ffffff",
    marginBottom: 10,
  },
  gridItemLabel: {
    fontSize: 8,
    color: "#6b7280",
    textTransform: "uppercase",
    marginBottom: 4,
  },
  gridItemValue: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#111827",
  },
  disclaimer: {
    marginTop: "auto",
    paddingTop: 15,
    borderTop: "1px solid #e5e7eb",
    fontSize: 9,
    color: "#6b7280",
    lineHeight: 1.4,
  },
});

interface PredictionReportPDFProps {
  type: "re" | "cl";
  form: ReadmissionRequest | ClaimRequest;
  result: ReadmissionResponse | ClaimResponse;
}

function BaselineBulletChartPDF({
  label,
  value,
  stats,
  isCurrency = false
}: {
  label: string;
  value: number;
  stats?: import("@/lib/types").BaselineStats;
  isCurrency?: boolean;
}) {
  if (!stats || stats.max === stats.min) return null;

  const fmt = (v: number) => isCurrency 
    ? `$${v.toLocaleString(undefined, { maximumFractionDigits: 0 })}` 
    : v.toLocaleString(undefined, { maximumFractionDigits: 1 });

  const toPct = (v: number) => Math.max(0, Math.min(100, ((v - stats.min) / (stats.max - stats.min)) * 100));

  const p25Pct = toPct(stats.p25);
  const p75Pct = toPct(stats.p75);
  const medianPct = toPct(stats.median);
  const valPct = toPct(value);

  return (
    <View style={{ marginBottom: 10 }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 3 }}>
        <Text style={{ fontSize: 9, color: "#6b7280" }}>{label}</Text>
        <Text style={{ fontSize: 9, fontWeight: "bold", color: "#111827" }}>{fmt(value)}</Text>
      </View>
      <View style={{ position: "relative", height: 10, backgroundColor: "#f3f4f6", borderRadius: 2 }}>
        <View style={{ position: "absolute", left: `${p25Pct}%`, width: `${p75Pct - p25Pct}%`, height: "100%", backgroundColor: "#d1d5db" }} />
        <View style={{ position: "absolute", left: `${medianPct}%`, width: 1, height: "100%", backgroundColor: "#4b5563" }} />
        <View style={{ position: "absolute", left: `${valPct}%`, width: 4, height: "100%", backgroundColor: isCurrency ? "#d97706" : "#0d9488" }} />
      </View>
      <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 2 }}>
        <Text style={{ fontSize: 7, color: "#9ca3af" }}>{fmt(stats.min)}</Text>
        <Text style={{ fontSize: 7, color: "#9ca3af" }}>Med: {fmt(stats.median)}</Text>
        <Text style={{ fontSize: 7, color: "#9ca3af" }}>{fmt(stats.max)}</Text>
      </View>
    </View>
  );
}


export function PredictionReportPDF({ type, form, result }: PredictionReportPDFProps) {
  const isRe = type === "re";

  const renderReadmission = () => {
    const rForm = form as ReadmissionRequest;
    const rRes = result as ReadmissionResponse;
    const prob = rRes.risk_probability;

    let barColor = "#0d9488"; // low
    if (prob !== null) {
      if (prob >= 0.6) barColor = "#dc2626"; // high
      else if (prob >= 0.3) barColor = "#d97706"; // medium
    }

    return (
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>AdmitGuard Readmission Risk Report</Text>
          <Text style={styles.headerSubtitle}>Clinical Intelligence Platform</Text>
          <View style={styles.metadataRow}>
            <Text style={styles.metadataItem}><Text style={styles.metadataLabel}>Model:</Text> Logistic Regression</Text>
            <Text style={styles.metadataItem}><Text style={styles.metadataLabel}>Generated:</Text> {rRes.timestamp || new Date().toISOString()}</Text>
          </View>
        </View>

        {/* Result Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Result Summary</Text>
          <View style={styles.resultCard}>
            <Text style={styles.resultLabel}>Predicted Risk Level</Text>
            <Text style={[
              styles.resultValuePrimary,
              rRes.risk_label === "High" ? styles.riskHigh :
              rRes.risk_label === "Medium" ? styles.riskMedium : styles.riskLow
            ]}>
              {rRes.risk_label}
            </Text>

            {prob !== null ? (
              <View>
                <Text style={styles.resultLabel}>Statistical Probability: {(prob * 100).toFixed(1)}%</Text>
                <View style={styles.progressBarContainer}>
                  <View style={[styles.progressBarFill, { width: `${Math.min(100, Math.max(0, prob * 100))}%`, backgroundColor: barColor }]} />
                </View>
                <View style={styles.progressLabels}>
                  <Text>Low (0-30%)</Text>
                  <Text>Moderate (30-60%)</Text>
                  <Text>High (60%+)</Text>
                </View>
              </View>
            ) : (
              <Text style={styles.resultLabel}>Probability unavailable</Text>
            )}
          </View>
        </View>

        {/* Explanation */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Interpretation</Text>
          <View style={styles.explanationBox}>
            <Text>This score estimates the model's predicted likelihood of readmission derived solely from the submitted clinical profile. It is a prototype output only. It is not medical advice and must not be used as a clinical decision by itself.</Text>
          </View>
        </View>

        {/* Baseline Comparison */}
        {rRes.baseline_context && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Dataset Baseline Comparison</Text>
            <View style={styles.resultCard}>
              <BaselineBulletChartPDF label="Time in Hospital" value={rForm.time_in_hospital} stats={rRes.baseline_context.time_in_hospital} />
              <BaselineBulletChartPDF label="Lab Procedures" value={rForm.num_lab_procedures} stats={rRes.baseline_context.num_lab_procedures} />
              <BaselineBulletChartPDF label="Other Procedures" value={rForm.num_procedures} stats={rRes.baseline_context.num_procedures} />
              <BaselineBulletChartPDF label="Medications" value={rForm.num_medications} stats={rRes.baseline_context.num_medications} />
              <BaselineBulletChartPDF label="Outpatient Visits" value={rForm.number_outpatient} stats={rRes.baseline_context.number_outpatient} />
              <BaselineBulletChartPDF label="Emergency Visits" value={rForm.number_emergency} stats={rRes.baseline_context.number_emergency} />
              <BaselineBulletChartPDF label="Inpatient Visits" value={rForm.number_inpatient} stats={rRes.baseline_context.number_inpatient} />
              <BaselineBulletChartPDF label="Diagnoses" value={rForm.number_diagnoses} stats={rRes.baseline_context.number_diagnoses} />
              <Text style={{ fontSize: 8, color: "#6b7280", marginTop: 5 }}>Descriptive reference only. The shaded bar is the dataset IQR (25th-75th percentile). This does not explain causality or feature importance.</Text>
            </View>
          </View>
        )}

        {/* Profile Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Submitted Profile Snapshot</Text>
          <Text style={{ fontSize: 9, color: "#6b7280", marginBottom: 10 }}>The model used these submitted fields as part of the estimate:</Text>
          <View style={styles.grid}>
            <GridItem label="Age" value={rForm.age} />
            <GridItem label="Gender" value={rForm.gender} />
            <GridItem label="Race" value={rForm.race} />
            <GridItem label="Time in Hosp" value={`${rForm.time_in_hospital} d`} />
            <GridItem label="Lab Procs" value={rForm.num_lab_procedures} />
            <GridItem label="Procedures" value={rForm.num_procedures} />
            <GridItem label="Medications" value={rForm.num_medications} />
            <GridItem label="Diagnoses" value={rForm.number_diagnoses} />
            <GridItem label="Outpatient" value={rForm.number_outpatient} />
            <GridItem label="Emergency" value={rForm.number_emergency} />
            <GridItem label="Inpatient" value={rForm.number_inpatient} />
            <GridItem label="Med Change" value={rForm.change} />
            <GridItem label="Diabetes Med" value={rForm.diabetesMed} />
            <GridItem label="Diag 1" value={rForm.diag_1} />
            <GridItem label="Diag 2" value={rForm.diag_2} />
            <GridItem label="Diag 3" value={rForm.diag_3} />
          </View>
        </View>

        {/* Disclaimer */}
        <View style={styles.disclaimer}>
          <Text>{rRes.disclaimer}</Text>
        </View>
      </Page>
    );
  };

  const renderClaim = () => {
    const cForm = form as ClaimRequest;
    const cRes = result as ClaimResponse;

    return (
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>AdmitGuard Claim Estimate Report</Text>
          <Text style={styles.headerSubtitle}>Financial Intelligence Platform</Text>
          <View style={styles.metadataRow}>
            <Text style={styles.metadataItem}><Text style={styles.metadataLabel}>Model:</Text> Random Forest Regressor</Text>
            <Text style={styles.metadataItem}><Text style={styles.metadataLabel}>Generated:</Text> {cRes.timestamp || new Date().toISOString()}</Text>
          </View>
        </View>

        {/* Result Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Result Summary</Text>
          <View style={styles.resultCard}>
            <Text style={styles.resultLabel}>Estimated Claim Amount</Text>
            <Text style={styles.resultValuePrimary}>
              ${cRes.predicted_claim_amount.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
              <Text style={{ fontSize: 14, color: "#6b7280" }}> {cRes.currency || 'USD'}</Text>
            </Text>
            
            {cRes.confidence_note && (
              <View style={{ marginTop: 10, paddingTop: 10, borderTop: "1px solid #e5e7eb" }}>
                <Text style={styles.resultLabel}>Confidence Note</Text>
                <Text style={{ fontSize: 10, color: "#1f2937" }}>{cRes.confidence_note}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Explanation */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Interpretation</Text>
          <View style={styles.explanationBox}>
            <Text>The estimate is generated from submitted demographic, lifestyle, and medical-risk fields. It is dataset-specific and does not constitute a billing guarantee or financial approval/rejection advice. Prototype output only.</Text>
          </View>
        </View>

        {/* Baseline Comparison */}
        {cRes.baseline_context && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Dataset Baseline Comparison</Text>
            <View style={styles.resultCard}>
              <BaselineBulletChartPDF label="Age" value={cForm.age} stats={cRes.baseline_context.age} />
              <BaselineBulletChartPDF label="Weight" value={cForm.weight} stats={cRes.baseline_context.weight} />
              <BaselineBulletChartPDF label="BMI" value={cForm.bmi} stats={cRes.baseline_context.bmi} />
              <BaselineBulletChartPDF label="Blood Pressure" value={cForm.bloodpressure} stats={cRes.baseline_context.bloodpressure} />
              <BaselineBulletChartPDF label="Dependents" value={cForm.no_of_dependents} stats={cRes.baseline_context.no_of_dependents} />
              <View style={{ marginTop: 5, paddingTop: 10, borderTop: "1px solid #e5e7eb" }}>
                <BaselineBulletChartPDF label="Predicted Claim vs Target Baseline" value={cRes.predicted_claim_amount} stats={cRes.baseline_context.claim} isCurrency={true} />
              </View>
              <Text style={{ fontSize: 8, color: "#6b7280", marginTop: 5 }}>Descriptive reference only. The shaded bar is the dataset IQR (25th-75th percentile). This does not explain causality or feature importance.</Text>
            </View>
          </View>
        )}

        {/* Profile Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Submitted Profile Snapshot</Text>
          <Text style={{ fontSize: 9, color: "#6b7280", marginBottom: 10 }}>The model used these submitted fields as part of the estimate:</Text>
          <View style={styles.grid}>
            <GridItem label="Age" value={cForm.age} />
            <GridItem label="Sex" value={cForm.sex} />
            <GridItem label="BMI" value={cForm.bmi} />
            <GridItem label="Weight" value={`${cForm.weight} kg`} />
            <GridItem label="Smoker" value={cForm.smoker === 1 ? "Yes" : "No"} />
            <GridItem label="Diabetes" value={cForm.diabetes === 1 ? "Yes" : "No"} />
            <GridItem label="Blood Pressure" value={cForm.bloodpressure} />
            <GridItem label="Regular Ex" value={cForm.regular_ex === 1 ? "Yes" : "No"} />
            <GridItem label="Dependents" value={cForm.no_of_dependents} />
            <GridItem label="City" value={cForm.city} />
            <GridItem label="Job Title" value={cForm.job_title} />
            <GridItem label="Hereditary" value={cForm.hereditary_diseases} />
          </View>
        </View>

        {/* Disclaimer */}
        <View style={styles.disclaimer}>
          <Text>{cRes.disclaimer}</Text>
        </View>
      </Page>
    );
  };

  return (
    <Document>
      {isRe ? renderReadmission() : renderClaim()}
    </Document>
  );
}

function GridItem({ label, value }: { label: string; value: string | number }) {
  return (
    <View style={styles.gridItem}>
      <Text style={styles.gridItemLabel}>{label}</Text>
      <Text style={styles.gridItemValue}>{value}</Text>
    </View>
  );
}
