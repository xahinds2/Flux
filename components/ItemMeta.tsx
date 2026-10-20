import type { Item } from "@/lib/db";
import { formatAge } from "@/lib/format";

export default function ItemMeta({ item }: { item: Item }) {
  const tags = [item.condition, item.purchased_at && formatAge(item.purchased_at), item.brand].filter(Boolean);
  if (tags.length === 0) return null;

  return (
    <ul className="flex flex-wrap gap-1.5">
      {tags.map((tag) => (
        <li key={tag} className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
          {tag}
        </li>
      ))}
    </ul>
  );
}
