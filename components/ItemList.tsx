import ItemCard from "@/components/ItemCard";
import type { Listing } from "@/lib/db";

export default function ItemList({ items, empty }: { items: Listing[]; empty: string }) {
  if (items.length === 0) {
    return <p className="rounded-xl border border-dashed border-slate-300 py-16 text-center text-slate-500">{empty}</p>;
  }

  return (
    <div className="grid gap-3 lg:grid-cols-2">
      {items.map((item) => (
        <ItemCard key={item.id} item={item} />
      ))}
    </div>
  );
}
