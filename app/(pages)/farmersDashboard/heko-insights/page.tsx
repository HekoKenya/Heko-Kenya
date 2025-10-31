"use client";

import { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Paperclip, Send, Trash2, Edit, Share2, Download } from "lucide-react";
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
  attachments: string[];
  creditCategory: string;
  seekingPreference: string;
  selectedLender?: string;
  selectedSupplier?: string;
};

type HistoryMessage = {
  sender: "user" | "ai";
  text: string;
};

type HistorySession = {
  id: string;
  title: string;
  timestamp: string;
  messages: HistoryMessage[];
};

const steps = [
  { key: "chart", label: "New Chart" },
  { key: "insights", label: "Credit Insights" },
  { key: "history", label: "History" },
] as const;

type StepKey = typeof steps[number]["key"];

export default function HekoInsightsForm() {
  const router = useRouter();
  const [active, setActive] = useState<StepKey>("chart");
  const [data, setData] = useState<FarmerFormData | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [aiResponse, setAiResponse] = useState("");
  const [insightIndex, setInsightIndex] = useState(0);

  const [historyList, setHistoryList] = useState<HistorySession[]>([]);
  const [selectedSession, setSelectedSession] = useState<HistorySession | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);

  // Load saved data from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("farmerFormData");
    if (saved) setData(JSON.parse(saved));
  }, []);

  // Mock insights feed for rotating display
  const insightsFeed = [
    { title: "Rainfall Index Strong in Region X", detail: "IoT rainfall sensors indicate above-average precipitation levels, expected to boost maize yields by 18% this season." },
    { title: "Government Announces Smart Credit Program", detail: "A new low-interest facility has been launched for smallholder farmers with verified production data under Heko-linked systems." },
    { title: "Soil Moisture Deficit Warning", detail: "IoT soil sensors show a 25% drop in moisture in Western zones. Risk of credit default in dryland regions may rise by 7%." },
    { title: "Market Price Forecast Positive", detail: "Commodity trends show maize prices increasing by 12%, lowering credit risk and improving repayment capacity for loaned farmers." },
    { title: "Regional Climate and Yield Trends Stable", detail: "Satellite and IoT datasets confirm optimal growing conditions, suggesting stable credit risk for the next quarter." },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setInsightIndex((prev) => (prev + 1) % insightsFeed.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const stepsDisplayed = useMemo(() => steps, []);
  const activeIndex = useMemo(() => stepsDisplayed.findIndex((s) => s.key === active), [active, stepsDisplayed]);

  const next = () => { if (activeIndex < stepsDisplayed.length - 1) setActive(stepsDisplayed[activeIndex + 1].key); };
  const prev = () => { if (activeIndex > 0) setActive(stepsDisplayed[activeIndex - 1].key); };

  // ------------------ MOCK AI FUNCTION ------------------
  const mockAIResponse = (input: string, data: FarmerFormData | null): Promise<string> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(`You typed: "${input}"\nAI Mock Analysis based on farmer data: ${data ? `Name: ${data.name}, County: ${data.county}, Crop: ${data.cropYield}` : "No data loaded"}`);
      }, 1000);
    });
  };

  const handlePromptSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!data) return;
    setSubmitting(true);
    setAiResponse("Processing your query...");

    try {
      const result = await mockAIResponse(newMessage || "hello", data);
      setAiResponse(result);
      setNewMessage(""); // Clear input after send
    } catch (err) {
      console.error(err);
      setAiResponse("Failed to fetch insights. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedSession) return;
    setSending(true);

    const updatedSession: HistorySession = {
      ...selectedSession,
      messages: [...selectedSession.messages, { sender: "user", text: newMessage }],
    };

    const updatedList = historyList.map((session) =>
      session.id === updatedSession.id ? updatedSession : session
    );

    setHistoryList(updatedList);
    setSelectedSession(updatedSession);
    setNewMessage("");

    setTimeout(() => {
      const mockReply: HistoryMessage = { sender: "ai", text: `Got it! You said: "${newMessage}". AI analyzed your farm data and generated insights.` };
      const updatedWithAI = updatedList.map((session) =>
        session.id === updatedSession.id ? { ...session, messages: [...session.messages, mockReply] } : session
      );
      setHistoryList(updatedWithAI);
      setSelectedSession({ ...updatedSession, messages: [...updatedSession.messages, mockReply] });
      setSending(false);
    }, 1000);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (active !== "history") { next(); return; }

    if (!data) return;

    try {
      setSubmitting(true);
      alert("Heko Insights submitted successfully!");
    } catch (err) {
      console.error(err);
      alert("Error submitting insights.");
    } finally { setSubmitting(false); }
  };

  return (
    <form onSubmit={onSubmit} className="flex h-[70vh] gap-4">
      <aside className="w-[260px] shrink-0 rounded-md border border-primary/10 bg-white p-4 shadow-sm h-full overflow-auto">
        <div className="text-xl font-bold text-primary tracking-wide">HEKO</div>
        <ol className="mt-4 space-y-2 text-sm">
          {stepsDisplayed.map((s) => {
            const isActive = s.key === active;
            const isDone = stepsDisplayed.findIndex((x) => x.key === s.key) < activeIndex;
            return (
              <li key={s.key}>
                <button
                  type="button"
                  onClick={() => setActive(s.key)}
                  className={`w-full rounded-md px-3 py-2 text-left transition-all duration-200 ${isActive ? "bg-primary text-white shadow-sm" : isDone ? "bg-primary/10 text-primary" : "hover:bg-primary/5 text-gray-700"}`}
                >
                  {s.label}
                </button>
              </li>
            );
          })}
        </ol>
      </aside>

      <section className="flex-1 rounded-md border border-primary/10 bg-white p-4 shadow-sm min-w-0 h-full overflow-hidden">
        <div className="flex h-full flex-col">
          <div className="flex-1 overflow-auto">
            {/* ------------------ NEW CHART / CHAT ------------------ */}
            {active === "chart" && (
              <div className="flex flex-col items-center justify-center h-full px-6">
                <form onSubmit={handlePromptSubmit} className="w-full max-w-3xl">
                  <div className="relative flex items-center bg-primary/5 rounded-full border border-primary/20 shadow-sm px-5 py-4 gap-3">
                    <label className="cursor-pointer text-primary hover:text-primary/80 transition" aria-label="Upload files">
                      <Paperclip size={20} />
                      <input
                        type="file"
                        onChange={(e) => console.log("Attach files if needed")}
                        className="hidden"
                        multiple
                      />
                    </label>
                    <input
                      type="text"
                      placeholder="Type your query..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      className="flex-1 bg-transparent outline-none text-gray-700 placeholder:text-gray-400 text-base"
                      aria-label="Insight prompt"
                    />
                    <button
                      type="submit"
                      disabled={submitting}
                      className="ml-2 p-2 bg-primary text-white rounded-full hover:bg-primary/90 disabled:opacity-50"
                      title="Send"
                      aria-label="Send"
                    >
                      <Send size={18} />
                    </button>
                  </div>
                  {aiResponse && (
                    <div className="mt-10 w-full max-w-3xl bg-primary/5 border border-primary/10 rounded-lg p-5 text-left text-sm text-gray-800 shadow-sm">
                      <strong className="block text-primary mb-2">AI Analysis:</strong>
                      <pre className="whitespace-pre-wrap">{aiResponse}</pre>
                    </div>
                  )}
                </form>
              </div>
            )}

            {/* ------------------ CREDIT INSIGHTS ------------------ */}
            {active === "insights" && (
              <div className="space-y-5">
                <h2 className="text-lg font-semibold text-primary">Credit Insights</h2>
                <div className="bg-primary/5 border border-primary/10 rounded-lg p-4 shadow-sm">
                  <h3 className="text-primary font-semibold mb-2">Live Trends & Insights</h3>
                  <div className="bg-white rounded-md border border-primary/10 p-4 shadow-sm transition-all duration-500">
                    <h4 className="text-md font-bold text-gray-800">{insightsFeed[insightIndex].title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{insightsFeed[insightIndex].detail}</p>
                  </div>
                </div>
              </div>
            )}

            {/* ------------------ HISTORY ------------------ */}
            {active === "history" && (
              <div className="flex h-full gap-4">
                <div className="w-[230px] border-r border-primary/10 pr-3 overflow-auto">
                  <h3 className="text-primary font-semibold mb-3">History</h3>
                  <ul className="space-y-2 text-sm">
                    {historyList.map((item) => (
                      <li key={item.id}>
                        <button
                          type="button"
                          onClick={() => setSelectedSession(item)}
                          className={`w-full text-left rounded-md px-3 py-2 transition ${selectedSession?.id === item.id ? "bg-primary text-white" : "hover:bg-primary/5 text-gray-700"}`}
                        >
                          <div className="font-medium">{item.title}</div>
                          <div className="text-xs text-gray-500">{item.timestamp}</div>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex-1 flex flex-col">
                  {selectedSession ? (
                    <>
                      <div className="flex justify-between items-center border-b border-primary/10 pb-2 mb-3">
                        <div>
                          <h4 className="text-md font-semibold text-primary">{selectedSession.title}</h4>
                          <p className="text-xs text-gray-500">{selectedSession.timestamp}</p>
                        </div>
                        <div className="flex gap-2 text-gray-500">
                          <button type="button" aria-label="Edit session" className="hover:text-primary"><Edit size={16} /></button>
                          <button type="button" aria-label="Delete session" className="hover:text-primary"><Trash2 size={16} /></button>
                          <button type="button" aria-label="Download session" className="hover:text-primary"><Download size={16} /></button>
                          <button type="button" aria-label="Share session" className="hover:text-primary"><Share2 size={16} /></button>
                        </div>
                      </div>

                      <div className="flex-1 overflow-auto space-y-3 p-1">
                        {selectedSession.messages.map((msg: HistoryMessage, idx: number) => (
                          <div key={idx} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                            <div className={`rounded-lg px-4 py-2 max-w-[75%] text-sm ${msg.sender === "user" ? "bg-primary text-white" : "bg-primary/5 text-gray-700 border border-primary/10"}`}>{msg.text}</div>
                          </div>
                        ))}
                      </div>

                      <div className="mt-3 border-t border-primary/10 pt-3 flex items-center gap-2">
                        <textarea
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          placeholder="Type your message..."
                          className="flex-1 resize-none rounded-lg border border-primary/20 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                          rows={1}
                          aria-label="New message"
                        />
                        <button type="button" onClick={handleSendMessage} disabled={sending} className="bg-primary text-white p-2 rounded-full hover:bg-primary/90 disabled:opacity-50" aria-label="Send message"><Send size={16} /></button>
                      </div>
                    </>
                  ) : (
                    <div className="text-sm text-gray-600 flex items-center justify-center h-full">Select a session to view history.</div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-primary/10 pt-3">
            <button type="button" onClick={prev} disabled={activeIndex === 0} className="rounded-md border border-primary/20 px-3 py-2 text-sm text-primary hover:bg-primary/5 disabled:opacity-50 transition">Back</button>
            <button type="submit" disabled={submitting} className="rounded-md bg-primary px-3 py-2 text-sm text-white hover:bg-primary/90 disabled:opacity-70">{active === "history" ? (submitting ? "Submitting..." : "Submit") : "Next"}</button>
          </div>
        </div>
      </section>
    </form>
  );
}
