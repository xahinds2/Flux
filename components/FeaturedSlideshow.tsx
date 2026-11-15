"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/format";

export type FeaturedItem = { id: string; title: string; image: string; price: number; seller: string };

export default function FeaturedSlideshow({ items }: { items: FeaturedItem[] }) {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const item = items[index];

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setPlaying(!preference.matches);
    update();
    preference.addEventListener("change", update);
    return () => preference.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!playing || hovered || focused || items.length < 2) return;
    const timer = window.setInterval(() => {
      if (!document.hidden) setIndex((current) => (current + 1) % items.length);
    }, 5000);
    return () => window.clearInterval(timer);
  }, [playing, hovered, focused, items.length]);

  if (!item) return <div className="flex aspect-[6/5] items-center justify-center rounded-[64px_16px_16px_16px] bg-[#e8eee3] p-10 text-center text-3xl font-medium tracking-tight text-[#245c43]">A new home for<br />your next find.</div>;

  const controlClass = "flex h-8 w-8 items-center justify-center rounded-lg text-[#245c43] hover:bg-[#e8eee3] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#245c43]";
  const move = (step: number) => {
    setPlaying(false);
    setIndex((current) => (current + step + items.length) % items.length);
  };

  return (
    <div role="region" aria-roledescription="carousel" aria-label="Featured items" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} onFocusCapture={() => setFocused(true)} onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false); }} className="min-w-0">
      <Link href={`/item/${item.id}`} aria-label={`View ${item.title}`} className="group relative block aspect-square overflow-hidden rounded-[64px_16px_16px_16px] bg-[#e8eee3] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#245c43] sm:aspect-[6/5]">
        <Image key={item.id} src={item.image} alt={item.title} fill priority={index === 0} sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
        <div className="absolute inset-x-4 bottom-4 rounded-xl bg-[#faf9f6]/95 p-4 sm:inset-x-5 sm:bottom-5">
          <p className="mb-1 text-xs text-[#616b64]">From {item.seller}’s listings</p>
          <div className="flex flex-wrap items-center justify-between gap-2 text-[#24372f]"><h2 className="font-semibold">{item.title}</h2><span className="text-sm font-medium">{formatPrice(item.price)}</span></div>
        </div>
      </Link>
      {items.length > 1 && (
        <div className="mt-3 flex items-center justify-end gap-2">
          <span aria-live={playing ? "off" : "polite"} className="mr-auto text-xs tabular-nums text-[#616b64]">{index + 1} / {items.length}</span>
          <button type="button" className={controlClass} aria-label={playing ? "Pause slideshow" : "Play slideshow"} onClick={() => setPlaying(!playing)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">{playing ? <path d="M9 5v14M15 5v14" /> : <path d="m8 5 11 7-11 7Z" />}</svg>
          </button>
          <button type="button" className={controlClass} aria-label="Previous item" onClick={() => move(-1)}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true"><path d="m15 6-6 6 6 6" /></svg></button>
          <button type="button" className={controlClass} aria-label="Next item" onClick={() => move(1)}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true"><path d="m9 6 6 6-6 6" /></svg></button>
        </div>
      )}
    </div>
  );
}
