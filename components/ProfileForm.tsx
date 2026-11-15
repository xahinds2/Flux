"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const inputClass = "w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-slate-900 focus:outline-none";

function splitNumber(saved: string) {
  if (!saved) return { code: "91", number: "" };
  if (saved.startsWith("91") && saved.length === 12) return { code: "91", number: saved.slice(2) };
  return { code: "", number: saved };
}

export default function ProfileForm({ initialName, initialWhatsapp, initialUsername, initialPhone }: { initialName: string; initialWhatsapp: string; initialUsername: string; initialPhone: string }) {
  const router = useRouter();
  const [phoneCode, setPhoneCode] = useState(() => splitNumber(initialPhone).code);
  const [phone, setPhone] = useState(() => splitNumber(initialPhone).number);
  const [username, setUsername] = useState(initialUsername);
  const [name, setName] = useState(initialName);
  const [code, setCode] = useState(() => splitNumber(initialWhatsapp).code);
  const [number, setNumber] = useState(() => splitNumber(initialWhatsapp).number);
  const testUsername = username.trim().replace(/^@/, "");
  const canTestUsername = /^(?=.*[a-zA-Z])[a-zA-Z0-9._]{3,35}$/.test(testUsername);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    const res = await fetch("/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, phone_number: phone.trim() ? `+${phoneCode}${phone}` : "", whatsapp_number: number.trim() ? `+${code}${number}` : "", whatsapp_username: username }),
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
        <label htmlFor="call-number" className="mb-1 block text-sm font-medium">Call number (optional)</label>
        <div className="flex gap-2">
          <div className="flex w-20 shrink-0 items-center rounded-lg border border-slate-300 bg-slate-100 px-3 focus-within:border-slate-900">
            <span className="text-slate-500">+</span>
            <input
              aria-label="Call country code"
              inputMode="numeric"
              value={phoneCode}
              onChange={(e) => setPhoneCode(e.target.value.replace(/\D/g, "").slice(0, 3))}
              className="w-full bg-transparent py-2 pl-0.5 focus:outline-none"
            />
          </div>
          <input id="call-number" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className={inputClass} placeholder="98765 43210" />
        </div>
        <p className="mt-1 text-xs text-slate-500">Shown to buyers for direct calls. This can differ from your WhatsApp number.</p>
      </div>

      <div>
        <label htmlFor="whatsapp-username" className="mb-1 block text-sm font-medium">WhatsApp username</label>
        <input id="whatsapp-username" value={username} onChange={(e) => setUsername(e.target.value)} className={inputClass} placeholder="xahinds" maxLength={36} autoCapitalize="none" spellCheck={false} />
        {canTestUsername && (
          <a href={`https://wa.me/${encodeURIComponent(testUsername)}`} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900">
            Test username ↗
          </a>
        )}
        <p className="mt-1 text-xs text-slate-500">Use your active WhatsApp username to receive enquiries without sharing your number.</p>
      </div>

      <div>
        <label htmlFor="whatsapp" className="mb-1 block text-sm font-medium">
          WhatsApp number
        </label>
        <div className="flex gap-2">
          <div className="flex w-20 shrink-0 items-center rounded-lg border border-slate-300 bg-slate-100 px-3 focus-within:border-slate-900">
            <span className="text-slate-500">+</span>
            <input
              aria-label="WhatsApp country code"
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
            required={!username.trim()}
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
