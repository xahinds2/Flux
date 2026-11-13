import Image from "next/image";
import Link from "next/link";
import ShareButton from "@/components/ShareButton";
import ItemDescription from "@/components/ItemDescription";
import ItemMeta from "@/components/ItemMeta";
import WhatsAppButton from "@/components/WhatsAppButton";
import type { Listing } from "@/lib/db";
import { formatPrice, whatsappLink } from "@/lib/format";

export default function ItemCard({ item }: { item: Listing }) {
  return (
    <article className={`group relative flex min-w-0 gap-3 sm:gap-4 rounded-xl border border-slate-200 p-3 transition ${item.sold ? "bg-slate-50" : "bg-white hover:border-slate-300 hover:shadow-md"}`}>
      <div className="relative aspect-square w-20 min-[380px]:w-28 shrink-0 self-start overflow-hidden rounded-lg bg-slate-100 sm:w-36">
        {item.images[0] ? (
          <Image
            src={item.images[0]}
            alt={item.title}
            fill
            sizes="144px"
            className={`object-cover transition duration-300 ${item.sold ? "grayscale opacity-50" : "group-hover:scale-105"}`}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-slate-400">No photo</div>
        )}
        {item.sold && <span className="absolute left-2 top-2 rounded bg-slate-700 px-2 py-1 text-xs font-semibold text-white">Sold</span>}
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <div className="flex items-center gap-2">
          <h3 className={`min-w-0 flex-1 line-clamp-1 font-medium ${item.sold ? "text-slate-500" : ""}`}>
            <Link href={`/item/${item.id}`} className="after:absolute after:inset-0">
              {item.title}
            </Link>
          </h3>
          <div className="relative z-10"><ShareButton itemId={item.id} title={item.title} compact /></div>
        </div>
        {item.description && <ItemDescription text={item.description} compact />}
        <ItemMeta item={item} />

        <div className="mt-auto flex flex-wrap items-center justify-between gap-x-3 gap-y-2 pt-2">
          <p className={`shrink-0 whitespace-nowrap text-lg font-semibold ${item.sold ? "text-slate-400 line-through" : ""}`}>{formatPrice(item.price)}</p>
          {item.sold ? (
            <span className="text-sm text-slate-500">Unavailable</span>
          ) : item.seller_whatsapp ? (
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
