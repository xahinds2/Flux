import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import DeleteButton from "@/components/DeleteButton";
import { getListings, getSeller } from "@/lib/db";
import { formatPrice } from "@/lib/format";

export const metadata = { title: "Dashboard" };

export default async function Dashboard() {
  const { userId } = await auth.protect();
  const [seller, items] = await Promise.all([getSeller(userId), getListings(userId)]);
  if (!seller?.whatsapp_number) redirect("/profile");

  const totalClicks = items.reduce((sum, item) => sum + item.whatsapp_clicks, 0);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <Link href="/new" className="rounded-lg bg-slate-900 px-4 py-2 text-white hover:bg-slate-800">
          New listing
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-sm text-slate-500">Profile</p>
          <p className="font-semibold">{seller.name}</p>
          <p className="text-sm text-slate-600">+{seller.whatsapp_number}</p>
          <Link href="/profile" className="mt-2 inline-block text-sm text-slate-900 underline-offset-4 hover:underline">
            Edit profile
          </Link>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-sm text-slate-500">Listings</p>
          <p className="text-3xl font-bold">{items.length}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-sm text-slate-500">WhatsApp clicks</p>
          <p className="text-3xl font-bold">{totalClicks}</p>
        </div>
      </div>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Your listings</h2>

        {items.length === 0 ? (
          <p className="rounded-xl border border-dashed border-slate-300 py-16 text-center text-slate-500">
            No listings yet.{" "}
            <Link href="/new" className="text-slate-900 underline">
              Create your first one
            </Link>
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <div key={item.id} className="overflow-hidden rounded-xl border border-slate-200 bg-white">
                <div className="relative aspect-video bg-slate-100">
                  {item.images[0] ? (
                    <Image src={item.images[0]} alt={item.title} fill sizes="(min-width: 1024px) 33vw, 50vw" className="object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-slate-400">No photo</div>
                  )}
                </div>
                <div className="space-y-2 p-3">
                  <div>
                    <h3 className="line-clamp-1 font-medium">{item.title}</h3>
                    <p className="font-semibold">{formatPrice(item.price)}</p>
                  </div>
                  <p className="text-sm text-slate-500">
                    {item.whatsapp_clicks} {item.whatsapp_clicks === 1 ? "person" : "people"} interested
                  </p>
                  <div className="flex gap-2 pt-1">
                    <Link
                      href={`/item/${item.id}`}
                      className="flex-1 rounded-md bg-slate-100 px-2 py-1.5 text-center text-sm hover:bg-slate-200"
                    >
                      View
                    </Link>
                    <Link
                      href={`/item/${item.id}/edit`}
                      className="flex-1 rounded-md bg-slate-100 px-2 py-1.5 text-center text-sm hover:bg-slate-200"
                    >
                      Edit
                    </Link>
                    <DeleteButton itemId={item.id} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
