import Image from "next/image";
import Link from "next/link";
import type { Listing } from "@/lib/db";

export default function StoreList({ items }: { items: Listing[] }) {
  const stores = new Map<string, { name: string; handle: string; count: number; image?: string }>();
  for (const item of items) {
    if (!item.seller_handle || !item.active || item.sold) continue;
    const store = stores.get(item.user_id);
    if (store) {
      store.count += 1;
      store.image ||= item.images[0];
    }
    else stores.set(item.user_id, { name: item.seller_name, handle: item.seller_handle, count: 1, image: item.images[0] });
  }
  if (!stores.size) return null;

  return (
    <section id="stores" aria-labelledby="stores-heading" className="scroll-mt-24 space-y-5">
      <h2 id="stores-heading" className="text-2xl font-semibold tracking-tight text-[#24372f]">Explore stores</h2>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {[...stores.values()].sort((a, b) => a.name.localeCompare(b.name)).map((store) => (
          <Link key={store.handle} href={`/${store.handle}`} className="group block min-w-0 overflow-hidden rounded-xl border border-[#dedfd6] bg-white transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#245c43]">
            {store.image && <div className="relative aspect-[16/9] overflow-hidden bg-[#edf0e8]"><Image src={store.image} alt={`A listing from ${store.name}`} fill sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="object-cover transition-transform duration-300 group-hover:scale-105" /></div>}
            <div className="flex items-center gap-3 p-4">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden="true">
                <path d="M3 10 5 4h14l2 6M3 10a3 3 0 0 0 6 0 3 3 0 0 0 6 0 3 3 0 0 0 6 0M5 13v7h14v-7M9 20v-5h6v5" />
              </svg>
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium">{store.name}</p>
              <p className="truncate text-xs text-slate-500">/{store.handle}</p>
            </div>
            <span className="shrink-0 text-xs text-slate-500">{store.count} {store.count === 1 ? "item" : "items"}</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 shrink-0 text-slate-400 group-hover:text-slate-600" aria-hidden="true"><path d="m9 6 6 6-6 6" /></svg>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
