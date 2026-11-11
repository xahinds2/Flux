"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

export default function ItemStatusButton({ itemId, active }: { itemId: string; active: boolean }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const toggleActive = () => {
    setError("");
    startTransition(async () => {
      try {
        const res = await fetch(`/api/items/${itemId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ active: !active }),
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
      <button
        type="button"
        onClick={toggleActive}
        disabled={pending}
        className="w-full rounded-md border border-slate-200 px-2 py-1.5 text-center text-sm hover:bg-slate-100 disabled:opacity-50"
      >
        {pending ? "Saving…" : active ? "Disable listing" : "Enable listing"}
      </button>
      {error && <p role="alert" className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}
