import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ItemList from "@/components/ItemList";
import { getListings, getSeller } from "@/lib/db";

type Props = { params: Promise<{ user_id: string }> };

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const seller = await getSeller((await params).user_id);
  return seller ? { title: `Items from ${seller.name}` } : {};
}

export default async function SellerPage({ params }: Props) {
  const { user_id } = await params;
  const [seller, items] = await Promise.all([getSeller(user_id), getListings(user_id)]);
  if (!seller) notFound();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{seller.name}</h1>
        <p className="text-slate-600">
          {items.length} {items.length === 1 ? "listing" : "listings"}
        </p>
      </div>
      <ItemList items={items} empty="This seller has no listings right now." />
    </div>
  );
}
