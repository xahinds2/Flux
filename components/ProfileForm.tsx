"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const inputClass = "w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-slate-900 focus:outline-none";

function splitNumber(saved: string) {
  if (!saved) return { code: "91", number: "" };
  if (saved.startsWith("91") && saved.length === 12) return { code: "91", number: saved.slice(2) };
  return { code: "", number: saved };
}

export default function ProfileForm({ initialName, initialWhatsapp }: { initialName: string; initialWhatsapp: string }) {
  const router = useRouter();
  const [name, setName] = useState(initialName);
  const [code, setCode] = useState(() => splitNumber(initialWhatsapp).code);
  const [number, setNumber] = useState(() => splitNumber(initialWhatsapp).number);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    const res = await fetch("/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, whatsapp_number: `+${code}${number}` }),
    });

    if (res.ok) {
      router.push("/dashboard");
      router.refresh();
    } else {
      setError((await res.json().catch(() => null))?.error ?? "Couldn't save your profile");
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="mb-1 block text-sm font-medium">
          Display name
        </label>
        <input id="name" value={name} onChange={(e) => setName(e.target.value)} className={inputClass} maxLength={60} required />
      </div>

      <div>
        <label htmlFor="whatsapp" className="mb-1 block text-sm font-medium">
          WhatsApp number
        </label>
        <div className="flex gap-2">
          <div className="flex w-20 shrink-0 items-center rounded-lg border border-slate-300 bg-slate-100 px-3 focus-within:border-slate-900">
            <span className="text-slate-500">+</span>
            <input
              aria-label="Country code"
              inputMode="numeric"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 3))}
              className="w-full bg-transparent py-2 pl-0.5 focus:outline-none"
            />
          </div>
          <input
            id="whatsapp"
            type="tel"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            className={inputClass}
            placeholder="98765 43210"
            required
          />
        </div>
        <p className="mt-1 text-xs text-slate-500">Selling from outside India? Change the country code.</p>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={saving}
        className="w-full rounded-lg bg-slate-900 px-4 py-2 text-white hover:bg-slate-800 disabled:opacity-50"
      >
        {saving ? "Saving…" : "Save profile"}
      </button>
    </form>
  );
}
