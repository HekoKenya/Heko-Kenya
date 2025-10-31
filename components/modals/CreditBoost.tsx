"use client";
import { useState } from "react";

export default function CreditBoost() {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button
        onClick={() => setOpen(true)}
        className="mt-2 rounded-sm bg-primary px-3 py-2 text-sm text-white hover:opacity-90"
      >
        Boost your credit
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <div className="relative z-10 w-[520px] max-w-[92vw] rounded-md border bg-white p-5 shadow-2xl">
            <div className="mb-3 text-lg font-semibold text-foreground">Improve your credit score</div>
            <div className="space-y-3 text-sm text-zinc-700">
              <p>Do you want to improve your credit score?</p>
              <p>
                Join a farm management company that will help you boost your farming practices. Click the link below:
              </p>
              <a
                href="https://kiembenikenya.vercel.app/"
                target="_blank"
                rel="noreferrer"
                className="inline-block rounded-sm bg-primary px-3 py-2 text-white hover:opacity-90"
              >
                Visit Kiembeni Kenya
              </a>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setOpen(false)}
                className="rounded-sm border px-3 py-2 text-sm hover:bg-zinc-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
