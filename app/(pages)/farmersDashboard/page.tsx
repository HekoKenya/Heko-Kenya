"use client";

import { useState, useEffect } from "react";
import { PagesShell } from "@/app/(pages)/page";
import ChatBot from "@/components/ui/chatbot";
import CreditBoost from "@/components/modals/CreditBoost";
import FarmerFormModal from "@/components/modals/FarmerFormModal";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Stat card component
type StatCardProps = {
  title: string;
  value: string;
  sub?: string;
  children?: React.ReactNode;
};

function StatCard({ title, value, sub, children }: StatCardProps) {
  return (
    <div className="relative w-full h-[250px] box-border rounded-sm border bg-white p-4 shadow-sm flex flex-col">
      <div className="text-xs uppercase tracking-wide text-zinc-600">{title}</div>
      <div className="mt-2 text-3xl font-semibold text-foreground">{value}</div>
      {sub ? <div className="mt-1 text-xs text-zinc-500">{sub}</div> : null}
      <div className="mt-4 flex-1 overflow-auto text-sm leading-6 text-zinc-700 space-y-2">
        {children}
      </div>
    </div>
  );
}

// Mock API data type
type FarmChartData = {
  date: string;
  cropYield: number;
  livestockValue: number;
  landValue: number;
}[];

export default function FarmerDashboard() {
  const [showForm, setShowForm] = useState(false);
  const [chartData, setChartData] = useState<FarmChartData>([]);

  const items = [
    { label: "Overview", href: "/farmersDashboard", active: true },
    { label: "Finances", href: "#finances" },
    { label: "Farm Value", href: "#farm-value" },
    { label: "Farm Health", href: "#farm-health" },
    { label: "Credit Score", href: "#credit-score" },
    { label: "Loans", href: "#credit" },
    { label: "Heko Insights", href: "/farmersDashboard/heko-insights" },
  ];

  const loans = [
    { date: "2024-01-12", amount: "$3,500", lender: "AgriBank", status: "Repaid", rate: "12%", term: "12 mo" },
    { date: "2024-08-04", amount: "$5,000", lender: "GreenFund", status: "Active", rate: "10%", term: "10 mo" },
    { date: "2025-03-22", amount: "$2,000", lender: "RuralCredit", status: "Active", rate: "11%", term: "6 mo" },
  ];

  // Fetch chart data from API (or mock)
  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const mockData: FarmChartData = [
          { date: "Jan", cropYield: 500, livestockValue: 2000, landValue: 10000 },
          { date: "Feb", cropYield: 600, livestockValue: 2100, landValue: 10200 },
          { date: "Mar", cropYield: 550, livestockValue: 2050, landValue: 10150 },
          { date: "Apr", cropYield: 700, livestockValue: 2200, landValue: 10400 },
        ];
        setChartData(mockData);
      } catch (err) {
        console.error("Error fetching chart data:", err);
      }
    };
    fetchChartData();
  }, []);

  return (
    <PagesShell
      items={items}
      title="Farmer Dashboard"
      subtitle="View and access your farm credit information."
    >
      <section id="finances" className="grid min-w-0 grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Finances" value="$12,450" sub="Available balance">
          {(() => {
            const monthChange = 8.5;
            const positive = monthChange >= 0;
            const sign = positive ? "+" : "";
            const color = positive ? "text-green-600" : "text-red-600";
            return (
              <ul className="space-y-2">
                <li className="flex items-center justify-between">
                  <span>Income (this month)</span>
                  <span className="font-medium">$6,800</span>
                </li>
                <li className="flex items-center justify-between">
                  <span>Expenses (this month)</span>
                  <span className="font-medium">$4,200</span>
                </li>
                <li className="mt-2 border-t pt-2 text-xs text-zinc-600">
                  This month vs last month: <span className={`font-medium ${color}`}>{`${sign}${monthChange.toFixed(1)}%`}</span>
                </li>
              </ul>
            );
          })()}
        </StatCard>

        <StatCard title="Farm Value" value="$86,300" sub="Estimated">
          <div className="space-y-2">
            <div className="flex items-center justify-between"><span>Land</span><span className="font-medium">$45,000</span></div>
            <div className="flex items-center justify-between"><span>Equipment</span><span className="font-medium">$18,700</span></div>
            <div className="flex items-center justify-between"><span>Livestock</span><span className="font-medium">$9,600</span></div>
            <div className="flex items-center justify-between"><span>Crops (in-field)</span><span className="font-medium">$13,000</span></div>
          </div>
        </StatCard>

        <StatCard title="Farm Health" value="Good" sub="Last update: 2 days ago">
          <ul className="list-disc pl-5 space-y-2">
            <li>Soil moisture: Optimal</li>
            <li>Pest risk: Low</li>
            <li>Irrigation efficiency: 92%</li>
            <li>Crop vigor index (NDVI): 0.72</li>
          </ul>
        </StatCard>

        <StatCard title="Credit Score" value="Good" sub="Category">
          <div className="space-y-2">
            <p className="text-sm">Score category limited to:</p>
            <ul className="grid grid-cols-2 gap-2 text-xs">
              <li className="rounded-sm border px-2 py-1 text-center bg-primary/10 text-foreground">Great</li>
              <li className="rounded-sm border px-2 py-1 text-center bg-primary text-white">Good</li>
              <li className="rounded-sm border px-2 py-1 text-center">Standard</li>
              <li className="rounded-sm border px-2 py-1 text-center">Poor</li>
            </ul>
            <div className="pointer-events-none">
              <div className="pointer-events-auto absolute inset-x-0 bottom-1 flex justify-center">
                <CreditBoost />
              </div>
            </div>
          </div>
        </StatCard>
      </section>

      {/* Farm Data Chart */}
      <section id="farm-data" className="mt-12">
        <h2 className="text-lg font-semibold text-foreground mb-4">Farm Data Overview</h2>
        <div className="rounded-sm border bg-white p-4 shadow-sm h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="cropYield" stroke="#8884d8" name="Crop Yield" />
              <Line type="monotone" dataKey="livestockValue" stroke="#82ca9d" name="Livestock Value" />
              <Line type="monotone" dataKey="landValue" stroke="#ffc658" name="Land Value" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section id="credit" className="mt-12">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Previous Loans / Credit</h2>
          <button
            onClick={() => setShowForm((v) => !v)}
            className="rounded-sm bg-primary px-3 py-2 text-sm text-white transition-opacity hover:opacity-90"
          >
            {showForm ? "Hide Application Form" : "Start Application Form"}
          </button>
        </div>
        <div className="overflow-x-auto rounded-sm border bg-white shadow-sm">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-zinc-100 text-zinc-700">
              <tr>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Lender</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Interest</th>
                <th className="px-4 py-3">Term</th>
              </tr>
            </thead>
            <tbody>
              {loans.map((l, i) => (
                <tr key={i} className="border-t">
                  <td className="px-4 py-3">{l.date}</td>
                  <td className="px-4 py-3">{l.amount}</td>
                  <td className="px-4 py-3">{l.lender}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-sm px-2 py-1 text-xs ${l.status === "Active" ? "bg-primary text-white" : "bg-zinc-100 text-zinc-700"}`}>
                      {l.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">{l.rate}</td>
                  <td className="px-4 py-3">{l.term}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Modals */}
      <FarmerFormModal open={showForm} onClose={() => setShowForm(false)} />
      <ChatBot />
    </PagesShell>
  );
}
