"use client";

import { useState } from "react";
import { handleError } from "@/lib/handle";
import { useRouter } from "next/navigation";

const inputClass = "w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-slate-900 focus:outline-none";

function splitNumber(saved: string) {
  if (!saved) return { code: "91", number: "" };
  if (saved.startsWith("91") && saved.length === 12) return { code: "91", number: saved.slice(2) };
  return { code: "", number: saved };
}

export default function ProfileForm({ initialHandle, initialName, initialWhatsapp, initialUsername, initialPhone }: { initialHandle: string; initialName: string; initialWhatsapp: string; initialUsername: string; initialPhone: string }) {
  const router = useRouter();
  const [handle, setHandle] = useState(initialHandle);
  const [availability, setAvailability] = useState<{ handle: string; message: string; available?: boolean } | null>(null);
  const [checking, setChecking] = useState(false);

  const checkHandle = async () => {
    const candidate = handle.trim().toLowerCase();
    const error = handleError(candidate);
    if (error) {
      setAvailability({ handle: candidate, message: error });
      return;
    }
    setAvailability(null);
    setChecking(true);
    try {
      const response = await fetch(`/api/profile/handle?handle=${encodeURIComponent(candidate)}`);
      const result = await response.json();
      setAvailability({ handle: candidate, message: response.ok ? (result.available ? "" : "This address is already taken.") : result.error, available: response.ok && result.available });
    } catch {
      setAvailability({ handle: candidate, message: "Couldn't check availability. Try again." });
    } finally {
      setChecking(false);
    }
  };
  const handleAvailable = availability?.handle === handle.trim().toLowerCase() && availability.available;
  const [phoneCode, setPhoneCode] = useState(() => splitNumber(initialPhone).code);
  const [phone, setPhone] = useState(() => splitNumber(initialPhone).number);
  const [whatsappType, setWhatsappType] = useState<"username" | "number">(initialUsername || !initialWhatsapp ? "username" : "number");
  const [username, setUsername] = useState(initialUsername);
  const [name, setName] = useState(initialName);
  const [code, setCode] = useState(() => splitNumber(initialWhatsapp).code);
  const [number, setNumber] = useState(() => splitNumber(initialWhatsapp).number);
  const testUsername = username.trim().replace(/^@/, "");
  const testNumber = `${code}${number}`.replace(/\D/g, "").replace(/^0+/, "");
  const testRecipient = whatsappType === "username" ? testUsername : testNumber;
  const canTestWhatsapp = whatsappType === "username"
    ? /^(?=.*[a-zA-Z])[a-zA-Z0-9._]{3,35}$/.test(testUsername)
    : Boolean(number.trim()) && /^[1-9][0-9]{7,14}$/.test(testNumber);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    const res = await fetch("/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ handle, name, phone_number: phone.trim() ? `+${phoneCode}${phone}` : "", whatsapp_number: whatsappType === "number" && number.trim() ? `+${code}${number}` : "", whatsapp_username: whatsappType === "username" ? username : "" }),
    });

    if (res.ok) {
      router.push("/dashboard");
      router.refresh();
    } else {
      setError((await res.json().catch(() => null))?.error ?? "Couldn't save your profile");
      setSaving(false);
    }
  };

  const whatsappTestLink = canTestWhatsapp && (
          <a href={`https://wa.me/${encodeURIComponent(testRecipient)}`} target="_blank" rel="noopener noreferrer" aria-label="Test WhatsApp" title="Test WhatsApp" className="inline-flex h-10 w-10 shrink-0 self-center items-center justify-center rounded-lg border border-green-200 bg-green-50 text-green-600 hover:bg-green-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600">
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
            </svg>
          </a>
        );

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="mb-1 block text-sm font-medium">
          Display name
        </label>
        <input id="name" value={name} onChange={(e) => setName(e.target.value)} className={inputClass} maxLength={60} required />
      </div>

      <div>
        <label htmlFor="handle" className="mb-1 block text-sm font-medium">Your listing address</label>
        <div className="flex gap-2">
          <input id="handle" value={handle} onChange={(e) => setHandle(e.target.value.toLowerCase())} className={`${inputClass} min-w-0`} placeholder="your-name" maxLength={30} autoCapitalize="none" spellCheck={false} />
          <button type="button" onClick={checkHandle} disabled={checking || !handle.trim()} aria-label={checking ? "Checking availability" : handleAvailable ? "Address available" : "Check availability"} title="Check availability" className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border text-sm disabled:cursor-default ${handleAvailable ? "border-green-200 bg-green-50 text-green-600" : "border-slate-200 text-slate-600 hover:bg-slate-100"}`}>
            {checking ? <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" opacity=".2" /><path d="M12 3a9 9 0 0 1 9 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg> : handleAvailable ? <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m5 12 4 4 10-10" /></svg> : <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 4 4" /></svg>}
          </button>
        </div>
        <p className="mt-1 break-all text-xs text-slate-500">flux-pune.vercel.app/{handle || "your-name"}</p>
        <span role="status" className="sr-only">{checking ? "Checking availability" : handleAvailable ? "Address available" : ""}</span>
        {availability?.handle === handle.trim().toLowerCase() && availability.message && <p role="status" className="mt-1 text-xs text-red-600">{availability.message}</p>}
      </div>

      <div>
        <label htmlFor="call-number" className="mb-1 block text-sm font-medium">Phone number</label>
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
        <p className="mt-1 text-xs text-slate-500">Shown to buyers for direct calls.</p>
      </div>

      <fieldset className="space-y-3">
        <legend className="mb-2 text-sm font-medium">WhatsApp</legend>
        <div className="flex gap-1 rounded-lg bg-slate-100 p-1">
          {(["username", "number"] as const).map((option) => (
            <label key={option} className="flex-1 cursor-pointer">
              <input type="radio" name="whatsapp-type" value={option} checked={whatsappType === option} onChange={() => setWhatsappType(option)} className="peer sr-only" />
              <span className="block rounded-md px-3 py-1.5 text-center text-sm text-slate-500 peer-checked:bg-white peer-checked:font-medium peer-checked:text-slate-900 peer-checked:shadow-sm peer-focus-visible:ring-2 peer-focus-visible:ring-slate-900">{option === "username" ? "Username" : "Phone number"}</span>
            </label>
          ))}
        </div>
      {whatsappType === "username" ? (
      <div>
        <label htmlFor="whatsapp-username" className="sr-only">WhatsApp username</label>
        <div className="flex gap-2">
          <input id="whatsapp-username" value={username} onChange={(e) => setUsername(e.target.value)} className={`${inputClass} min-w-0`} placeholder="xahinds" maxLength={36} autoCapitalize="none" spellCheck={false} required />
          {whatsappTestLink}
        </div>
        <p className="mt-1 text-xs text-slate-500">Use a username to keep your WhatsApp number private.</p>
      </div>

      ) : (
      <div>
        <label htmlFor="whatsapp" className="sr-only">
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
            className={`${inputClass} min-w-0`}
            placeholder="98765 43210"
            required
          />
          {whatsappTestLink}
        </div>
        <p className="mt-1 text-xs text-slate-500">Selling from outside India? Change the country code.</p>
      </div>


      )}

      </fieldset>

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
