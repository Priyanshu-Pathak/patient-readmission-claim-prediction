"use client";

import React, { useState } from "react";
import { AppShell } from "../../components/layout/AppShell";
import { Container } from "../../components/ui/Container";
import { SectionHeader } from "../../components/ui/SectionHeader";
import { SurfaceCard } from "../../components/ui/SurfaceCard";
import { Button } from "../../components/ui/Button";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { api, ApiError } from "../../lib/api";
import { PredictionRequest, ReadmissionResponse, ClaimResponse } from "../../lib/types";

const defaultFormState: PredictionRequest = {
  age: "[70-80)",
  gender: "Female",
  weight: 150,
  bmi: 28.5,
  no_of_dependents: 0,
  "heart rate": 75,
  time_in_hospital: 3,
  payer_code: "MC",
  num_lab_procedures: 45,
  num_procedures: 1,
  num_medications: 15,
  number_outpatient: 0,
  number_emergency: 0,
  number_inpatient: 0,
  number_diagnoses: 5,
  insulin: "Steady",
  change: "No",
  diabetesMed: "Yes",
};

export default function PredictPage() {
  const [formData, setFormData] = useState<PredictionRequest>(defaultFormState);
  
  const [readmissionResult, setReadmissionResult] = useState<ReadmissionResponse | null>(null);
  const [claimResult, setClaimResult] = useState<ClaimResponse | null>(null);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const numFields = ["weight", "bmi", "no_of_dependents", "heart rate", "time_in_hospital", "num_lab_procedures", "num_procedures", "num_medications", "number_outpatient", "number_emergency", "number_inpatient", "number_diagnoses"];
    
    setFormData(prev => ({
      ...prev,
      [name]: numFields.includes(name) ? Number(value) : value
    }));
  };

  const handlePredict = async () => {
    setLoading(true);
    setError(null);
    setReadmissionResult(null);
    setClaimResult(null);

    try {
      // Run both promises concurrently
      const [readmissionRes, claimRes] = await Promise.allSettled([
        api.predictReadmission(formData),
        api.predictClaim(formData)
      ]);

      if (readmissionRes.status === "fulfilled" && readmissionRes.value.data) {
        setReadmissionResult(readmissionRes.value.data);
      } else if (readmissionRes.status === "rejected") {
        console.error("Readmission failed:", readmissionRes.reason);
      }

      if (claimRes.status === "fulfilled" && claimRes.value.data) {
        setClaimResult(claimRes.value.data);
      } else if (claimRes.status === "rejected") {
        console.error("Claim failed:", claimRes.reason);
      }

      if (readmissionRes.status === "rejected" && claimRes.status === "rejected") {
        throw new Error("Both prediction services failed or are unavailable.");
      }

    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell>
      <Container className="max-w-6xl">
        <SectionHeader 
          title="Patient Risk Prediction" 
          description="Enter clinical parameters to forecast readmission probability and estimated claim amounts."
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          
          {/* Form Section */}
          <div className="lg:col-span-2">
            <SurfaceCard className="p-6">
              <h2 className="text-xl font-semibold mb-6">Clinical Input Parameters</h2>
              
              <div className="space-y-6">
                {/* Demographics */}
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4 border-b border-border/50 pb-2">Demographics</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-medium">Age Group</label>
                      <select name="age" value={formData.age} onChange={handleChange} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
                        <option value="[0-10)">[0-10)</option>
                        <option value="[10-20)">[10-20)</option>
                        <option value="[20-30)">[20-30)</option>
                        <option value="[30-40)">[30-40)</option>
                        <option value="[40-50)">[40-50)</option>
                        <option value="[50-60)">[50-60)</option>
                        <option value="[60-70)">[60-70)</option>
                        <option value="[70-80)">[70-80)</option>
                        <option value="[80-90)">[80-90)</option>
                        <option value="[90-100)">[90-100)</option>
                      </select>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-medium">Gender</label>
                      <select name="gender" value={formData.gender} onChange={handleChange} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Unknown/Invalid">Unknown/Invalid</option>
                      </select>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-medium">Weight (lbs/kg)</label>
                      <input type="number" name="weight" value={formData.weight} onChange={handleChange} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-medium">BMI</label>
                      <input type="number" name="bmi" value={formData.bmi} onChange={handleChange} step="0.1" className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-medium">Dependents</label>
                      <input type="number" name="no_of_dependents" value={formData.no_of_dependents} onChange={handleChange} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-medium">Payer Code</label>
                      <input type="text" name="payer_code" value={formData.payer_code} onChange={handleChange} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" />
                    </div>
                  </div>
                </div>

                {/* Encounter Details */}
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4 border-b border-border/50 pb-2">Encounter & Vitals</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-medium">Heart Rate</label>
                      <input type="number" name="heart rate" value={formData["heart rate"]} onChange={handleChange} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-medium">Days in Hospital</label>
                      <input type="number" name="time_in_hospital" value={formData.time_in_hospital} onChange={handleChange} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-medium">Lab Procedures</label>
                      <input type="number" name="num_lab_procedures" value={formData.num_lab_procedures} onChange={handleChange} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-medium">Procedures</label>
                      <input type="number" name="num_procedures" value={formData.num_procedures} onChange={handleChange} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-medium">Diagnoses</label>
                      <input type="number" name="number_diagnoses" value={formData.number_diagnoses} onChange={handleChange} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" />
                    </div>
                  </div>
                </div>

                {/* History & Medications */}
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4 border-b border-border/50 pb-2">History & Medications</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-medium">Outpatient Visits</label>
                      <input type="number" name="number_outpatient" value={formData.number_outpatient} onChange={handleChange} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-medium">Emergency Visits</label>
                      <input type="number" name="number_emergency" value={formData.number_emergency} onChange={handleChange} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-medium">Inpatient Visits</label>
                      <input type="number" name="number_inpatient" value={formData.number_inpatient} onChange={handleChange} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-medium">Num Medications</label>
                      <input type="number" name="num_medications" value={formData.num_medications} onChange={handleChange} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-medium">Insulin</label>
                      <select name="insulin" value={formData.insulin} onChange={handleChange} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
                        <option value="Up">Up</option>
                        <option value="Down">Down</option>
                        <option value="Steady">Steady</option>
                        <option value="No">No</option>
                      </select>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-medium">Med Change</label>
                      <select name="change" value={formData.change} onChange={handleChange} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
                        <option value="Ch">Ch (Changed)</option>
                        <option value="No">No</option>
                      </select>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-medium">Diabetes Med</label>
                      <select name="diabetesMed" value={formData.diabetesMed} onChange={handleChange} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-border/50">
                  <Button 
                    className="w-full sm:w-auto px-8 py-3 text-lg" 
                    onClick={handlePredict}
                    disabled={loading}
                  >
                    {loading ? "Analyzing..." : "Generate Risk Assessment"}
                  </Button>
                </div>
                
                {error && (
                  <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-md text-sm">
                    {error}
                  </div>
                )}
              </div>
            </SurfaceCard>
          </div>

          {/* Results Section */}
          <div className="flex flex-col gap-6">
            <SurfaceCard className="p-6 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
              <h2 className="text-lg font-semibold mb-4 flex items-center justify-between">
                Readmission Risk
                {readmissionResult?.risk_label && (
                   <StatusBadge 
                     status={
                       readmissionResult.risk_label === "High" ? "danger" : 
                       readmissionResult.risk_label === "Medium" ? "warning" : "success"
                     }
                     label={readmissionResult.risk_label}
                   />
                )}
              </h2>
              
              {readmissionResult ? (
                <div className="space-y-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-4xl font-bold text-primary">
                      {readmissionResult.risk_probability !== null 
                        ? `${(readmissionResult.risk_probability * 100).toFixed(1)}%` 
                        : "N/A"}
                    </span>
                    <span className="text-xs text-muted-foreground">30-day readmission probability</span>
                  </div>
                  
                  <div className="pt-4 border-t border-border/50 text-sm text-muted-foreground space-y-2">
                    <p><span className="font-medium text-foreground">Status:</span> {readmissionResult.model_status}</p>
                    {readmissionResult.confidence_note && <p className="italic">{readmissionResult.confidence_note}</p>}
                    <p className="text-xs text-muted-foreground/60 leading-tight mt-4 border border-border/50 p-2 rounded bg-background/50">
                      {readmissionResult.disclaimer}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="h-32 flex items-center justify-center text-sm text-muted-foreground border border-dashed border-border/50 rounded-md">
                  {loading ? "Computing..." : "Awaiting input"}
                </div>
              )}
            </SurfaceCard>

            <SurfaceCard className="p-6 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 to-transparent pointer-events-none" />
              <h2 className="text-lg font-semibold mb-4">Predicted Claim</h2>
              
              {claimResult ? (
                <div className="space-y-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-4xl font-bold text-teal-500">
                      ${claimResult.predicted_claim_amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                    <span className="text-xs text-muted-foreground">Estimated {claimResult.currency}</span>
                  </div>
                  
                  <div className="pt-4 border-t border-border/50 text-sm text-muted-foreground space-y-2">
                    <p><span className="font-medium text-foreground">Status:</span> {claimResult.model_status}</p>
                    {claimResult.confidence_note && <p className="italic">{claimResult.confidence_note}</p>}
                    <p className="text-xs text-muted-foreground/60 leading-tight mt-4 border border-border/50 p-2 rounded bg-background/50">
                      {claimResult.disclaimer}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="h-32 flex items-center justify-center text-sm text-muted-foreground border border-dashed border-border/50 rounded-md">
                  {loading ? "Computing..." : "Awaiting input"}
                </div>
              )}
            </SurfaceCard>
          </div>

        </div>
      </Container>
    </AppShell>
  );
}
