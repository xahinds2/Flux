import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SellerPage from "@/app/seller/[user_id]/page";
import { getSellerByHandle } from "@/lib/db";
import { handleError } from "@/lib/handle";

type Props = { params: Promise<{ handle: string }>; searchParams: Promise<{ sort?: string | string[] }> };

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const handle = (await params).handle.toLowerCase();
  if (handleError(handle)) return {};
  const seller = await getSellerByHandle(handle);
  return seller ? { title: `Items from ${seller.name}` } : {};
}

export default async function HandlePage({ params, searchParams }: Props) {
  const handle = (await params).handle.toLowerCase();
  if (handleError(handle)) notFound();
  const seller = await getSellerByHandle(handle);
  if (!seller) notFound();
  return <SellerPage params={Promise.resolve({ user_id: seller.id })} searchParams={searchParams} />;
}
