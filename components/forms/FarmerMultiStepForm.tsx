"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { sendHekoData, HekoApiResponse } from "@/utils/api";

type InputProps = {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  error?: string;
};

function Input({ label, value, onChange, type = "text", error }: InputProps) {
  return (
    <label className="flex w-full flex-col gap-1 text-sm">
      <span className="text-zinc-700">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`rounded-sm border px-3 py-2 focus:outline-none ${error ? "border-red-500" : ""}`}
      />
      {error ? <span className="text-xs text-red-600">{error}</span> : null}
    </label>
  );
}

type SelectProps = {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  error?: string;
};

function Select({ label, value, onChange, options, error }: SelectProps) {
  return (
    <label className="flex w-full flex-col gap-1 text-sm">
      <span className="text-zinc-700">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`rounded-sm border px-3 py-2 focus:outline-none ${error ? "border-red-500" : ""}`}
      >
        <option value="">Select...</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      {error ? <span className="text-xs text-red-600">{error}</span> : null}
    </label>
  );
}

type TextAreaProps = {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  error?: string;
};

function TextArea({ label, value, onChange, rows = 4, error }: TextAreaProps) {
  return (
    <label className="flex w-full flex-col gap-1 text-sm">
      <span className="text-zinc-700">{label}</span>
      <textarea
        rows={rows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`rounded-sm border px-3 py-2 focus:outline-none ${error ? "border-red-500" : ""}`}
      />
      {error ? <span className="text-xs text-red-600">{error}</span> : null}
    </label>
  );
}

type FarmerFormData = {
  name: string;
  gender: string;
  age: string;
  county: string;
  inCoop: string;
  experience: string;
  cropYield: string;
  landOwned: string;
  landCultivated: string;
  farmingType: string;
  livestockCount: string;
  farmingDetails: string;
  reputationScore: string;
  resourceAccess: string;
  practiceQuality: string;
  incomeMonthly: string;
  expensesMonthly: string;
  incomeAnnual: string;
  expensesAnnual: string;
  repaymentHistory: string;
  attachments: string[]; // We'll convert this before sending
  seekingPreference: string;
  selectedLender?: string;
  selectedSupplier?: string;
};

const initialData: FarmerFormData = {
  name: "",
  gender: "",
  age: "",
  county: "",
  inCoop: "",
  experience: "",
  cropYield: "",
  landOwned: "",
  landCultivated: "",
  farmingType: "",
  livestockCount: "",
  farmingDetails: "",
  reputationScore: "",
  resourceAccess: "",
  practiceQuality: "",
  incomeMonthly: "",
  expensesMonthly: "",
  incomeAnnual: "",
  expensesAnnual: "",
  repaymentHistory: "",
  attachments: [],
  seekingPreference: "",
  selectedLender: undefined,
  selectedSupplier: undefined,
};

const steps = [
  { key: "farmer", label: "Farmer Data" },
  { key: "farm", label: "Farm Data" },
  { key: "quality", label: "Quality Assurance" },
  { key: "finances", label: "Finances" },
  { key: "attachments", label: "Attachments" },
  { key: "summary", label: "Summary & Confirm" },
  { key: "analysis", label: "Analysis" },
  { key: "offers", label: "Heko Insights" },
] as const;

type StepKey = typeof steps[number]["key"];

export default function FarmerMultiStepForm() {
  const router = useRouter();
  const [active, setActive] = useState<StepKey>("farmer");
  const [data, setData] = useState<FarmerFormData>(() => {
    const saved = localStorage.getItem("farmerFormData");
    return saved ? JSON.parse(saved) : initialData;
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FarmerFormData, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [apiResponse, setApiResponse] = useState<HekoApiResponse | null>(null);
  const [showFinishModal, setShowFinishModal] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<"john" | "mary" | "peter" | "amina">("john");

  // Shared offer options used in Offers step and Finish modal
  const lenderOptions = useMemo(() => (
    [
      { id: "lend-a", name: "AgriBank", rate: "10%", term: "12 mo", max: "$5,000" },
      { id: "lend-b", name: "GreenFund", rate: "12%", term: "10 mo", max: "$8,000" },
      { id: "lend-c", name: "RuralCredit", rate: "8%", term: "6 mo", max: "$3,500" },
    ]
  ), []);
  const supplierOptions = useMemo(() => (
    [
      { id: "sup-a", name: "AgriInputs Co.", offer: "Fertilizer & Seeds", terms: "Net 30", support: "Field training" },
      { id: "sup-b", name: "IrrigaTech", offer: "Irrigation kits", terms: "Lease-to-own", support: "Installation" },
      { id: "sup-c", name: "CropCare", offer: "Crop protection", terms: "Discount 8%", support: "Advisory" },
    ]
  ), []);

  // Demo profiles used for Auto-fill; all values map cleanly to API schema through toApiPayload
  const demoProfiles = useMemo(() => ({
    john: {
      name: "John Doe",
      gender: "Male",
      age: "35",
      county: "Nairobi",
      inCoop: "Yes",
      experience: "15",
      cropYield: "5.2",
      landOwned: "10.5",
      landCultivated: "10.5",
      farmingType: "Crop",
      livestockCount: "0",
      farmingDetails: "",
      reputationScore: "75",
      resourceAccess: "Medium",
      practiceQuality: "70",
      incomeMonthly: "1000",
      expensesMonthly: "300",
      incomeAnnual: "12000",
      expensesAnnual: "3600",
      repaymentHistory: "Yes",
      attachments: [],
      seekingPreference: "Credit",
      selectedLender: undefined,
      selectedSupplier: undefined,
    } as FarmerFormData,
    mary: {
      name: "Mary Wanjiru",
      gender: "Female",
      age: "29",
      county: "Nakuru",
      inCoop: "No",
      experience: "6",
      cropYield: "3.8",
      landOwned: "4.0",
      landCultivated: "3.5",
      farmingType: "Crop",
      livestockCount: "2",
      farmingDetails: "Maize and beans rotation.",
      reputationScore: "68",
      resourceAccess: "Medium",
      practiceQuality: "65",
      incomeMonthly: "900",
      expensesMonthly: "450",
      incomeAnnual: "10800",
      expensesAnnual: "5400",
      repaymentHistory: "No",
      attachments: [],
      seekingPreference: "Resources",
      selectedLender: undefined,
      selectedSupplier: undefined,
    } as FarmerFormData,
    peter: {
      name: "Peter Otieno",
      gender: "Male",
      age: "41",
      county: "Kisumu",
      inCoop: "Yes",
      experience: "14",
      cropYield: "6.3",
      landOwned: "8.5",
      landCultivated: "7.2",
      farmingType: "Mixed",
      livestockCount: "10",
      farmingDetails: "Dairy and sugarcane.",
      reputationScore: "83",
      resourceAccess: "High",
      practiceQuality: "80",
      incomeMonthly: "1400",
      expensesMonthly: "700",
      incomeAnnual: "16800",
      expensesAnnual: "8400",
      repaymentHistory: "Yes",
      attachments: [],
      seekingPreference: "Both",
      selectedLender: undefined,
      selectedSupplier: undefined,
    } as FarmerFormData,
    amina: {
      name: "Amina Hassan",
      gender: "Female",
      age: "33",
      county: "Mombasa",
      inCoop: "No",
      experience: "9",
      cropYield: "1.2",
      landOwned: "2.5",
      landCultivated: "2.0",
      farmingType: "Livestock",
      livestockCount: "18",
      farmingDetails: "Goats and poultry.",
      reputationScore: "57",
      resourceAccess: "Low",
      practiceQuality: "58",
      incomeMonthly: "700",
      expensesMonthly: "400",
      incomeAnnual: "8400",
      expensesAnnual: "4800",
      repaymentHistory: "No",
      attachments: [],
      seekingPreference: "Resources",
      selectedLender: undefined,
      selectedSupplier: undefined,
    } as FarmerFormData,
  }), []);

  const stepsDisplayed = useMemo(
    () => (submitted ? steps : steps.filter((s) => s.key !== "offers")),
    [submitted]
  );
  const activeIndex = useMemo(
    () => stepsDisplayed.findIndex((s) => s.key === active),
    [active, stepsDisplayed]
  );

  const riskLevel = useMemo(() => {
    const out = (apiResponse as any)?.output;
    return typeof out === "string" ? out.toLowerCase() : undefined;
  }, [apiResponse]);

  const creditScoreLabel = useMemo(() => {
    if (riskLevel === "high") return "Low";
    if (riskLevel === "medium") return "Average";
    if (riskLevel === "low") return "High";
    return undefined;
  }, [riskLevel]);

  const next = () => {
    const i = stepsDisplayed.findIndex((s) => s.key === active);
    if (i < stepsDisplayed.length - 1) setActive(stepsDisplayed[i + 1].key);
  };

  // Build API payload in required format
  const toApiPayload = (form: FarmerFormData) => {
    const parseNum = (s: string): number | null => {
      const n = Number(s);
      return isFinite(n) ? n : null;
    };
    const parseFirstNumberInText = (s: string): number | null => {
      const m = (s || "").match(/[-+]?[0-9]*\.?[0-9]+/);
      return m ? Number(m[0]) : null;
    };
    const landAcres = parseNum(form.landOwned) ?? 0;
    const incomeMonthly = Math.max(0, parseNum(form.incomeMonthly) ?? 0);
    const expensesMonthly = Math.max(0, parseNum(form.expensesMonthly) ?? 0);
    const variabilityRaw = incomeMonthly > 0 ? expensesMonthly / incomeMonthly : 0.3;
    const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
    const accessMap: Record<string, string> = { Low: "None", Medium: "Some", High: "Limited" };
    return {
      County: form.county || "",
      Age: Math.max(0, parseNum(form.age) ?? 0),
      Gender: form.gender || "",
      Crop_Yield_Tons: parseFirstNumberInText(form.cropYield) ?? 0,
      Land_Ownership: landAcres > 0 ? "Owned" : "Unknown",
      land_ownership_acres: landAcres,
      farming_type: form.farmingType || "",
      farming_experience_years: Math.max(0, parseNum(form.experience) ?? 0),
      access_to_resources: (accessMap[form.resourceAccess] ?? form.resourceAccess) || "",
      income_variability_index: clamp01(variabilityRaw),
      community_reputation_score: (parseNum(form.reputationScore) ?? 0) / 10,
    } as const;
  };

  // Generate demo data quickly based on selected profile
  const generateDemoData = (): FarmerFormData => {
    return demoProfiles[selectedProfile] || demoProfiles.john;
  };

  const handleAutoFill = () => {
    const demo = generateDemoData();
    setData(demo);
    localStorage.setItem("farmerFormData", JSON.stringify(demo));
    setErrors({});
  };

  const handleClearAll = () => {
    try {
      localStorage.removeItem("farmerFormData");
      localStorage.removeItem("hekoApiResponse");
    } catch {}
    setData(initialData);
    setErrors({});
    setSubmitted(false);
    setApiResponse(null);
    setActive("farmer");
  };

  const handleAutoFillAndSubmit = async () => {
    const demo = generateDemoData();
    setData(demo);
    localStorage.setItem("farmerFormData", JSON.stringify(demo));
    setErrors({});
    // Validate demo across steps before sending
    for (const s of ["farmer", "farm", "quality", "finances"] as StepKey[]) {
      if (!validateStep(s, demo)) {
        setActive(s);
        return;
      }
    }
    // Submit using demo payload
    try {
      setSubmitting(true);
      setActive("analysis");
      const payload = toApiPayload(demo);
      console.log("Outgoing payload (auto):", payload);
      const result = await sendHekoData(payload);
      console.log("API result (auto):", result);
      setApiResponse(result);
      setSubmitted(true);
      localStorage.setItem("hekoApiResponse", JSON.stringify(result));
    } catch (err) {
      console.error("Auto submit failed:", err);
      alert("Auto submit failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };
  const prev = () => {
    const i = stepsDisplayed.findIndex((s) => s.key === active);
    if (i > 0) setActive(stepsDisplayed[i - 1].key);
  };

  const update = <K extends keyof FarmerFormData>(key: K, value: FarmerFormData[K]) => {
    setData((d) => {
      const updated = { ...d, [key]: value };
      localStorage.setItem("farmerFormData", JSON.stringify(updated)); // Save each change
      return updated;
    });
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const isNumber = (v: string) => v !== "" && !isNaN(Number(v));
  const isNonNegative = (v: string) => isNumber(v) && Number(v) >= 0;
  const inRange = (v: string, min: number, max: number) => isNumber(v) && Number(v) >= min && Number(v) <= max;

  const validateStep = (step: StepKey, form: FarmerFormData = data) => {
    const stepErrors: Partial<Record<keyof FarmerFormData, string>> = {};
    if (step === "farmer") {
      if (!form.name) stepErrors.name = "Required";
      if (!form.gender) stepErrors.gender = "Required";
      if (!isNonNegative(form.age)) stepErrors.age = "Enter a valid age";
      if (!form.county) stepErrors.county = "Required";
      if (!form.inCoop) stepErrors.inCoop = "Required";
      if (!isNonNegative(form.experience)) stepErrors.experience = "Enter years (0+)";
    }
    if (step === "farm") {
      if (!form.cropYield) stepErrors.cropYield = "Required";
      if (!isNonNegative(form.landOwned)) stepErrors.landOwned = "0 or more";
      if (!isNonNegative(form.landCultivated)) stepErrors.landCultivated = "0 or more";
      if (!form.farmingType) stepErrors.farmingType = "Required";
      if (!isNonNegative(form.livestockCount)) stepErrors.livestockCount = "0 or more";
      // farmingDetails optional
    }
    if (step === "quality") {
      if (!inRange(form.reputationScore, 1, 100)) stepErrors.reputationScore = "1 - 100";
      if (!form.resourceAccess) stepErrors.resourceAccess = "Required";
      if (!inRange(form.practiceQuality, 1, 100)) stepErrors.practiceQuality = "1 - 100";
    }
    if (step === "finances") {
      if (!isNonNegative(form.incomeMonthly)) stepErrors.incomeMonthly = "0 or more";
      if (!isNonNegative(form.expensesMonthly)) stepErrors.expensesMonthly = "0 or more";
      if (!isNonNegative(form.incomeAnnual)) stepErrors.incomeAnnual = "0 or more";
      if (!isNonNegative(form.expensesAnnual)) stepErrors.expensesAnnual = "0 or more";
      if (!form.repaymentHistory) stepErrors.repaymentHistory = "Required";
      if (!form.seekingPreference) stepErrors.seekingPreference = "Required";
    }
    setErrors((prev) => ({ ...prev, ...stepErrors }));
    return Object.keys(stepErrors).length === 0;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (active !== "summary") {
      const ok = validateStep(active);
      if (ok) next();
      return;
    }

    try {
      setSubmitting(true);
      // Validate all steps before submit
      for (const s of ["farmer", "farm", "quality", "finances"] as StepKey[]) {
        if (!validateStep(s)) {
          setActive(s);
          throw new Error("Validation failed");
        }
      }

      // Move to analysis step to show loading while calling API
      setActive("analysis");

      // Map form to API schema
      const payload = toApiPayload(data);
      console.log("Outgoing payload:", payload);

      const result = await sendHekoData(payload);
      console.log("API result (submit):", result);
      setApiResponse(result);

      setSubmitted(true);

      // Persist response (optional for later use)
      try { localStorage.setItem("hekoApiResponse", JSON.stringify(result)); } catch {}
    } catch (err) {
      console.error("Failed to submit to API:", err);
      alert("There was an error submitting the form. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
    <form onSubmit={onSubmit} className="flex h-[70vh] gap-4">
      <aside className="w-[260px] shrink-0 rounded-sm border bg-white p-4 shadow-sm h-full overflow-auto">
        <div className="text-sm font-semibold text-foreground">Steps</div>
        <ol className="mt-3 space-y-2 text-sm">
          {stepsDisplayed.map((s, i) => {
            const isActive = s.key === active;
            const isDone = i < activeIndex;
            return (
              <li key={s.key}>
                <button
                  type="button"
                  onClick={() => setActive(s.key)}
                  className={`w-full rounded-sm px-3 py-2 text-left transition-colors ${
                    isActive ? "bg-primary text-white" : isDone ? "bg-primary/10 text-foreground" : "hover:bg-zinc-100"
                  }`}
                >
                  <span className="mr-2 inline-block w-6 text-center text-xs align-middle opacity-70">{i + 1}</span>
                  {s.label}
                </button>
              </li>
            );
          })}
        </ol>
      </aside>

      <section className="flex-1 rounded-sm border bg-white p-4 shadow-sm min-w-0 h-full overflow-hidden">
        <div className="flex h-full flex-col">
          <div className="flex-1 overflow-auto">
            {active === "farmer" && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-foreground">Farmer Data</h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Input label="Name" value={data.name} onChange={(v) => update("name", v)} error={errors.name} />
                  <Select label="Gender" value={data.gender} onChange={(v) => update("gender", v)} options={["Male", "Female", "Other"]} error={errors.gender} />
                  <Input label="Age" value={data.age} onChange={(v) => update("age", v)} type="number" error={errors.age} />
                  <Input label="County" value={data.county} onChange={(v) => update("county", v)} error={errors.county} />
                  <Select label="Belongs to Cooperative/SACCO" value={data.inCoop} onChange={(v) => update("inCoop", v)} options={["Yes", "No"]} error={errors.inCoop} />
                  <Input label="Farming Experience (years)" value={data.experience} onChange={(v) => update("experience", v)} type="number" error={errors.experience} />
                </div>
              </div>
            )}

            {active === "farm" && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-foreground">Farm Data</h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Input label="Crop Yield" value={data.cropYield} onChange={(v) => update("cropYield", v)} error={errors.cropYield} />
                  <Input label="Land Owned (acres)" value={data.landOwned} onChange={(v) => update("landOwned", v)} type="number" error={errors.landOwned} />
                  <Input label="Land Cultivated (acres)" value={data.landCultivated} onChange={(v) => update("landCultivated", v)} type="number" error={errors.landCultivated} />
                  <Select label="Farming Type" value={data.farmingType} onChange={(v) => update("farmingType", v)} options={["Crop", "Livestock", "Mixed"]} error={errors.farmingType} />
                  <Input label="Livestock Count" value={data.livestockCount} onChange={(v) => update("livestockCount", v)} type="number" error={errors.livestockCount} />
                  <TextArea label="Specific Farming Details" value={data.farmingDetails} onChange={(v) => update("farmingDetails", v)} rows={3} />
                </div>
              </div>
            )}

            {active === "quality" && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-foreground">Quality Assurance</h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Input label="Community Reputation Score (1-100)" value={data.reputationScore} onChange={(v) => update("reputationScore", v)} type="number" error={errors.reputationScore} />
                  <Select label="Access to Resources" value={data.resourceAccess} onChange={(v) => update("resourceAccess", v)} options={["Low", "Medium", "High"]} error={errors.resourceAccess} />
                  <Input label="Farming Practice Quality Score (1-100)" value={data.practiceQuality} onChange={(v) => update("practiceQuality", v)} type="number" error={errors.practiceQuality} />
                </div>
              </div>
            )}

            {active === "finances" && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-foreground">Finances</h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Input label="Income (Monthly)" value={data.incomeMonthly} onChange={(v) => update("incomeMonthly", v)} type="number" error={errors.incomeMonthly} />
                  <Input label="Expenses (Monthly)" value={data.expensesMonthly} onChange={(v) => update("expensesMonthly", v)} type="number" error={errors.expensesMonthly} />
                  <Input label="Income (Annual)" value={data.incomeAnnual} onChange={(v) => update("incomeAnnual", v)} type="number" error={errors.incomeAnnual} />
                  <Input label="Expenses (Annual)" value={data.expensesAnnual} onChange={(v) => update("expensesAnnual", v)} type="number" error={errors.expensesAnnual} />
                  <Select
                label="Have you previously had access to credit (cash or in-kind resources)?"
                value={data.repaymentHistory}
                onChange={(v) => update("repaymentHistory", v)}
                options={["Yes", "No"]}
                error={errors.repaymentHistory}
              />
                  <Select label="Seeking" value={data.seekingPreference} onChange={(v) => update("seekingPreference", v)} options={["Credit", "Resources", "Both"]} error={errors.seekingPreference} />
                </div>
              </div>
            )}

            {active === "attachments" && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-foreground">Attachments</h2>
                <div className="space-y-3">
                  <div className="text-sm text-zinc-700">Upload supporting documents (proof of income, land records, cooperative membership, etc.).</div>
                  <label className="flex w-full flex-col gap-1 text-sm sm:max-w-md">
                    <span className="text-zinc-700">Files</span>
                    <input
                      type="file"
                      multiple
                      onChange={(e) => {
                        const files = e.target.files ? Array.from(e.target.files).map((f) => f.name) : [];
                        update("attachments", files);
                      }}
                      className="rounded-sm border px-3 py-2 focus:outline-none"
                    />
                  </label>
                  {data.attachments.length > 0 && (
                    <ul className="list-inside list-disc text-sm text-zinc-700">
                      {data.attachments.map((n, i) => (
                        <li key={`${n}-${i}`}>{n}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            )}
            {active === "summary" && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-foreground">Summary & Confirm</h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {Object.entries(data).map(([k, v]) => (
                    <div key={k} className="rounded-sm border p-3 text-sm">
                      <div className="text-xs uppercase text-zinc-500">{labelize(k)}</div>
                      <div className="mt-1 font-medium text-foreground">{String(v) || "-"}</div>
                    </div>
                  ))}
                </div>
                {submitted && apiResponse && (
                  <div className="rounded-sm border bg-primary/5 p-4 text-sm">
                    <pre>{JSON.stringify(apiResponse, null, 2)}</pre>
                  </div>
                )}
              </div>
            )}

            {active === "analysis" && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-foreground">Analysis</h2>
                {submitting ? (
                  <div className="rounded-sm border bg-primary/5 p-6 text-sm flex items-center justify-center">
                    <span className="animate-pulse">Analyzing your data, please wait...</span>
                  </div>
                ) : apiResponse ? (
                  <div className="space-y-3">
                    <div className="rounded-sm border p-4">
                      <div className="text-sm text-zinc-600">Credit Score</div>
                      <div className="text-2xl font-semibold text-primary mt-1">{creditScoreLabel ?? "-"}</div>
                      <div className="mt-1 text-sm text-zinc-700">{apiResponse.prediction || apiResponse.message || ""}</div>
                    </div>
                    <div className="rounded-sm border p-4">
                      <div className="text-sm font-medium text-foreground">Recommendations</div>
                      <ul className="mt-2 list-disc list-inside text-sm text-zinc-700">
                        {riskLevel === "high" && (
                          <>
                            <li>Eligible for lender recommendations and farm resources.</li>
                            <li>Proceed to the next step to view offers.</li>
                          </>
                        )}
                        {riskLevel === "medium" && (
                          <>
                            <li>Limited access to loans may apply; proceed to view eligible offers.</li>
                            <li>Consider initiatives to improve your score.</li>
                          </>
                        )}
                        {riskLevel === "low" && (
                          <>
                            <li>Focus on farm management services and training initiatives.</li>
                            <li>Improve practices to unlock loan access.</li>
                          </>
                        )}
                        {!riskLevel && (
                          <li>Proceed to the next step to view available options.</li>
                        )}
                        {(apiResponse.recommendations || []).map((r, i) => (
                          <li key={`api-${i}`}>{String(r)}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-sm border bg-amber-50 p-4 text-sm">No response yet.</div>
                )}
              </div>
            )}

            
            {active === "offers" && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-foreground">Available Lenders & Suppliers</h2>
                {riskLevel === "high" && (
                  <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <div>
                      <div className="mb-2 text-sm font-medium text-foreground">Lenders</div>
                      <ul className="space-y-2 text-sm">
                        {lenderOptions.map((l) => (
                          <li key={l.id} className="rounded-sm border p-3">
                            <label className="flex w-full cursor-pointer items-center gap-3">
                              <input
                                type="radio"
                                name="lender"
                                checked={data.selectedLender === l.id}
                                onChange={() => update("selectedLender", l.id)}
                              />
                              <div className="flex-1">
                                <div className="font-medium">{l.name}</div>
                                <div className="text-xs text-zinc-600">Rate {l.rate} • Term {l.term} • Max {l.max}</div>
                              </div>
                            </label>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <div className="mb-2 text-sm font-medium text-foreground">Suppliers</div>
                      <ul className="space-y-2 text-sm">
                        {supplierOptions.map((s) => (
                          <li key={s.id} className="rounded-sm border p-3">
                            <label className="flex w-full cursor-pointer items-center gap-3">
                              <input
                                type="radio"
                                name="supplier"
                                checked={data.selectedSupplier === s.id}
                                onChange={() => update("selectedSupplier", s.id)}
                              />
                              <div className="flex-1">
                                <div className="font-medium">{s.name}</div>
                                <div className="text-xs text-zinc-600">{s.offer} • {s.terms} • {s.support}</div>
                              </div>
                            </label>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {riskLevel === "medium" && (
                  <div className="space-y-4">
                    <div className="rounded-sm border p-4">
                      <div className="text-sm font-medium text-foreground mb-2">Limited Loan Offers</div>
                      <ul className="space-y-2 text-sm">
                        {lenderOptions.filter(l => l.id === "lend-c").map((l) => (
                          <li key={l.id} className="rounded-sm border p-3">
                            <label className="flex w-full cursor-pointer items-center gap-3">
                              <input type="radio" name="lender" checked={data.selectedLender === l.id} onChange={() => update("selectedLender", l.id)} />
                              <div className="flex-1">
                                <div className="font-medium">{l.name}</div>
                                <div className="text-xs text-zinc-600">Rate {l.rate} • Term {l.term} • Max {l.max}</div>
                              </div>
                            </label>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="rounded-sm border p-4">
                      <div className="text-sm font-medium text-foreground mb-2">Recommended Initiatives</div>
                      <ul className="list-disc list-inside text-sm text-zinc-700">
                        <li>Join county agricultural training programs</li>
                        <li>Enroll in soil testing and advisory services</li>
                        <li>Adopt improved irrigation practices</li>
                      </ul>
                    </div>
                  </div>
                )}

                {riskLevel === "low" && (
                  <div className="rounded-sm border p-4">
                    <div className="text-sm font-medium text-foreground mb-2">Recommended Initiatives</div>
                    <ul className="list-disc list-inside text-sm text-zinc-700">
                      <li>Join farm management services</li>
                      <li>Participate in county agricultural initiatives</li>
                      <li>Attend best-practice trainings to improve credit standing</li>
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="mt-4 flex items-center justify-between border-t pt-3 gap-2">
            <div className="flex items-center gap-2">
              <button type="button" onClick={prev} disabled={active === steps[0].key} className="rounded-sm border px-3 py-2 text-sm disabled:opacity-50">
              Back
              </button>
              <select
                className="rounded-sm border px-2 py-2 text-sm text-foreground"
                value={selectedProfile}
                onChange={(e) => setSelectedProfile(e.target.value as any)}
                title="Choose demo profile"
              >
                <option value="john">John Doe</option>
                <option value="mary">Mary Wanjiru</option>
                <option value="peter">Peter Otieno</option>
                <option value="amina">Amina Hassan</option>
              </select>
              <button type="button" onClick={handleClearAll} className="rounded-sm border px-3 py-2 text-sm">
                Clear All
              </button>
              <button type="button" onClick={handleAutoFill} className="rounded-sm border px-3 py-2 text-sm">
                Auto-fill
              </button>
              <button type="button" onClick={handleAutoFillAndSubmit} disabled={submitting} className="rounded-sm border px-3 py-2 text-sm disabled:opacity-50">
                {submitting ? "Submitting..." : "Auto-fill & Submit"}
              </button>
            </div>
            {active !== "summary" && active !== "offers" ? (
              <button type="submit" disabled={submitting || (active === "analysis" && !apiResponse)} className="rounded-sm bg-primary px-3 py-2 text-sm text-white hover:opacity-90 disabled:opacity-70">
                Next
              </button>
            ) : active === "summary" ? (
              <button type="submit" disabled={submitting} className="rounded-sm bg-primary px-3 py-2 text-sm text-white hover:opacity-90 disabled:opacity-70">
                {submitting ? "Submitting..." : "Confirm & Submit"}
              </button>
            ) : (
              <button type="button" onClick={() => setShowFinishModal(true)} className="rounded-sm bg-primary px-3 py-2 text-sm text-white hover:opacity-90">
                Finish
              </button>
            )}
          </div>
        </div>
      </section>
    </form>
    {showFinishModal && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
        <div className="w-full max-w-md rounded-md bg-white p-5 shadow-lg">
          <div className="text-lg font-semibold text-foreground">Submission Complete</div>
          <div className="mt-3 text-sm text-zinc-700">
            <div className="mb-2">Here are your selected options:</div>
            <ul className="mb-3 list-disc list-inside">
              <li>
                Lender: {lenderOptions.find(l => l.id === data.selectedLender)?.name || "-"}
              </li>
              {data.selectedSupplier && (
                <li>
                  Supplier: {supplierOptions.find(s => s.id === data.selectedSupplier)?.name}
                </li>
              )}
            </ul>
            <div>We will contact you based on your selections.</div>
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <button type="button" className="rounded-sm border px-3 py-2 text-sm" onClick={() => setShowFinishModal(false)}>Close</button>
            <button
              type="button"
              className="rounded-sm bg-primary px-3 py-2 text-sm text-white hover:opacity-90"
              onClick={() => {
                setShowFinishModal(false);
                handleClearAll();
              }}
            >
              Done
            </button>
          </div>
        </div>
      </div>
    )}
    </>
  );
}

function labelize(key: string) {
  return key.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}
