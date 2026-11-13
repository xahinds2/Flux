import type { Item } from "@/lib/db";

export const SORT_OPTIONS = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "price-low", label: "Price: low to high" },
  { value: "price-high", label: "Price: high to low" },
] as const;

export type SortOrder = (typeof SORT_OPTIONS)[number]["value"];

export function parseSort(value: string | string[] | undefined): SortOrder {
  return SORT_OPTIONS.find((option) => option.value === value)?.value ?? "price-high";
}

export function sortItems<T extends Item>(items: T[], sort: SortOrder): T[] {
  return [...items].sort((a, b) => {
    const newest = Date.parse(b.created_at) - Date.parse(a.created_at) || a.id.localeCompare(b.id);
    if (sort === "oldest") return -newest;
    if (sort === "price-low") return a.price - b.price || newest;
    if (sort === "price-high") return b.price - a.price || newest;
    return newest;
  });
}
