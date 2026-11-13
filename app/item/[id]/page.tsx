import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import ImageGallery from "@/components/ImageGallery";
import ShareButton from "@/components/ShareButton";
import ItemDescription from "@/components/ItemDescription";
import ItemMeta from "@/components/ItemMeta";
import WhatsAppButton from "@/components/WhatsAppButton";
import { getItem } from "@/lib/db";
import { formatPrice, whatsappLink } from "@/lib/format";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const data = await getItem((await params).id);
  if (!data || (!data.item.active && !data.item.sold)) return {};
  const { item } = data;
  return {
    title: item.title,
    description: item.description.slice(0, 160) || `${formatPrice(item.price)} on Flux`,
    openGraph: item.images.length ? { images: item.images } : undefined,
  };
}

export default async function ItemPage({ params }: Props) {
  const data = await getItem((await params).id);
  if (!data) notFound();

  const { item, seller } = data;
  const { userId } = await auth();
  if (!item.active && !item.sold && userId !== item.user_id) notFound();
  const sellerName = seller?.name ?? "Seller";

  return (
    <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-2">
      <ImageGallery images={item.images} title={item.title} />

      <div className="space-y-6">
        {!item.active && (
          <p className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800">{item.sold ? "This item has been sold." : "This listing is inactive and hidden from buyers."}</p>
        )}
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-3">
            <h1 className="min-w-0 text-3xl font-bold tracking-tight">{item.title}</h1>
            <ShareButton itemId={item.id} title={item.title} />
          </div>
          <p className="text-2xl font-semibold">{formatPrice(item.price)}</p>
          <Link href={`/seller/${item.user_id}`} className="text-sm text-slate-600 hover:text-slate-900">
            Sold by {sellerName}
          </Link>
        </div>

        <ItemMeta item={item} />

        {item.description && <ItemDescription text={item.description} />}

        {userId === item.user_id ? (
          <Link
            href={`/item/${item.id}/edit`}
            className="block w-full rounded-lg border border-slate-300 px-4 py-3 text-center font-semibold hover:bg-slate-100"
          >
            Edit listing
          </Link>
        ) : item.sold ? (
          <p className="rounded-lg bg-slate-100 px-4 py-3 text-center font-semibold text-slate-500">Sold — no longer available</p>
        ) : seller?.whatsapp_number ? (
          <WhatsAppButton
            itemId={item.id}
            href={whatsappLink(seller.whatsapp_number, item.title, item.price)}
            label={`Message ${sellerName} on WhatsApp`}
          />
        ) : (
          <p className="text-sm text-slate-500">This seller hasn&apos;t set up WhatsApp yet.</p>
        )}

        <Link href={`/seller/${item.user_id}`} className="inline-block text-sm font-medium text-slate-900 underline-offset-4 hover:underline">
          View more from {sellerName} →
        </Link>
      </div>
    </div>
  );
}
