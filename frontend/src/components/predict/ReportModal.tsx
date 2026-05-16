"use client";

import React, { useEffect, useState } from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import type { ReadmissionRequest, ReadmissionResponse, ClaimRequest, ClaimResponse } from "@/lib/types";
import { PredictionReportPDF } from "./PredictionReportPDF";

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: "re" | "cl";
  form: ReadmissionRequest | ClaimRequest | null;
  result: ReadmissionResponse | ClaimResponse | null;
}

export function ReportModal({ isOpen, onClose, type, form, result }: ReportModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen || !form || !result) return null;

  const handlePrint = () => {
    window.print();
  };

  const isRe = type === "re";
  const reForm = form as ReadmissionRequest;
  const reRes = result as ReadmissionResponse;
  const clForm = form as ClaimRequest;
  const clRes = result as ClaimResponse;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm print:bg-white print:p-0">
      <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-background surface-panel border border-border rounded shadow-2xl print:shadow-none print:border-none print:w-full print:max-w-none print:max-h-none print:h-auto print:overflow-visible">
        
        {/* Header Actions (Hidden in print) */}
        <div className="sticky top-0 z-10 flex items-center justify-between p-4 bg-background/95 backdrop-blur border-b border-border print:hidden">
          <div className="flex gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 text-xs font-bold uppercase tracking-widest bg-muted/20 text-foreground border border-border rounded hover:bg-muted/40 transition-colors"
            >
              Preview Print
            </button>
            {mounted && (
              <PDFDownloadLink
                document={<PredictionReportPDF type={type} form={form as any} result={result as any} />}
                fileName={`AdmitGuard_${isRe ? "Readmission" : "Claim"}_Report_${new Date().getTime()}.pdf`}
                className="px-4 py-2 text-xs font-bold uppercase tracking-widest bg-primary/10 text-primary border border-primary/30 rounded hover:bg-primary/20 transition-colors flex items-center justify-center"
              >
                {/* @ts-ignore */}
                {({ loading }) => (loading ? "Generating PDF..." : "Download PDF")}
              </PDFDownloadLink>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded hover:bg-muted/20"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {/* Printable Content */}
        <div className="p-8 print:p-0 print:text-black">
          
          {/* Document Header */}
          <div className="mb-8 border-b border-border pb-6 print:border-gray-300">
            <h1 className="text-3xl font-bold tracking-tight text-foreground print:text-black">
              {isRe ? "AdmitGuard Readmission Risk Report" : "AdmitGuard Claim Estimate Report"}
            </h1>
            <div className="flex flex-wrap gap-x-6 gap-y-2 mt-4 text-xs font-medium text-muted-foreground uppercase tracking-widest print:text-gray-600">
              <p>Model: <span className="text-foreground print:text-black">{isRe ? "Logistic Regression" : "Random Forest Regressor"}</span></p>
              <p>Timestamp: <span className="text-foreground print:text-black">{result.timestamp || new Date().toISOString()}</span></p>
              <p>Status: <span className="text-foreground print:text-black">Prototype Output</span></p>
            </div>
          </div>

          {/* Analysis Result Section */}
          <section className="mb-8">
            <h2 className="text-[10px] font-bold text-primary uppercase tracking-widest mb-4 print:text-gray-800">Result Summary</h2>
            
            {isRe ? (
              <div className="surface-panel p-6 rounded border border-border print:border-gray-300 print:bg-white">
                <div className="flex flex-col gap-2">
                  <p className="text-sm font-semibold uppercase tracking-widest text-muted-foreground print:text-gray-600">Predicted Risk Level</p>
                  <p className={`text-4xl font-extrabold tracking-tight ${
                    reRes.risk_label === 'High' ? 'text-danger print:text-red-700' :
                    reRes.risk_label === 'Medium' ? 'text-warning print:text-amber-600' : 'text-primary print:text-teal-700'
                  }`}>
                    {reRes.risk_label}
                  </p>
                </div>
                
                <div className="mt-6 pt-6 border-t border-border/50 print:border-gray-200">
                  <p className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-2 print:text-gray-600">Statistical Probability</p>
                  {reRes.risk_probability !== null ? (
                    <div>
                      <p className="text-2xl font-light text-foreground print:text-black mb-3">
                        {(reRes.risk_probability * 100).toFixed(1)}%
                      </p>
                      <div className="w-full bg-muted rounded h-2 mb-2 overflow-hidden print:border print:border-gray-300">
                        <div 
                          className={`h-full transition-all duration-1000 ease-out print:!bg-black ${
                            reRes.risk_probability < 0.3 ? 'bg-primary' :
                            reRes.risk_probability < 0.6 ? 'bg-warning' : 'bg-danger'
                          }`}
                          style={{ width: `${Math.min(100, Math.max(0, reRes.risk_probability * 100))}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-[10px] text-muted-foreground font-medium print:text-gray-500">
                        <span>Low (0-30%)</span>
                        <span>Moderate (30-60%)</span>
                        <span>High (60%+)</span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-foreground print:text-black">Probability unavailable</p>
                  )}
                </div>
              </div>
            ) : (
              <div className="surface-panel p-6 rounded border border-border print:border-gray-300 print:bg-white">
                <div className="flex flex-col gap-2">
                  <p className="text-sm font-semibold uppercase tracking-widest text-muted-foreground print:text-gray-600">Estimated Claim Amount</p>
                  <p className="text-4xl font-extrabold text-secondary tracking-tight print:text-black">
                    ${clRes.predicted_claim_amount.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                    <span className="text-xl text-secondary/70 ml-2 font-medium print:text-gray-600">{clRes.currency || 'USD'}</span>
                  </p>
                </div>
                {clRes.confidence_note && (
                  <div className="mt-6 pt-6 border-t border-border/50 print:border-gray-200">
                    <p className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-2 print:text-gray-600">Confidence Note</p>
                    <p className="text-foreground text-sm print:text-black">{clRes.confidence_note}</p>
                  </div>
                )}
              </div>
            )}
          </section>

          {/* Plain Language Interpretation */}
          <section className="mb-8">
            <h2 className="text-[10px] font-bold text-primary uppercase tracking-widest mb-4 print:text-gray-800">Interpretation</h2>
            <div className="p-4 bg-muted/20 border-l-2 border-primary rounded-r print:bg-white print:border-gray-300">
              <p className="text-sm text-foreground leading-relaxed print:text-black">
                {isRe 
                  ? "This score estimates the model's predicted likelihood of readmission derived solely from the submitted clinical profile. It is not medical advice and must not be used as a clinical decision by itself. This should be reviewed as a prototype output only."
                  : "This estimate is generated from the submitted demographic, lifestyle, and medical-risk fields. It is dataset-specific and does not constitute a billing guarantee or financial approval/rejection advice. This should be reviewed as a prototype output only."
                }
              </p>
            </div>
          </section>

          {/* Key Inputs Section */}
          <section className="mb-8">
            <h2 className="text-[10px] font-bold text-primary uppercase tracking-widest mb-4 print:text-gray-800">Profile Summary</h2>
            <p className="text-xs text-muted-foreground mb-4 print:text-gray-600">The model used these submitted fields as part of the estimate:</p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {isRe ? (
                <>
                  <InputItem label="Age" value={reForm.age} />
                  <InputItem label="Gender" value={reForm.gender} />
                  <InputItem label="Race" value={reForm.race} />
                  <InputItem label="Time in Hospital" value={`${reForm.time_in_hospital} days`} />
                  <InputItem label="Lab Procedures" value={reForm.num_lab_procedures} />
                  <InputItem label="Procedures" value={reForm.num_procedures} />
                  <InputItem label="Medications" value={reForm.num_medications} />
                  <InputItem label="Diagnoses" value={reForm.number_diagnoses} />
                  <InputItem label="Primary Diag" value={reForm.diag_1} />
                  <InputItem label="Diabetes Meds" value={reForm.diabetesMed} />
                  <InputItem label="Med Change" value={reForm.change} />
                </>
              ) : (
                <>
                  <InputItem label="Age" value={clForm.age} />
                  <InputItem label="Sex" value={clForm.sex} />
                  <InputItem label="BMI" value={clForm.bmi} />
                  <InputItem label="Smoker" value={clForm.smoker === 1 ? "Yes" : "No"} />
                  <InputItem label="Blood Pressure" value={clForm.bloodpressure} />
                  <InputItem label="Diabetes" value={clForm.diabetes === 1 ? "Yes" : "No"} />
                  <InputItem label="Regular Exercise" value={clForm.regular_ex === 1 ? "Yes" : "No"} />
                  <InputItem label="City" value={clForm.city} />
                  <InputItem label="Dependents" value={clForm.no_of_dependents} />
                  <InputItem label="Hereditary Disease" value={clForm.hereditary_diseases} />
                </>
              )}
            </div>
          </section>

          {/* Disclaimer */}
          <section className="pt-6 border-t border-border print:border-gray-300">
            <p className="text-xs text-muted-foreground leading-relaxed print:text-gray-600">
              {result.disclaimer}
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}

function InputItem({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex flex-col gap-1 p-3 surface-panel border border-border/50 rounded print:border-gray-300 print:bg-white">
      <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground print:text-gray-600">{label}</span>
      <span className="text-sm font-medium text-foreground print:text-black">{value}</span>
    </div>
  );
}
