"use client";

import { useState } from "react";

export default function ShareButton({ itemId, title }: { itemId: string; title: string }) {
  const [message, setMessage] = useState("");

  const share = async () => {
    setMessage("");
    const url = new URL(`/item/${itemId}`, window.location.origin).href;
    try {
      if (navigator.share) {
        await navigator.share({ title, url });
      } else {
        await navigator.clipboard.writeText(url);
        setMessage("Link copied");
      }
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") return;
      setMessage("Couldn't share. Please try again.");
    }
  };

  return (
    <div className="relative shrink-0">
      <button
        type="button"
        onClick={share}
        aria-label={`Share ${title}`}
        title="Share listing"
        className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="h-5 w-5" aria-hidden="true">
          <circle cx="18" cy="5" r="3" />
          <circle cx="6" cy="12" r="3" />
          <circle cx="18" cy="19" r="3" />
          <path d="m8.6 10.5 6.8-4M8.6 13.5l6.8 4" />
        </svg>
      </button>
      <span role="status" className={message ? "absolute right-0 top-full z-20 mt-1 w-40 rounded-lg border border-slate-200 bg-white p-2 text-sm shadow-sm" : "sr-only"}>
        {message}
      </span>
    </div>
  );
}
