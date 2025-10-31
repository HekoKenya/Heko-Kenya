"use client";
import { useState, useRef, useEffect } from "react";

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Array<{ role: "user" | "assistant"; text: string }>>([
    { role: "assistant", text: "Hi! I'm your Heko assistant. How can I help?" },
  ]);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, open]);

  function send() {
    const text = input.trim();
    if (!text) return;
    setMessages((m) => [...m, { role: "user", text }]);
    setInput("");
    setTimeout(() => {
      setMessages((m) => [
        ...m,
        { role: "assistant", text: "Thanks! I noted your message. (Demo response)" },
      ]);
    }, 400);
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-full bg-primary px-4 py-3 text-white shadow-lg hover:opacity-90 focus:outline-none"
      >
        <span className="inline-block h-3 w-3 rounded-full bg-white" />
        <span className="text-sm font-medium">click me im your heko assistant</span>
      </button>

      {open && (
        <div className="mt-3 w-[360px] rounded-md border bg-white shadow-2xl">
          <div className="flex items-center justify-between border-b px-4 py-2">
            <div className="text-sm font-semibold text-foreground">Heko Assistant</div>
            <button
              onClick={() => setOpen(false)}
              className="rounded-sm px-2 py-1 text-xs text-zinc-600 hover:bg-zinc-100"
            >
              Close
            </button>
          </div>
          <div ref={scrollRef} className="h-64 overflow-y-auto px-4 py-3 space-y-2 text-sm">
            {messages.map((m, i) => (
              <div
                key={i}
                className={
                  m.role === "assistant"
                    ? "flex w-full justify-start"
                    : "flex w-full justify-end"
                }
              >
                <div
                  className={
                    m.role === "assistant"
                      ? "max-w-[80%] rounded-md bg-zinc-100 px-3 py-2 text-zinc-800"
                      : "max-w-[80%] rounded-md bg-primary px-3 py-2 text-white"
                  }
                >
                  {m.text}
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2 border-t p-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
              className="min-h-[40px] flex-1 resize-none rounded-sm border px-3 py-2 text-sm focus:outline-none"
              rows={2}
            />
            <button
              onClick={send}
              className="rounded-sm bg-primary px-3 py-2 text-sm text-white hover:opacity-90"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
