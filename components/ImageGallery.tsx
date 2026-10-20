"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function ImageGallery({ images, title }: { images: string[]; title: string }) {
  const [active, setActive] = useState(0);
  const [preview, setPreview] = useState(false);

  useEffect(() => {
    if (!preview) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setPreview(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [preview]);

  return (
    <div className="space-y-3">
      <div className="relative aspect-square overflow-hidden rounded-xl bg-slate-100">
        {images[active] ? (
          <button type="button" onClick={() => setPreview(true)} aria-label="View full photo" className="absolute inset-0 cursor-zoom-in">
            <Image src={images[active]} alt={title} fill priority sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
          </button>
        ) : (
          <div className="flex h-full items-center justify-center text-slate-400">No photo</div>
        )}
      </div>

      {images.length > 1 && (
        <div className="flex gap-2">
          {images.map((url, i) => (
            <button
              key={url}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Show photo ${i + 1}`}
              className={`relative aspect-square w-16 overflow-hidden rounded-lg bg-slate-100 ring-2 ${i === active ? "ring-slate-900" : "ring-transparent hover:ring-slate-300"}`}
            >
              <Image src={url} alt="" fill sizes="64px" className="object-cover" />
            </button>
          ))}
        </div>
      )}

      {preview && (
        <div role="dialog" aria-modal="true" aria-label={title} onClick={() => setPreview(false)} className="fixed inset-0 z-[60] bg-black/90">
          <Image src={images[active]} alt={title} fill sizes="100vw" className="object-contain p-4 sm:p-10" />
          <button
            type="button"
            onClick={() => setPreview(false)}
            aria-label="Close preview"
            autoFocus
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-2xl text-white hover:bg-white/20"
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
}
