"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { SORT_OPTIONS, type SortOrder } from "@/lib/sort";

export default function SortSelect({ value }: { value: SortOrder }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <label className="flex items-center gap-2 text-sm text-slate-600">
      <span className="shrink-0">Sort by</span>
      <select
        value={value}
        disabled={pending}
        onChange={(event) => {
          const url = new URL(window.location.href);
          url.searchParams.set("sort", event.target.value);
          startTransition(() => router.push(`${url.pathname}${url.search}${url.hash}`, { scroll: false }));
        }}
        className="min-w-0 rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 disabled:opacity-50"
      >
        {SORT_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
      </select>
    </label>
  );
}
