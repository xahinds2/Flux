import LandingHero from "@/components/LandingHero";
import StoreList from "@/components/StoreList";
import SortSelect from "@/components/SortSelect";
import { parseSort, sortItems } from "@/lib/sort";
import ItemList from "@/components/ItemList";
import { getListings } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function Home({ searchParams }: { searchParams: Promise<{ sort?: string | string[] }> }) {
  const sort = parseSort((await searchParams).sort);
  const items = await getListings();
  const featured = items.filter((item) => item.active && !item.sold && item.images.length > 0).map((item) => ({ id: item.id, title: item.title, image: item.images[0], price: item.price, seller: item.seller_name }));

  return (
    <div className="-mx-4 -my-8 space-y-10 bg-[#faf9f6] px-4 py-8 sm:space-y-14">
      <LandingHero items={featured} />
      <div className="grid grid-cols-1 gap-3 rounded-xl border border-[#e4e7dd] bg-[#edf0e8] px-5 py-5 text-center text-sm text-[#245c43] sm:grid-cols-3"><span>Personal stores</span><span>Everyday finds</span><span>Direct conversations</span></div>
      <StoreList items={items} />
      <section id="items" className="scroll-mt-24 space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3"><h2 className="text-2xl font-semibold tracking-tight text-[#24372f]">Browse items</h2><SortSelect value={sort} /></div>
      <ItemList items={sortItems(items, sort)} empty="No items listed yet. Be the first!" />
      </section>
      <footer className="flex flex-wrap justify-between gap-2 border-t border-[#dedfd6] py-6 text-sm text-[#616b64]"><span className="font-semibold text-[#24372f]">Flux</span><span>A new home for everyday things.</span></footer>
    </div>
  );
}
