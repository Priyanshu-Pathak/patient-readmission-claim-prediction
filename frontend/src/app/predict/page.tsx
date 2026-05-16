"use client";
import React, { useState } from "react";
import { api } from "../../lib/api";
import { ReadmissionRequest, ClaimRequest, ReadmissionResponse, ClaimResponse } from "../../lib/types";

export default function PredictPage() {
  const [tab, setTab] = useState<"re" | "cl">("re");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [reForm, setReForm] = useState<ReadmissionRequest>({
    race: "Caucasian", gender: "Female", age: "[70-80)",
    admission_type_id: "1", admission_source_id: "7",
    time_in_hospital: 5, num_lab_procedures: 44, num_procedures: 1,
    num_medications: 14, number_outpatient: 0, number_emergency: 0,
    number_inpatient: 0, number_diagnoses: 9,
    diag_1: "428", diag_2: "250", diag_3: "401",
    max_glu_serum: "None", A1Cresult: "None",
    metformin: "No", repaglinide: "No", nateglinide: "No",
    chlorpropamide: "No", glimepiride: "No", glipizide: "No",
    glyburide: "No", pioglitazone: "No", rosiglitazone: "No",
    acarbose: "No", miglitol: "No", insulin: "Steady",
    change: "No", diabetesMed: "Yes",
  });

  const [clForm, setClForm] = useState<ClaimRequest>({
    age: 35, sex: "male", weight: 72, bmi: 28.5, no_of_dependents: 2,
    smoker: 0, diabetes: 1, regular_ex: 0, bloodpressure: 80,
    hereditary_diseases: "NoDisease", city: "NewYork", job_title: "Engineer",
  });

  const [reRes, setReRes] = useState<ReadmissionResponse | null>(null);
  const [clRes, setClRes] = useState<ClaimResponse | null>(null);

  const handleRe = (e: any) => {
    const { name, value, type } = e.target;
    setReForm(p => ({ ...p, [name]: type === "number" ? Number(value) : value }));
  };

  const handleCl = (e: any) => {
    const { name, value, type } = e.target;
    setClForm(p => ({ ...p, [name]: type === "number" ? Number(value) : value }));
  };

  const submit = async () => {
    setError(null);
    setLoading(true);
    try {
      if (tab === "re") {
        if (reForm.time_in_hospital < 1) throw new Error("Hospital days >= 1");
        const r = await api.predictReadmission(reForm);
        setReRes(r.data || null);
      } else {
        if (clForm.age < 0) throw new Error("Age >= 0");
        const r = await api.predictClaim(clForm);
        setClRes(r.data || null);
      }
    } catch (e: any) {
      setError(e.message || "Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto text-white bg-slate-900 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">AdmitGuard Predictions</h1>
      
      <div className="flex gap-4 mb-8">
        <button className={`px-4 py-2 rounded ${tab==="re" ? "bg-blue-600":"bg-slate-700"}`} onClick={()=>setTab("re")}>Readmission</button>
        <button className={`px-4 py-2 rounded ${tab==="cl" ? "bg-blue-600":"bg-slate-700"}`} onClick={()=>setTab("cl")}>Claim</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          {tab === "re" ? (
            <div className="space-y-2 text-sm">
              {Object.keys(reForm).map(k => (
                <div key={k}>
                  <label className="block text-slate-400">{k}</label>
                  {typeof (reForm as any)[k] === "number" ? (
                    <input type="number" name={k} value={(reForm as any)[k]} onChange={handleRe} className="bg-slate-800 p-1 w-full" />
                  ) : (
                    <input type="text" name={k} value={(reForm as any)[k] || ""} onChange={handleRe} className="bg-slate-800 p-1 w-full" />
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-2 text-sm">
              {Object.keys(clForm).map(k => (
                <div key={k}>
                  <label className="block text-slate-400">{k}</label>
                  {typeof (clForm as any)[k] === "number" ? (
                    <input type="number" name={k} value={(clForm as any)[k]} onChange={handleCl} className="bg-slate-800 p-1 w-full" />
                  ) : (
                    <input type="text" name={k} value={(clForm as any)[k] || ""} onChange={handleCl} className="bg-slate-800 p-1 w-full" />
                  )}
                </div>
              ))}
            </div>
          )}
          <button className="mt-4 bg-green-600 px-4 py-2 w-full" onClick={submit} disabled={loading}>{loading ? "..." : "Predict"}</button>
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>

        <div className="bg-slate-800 p-4 rounded">
          <h2 className="font-bold mb-2">Result</h2>
          {tab === "re" ? (
            reRes ? (
              <div>
                <p>Risk: {reRes.risk_label}</p>
                <p>Prob: {(reRes.risk_probability || 0 * 100).toFixed(1)}%</p>
                <p className="text-xs mt-4 opacity-50">{reRes.disclaimer}</p>
              </div>
            ) : "No result"
          ) : (
            clRes ? (
              <div>
                <p>Claim: ${clRes.predicted_claim_amount.toFixed(2)}</p>
                <p className="text-xs mt-4 opacity-50">{clRes.disclaimer}</p>
              </div>
            ) : "No result"
          )}
        </div>
      </div>
    </div>
  );
}
