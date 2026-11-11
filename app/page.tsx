import SortSelect from "@/components/SortSelect";
import { parseSort, sortItems } from "@/lib/sort";
import ItemList from "@/components/ItemList";
import { getListings } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function Home({ searchParams }: { searchParams: Promise<{ sort?: string | string[] }> }) {
  const sort = parseSort((await searchParams).sort);
  const items = await getListings();

  return (
    <div className="space-y-4">
      <div className="flex justify-end"><SortSelect value={sort} /></div>
      <ItemList items={sortItems(items, sort)} empty="No items listed yet. Be the first!" />
    </div>
  );
}
