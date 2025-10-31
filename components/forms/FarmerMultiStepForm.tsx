"use client";

import { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { sendHekoData, HekoApiResponse } from "@/utils/api";

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
  creditCategory: string;
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
  creditCategory: "",
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
  { key: "offers", label: "Lenders & Suppliers" },
] as const;

type StepKey = typeof steps[number]["key"];

export default function FarmerMultiStepForm() {
  const router = useRouter();
  const [active, setActive] = useState<StepKey>("farmer");
  const [data, setData] = useState<FarmerFormData>(() => {
    const saved = localStorage.getItem("farmerFormData");
    return saved ? JSON.parse(saved) : initialData;
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [apiResponse, setApiResponse] = useState<HekoApiResponse | null>(null);

  const stepsDisplayed = useMemo(
    () => (submitted ? steps : steps.filter((s) => s.key !== "offers")),
    [submitted]
  );
  const activeIndex = useMemo(
    () => stepsDisplayed.findIndex((s) => s.key === active),
    [active, stepsDisplayed]
  );

  const next = () => {
    const i = stepsDisplayed.findIndex((s) => s.key === active);
    if (i < stepsDisplayed.length - 1) setActive(stepsDisplayed[i + 1].key);
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
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (active !== "summary") {
      next();
      return;
    }

    try {
      setSubmitting(true);

      // Convert attachments array to JSON string for API
      const payload = { ...data, attachments: JSON.stringify(data.attachments) };

      const result = await sendHekoData(payload);
      console.log("API result:", result);
      setApiResponse(result);

      setSubmitted(true);

      // Redirect to Heko Insights page
      router.push("/farmersDashboard/heko-insights");
    } catch (err) {
      console.error("Failed to submit to API:", err);
      alert("There was an error submitting the form. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
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
            {/* Render steps here */}
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

            {active === "offers" && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-foreground">Available Lenders & Suppliers</h2>
                {/* Your existing offers UI logic */}
              </div>
            )}
          </div>

          <div className="mt-4 flex items-center justify-between border-t pt-3">
            <button type="button" onClick={prev} disabled={active === steps[0].key} className="rounded-sm border px-3 py-2 text-sm disabled:opacity-50">
              Back
            </button>
            {active !== "summary" && active !== "offers" ? (
              <button type="submit" className="rounded-sm bg-primary px-3 py-2 text-sm text-white hover:opacity-90">
                Next
              </button>
            ) : active === "summary" ? (
              <button type="submit" disabled={submitting} className="rounded-sm bg-primary px-3 py-2 text-sm text-white hover:opacity-90 disabled:opacity-70">
                {submitting ? "Submitting..." : "Confirm & Submit"}
              </button>
            ) : (
              <button type="button" onClick={() => alert(`Selected lender: ${data.selectedLender || "-"}\nSelected supplier: ${data.selectedSupplier || "-"}`)} className="rounded-sm bg-primary px-3 py-2 text-sm text-white hover:opacity-90">
                Finish
              </button>
            )}
          </div>
        </div>
      </section>
    </form>
  );
}

function labelize(key: string) {
  return key.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}
