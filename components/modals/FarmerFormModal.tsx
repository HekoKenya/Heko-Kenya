"use client";
import FarmerMultiStepForm from "@/components/forms/FarmerMultiStepForm";

export default function FarmerFormModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative z-10 w-[960px] max-w-[95vw] max-h-[90vh] overflow-auto rounded-md border bg-white p-5 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Farmer Application Form</h2>
          <button onClick={onClose} className="rounded-sm border px-3 py-2 text-sm hover:bg-zinc-50">Close</button>
        </div>
        <FarmerMultiStepForm />
      </div>
    </div>
  );
}
