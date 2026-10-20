"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type { Item } from "@/lib/db";
import { CONDITIONS, MAX_IMAGES } from "@/lib/validate";

const MAX_BYTES = 4 * 1024 * 1024;
type Photo = { url: string; file?: File };

const inputClass = "w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-slate-900 focus:outline-none";

async function send(url: string, init: RequestInit) {
  const res = await fetch(url, init);
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error(data?.error ?? "Something went wrong");
  return data;
}

export default function ItemForm({ item }: { item?: Item }) {
  const router = useRouter();
  const [title, setTitle] = useState(item?.title ?? "");
  const [description, setDescription] = useState(item?.description ?? "");
  const [price, setPrice] = useState(item ? String(item.price) : "");
  const [condition, setCondition] = useState(item?.condition ?? "");
  const [brand, setBrand] = useState(item?.brand ?? "");
  const [purchasedAt, setPurchasedAt] = useState(item?.purchased_at ?? "");
  const [active, setActive] = useState(item?.active ?? true);
  const [photos, setPhotos] = useState<Photo[]>(item?.images.map((url) => ({ url })) ?? []);
  const [status, setStatus] = useState<"idle" | "uploading" | "saving">("idle");
  const [error, setError] = useState("");

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = [...(e.target.files ?? [])];
    e.target.value = "";
    if (selected.some((f) => f.size > MAX_BYTES)) return setError("Each image must be 4MB or smaller");
    if (photos.length + selected.length > MAX_IMAGES) return setError(`Up to ${MAX_IMAGES} photos allowed`);
    setError("");
    setPhotos([...photos, ...selected.map((file) => ({ url: URL.createObjectURL(file), file }))]);
  };

  const makeCover = (i: number) => setPhotos([photos[i], ...photos.filter((_, j) => j !== i)]);
  const removePhoto = (i: number) => setPhotos(photos.filter((_, j) => j !== i));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      if (photos.some((p) => p.file)) setStatus("uploading");
      const images = await Promise.all(
        photos.map(async ({ url, file }) => {
          if (!file) return url;
          const body = new FormData();
          body.append("file", file);
          return (await send("/api/upload", { method: "POST", body })).url as string;
        }),
      );

      setStatus("saving");
      await send(item ? `/api/items/${item.id}` : "/api/items", {
        method: item ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, price: Number(price), images, condition, brand, purchased_at: purchasedAt, active }),
      });

      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setStatus("idle");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="title" className="mb-1 block text-sm font-medium">
          Title
        </label>
        <input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={inputClass}
          placeholder="What are you selling?"
          maxLength={120}
          required
        />
      </div>

      <div>
        <label htmlFor="description" className="mb-1 block text-sm font-medium">
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={`${inputClass} h-28`}
          placeholder="Condition, size, pickup details…"
          maxLength={2000}
        />
      </div>

      <div>
        <label htmlFor="price" className="mb-1 block text-sm font-medium">
          Price (₹)
        </label>
        <input
          id="price"
          type="number"
          inputMode="decimal"
          min="0"
          step="0.01"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className={inputClass}
          placeholder="0.00"
          required
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="min-w-0">
          <label htmlFor="condition" className="mb-1 block text-sm font-medium">
            Condition
          </label>
          <select id="condition" value={condition} onChange={(e) => setCondition(e.target.value)} className={inputClass}>
            <option value="">Not specified</option>
            {CONDITIONS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div className="min-w-0">
          <label htmlFor="purchased_at" className="mb-1 block text-sm font-medium">
            Purchased
          </label>
          <input
            id="purchased_at"
            type="month"
            max={new Date().toISOString().slice(0, 7)}
            value={purchasedAt}
            onChange={(e) => setPurchasedAt(e.target.value)}
            className={`${inputClass} block min-h-[42px] appearance-none bg-white text-left`}
          />
        </div>
      </div>

      <div>
        <label htmlFor="brand" className="mb-1 block text-sm font-medium">
          Brand
        </label>
        <input
          id="brand"
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
          className={inputClass}
          placeholder="e.g. Apple, IKEA"
          maxLength={60}
        />
      </div>

      <div>
        <label htmlFor="images" className="mb-1 block text-sm font-medium">
          Photos ({photos.length}/{MAX_IMAGES})
        </label>
        {photos.length > 0 && (
          <div className="mb-2 grid grid-cols-3 gap-2">
            {photos.map((photo, i) => (
              <div key={photo.url} className="relative aspect-square overflow-hidden rounded-lg bg-slate-100">
                <Image src={photo.url} alt="" fill sizes="140px" unoptimized={!!photo.file} className="object-cover" />
                <button
                  type="button"
                  onClick={() => removePhoto(i)}
                  aria-label={`Remove photo ${i + 1}`}
                  className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-sm text-white hover:bg-black/80"
                >
                  ×
                </button>
                {i === 0 ? (
                  <span className="absolute bottom-1 left-1 rounded bg-slate-900 px-1.5 py-0.5 text-xs text-white">Cover</span>
                ) : (
                  <button
                    type="button"
                    onClick={() => makeCover(i)}
                    className="absolute bottom-1 left-1 rounded bg-white/90 px-1.5 py-0.5 text-xs hover:bg-white"
                  >
                    Make cover
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
        {photos.length < MAX_IMAGES && (
          <input
            id="images"
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handleFiles}
            className="w-full text-sm file:mr-3 file:rounded-md file:border-0 file:bg-slate-100 file:px-3 file:py-2 file:text-sm hover:file:bg-slate-200"
          />
        )}
        <p className="mt-1 text-xs text-slate-500">Up to {MAX_IMAGES} photos. JPEG, PNG, WebP or GIF up to 4MB each. First photo is the cover.</p>
      </div>

      {item && (
        <label className="flex items-start gap-3 rounded-lg border border-slate-200 bg-white p-3">
          <input
            type="checkbox"
            checked={active}
            onChange={(e) => setActive(e.target.checked)}
            className="mt-0.5 h-5 w-5 accent-slate-900"
          />
          <span>
            <span className="block text-sm font-medium">Active</span>
            <span className="block text-xs text-slate-500">Uncheck to hide this listing from buyers.</span>
          </span>
        </label>
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={status !== "idle"}
        className="w-full rounded-lg bg-slate-900 px-4 py-2 text-white hover:bg-slate-800 disabled:opacity-50"
      >
        {status === "uploading" ? "Uploading photos…" : status === "saving" ? "Saving…" : item ? "Save changes" : "Create listing"}
      </button>
    </form>
  );
}
