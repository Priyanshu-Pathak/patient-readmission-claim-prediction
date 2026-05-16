"use client";
import React, { useState } from "react";
import { api } from "../../lib/api";
import { ReadmissionRequest, ClaimRequest, ReadmissionResponse, ClaimResponse } from "../../lib/types";

// --- Form Configuration ---

type FieldOption = {
  label: string;
  value: string | number;
};

type FieldConfig = {
  key: string;
  label: string;
  helper?: string;
  options?: FieldOption[];
};

type GroupConfig = {
  title: string;
  fields: FieldConfig[];
};

const medOptions: FieldOption[] = [
  { label: "No", value: "No" },
  { label: "Steady", value: "Steady" },
  { label: "Up", value: "Up" },
  { label: "Down", value: "Down" },
];

const reGroups: GroupConfig[] = [
  {
    title: "Patient Profile",
    fields: [
      {
        key: "race",
        label: "Race",
        options: [
          { label: "Caucasian", value: "Caucasian" },
          { label: "AfricanAmerican", value: "AfricanAmerican" },
          { label: "Asian", value: "Asian" },
          { label: "Hispanic", value: "Hispanic" },
          { label: "Other", value: "Other" },
          { label: "?", value: "?" },
        ],
      },
      {
        key: "gender",
        label: "Gender",
        options: [
          { label: "Female", value: "Female" },
          { label: "Male", value: "Male" },
          { label: "Unknown/Invalid", value: "Unknown/Invalid" },
        ],
      },
      {
        key: "age",
        label: "Age Group",
        helper: "Bracket representation (e.g., [70-80))",
        options: [
          { label: "[0-10)", value: "[0-10)" },
          { label: "[10-20)", value: "[10-20)" },
          { label: "[20-30)", value: "[20-30)" },
          { label: "[30-40)", value: "[30-40)" },
          { label: "[40-50)", value: "[40-50)" },
          { label: "[50-60)", value: "[50-60)" },
          { label: "[60-70)", value: "[60-70)" },
          { label: "[70-80)", value: "[70-80)" },
          { label: "[80-90)", value: "[80-90)" },
          { label: "[90-100)", value: "[90-100)" },
        ],
      },
    ],
  },
  {
    title: "Encounter Details",
    fields: [
      {
        key: "admission_type_id",
        label: "Admission Type ID",
        helper: "Numeric category from the original hospital dataset.",
        options: [
          { label: "1 (Emergency)", value: "1" },
          { label: "2 (Urgent)", value: "2" },
          { label: "3 (Elective)", value: "3" },
          { label: "4 (Newborn)", value: "4" },
          { label: "5 (Not Available)", value: "5" },
          { label: "6 (NULL)", value: "6" },
          { label: "7 (Trauma Center)", value: "7" },
          { label: "8 (Not Mapped)", value: "8" },
        ],
      },
      {
        key: "admission_source_id",
        label: "Admission Source ID",
        helper: "Numeric category showing how the patient entered care.",
        options: [
          { label: "1 (Physician Referral)", value: "1" },
          { label: "2 (Clinic Referral)", value: "2" },
          { label: "3 (HMO Referral)", value: "3" },
          { label: "4 (Transfer from a hospital)", value: "4" },
          { label: "5 (Transfer from a SNF)", value: "5" },
          { label: "6 (Transfer from another health care facility)", value: "6" },
          { label: "7 (Emergency Room)", value: "7" },
          { label: "8 (Court/Law Enforcement)", value: "8" },
          { label: "9 (Not Available)", value: "9" },
          { label: "11 (Normal Delivery)", value: "11" },
          { label: "17 (NULL)", value: "17" },
        ],
      },
      {
        key: "time_in_hospital",
        label: "Time in Hospital",
        helper: "Number of days between admission and discharge (1-14).",
      },
    ],
  },
  {
    title: "Prior Utilization",
    fields: [
      { key: "num_lab_procedures", label: "Number of Lab Procedures" },
      { key: "num_procedures", label: "Number of Procedures", helper: "Procedures other than lab tests." },
      { key: "num_medications", label: "Number of Medications", helper: "Distinct generic drugs administered." },
      { key: "number_outpatient", label: "Outpatient Visits", helper: "Visits in the prior year." },
      { key: "number_emergency", label: "Emergency Visits", helper: "Visits in the prior year." },
      { key: "number_inpatient", label: "Inpatient Visits", helper: "Visits in the prior year." },
    ],
  },
  {
    title: "Diagnoses & Clinical Complexity",
    fields: [
      { key: "diag_1", label: "Primary Diagnosis Code", helper: "ICD-style diagnosis code from the dataset." },
      { key: "diag_2", label: "Secondary Diagnosis Code", helper: "ICD-style diagnosis code from the dataset." },
      { key: "diag_3", label: "Tertiary Diagnosis Code", helper: "ICD-style diagnosis code from the dataset." },
      { key: "number_diagnoses", label: "Number of Diagnoses", helper: "Total diagnoses entered into the system." },
    ],
  },
  {
    title: "Diabetes Medication Indicators",
    fields: [
      {
        key: "max_glu_serum",
        label: "Max Glucose Serum",
        options: [
          { label: "None", value: "None" },
          { label: "Norm", value: "Norm" },
          { label: ">200", value: ">200" },
          { label: ">300", value: ">300" },
        ],
      },
      {
        key: "A1Cresult",
        label: "A1C Test Result",
        helper: "Recent blood sugar control indicator, if available.",
        options: [
          { label: "None", value: "None" },
          { label: "Norm", value: "Norm" },
          { label: ">7", value: ">7" },
          { label: ">8", value: ">8" },
        ],
      },
      { key: "metformin", label: "Metformin Dosage Change", options: medOptions },
      { key: "repaglinide", label: "Repaglinide Dosage Change", options: medOptions },
      { key: "nateglinide", label: "Nateglinide Dosage Change", options: medOptions },
      { key: "chlorpropamide", label: "Chlorpropamide Dosage Change", options: medOptions },
      { key: "glimepiride", label: "Glimepiride Dosage Change", options: medOptions },
      { key: "glipizide", label: "Glipizide Dosage Change", options: medOptions },
      { key: "glyburide", label: "Glyburide Dosage Change", options: medOptions },
      { key: "pioglitazone", label: "Pioglitazone Dosage Change", options: medOptions },
      { key: "rosiglitazone", label: "Rosiglitazone Dosage Change", options: medOptions },
      { key: "acarbose", label: "Acarbose Dosage Change", options: medOptions },
      { key: "miglitol", label: "Miglitol Dosage Change", options: medOptions },
      { key: "insulin", label: "Insulin Dosage Change", options: medOptions },
      {
        key: "change",
        label: "Diabetic Med Change",
        helper: "Was there a change in diabetic medications?",
        options: [
          { label: "No", value: "No" },
          { label: "Ch", value: "Ch" },
        ],
      },
      {
        key: "diabetesMed",
        label: "Diabetes Medication Prescribed",
        helper: "Whether any diabetes medication was prescribed.",
        options: [
          { label: "No", value: "No" },
          { label: "Yes", value: "Yes" },
        ],
      },
    ],
  },
];

const clGroups: GroupConfig[] = [
  {
    title: "Patient Profile",
    fields: [
      { key: "age", label: "Age", helper: "Age in years." },
      {
        key: "sex",
        label: "Sex",
        helper: "Biological sex (male/female).",
        options: [
          { label: "Male", value: "male" },
          { label: "Female", value: "female" },
        ],
      },
      { key: "weight", label: "Weight", helper: "Weight in kg." },
      { key: "bmi", label: "Body Mass Index (BMI)" },
    ],
  },
  {
    title: "Lifestyle & Risk Factors",
    fields: [
      {
        key: "smoker",
        label: "Smoker",
        helper: "Status (1 = smoker, 0 = non-smoker).",
        options: [
          { label: "No (0)", value: 0 },
          { label: "Yes (1)", value: 1 },
        ],
      },
      {
        key: "hereditary_diseases",
        label: "Hereditary Disease History",
        helper: "Known inherited or family-linked condition category.",
        options: [
          { label: "NoDisease", value: "NoDisease" },
          { label: "Epilepsy", value: "Epilepsy" },
          { label: "EyeDisease", value: "EyeDisease" },
          { label: "Alzheimer", value: "Alzheimer" },
          { label: "Arthritis", value: "Arthritis" },
          { label: "HeartDisease", value: "HeartDisease" },
          { label: "Diabetes", value: "Diabetes" },
          { label: "Cancer", value: "Cancer" },
          { label: "High BP", value: "High BP" },
          { label: "Obesity", value: "Obesity" },
        ],
      },
      { key: "no_of_dependents", label: "Number of Dependents" },
    ],
  },
  {
    title: "Medical History",
    fields: [
      { key: "bloodpressure", label: "Blood Pressure" },
      {
        key: "diabetes",
        label: "Diabetes",
        helper: "1 = has diabetes, 0 = does not.",
        options: [
          { label: "No (0)", value: 0 },
          { label: "Yes (1)", value: 1 },
        ],
      },
      {
        key: "regular_ex",
        label: "Regular Exercise",
        helper: "Lifestyle indicator from the claims dataset (1 = yes, 0 = no).",
        options: [
          { label: "No (0)", value: 0 },
          { label: "Yes (1)", value: 1 },
        ],
      },
    ],
  },
  {
    title: "Location & Claim Context",
    fields: [
      { key: "city", label: "City" },
      { key: "job_title", label: "Job Title" },
    ],
  },
];

export default function PredictPage() {
  const [tab, setTab] = useState<"re" | "cl">("re");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

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
    const isNumberField = typeof (reForm as any)[name] === "number";
    setReForm(p => ({ ...p, [name]: (type === "number" || isNumberField) ? Number(value) : value }));
    setFieldErrors(prev => ({ ...prev, [name]: "" }));
    setError(null);
  };

  const handleCl = (e: any) => {
    const { name, value, type } = e.target;
    const isNumberField = typeof (clForm as any)[name] === "number";
    setClForm(p => ({ ...p, [name]: (type === "number" || isNumberField) ? Number(value) : value }));
    setFieldErrors(prev => ({ ...prev, [name]: "" }));
    setError(null);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (tab === "re") {
      Object.keys(reForm).forEach(k => {
        const val = (reForm as any)[k];
        if (val === "" || val === null || val === undefined || (typeof val === "number" && isNaN(val))) {
          newErrors[k] = "This field is required.";
        }
      });
      if (reForm.time_in_hospital < 1 || reForm.time_in_hospital > 14) newErrors.time_in_hospital = "Must be between 1 and 14.";
      if (reForm.num_lab_procedures < 0) newErrors.num_lab_procedures = "Cannot be negative.";
      if (reForm.num_procedures < 0) newErrors.num_procedures = "Cannot be negative.";
      if (reForm.num_medications < 0) newErrors.num_medications = "Cannot be negative.";
      if (reForm.number_outpatient < 0) newErrors.number_outpatient = "Cannot be negative.";
      if (reForm.number_emergency < 0) newErrors.number_emergency = "Cannot be negative.";
      if (reForm.number_inpatient < 0) newErrors.number_inpatient = "Cannot be negative.";
      if (reForm.number_diagnoses < 1) newErrors.number_diagnoses = "Must be at least 1.";
      
      if (!reForm.diag_1?.trim()) newErrors.diag_1 = "Primary diagnosis cannot be blank.";
      if (!reForm.diag_2?.trim()) newErrors.diag_2 = "Secondary diagnosis cannot be blank.";
      if (!reForm.diag_3?.trim()) newErrors.diag_3 = "Tertiary diagnosis cannot be blank.";
    } else {
      Object.keys(clForm).forEach(k => {
        const val = (clForm as any)[k];
        if (val === "" || val === null || val === undefined || (typeof val === "number" && isNaN(val))) {
          newErrors[k] = "This field is required.";
        }
      });
      if (clForm.age < 0 || clForm.age > 120) newErrors.age = "Must be between 0 and 120.";
      if (clForm.weight <= 0) newErrors.weight = "Must be greater than 0.";
      if (clForm.bmi <= 0) newErrors.bmi = "Must be greater than 0.";
      if (clForm.no_of_dependents < 0) newErrors.no_of_dependents = "Cannot be negative.";
      if (clForm.bloodpressure <= 0) newErrors.bloodpressure = "Must be greater than 0.";

      if (!clForm.city?.trim()) newErrors.city = "City cannot be blank.";
      if (!clForm.job_title?.trim()) newErrors.job_title = "Job title cannot be blank.";
    }

    setFieldErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      setError("Please fix the highlighted field errors before submitting.");
      return false;
    }
    return true;
  };

  const submit = async () => {
    if (!validateForm()) return;
    
    setError(null);
    setLoading(true);
    try {
      if (tab === "re") {
        const r = await api.predictReadmission(reForm);
        setReRes(r.data || null);
      } else {
        const r = await api.predictClaim(clForm);
        setClRes(r.data || null);
      }
    } catch (e: any) {
      setError(e.message || "Failed to submit prediction. Please check your connection or backend status.");
    } finally {
      setLoading(false);
    }
  };

  const renderField = (formState: any, handleChange: any, field: FieldConfig) => {
    const val = formState[field.key];
    const isNum = typeof val === "number";
    const fieldErr = fieldErrors[field.key];

    return (
      <div key={field.key} className="mb-4">
        <label className="block text-slate-300 font-medium mb-1">
          {field.label}
        </label>
        {field.options ? (
          <select
            name={field.key}
            value={val !== null && val !== undefined ? val : ""}
            onChange={handleChange}
            className={`bg-slate-800 border rounded px-3 py-2 w-full text-white focus:outline-none ${fieldErr ? 'border-red-500 focus:border-red-500' : 'border-slate-700 focus:border-blue-500'}`}
          >
            {field.options.map(opt => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        ) : (
          <input
            type={isNum ? "number" : "text"}
            name={field.key}
            value={val !== null && val !== undefined ? val : ""}
            onChange={handleChange}
            className={`bg-slate-800 border rounded px-3 py-2 w-full text-white focus:outline-none ${fieldErr ? 'border-red-500 focus:border-red-500' : 'border-slate-700 focus:border-blue-500'}`}
          />
        )}
        {fieldErr ? (
          <p className="text-xs text-red-400 mt-1">{fieldErr}</p>
        ) : field.helper ? (
          <p className="text-xs text-slate-500 mt-1">{field.helper}</p>
        ) : null}
      </div>
    );
  };

  return (
    <div className="p-8 max-w-6xl mx-auto text-white bg-slate-900 min-h-screen font-sans">
      <h1 className="text-3xl font-bold mb-2">AdmitGuard Predictions</h1>
      <p className="text-slate-400 mb-8">Clinical decision-support prototype.</p>

      <div className="flex gap-4 mb-8">
        <button
          className={`px-6 py-2 rounded-md font-medium transition-colors ${
            tab === "re" ? "bg-blue-600 text-white" : "bg-slate-800 text-slate-400 hover:bg-slate-700"
          }`}
          onClick={() => {
            setTab("re");
            setFieldErrors({});
            setError(null);
          }}
        >
          Readmission Risk
        </button>
        <button
          className={`px-6 py-2 rounded-md font-medium transition-colors ${
            tab === "cl" ? "bg-blue-600 text-white" : "bg-slate-800 text-slate-400 hover:bg-slate-700"
          }`}
          onClick={() => {
            setTab("cl");
            setFieldErrors({});
            setError(null);
          }}
        >
          Claim Estimate
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Column */}
        <div className="lg:col-span-2">
          {tab === "re" ? (
            <div className="space-y-8">
              {reGroups.map(group => (
                <div key={group.title} className="bg-slate-800/50 p-6 rounded-xl border border-slate-700/50">
                  <h3 className="text-lg font-semibold text-blue-400 mb-4 pb-2 border-b border-slate-700">
                    {group.title}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                    {group.fields.map(field => renderField(reForm, handleRe, field))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-8">
              {clGroups.map(group => (
                <div key={group.title} className="bg-slate-800/50 p-6 rounded-xl border border-slate-700/50">
                  <h3 className="text-lg font-semibold text-teal-400 mb-4 pb-2 border-b border-slate-700">
                    {group.title}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                    {group.fields.map(field => renderField(clForm, handleCl, field))}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-8">
            {error && <p className="text-red-400 mb-4 p-3 bg-red-900/20 rounded border border-red-900/50">{error}</p>}
            <button
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-4 rounded-lg transition-colors shadow-lg shadow-blue-900/20 disabled:opacity-50"
              onClick={submit}
              disabled={loading}
            >
              {loading ? "Analyzing..." : (tab === "re" ? "Analyze Readmission Risk" : "Estimate Claim Amount")}
            </button>
          </div>
        </div>

        {/* Results Column */}
        <div className="lg:col-span-1">
          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 sticky top-8 shadow-xl">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-white">
              Analysis Result
            </h2>
            {tab === "re" ? (
              reRes ? (
                <div className="space-y-6">
                  {/* Risk Label Block */}
                  <div className="p-5 bg-slate-900/80 rounded-xl border border-slate-700/80 shadow-inner">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Risk Level</p>
                    <p className={`text-3xl font-extrabold tracking-tight ${
                      reRes.risk_label === 'High' ? 'text-red-400' :
                      reRes.risk_label === 'Medium' ? 'text-yellow-400' : 'text-green-400'
                    }`}>
                      {reRes.risk_label}
                    </p>
                  </div>

                  {/* Probability & Risk Bar Block */}
                  <div className="p-5 bg-slate-900/80 rounded-xl border border-slate-700/80 shadow-inner">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Probability</p>
                    <div className="flex items-baseline gap-2 mb-3">
                      <p className="text-4xl font-light text-white">
                        {reRes.risk_probability !== null ? `${(reRes.risk_probability * 100).toFixed(1)}%` : "N/A"}
                      </p>
                    </div>
                    
                    {/* Horizontal Risk Bar */}
                    {reRes.risk_probability !== null && (
                      <div className="w-full bg-slate-800 rounded-full h-3 mb-2 overflow-hidden border border-slate-700">
                        <div 
                          className={`h-full rounded-full transition-all duration-1000 ease-out ${
                            reRes.risk_probability < 0.3 ? 'bg-green-500' :
                            reRes.risk_probability < 0.6 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${Math.min(100, Math.max(0, reRes.risk_probability * 100))}%` }}
                        ></div>
                      </div>
                    )}
                    <div className="flex justify-between text-[10px] text-slate-500 font-medium px-1">
                      <span>Low (0-30%)</span>
                      <span>Mod (30-60%)</span>
                      <span>High (60%+)</span>
                    </div>
                  </div>

                  {/* Disclaimer Block */}
                  <div className="text-xs text-slate-400 mt-6 pt-5 border-t border-slate-700/80 leading-relaxed">
                    <div className="flex items-start gap-2">
                      <span className="font-bold text-slate-300 mt-0.5">Note:</span>
                      <p>{reRes.disclaimer}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-slate-500 text-center py-16 px-4 border-2 border-dashed border-slate-700 rounded-xl bg-slate-800/30">
                  <p className="font-medium">Awaiting Data</p>
                  <p className="text-sm mt-2 opacity-70">Submit the patient profile to view the readmission risk analysis.</p>
                </div>
              )
            ) : (
              clRes ? (
                <div className="space-y-6">
                  {/* Estimated Claim Block */}
                  <div className="p-6 bg-slate-900/80 rounded-xl border border-slate-700/80 shadow-inner flex flex-col items-center justify-center text-center">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Estimated Claim</p>
                    <p className="text-5xl font-extrabold text-teal-400 tracking-tight drop-shadow-sm">
                      ${clRes.predicted_claim_amount.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                    </p>
                    <p className="text-sm text-teal-600/70 mt-2 font-medium">USD</p>
                  </div>

                  {/* Optional Model Message */}
                  {clRes.confidence_note && (
                    <div className="p-4 bg-slate-800/80 rounded-lg border border-slate-700/50">
                      <p className="text-sm text-slate-300">
                        {clRes.confidence_note}
                      </p>
                    </div>
                  )}

                  {/* Disclaimer Block */}
                  <div className="text-xs text-slate-400 mt-6 pt-5 border-t border-slate-700/80 leading-relaxed">
                    <div className="flex items-start gap-2">
                      <span className="font-bold text-slate-300 mt-0.5">Note:</span>
                      <p>{clRes.disclaimer}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-slate-500 text-center py-16 px-4 border-2 border-dashed border-slate-700 rounded-xl bg-slate-800/30">
                  <p className="font-medium">Awaiting Data</p>
                  <p className="text-sm mt-2 opacity-70">Submit the profile to view the estimated claim amount.</p>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
