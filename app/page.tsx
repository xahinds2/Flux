import ItemList from "@/components/ItemList";
import { getListings } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function Home() {
  const items = await getListings();

  return <ItemList items={items} empty="No items listed yet. Be the first!" />;
}
