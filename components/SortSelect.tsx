"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { SORT_OPTIONS, type SortOrder } from "@/lib/sort";

export default function SortSelect({ value }: { value: SortOrder }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <label className="inline-flex items-center gap-2.5 text-sm text-slate-500">
      <span className="shrink-0">Sort by</span>
      <span className="relative inline-flex">
      <select
        value={value}
        disabled={pending}
        onChange={(event) => {
          const url = new URL(window.location.href);
          url.searchParams.set("sort", event.target.value);
          startTransition(() => router.push(`${url.pathname}${url.search}${url.hash}`, { scroll: false }));
        }}
        className="h-9 min-w-0 appearance-none rounded-lg border border-slate-200 bg-white py-0 pl-3 pr-9 text-sm font-medium text-slate-700 transition-colors hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 disabled:opacity-50"
      >
        {SORT_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
      </select>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500">
        <path d="m7 10 5 5 5-5" />
      </svg>
      </span>
    </label>
  );
}
