"use client";
import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import type { Chart as ChartType } from "chart.js";
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

export default function LendersDashboard() {
  const items = [
    { label: "Overview", href: "#overview", active: true },
    { label: "Status", href: "#status" },
    { label: "Credit Types", href: "#credit-types" },
    { label: "Payments", href: "#payments" },
    { label: "Quarters", href: "#quarters" },
    { label: "Charts", href: "#charts" },
  ];

  const totals = { year: 2025, total: 185, defaulted: 9, active: 74, completed: 102 };
  const creditMix = { great: 28, good: 92, standard: 54, risky: 11 };
  const payments = {
    onTimeCount: 143,
    missedCount: 17,
    onTimeAmount: 425_600,
    missedAmount: 36_900,
  };
  const quarters = [
    { q: "Q1", issued: 42, defaultRate: 3.1, completionRate: 58 },
    { q: "Q2", issued: 48, defaultRate: 4.2, completionRate: 61 },
    { q: "Q3", issued: 50, defaultRate: 4.8, completionRate: 64 },
    { q: "Q4", issued: 45, defaultRate: 2.9, completionRate: 67 },
  ];
  const pending = [
    { id: "REQ-1023", applicant: "K. Njoroge", amount: 12000, date: "2025-08-14", product: "Seasonal Input", score: "Good" },
    { id: "REQ-1024", applicant: "M. Achieng", amount: 5400, date: "2025-08-18", product: "Equipment Lease", score: "Standard" },
    { id: "REQ-1025", applicant: "R. Kiptoo", amount: 8000, date: "2025-08-21", product: "Working Capital", score: "Great" },
    { id: "REQ-1026", applicant: "S. Wanjiru", amount: 15000, date: "2025-08-23", product: "Expansion", score: "Risky" },
  ];

  const perfRef = useRef<HTMLCanvasElement | null>(null);
  const creditRef = useRef<HTMLCanvasElement | null>(null);
  const ratesRef = useRef<HTMLCanvasElement | null>(null);
  const issuedRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const monthLabels = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const creditByMonth = {
      great: [8, 7, 6, 9, 10, 11, 9, 10, 8, 7, 6, 8],
      good: [12, 13, 14, 12, 11, 12, 13, 12, 14, 13, 12, 11],
      standard: [9, 8, 10, 9, 10, 9, 8, 9, 10, 11, 9, 10],
      risky: [3, 2, 4, 3, 2, 3, 4, 3, 2, 3, 2, 3],
    };

    const ratesByMonth = {
      r13: [4, 3, 5, 4, 3, 5, 4, 3, 4, 5, 3, 4],
      r8: [6, 7, 5, 6, 7, 6, 7, 6, 5, 6, 7, 6],
      r10: [5, 6, 6, 5, 6, 5, 6, 5, 6, 5, 6, 5],
      r18: [2, 3, 2, 3, 2, 2, 3, 2, 2, 3, 2, 2],
    };

    const issuedMonthly = [
      28, 31, 29, 32, 35, 36, 38, 34, 33, 31, 30, 29,
    ];

    const instances: ChartType[] = [];

    if (perfRef.current) {
      const c: ChartType = new Chart(perfRef.current, {
        type: "doughnut",
        data: {
          labels: ["Defaulted", "Active", "Completed"],
          datasets: [
            {
              data: [totals.defaulted, totals.active, totals.completed],
              backgroundColor: ["#ef4444", "#0f172a", "#16a34a"],
              borderWidth: 0,
            },
          ],
        },
        options: {
          responsive: true,
          layout: { padding: { top: 8, bottom: 8 } },
          plugins: {
            legend: {
              position: "bottom",
              align: "center",
              labels: {
                padding: 16,
                usePointStyle: true,
                pointStyle: "circle",
                boxWidth: 12,
                boxHeight: 12,
              },
            },
          },
        },
      });
      instances.push(c);
    }

    if (creditRef.current) {
      const c: ChartType = new Chart(creditRef.current, {
        type: "bar",
        data: {
          labels: monthLabels,
          datasets: [
            { label: "Great", data: creditByMonth.great, backgroundColor: "#22c55e" },
            { label: "Good", data: creditByMonth.good, backgroundColor: "#3b82f6" },
            { label: "Standard", data: creditByMonth.standard, backgroundColor: "#f59e0b" },
            { label: "Risky", data: creditByMonth.risky, backgroundColor: "#ef4444" },
          ],
        },
        options: {
          responsive: true,
          plugins: { legend: { position: "bottom" } },
          scales: { x: { stacked: true }, y: { stacked: true, beginAtZero: true } },
        },
      });
      instances.push(c);
    }

    if (ratesRef.current) {
      const c: ChartType = new Chart(ratesRef.current, {
        type: "bar",
        data: {
          labels: monthLabels,
          datasets: [
            { label: "13%", data: ratesByMonth.r13, backgroundColor: "#0ea5e9" },
            { label: "8%", data: ratesByMonth.r8, backgroundColor: "#10b981" },
            { label: "10%", data: ratesByMonth.r10, backgroundColor: "#f59e0b" },
            { label: "18%", data: ratesByMonth.r18, backgroundColor: "#ef4444" },
          ],
        },
        options: {
          responsive: true,
          plugins: { legend: { position: "bottom" } },
          scales: { y: { beginAtZero: true } },
        },
      });
      instances.push(c);
    }

    if (issuedRef.current) {
      const c: ChartType = new Chart(issuedRef.current, {
        type: "line",
        data: {
          labels: monthLabels,
          datasets: [
            {
              label: "Loans Issued",
              data: issuedMonthly,
              borderColor: "#6366f1",
              backgroundColor: "rgba(99,102,241,0.2)",
              tension: 0.3,
              fill: true,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: { legend: { position: "bottom" } },
          scales: { y: { beginAtZero: true } },
        },
      });
      instances.push(c);
    }

    return () => {
      instances.forEach((i) => i.destroy());
    };
  }, [totals.active, totals.completed, totals.defaulted]);

  return (
    <PagesShell
      items={items}
      title="Lenders Dashboard"
      subtitle="Monitor loans, client credit quality, payments, and quarterly performance."
    >

        <section id="status" className="grid min-w-0 grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard title={`Total Loans (${totals.year})`} value={String(totals.total)} sub="Issued this year">
            <ul className="space-y-2 text-sm">
              <li className="rounded-sm border p-2 flex items-center justify-between">
                <span className="text-xs text-zinc-600">Defaulted</span>
                <span className="font-semibold text-red-600">{totals.defaulted}</span>
              </li>
              <li className="rounded-sm border p-2 flex items-center justify-between">
                <span className="text-xs text-zinc-600">Active</span>
                <span className="font-semibold text-foreground">{totals.active}</span>
              </li>
              <li className="rounded-sm border p-2 flex items-center justify-between">
                <span className="text-xs text-zinc-600">Completed</span>
                <span className="font-semibold text-green-600">{totals.completed}</span>
              </li>
            </ul>
          </StatCard>

          <StatCard title="Loan Client Credit Types" value={`${creditMix.good + creditMix.great}/${totals.total}`} sub="Good or better">
            <ul className="space-y-2 text-xs">
              <li className="rounded-sm border px-3 py-2 flex items-center justify-between">
                <span>Great</span>
                <span className="font-medium">{creditMix.great}</span>
              </li>
              <li className="rounded-sm border px-3 py-2 flex items-center justify-between">
                <span>Good</span>
                <span className="font-medium">{creditMix.good}</span>
              </li>
              <li className="rounded-sm border px-3 py-2 flex items-center justify-between">
                <span>Standard</span>
                <span className="font-medium">{creditMix.standard}</span>
              </li>
              <li className="rounded-sm border px-3 py-2 flex items-center justify-between">
                <span>Risky</span>
                <span className="font-medium text-red-600">{creditMix.risky}</span>
              </li>
            </ul>
          </StatCard>

          <StatCard title="Loan Payments" value={`${payments.onTimeCount} on-time`} sub={`${payments.missedCount} missed`}>
            <ul className="space-y-2">
              <li className="flex items-center justify-between">
                <span>On-time amount</span>
                <span className="font-medium text-green-600">${payments.onTimeAmount.toLocaleString()}</span>
              </li>
              <li className="flex items-center justify-between">
                <span>Missed amount</span>
                <span className="font-medium text-red-600">${payments.missedAmount.toLocaleString()}</span>
              </li>
            </ul>
          </StatCard>

          <StatCard title="Quarterly Performance" value="This year" sub="Loans issued / default% / completion%">
            <div className="space-y-2 text-xs">
              {quarters.map((q) => (
                <div key={q.q} className="rounded-sm border p-2">
                  <div className="text-zinc-600">{q.q}</div>
                  <div className="mt-1 flex items-center justify-between">
                    <span>Issued</span>
                    <span className="font-medium">{q.issued}</span>
                  </div>
                  <div className="mt-1 flex items-center justify-between">
                    <span>Default</span>
                    <span className="font-medium text-red-600">{q.defaultRate}%</span>
                  </div>
                  <div className="mt-1 flex items-center justify-between">
                    <span>Complete</span>
                    <span className="font-medium text-green-600">{q.completionRate}%</span>
                  </div>
                </div>
              ))}
            </div>
          </StatCard>
        </section>

        <section id="pending" className="mt-12">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">Pending Loan Requests</h2>
          </div>
          <div className="overflow-x-auto rounded-sm border bg-white shadow-sm">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-zinc-100 text-zinc-700">
                <tr>
                  <th className="px-4 py-3">Request ID</th>
                  <th className="px-4 py-3">Applicant</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Product</th>
                  <th className="px-4 py-3">Credit Type</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {pending.map((r) => (
                  <tr key={r.id} className="border-t">
                    <td className="px-4 py-3 font-mono text-xs">{r.id}</td>
                    <td className="px-4 py-3">{r.applicant}</td>
                    <td className="px-4 py-3">{`$${r.amount.toLocaleString()}`}</td>
                    <td className="px-4 py-3">{r.date}</td>
                    <td className="px-4 py-3">{r.product}</td>
                    <td className="px-4 py-3">{r.score}</td>
                    <td className="px-4 py-3">
                      <span className="rounded-sm bg-yellow-100 px-2 py-1 text-xs text-yellow-700">Pending</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section id="charts" className="mt-12">
          <div className="mb-3">
            <h2 className="text-lg font-semibold text-foreground">Charts</h2>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="rounded-sm border bg-white p-4 shadow-sm">
              <div className="mb-2 text-sm text-zinc-600">Loan Performance</div>
              <div className="h-64 flex items-center justify-center">
                <canvas ref={perfRef} className="w-56 h-56" />
              </div>
            </div>
            <div className="rounded-sm border bg-white p-4 shadow-sm">
              <div className="mb-2 text-sm text-zinc-600">Monthly Loans by Credit Type</div>
              <div className="h-64">
                <canvas ref={creditRef} className="w-full h-full" />
              </div>
            </div>
            <div className="rounded-sm border bg-white p-4 shadow-sm">
              <div className="mb-2 text-sm text-zinc-600">Loan Rates per Month</div>
              <div className="h-64">
                <canvas ref={ratesRef} className="w-full h-full" />
              </div>
            </div>
            <div className="rounded-sm border bg-white p-4 shadow-sm">
              <div className="mb-2 text-sm text-zinc-600">Loans Issued Monthly</div>
              <div className="h-64">
                <canvas ref={issuedRef} className="w-full h-full" />
              </div>
            </div>
          </div>
        </section>

    </PagesShell>
  );
}
//   const quarters = [
//     { q: "Q1", issued: 42, defaultRate: 3.1, completionRate: 58 },
//     { q: "Q2", issued: 48, defaultRate: 4.2, completionRate: 61 },
//     { q: "Q3", issued: 50, defaultRate: 4.8, completionRate: 64 },
//     { q: "Q4", issued: 45, defaultRate: 2.9, completionRate: 67 },
//   ];

//   return (
//     <div className="flex min-h-screen bg-zinc-50">
//       <Sidebar
//         items={items}
//         header={<div className="text-lg font-semibold">Lender</div>}
//         className="bg-white"
//       />

//       <main className="flex-1 p-6">
//         <div id="overview" className="mb-6">
//           <h1 className="text-2xl font-semibold text-foreground">Lenders Dashboard</h1>
//           <p className="text-sm text-zinc-600">Monitor loans, client credit quality, payments, and quarterly performance.</p>
//         </div>

//         <section id="status" className="grid min-w-0 grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
//           <StatCard title={`Total Loans (${totals.year})`} value={String(totals.total)} sub="Issued this year">
//             <ul className="grid grid-cols-3 gap-2 text-sm">
//               <li className="rounded-sm border p-2 text-center">
//                 <div className="text-xs text-zinc-600">Defaulted</div>
//                 <div className="font-semibold text-red-600">{totals.defaulted}</div>
//               </li>
//               <li className="rounded-sm border p-2 text-center">
//                 <div className="text-xs text-zinc-600">Active</div>
//                 <div className="font-semibold text-foreground">{totals.active}</div>
//               </li>
//               <li className="rounded-sm border p-2 text-center">
//                 <div className="text-xs text-zinc-600">Completed</div>
//                 <div className="font-semibold text-green-600">{totals.completed}</div>
//               </li>
//             </ul>
//           </StatCard>

//           <StatCard title="Loan Client Credit Types" value={`${creditMix.good + creditMix.great}/${totals.total}`} sub="Good or better">
//             <ul className="grid grid-cols-2 gap-2 text-xs">
//               <li className="rounded-sm border px-3 py-2 flex items-center justify-between">
//                 <span>Great</span>
//                 <span className="font-medium">{creditMix.great}</span>
//               </li>
//               <li className="rounded-sm border px-3 py-2 flex items-center justify-between">
//                 <span>Good</span>
//                 <span className="font-medium">{creditMix.good}</span>
//               </li>
//               <li className="rounded-sm border px-3 py-2 flex items-center justify-between">
//                 <span>Standard</span>
//                 <span className="font-medium">{creditMix.standard}</span>
//               </li>
//               <li className="rounded-sm border px-3 py-2 flex items-center justify-between">
//                 <span>Risky</span>
//                 <span className="font-medium text-red-600">{creditMix.risky}</span>
//               </li>
//             </ul>
//           </StatCard>

//           <StatCard title="Loan Payments" value={`${payments.onTimeCount} on-time`} sub={`${payments.missedCount} missed`}>
//             <ul className="space-y-2">
//               <li className="flex items-center justify-between">
//                 <span>On-time amount</span>
//                 <span className="font-medium text-green-600">${payments.onTimeAmount.toLocaleString()}</span>
//               </li>
//               <li className="flex items-center justify-between">
//                 <span>Missed amount</span>
//                 <span className="font-medium text-red-600">${payments.missedAmount.toLocaleString()}</span>
//               </li>
//             </ul>
//           </StatCard>

//           <StatCard title="Quarterly Performance" value="This year" sub="Loans issued / default% / completion%">
//             <div className="grid grid-cols-2 gap-2 text-xs">
//               {quarters.map((q) => (
//                 <div key={q.q} className="rounded-sm border p-2">
//                   <div className="text-zinc-600">{q.q}</div>
//                   <div className="mt-1 flex items-center justify-between">
//                     <span>Issued</span>
//                     <span className="font-medium">{q.issued}</span>
//                   </div>
//                   <div className="mt-1 flex items-center justify-between">
//                     <span>Default</span>
//                     <span className="font-medium text-red-600">{q.defaultRate}%</span>
//                   </div>
//                   <div className="mt-1 flex items-center justify-between">
//                     <span>Complete</span>
//                     <span className="font-medium text-green-600">{q.completionRate}%</span>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </StatCard>
//         </section>
//       </main>
//     </div>
//   );
// }