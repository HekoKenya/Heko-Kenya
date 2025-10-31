import { PagesShell } from "@/app/(pages)/page";

type StatCardProps = {
  title: string;
  value: string;
  sub?: string;
  children?: React.ReactNode;
};

function StatCard({ title, value, sub, children }: StatCardProps) {
  return (
    <div className="w-full h-[250px] box-border rounded-sm border bg-white p-4 shadow-sm flex flex-col">
      <div className="text-xs uppercase tracking-wide text-zinc-600">{title}</div>
      <div className="mt-2 text-3xl font-semibold text-foreground">{value}</div>
      {sub ? <div className="mt-1 text-xs text-zinc-500">{sub}</div> : null}
      <div className="mt-4 flex-1 overflow-auto text-sm leading-6 text-zinc-700 space-y-2">
        {children}
      </div>
    </div>
  );
}

export default function HekoDashboard() {
  const items = [
    { label: "Overview", href: "#overview", active: true },
    { label: "Users", href: "#users" },
    { label: "Model Accuracy", href: "#accuracy" },
    { label: "Loans", href: "#loans" },
    { label: "Credit Mix", href: "#credit-mix" },
  ];

  // Example data (static)
  const users = { farmers: 1240, lenders: 78 };
  const model = { accuracy: 92.3, precision: 90.1, recall: 88.7, f1: 89.4, errorRate: 7.7 };
  const loans = { total: 1560, defaulted: 84, active: 612, closed: 864 };
  const creditMix = { poor: 102, standard: 486, good: 504, great: 148 };

  return (
    <PagesShell
      items={items}
      title="Heko Dashboard"
      subtitle="Platform overview: users, model quality, loan utilization, and credit mix."
    >
      <section id="overview" className="grid min-w-0 grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Users" value={`${users.farmers + users.lenders}`} sub="Total registered">
          <ul className="space-y-2">
            <li className="flex items-center justify-between">
              <span>Farmers</span>
              <span className="font-medium">{users.farmers}</span>
            </li>
            <li className="flex items-center justify-between">
              <span>Lenders</span>
              <span className="font-medium">{users.lenders}</span>
            </li>
          </ul>
        </StatCard>

        <StatCard title="Model Accuracy" value={`${model.accuracy}%`} sub="Current">
          <ul className="space-y-1 text-sm">
            <li className="flex items-center justify-between"><span>Precision</span><span className="font-medium">{model.precision}%</span></li>
            <li className="flex items-center justify-between"><span>Recall</span><span className="font-medium">{model.recall}%</span></li>
            <li className="flex items-center justify-between"><span>F1 Score</span><span className="font-medium">{model.f1}%</span></li>
            <li className="flex items-center justify-between"><span>Error Rate</span><span className="font-medium text-red-600">{model.errorRate}%</span></li>
          </ul>
        </StatCard>

        <StatCard title="Loans via Model" value={`${loans.total}`} sub="Issued">
          <ul className="space-y-2">
            <li className="flex items-center justify-between"><span>Defaulted</span><span className="font-semibold text-red-600">{loans.defaulted}</span></li>
            <li className="flex items-center justify-between"><span>Active</span><span className="font-semibold text-foreground">{loans.active}</span></li>
            <li className="flex items-center justify-between"><span>Closed</span><span className="font-semibold text-green-600">{loans.closed}</span></li>
          </ul>
        </StatCard>

        <StatCard title="Credit Score Mix" value={`${creditMix.good + creditMix.great}`} sub="Good or better">
          <ul className="space-y-2 text-xs">
            <li className="rounded-sm border px-3 py-2 flex items-center justify-between"><span>Poor</span><span className="font-medium">{creditMix.poor}</span></li>
            <li className="rounded-sm border px-3 py-2 flex items-center justify-between"><span>Standard</span><span className="font-medium">{creditMix.standard}</span></li>
            <li className="rounded-sm border px-3 py-2 flex items-center justify-between"><span>Good</span><span className="font-medium">{creditMix.good}</span></li>
            <li className="rounded-sm border px-3 py-2 flex items-center justify-between"><span>Great</span><span className="font-medium">{creditMix.great}</span></li>
          </ul>
        </StatCard>
      </section>
    </PagesShell>
  );
}
