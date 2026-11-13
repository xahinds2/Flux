"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

export default function ItemStatusButton({ itemId, active, sold }: { itemId: string; active: boolean; sold: boolean }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const updateStatus = (status: { active: boolean } | { sold: true }) => {
    setError("");
    startTransition(async () => {
      try {
        const res = await fetch(`/api/items/${itemId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(status),
        });
        if (!res.ok) throw new Error("Couldn't update this listing. Please try again.");
        router.refresh();
      } catch {
        setError("Couldn't update this listing. Please try again.");
      }
    });
  };

  return (
    <div>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => updateStatus({ active: !active })}
          disabled={pending}
          className="flex-1 rounded-md border border-slate-200 px-2 py-1.5 text-center text-sm hover:bg-slate-100 disabled:opacity-50"
        >
          {pending ? "Saving…" : active ? "Disable listing" : "Enable listing"}
        </button>
        <button
          type="button"
          onClick={() => updateStatus(sold ? { active: true } : { sold: true })}
          disabled={pending}
          className="flex-1 rounded-md border border-emerald-200 bg-emerald-50 px-2 py-1.5 text-center text-sm text-emerald-800 hover:bg-emerald-100 disabled:opacity-50"
        >
          {sold ? "Mark available" : "Mark sold"}
        </button>
      </div>
      {error && <p role="alert" className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}
