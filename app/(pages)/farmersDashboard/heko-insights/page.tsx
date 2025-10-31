"use client";
import { useMemo, useState, useEffect } from "react";
import {
  Paperclip,
  Send,
  Mic,
  Sparkles,
  Trash2,
  Edit,
  Share2,
  Download,
} from "lucide-react";

type HekoInsightsData = {
  fullName: string;
  email: string;
  phone: string;
  organization: string;
  role: string;
  industry: string;
  challenges: string;
  techUsage: string;
  budgetRange: string;
  attachments: string[];
  preferredContact: string;
  additionalNotes: string;
};

const initialData: HekoInsightsData = {
  fullName: "",
  email: "",
  phone: "",
  organization: "",
  role: "",
  industry: "",
  challenges: "",
  techUsage: "",
  budgetRange: "",
  attachments: [],
  preferredContact: "",
  additionalNotes: "",
};

const steps = [
  { key: "chart", label: "New Chart" },
  { key: "insights", label: "Credit Insights" },
  { key: "history", label: "History" },
] as const;

type StepKey = typeof steps[number]["key"];

export default function HekoInsightsForm() {
  const [active, setActive] = useState<StepKey>("chart");
  const [data, setData] = useState<HekoInsightsData>(initialData);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [aiResponse, setAiResponse] = useState("");
  const [insightIndex, setInsightIndex] = useState(0);

  // Simulated conversation history
  const [historyList, setHistoryList] = useState([
    {
      id: 1,
      title: "Credit Health Summary",
      timestamp: "Oct 30, 2025 – 3:15 PM",
      type: "Chat",
      messages: [
        {
          sender: "user",
          text: "How is my farm's credit score looking this season?",
        },
        {
          sender: "ai",
          text: "Your farm’s credit score is stable at 78/100, projected to rise by 5%.",
        },
      ],
    },
    {
      id: 2,
      title: "Loan Repayment Analysis",
      timestamp: "Oct 29, 2025 – 9:22 AM",
      type: "Report",
      messages: [
        { sender: "user", text: "Analyze my repayment performance." },
        {
          sender: "ai",
          text: "Your repayment consistency is 94%, with early repayment bonuses applied twice.",
        },
      ],
    },
    {
      id: 3,
      title: "Yield and Risk Forecast",
      timestamp: "Oct 27, 2025 – 7:01 PM",
      type: "Insight",
      messages: [
        { sender: "user", text: "Forecast next quarter’s yield." },
        {
          sender: "ai",
          text: "Expected yield increase of 12% based on IoT rainfall and soil data.",
        },
      ],
    },
  ]);
  const [selectedSession, setSelectedSession] = useState(historyList[0] || null);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);

  const insightsFeed = [
    {
      title: "Rainfall Index Strong in Region X",
      detail:
        "IoT rainfall sensors indicate above-average precipitation levels, expected to boost maize yields by 18% this season.",
    },
    {
      title: "Government Announces Smart Credit Program",
      detail:
        "A new low-interest facility has been launched for smallholder farmers with verified production data under Heko-linked systems.",
    },
    {
      title: "Soil Moisture Deficit Warning",
      detail:
        "IoT soil sensors show a 25% drop in moisture in Western zones. Risk of credit default in dryland regions may rise by 7%.",
    },
    {
      title: "Market Price Forecast Positive",
      detail:
        "Commodity trends show maize prices increasing by 12%, lowering credit risk and improving repayment capacity for loaned farmers.",
    },
    {
      title: "Regional Climate and Yield Trends Stable",
      detail:
        "Satellite and IoT datasets confirm optimal growing conditions, suggesting stable credit risk for the next quarter.",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setInsightIndex((prev) => (prev + 1) % insightsFeed.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const stepsDisplayed = useMemo(() => steps, []);
  const activeIndex = useMemo(
    () => stepsDisplayed.findIndex((s) => s.key === active),
    [active]
  );

  function next() {
    const i = stepsDisplayed.findIndex((s) => s.key === active);
    if (i < stepsDisplayed.length - 1) setActive(stepsDisplayed[i + 1].key);
  }

  function prev() {
    const i = stepsDisplayed.findIndex((s) => s.key === active);
    if (i > 0) setActive(stepsDisplayed[i - 1].key);
  }

  function update<K extends keyof HekoInsightsData>(
    key: K,
    value: HekoInsightsData[K]
  ) {
    setData((d) => ({ ...d, [key]: value }));
  }

  async function handlePromptSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!prompt && !file) {
      alert("Please enter a prompt or upload a file first.");
      return;
    }

    setSubmitting(true);
    setAiResponse("");
    await new Promise((r) => setTimeout(r, 1500));
    setAiResponse(
      "This is a generated insight based on your query. In the final version, Heko AI will analyze live credit and risk data for your specific request."
    );
    setSubmitting(false);
  }

  async function handleSendMessage() {
    if (!newMessage.trim() || !selectedSession) return;
    setSending(true);

    // Add user message
    const updatedSessions = historyList.map((session) =>
      session.id === selectedSession.id
        ? {
            ...session,
            messages: [
              ...session.messages,
              { sender: "user", text: newMessage },
            ],
          }
        : session
    );
    setHistoryList(updatedSessions);
    setSelectedSession({
      ...selectedSession,
      messages: [
        ...selectedSession.messages,
        { sender: "user", text: newMessage },
      ],
    });
    setNewMessage("");

    // Mock AI reply
    setTimeout(() => {
      const mockReply = {
        sender: "ai",
        text: `Got it! You said: "${newMessage}". I'll process your request.`,
      };
      const updatedWithAI = updatedSessions.map((session) =>
        session.id === selectedSession.id
          ? {
              ...session,
              messages: [...session.messages, mockReply],
            }
          : session
      );
      setHistoryList(updatedWithAI);
      setSelectedSession({
        ...selectedSession,
        messages: [
          ...selectedSession.messages,
          mockReply,
        ],
      });
      setSending(false);
    }, 1000);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (active !== "history") {
      next();
      return;
    }

    try {
      setSubmitting(true);
      await new Promise((r) => setTimeout(r, 700));
      setSubmitted(true);
      alert("Heko Insights data saved successfully!");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex h-[70vh] gap-4">
      {/* Sidebar */}
      <aside className="w-[260px] shrink-0 rounded-md border border-primary/10 bg-white p-4 shadow-sm h-full overflow-auto">
        <div className="text-xl font-bold text-primary tracking-wide">HEKO</div>
        <ol className="mt-4 space-y-2 text-sm">
          {stepsDisplayed.map((s) => {
            const isActive = s.key === active;
            const isDone =
              stepsDisplayed.findIndex((x) => x.key === s.key) < activeIndex;
            return (
              <li key={s.key}>
                <button
                  type="button"
                  onClick={() => setActive(s.key)}
                  className={`w-full rounded-md px-3 py-2 text-left transition-all duration-200 ${
                    isActive
                      ? "bg-primary text-white shadow-sm"
                      : isDone
                      ? "bg-primary/10 text-primary"
                      : "hover:bg-primary/5 text-gray-700"
                  }`}
                >
                  {s.label}
                </button>
              </li>
            );
          })}
        </ol>
      </aside>

      {/* Main Section */}
      <section className="flex-1 rounded-md border border-primary/10 bg-white p-4 shadow-sm min-w-0 h-full overflow-hidden">
        <div className="flex h-full flex-col">
          <div className="flex-1 overflow-auto">
            {/* Step 1: New Chart */}
            {active === "chart" && (
              <div className="flex flex-col items-center justify-center h-full px-6">
                <div className="mb-8">
                  <span className="ml-2 text-3xl font-bold text-black">HEKO</span>
                </div>

                <form onSubmit={handlePromptSubmit} className="w-full max-w-3xl">
                  <div className="relative">
                    <div className="flex items-center bg-primary/5 rounded-full border border-primary/20 shadow-sm px-5 py-4 gap-3">
                      <label className="cursor-pointer text-primary hover:text-primary/80 transition">
                        <Paperclip size={20} />
                        <input
                          type="file"
                          onChange={(e) =>
                            setFile(e.target.files?.[0] || null)
                          }
                          className="hidden"
                        />
                      </label>

                      <input
                        type="text"
                        placeholder="Ask your insight query..."
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        className="flex-1 bg-transparent outline-none text-gray-700 placeholder:text-gray-400 text-base"
                      />

                      <button
                        type="submit"
                        disabled={submitting}
                        className="ml-2 p-2 bg-primary text-white rounded-full hover:bg-primary/90 disabled:opacity-50 transition"
                      >
                        <Send size={18} />
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-center gap-3 mt-6">
                    <button
                      type="button"
                      className="flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-sm text-primary hover:bg-primary/20 transition"
                    >
                      <Sparkles size={16} />
                      Credit Insights
                    </button>
                    <button
                      type="button"
                      className="flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-sm text-primary hover:bg-primary/20 transition"
                    >
                      <Mic size={16} />
                      Voice
                    </button>
                  </div>
                </form>

                {aiResponse && (
                  <div className="mt-10 w-full max-w-3xl bg-primary/5 border border-primary/10 rounded-lg p-5 text-left text-sm text-gray-800 shadow-sm">
                    <strong className="block text-primary mb-2">
                      AI Response:
                    </strong>
                    <p>{aiResponse}</p>
                  </div>
                )}
              </div>
            )}

            {/* Step 2: Credit Insights */}
            {active === "insights" && (
              <div className="space-y-5">
                <h2 className="text-lg font-semibold text-primary">
                  Credit Insights
                </h2>
                <p className="text-sm text-gray-600">
                  Real-time credit and risk trends derived from IoT and financial datasets.
                </p>

                <div className="bg-primary/5 border border-primary/10 rounded-lg p-4 shadow-sm">
                  <h3 className="text-primary font-semibold mb-2">
                    Live Trends & Insights
                  </h3>
                  <div className="bg-white rounded-md border border-primary/10 p-4 shadow-sm transition-all duration-500">
                    <h4 className="text-md font-bold text-gray-800">
                      {insightsFeed[insightIndex].title}
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">
                      {insightsFeed[insightIndex].detail}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: History */}
            {active === "history" && (
              <div className="flex h-full gap-4">
                {/* Sidebar List */}
                <div className="w-[230px] border-r border-primary/10 pr-3 overflow-auto">
                  <h3 className="text-primary font-semibold mb-3">History</h3>
                  <ul className="space-y-2 text-sm">
                    {historyList.map((item) => (
                      <li key={item.id}>
                        <button
                          type="button"
                          onClick={() => setSelectedSession(item)}
                          className={`w-full text-left rounded-md px-3 py-2 transition ${
                            selectedSession?.id === item.id
                              ? "bg-primary text-white"
                              : "hover:bg-primary/5 text-gray-700"
                          }`}
                        >
                          <div className="font-medium">{item.title}</div>
                          <div className="text-xs text-gray-500">
                            {item.timestamp}
                          </div>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Main Chat View */}
                <div className="flex-1 flex flex-col">
                  {selectedSession ? (
                    <>
                      <div className="flex justify-between items-center border-b border-primary/10 pb-2 mb-3">
                        <div>
                          <h4 className="text-md font-semibold text-primary">
                            {selectedSession.title}
                          </h4>
                          <p className="text-xs text-gray-500">
                            {selectedSession.timestamp}
                          </p>
                        </div>
                        <div className="flex gap-2 text-gray-500">
                          <button className="hover:text-primary">
                            <Edit size={16} />
                          </button>
                          <button className="hover:text-primary">
                            <Trash2 size={16} />
                          </button>
                          <button className="hover:text-primary">
                            <Download size={16} />
                          </button>
                          <button className="hover:text-primary">
                            <Share2 size={16} />
                          </button>
                        </div>
                      </div>

                      {/* Chat Messages */}
                      <div className="flex-1 overflow-auto space-y-3 p-1">
                        {selectedSession.messages.map((msg, idx) => (
                          <div
                            key={idx}
                            className={`flex ${
                              msg.sender === "user"
                                ? "justify-end"
                                : "justify-start"
                            }`}
                          >
                            <div
                              className={`rounded-lg px-4 py-2 max-w-[75%] text-sm ${
                                msg.sender === "user"
                                  ? "bg-primary text-white"
                                  : "bg-primary/5 text-gray-700 border border-primary/10"
                              }`}
                            >
                              {msg.text}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Input Area */}
                      <div className="mt-3 border-t border-primary/10 pt-3 flex items-center gap-2">
                        <textarea
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          placeholder="Type your message..."
                          className="flex-1 resize-none rounded-lg border border-primary/20 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                          rows={1}
                        />
                        <button
                          type="button"
                          onClick={handleSendMessage}
                          disabled={sending}
                          className="bg-primary text-white p-2 rounded-full hover:bg-primary/90 disabled:opacity-50"
                        >
                          <Send size={16} />
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="text-sm text-gray-600 flex items-center justify-center h-full">
                      Select a session to view its history.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="mt-4 flex items-center justify-between border-t border-primary/10 pt-3">
            <button
              type="button"
              onClick={prev}
              disabled={activeIndex === 0}
              className="rounded-md border border-primary/20 px-3 py-2 text-sm text-primary hover:bg-primary/5 disabled:opacity-50 transition"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-md bg-primary px-3 py-2 text-sm text-white hover:bg-primary/90 disabled:opacity-70"
            >
              {active === "history"
                ? submitting
                  ? "Submitting..."
                  : "Submit"
                : "Next"}
            </button>
          </div>
        </div>
      </section>
    </form>
  );
}
