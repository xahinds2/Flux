import Image from "next/image";
import Link from "next/link";
import ItemMeta from "@/components/ItemMeta";
import WhatsAppButton from "@/components/WhatsAppButton";
import type { Listing } from "@/lib/db";
import { formatPrice, whatsappLink } from "@/lib/format";

export default function ItemCard({ item }: { item: Listing }) {
  return (
    <article className="group relative flex gap-4 rounded-xl border border-slate-200 bg-white p-3 transition hover:border-slate-300 hover:shadow-md">
      <div className="relative aspect-square w-28 shrink-0 overflow-hidden rounded-lg bg-slate-100 sm:w-36">
        {item.images[0] ? (
          <Image
            src={item.images[0]}
            alt={item.title}
            fill
            sizes="144px"
            className="object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-slate-400">No photo</div>
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <h3 className="line-clamp-1 font-medium">
          <Link href={`/item/${item.id}`} className="after:absolute after:inset-0">
            {item.title}
          </Link>
        </h3>
        {item.description && <p className="line-clamp-2 text-sm text-slate-600">{item.description}</p>}
        <ItemMeta item={item} />

        <div className="mt-auto flex items-center justify-between gap-3 pt-1">
          <p className="text-lg font-semibold">{formatPrice(item.price)}</p>
          {item.seller_whatsapp ? (
            <div className="relative z-10 min-w-0">
              <WhatsAppButton
                itemId={item.id}
                href={whatsappLink(item.seller_whatsapp, item.title, item.price)}
                label={item.seller_name}
                compact
              />
            </div>
          ) : (
            <p className="truncate text-xs text-slate-500">{item.seller_name}</p>
          )}
        </div>
      </div>
    </article>
  );
}
