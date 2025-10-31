"use client";
import { useMemo, useState } from "react";

type FarmerFormData = {
  // Step 1: Farmer Data
  name: string;
  gender: string;
  age: string;
  county: string;
  inCoop: string;
  experience: string;
  // Step 2: Farm Data
  cropYield: string;
  landOwned: string;
  landCultivated: string;
  farmingType: string;
  livestockCount: string;
  farmingDetails: string;
  // Step 3: Quality Assurance
  reputationScore: string;
  resourceAccess: string;
  practiceQuality: string;
  // Step 4: Finances
  incomeMonthly: string;
  expensesMonthly: string;
  incomeAnnual: string;
  expensesAnnual: string;
  repaymentHistory: string;
  // Step 5: Attachments (filenames only for demo)
  attachments: string[];
  // Simulation inputs
  creditCategory: string; // Poor | Standard | Good | Great
  seekingPreference: string; // Credit | Resources | Both
  // Offers selections
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
  const [active, setActive] = useState<StepKey>("farmer");
  const [data, setData] = useState<FarmerFormData>(initialData);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const stepsDisplayed = useMemo(
    () => (submitted ? steps : steps.filter((s) => s.key !== "offers")),
    [submitted]
  );
  const activeIndex = useMemo(
    () => stepsDisplayed.findIndex((s) => s.key === active),
    [active, stepsDisplayed]
  );

  function next() {
    const i = stepsDisplayed.findIndex((s) => s.key === active);
    if (i < stepsDisplayed.length - 1) setActive(stepsDisplayed[i + 1].key);
  }
  function prev() {
    const i = stepsDisplayed.findIndex((s) => s.key === active);
    if (i > 0) setActive(stepsDisplayed[i - 1].key);
  }

  function update<K extends keyof FarmerFormData>(key: K, value: FarmerFormData[K]) {
    setData((d) => ({ ...d, [key]: value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (active !== "summary") {
      next();
      return;
    }
    try {
      setSubmitting(true);
      await new Promise((r) => setTimeout(r, 700));
      setSubmitted(true);
      setActive("offers");
    } finally {
      setSubmitting(false);
    }
  }

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
                    isActive
                      ? "bg-primary text-white"
                      : isDone
                        ? "bg-primary/10 text-foreground"
                        : "hover:bg-zinc-100"
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
                  <Input label="Name" value={data.name} onChange={(v) => update("name", v)} />
                  <Select label="Gender" value={data.gender} onChange={(v) => update("gender", v)} options={["Male", "Female", "Other"]} />
                  <Input label="Age" value={data.age} onChange={(v) => update("age", v)} type="number" />
                  <Input label="County" value={data.county} onChange={(v) => update("county", v)} />
                  <Select label="Belongs to Cooperative/SACCO" value={data.inCoop} onChange={(v) => update("inCoop", v)} options={["Yes", "No"]} />
                  <Input label="Farming Experience (years)" value={data.experience} onChange={(v) => update("experience", v)} type="number" />
                </div>
              </div>
            )}

            {active === "farm" && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-foreground">Farm Data</h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Input label="Crop Yield" value={data.cropYield} onChange={(v) => update("cropYield", v)} />
                  <Input label="Land Owned (acres)" value={data.landOwned} onChange={(v) => update("landOwned", v)} type="number" />
                  <Input label="Land Cultivated (acres)" value={data.landCultivated} onChange={(v) => update("landCultivated", v)} type="number" />
                  <Select label="Farming Type" value={data.farmingType} onChange={(v) => update("farmingType", v)} options={["Crop", "Livestock", "Mixed"]} />
                  <Input label="Livestock Count" value={data.livestockCount} onChange={(v) => update("livestockCount", v)} type="number" />
                  <TextArea label="Specific Farming Details" value={data.farmingDetails} onChange={(v) => update("farmingDetails", v)} rows={3} />
                </div>
              </div>
            )}

            {active === "quality" && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-foreground">Quality Assurance</h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Input label="Community Reputation Score (1-100)" value={data.reputationScore} onChange={(v) => update("reputationScore", v)} type="number" />
                  <Select label="Access to Resources" value={data.resourceAccess} onChange={(v) => update("resourceAccess", v)} options={["Low", "Medium", "High"]} />
                  <Input label="Farming Practice Quality Score (1-100)" value={data.practiceQuality} onChange={(v) => update("practiceQuality", v)} type="number" />
                  <Select label="Credit Category" value={data.creditCategory} onChange={(v) => update("creditCategory", v)} options={["Poor", "Standard", "Good", "Great"]} />
                </div>
              </div>
            )}

            {active === "finances" && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-foreground">Finances</h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Input label="Income (Monthly)" value={data.incomeMonthly} onChange={(v) => update("incomeMonthly", v)} type="number" />
                  <Input label="Expenses (Monthly)" value={data.expensesMonthly} onChange={(v) => update("expensesMonthly", v)} type="number" />
                  <Input label="Income (Annual)" value={data.incomeAnnual} onChange={(v) => update("incomeAnnual", v)} type="number" />
                  <Input label="Expenses (Annual)" value={data.expensesAnnual} onChange={(v) => update("expensesAnnual", v)} type="number" />
                  <Select
                label="Have you previously had access to credit (cash or in-kind resources)?"
                value={data.repaymentHistory}
                onChange={(v) => update("repaymentHistory", v)}
                options={["Yes", "No"]}
              />
                  <Select label="Seeking" value={data.seekingPreference} onChange={(v) => update("seekingPreference", v)} options={["Credit", "Resources", "Both"]} />
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
                {submitted && (
                  <div className="rounded-sm border bg-primary/5 p-4 text-sm">
                    {renderSimulation(data)}
                  </div>
                )}
              </div>
            )}

            {active === "offers" && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-foreground">Available Lenders & Suppliers</h2>
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                  <div>
                    <div className="mb-2 text-sm font-medium text-foreground">Lenders</div>
                    <ul className="space-y-2 text-sm">
                      {[
                        { id: "lend-a", name: "AgriBank", rate: "10%", term: "12 mo", max: "$5,000" },
                        { id: "lend-b", name: "GreenFund", rate: "12%", term: "10 mo", max: "$8,000" },
                        { id: "lend-c", name: "RuralCredit", rate: "8%", term: "6 mo", max: "$3,500" },
                      ].map((l) => (
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
                      {[
                        { id: "sup-a", name: "AgriInputs Co.", offer: "Fertilizer & Seeds", terms: "Net 30", support: "Field training" },
                        { id: "sup-b", name: "IrrigaTech", offer: "Irrigation kits", terms: "Lease-to-own", support: "Installation" },
                        { id: "sup-c", name: "CropCare", offer: "Crop protection", terms: "Discount 8%", support: "Advisory" },
                      ].map((s) => (
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
              </div>
            )}
          </div>
          <div className="mt-4 flex items-center justify-between border-t pt-3">
            <button
              type="button"
              onClick={prev}
              disabled={active === steps[0].key}
              className="rounded-sm border px-3 py-2 text-sm disabled:opacity-50"
            >
              Back
            </button>
            {active !== "summary" && active !== "offers" ? (
              <button type="submit" className="rounded-sm bg-primary px-3 py-2 text-sm text-white hover:opacity-90">
                Next
              </button>
            ) : active === "summary" ? (
              <button
                type="submit"
                disabled={submitting}
                className="rounded-sm bg-primary px-3 py-2 text-sm text-white hover:opacity-90 disabled:opacity-70"
              >
                {submitting ? "Submitting..." : "Confirm & Submit"}
              </button>
            ) : (
              <button
                type="button"
                onClick={() => alert(`Selected lender: ${data.selectedLender || "-"}\nSelected supplier: ${data.selectedSupplier || "-"}`)}
                className="rounded-sm bg-primary px-3 py-2 text-sm text-white hover:opacity-90"
              >
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
  return key
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function Input({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="text-zinc-700">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-sm border px-3 py-2 focus:outline-none"
      />
    </label>
  );
}

function Select({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="text-zinc-700">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-sm border px-3 py-2 focus:outline-none"
      >
        <option value="" disabled>
          Select...
        </option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  );
}

function TextArea({ label, value, onChange, rows = 4 }: { label: string; value: string; onChange: (v: string) => void; rows?: number }) {
  return (
    <label className="flex flex-col gap-1 text-sm sm:col-span-2">
      <span className="text-zinc-700">{label}</span>
      <textarea
        rows={rows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="min-h-10 resize-y rounded-sm border px-3 py-2 focus:outline-none"
      />
    </label>
  );
}

function renderSimulation(data: FarmerFormData) {
  const cat = (data.creditCategory || "").toLowerCase();
  const seeking = (data.seekingPreference || "").toLowerCase();
  const previouslyCredited = (data.repaymentHistory || "").toLowerCase() === "yes";

  if (cat === "great" || cat === "good") {
    return (
      <div>
        <div className="mb-2 font-medium text-foreground">Result: Strong credit profile</div>
        <ul className="list-inside list-disc space-y-1">
          <li>Access to a larger pool of lenders, funds, and farm resources.</li>
          <li>Eligible to receive both cash and in-kind resources.</li>
          {seeking && <li>Preference noted: {data.seekingPreference}.</li>}
          {previouslyCredited && <li>Previous credit history detected — you may qualify for faster disbursement.</li>}
        </ul>
      </div>
    );
  }

  if (cat === "standard") {
    return (
      <div>
        <div className="mb-2 font-medium text-foreground">Result: Moderate credit profile</div>
        <ul className="list-inside list-disc space-y-1">
          <li>Qualified for selected lenders and tailored resource support.</li>
          <li>Consider combining resources (inputs, training) with smaller credit to improve outcomes.</li>
          {seeking && <li>Preference noted: {data.seekingPreference}.</li>}
        </ul>
      </div>
    );
  }

  if (cat === "poor") {
    return (
      <div>
        <div className="mb-2 font-medium text-foreground">Result: Development path recommended</div>
        <ul className="list-inside list-disc space-y-1">
          <li>Join a cooperative or SACCO to build savings and credit discipline.</li>
          <li>
            Enroll in a farm management programme for improved practices and mentorship —
            {/* <a className="text-primary underline ml-1" href="https://kiembenikenya.vercel.app/" target="_blank" rel="noreferrer">see option</a>. */}
          </li>
          <li>Focus on resources first (inputs, training, agronomy support) to raise yields and reduce risk.</li>
          <li>Re-evaluate credit after one or two seasons with improved performance.</li>
        </ul>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-2 font-medium text-foreground">Result: More information needed</div>
      <ul className="list-inside list-disc space-y-1">
        <li>Please select your Credit Category and Seeking preference for tailored recommendations.</li>
      </ul>
    </div>
  );
}
