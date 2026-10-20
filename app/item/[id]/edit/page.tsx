import { notFound } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import ItemForm from "@/components/ItemForm";
import { getItem } from "@/lib/db";

export const metadata = { title: "Edit listing" };

export default async function EditItemPage({ params }: { params: Promise<{ id: string }> }) {
  const { userId } = await auth.protect();
  const data = await getItem((await params).id);
  if (!data || data.item.user_id !== userId) notFound();

  return (
    <div className="mx-auto max-w-md space-y-6">
      <h1 className="text-2xl font-bold">Edit listing</h1>
      <ItemForm item={data.item} />
    </div>
  );
}
