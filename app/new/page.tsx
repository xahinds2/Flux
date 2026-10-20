import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import ItemForm from "@/components/ItemForm";
import { getSeller } from "@/lib/db";

export const metadata = { title: "New listing" };

export default async function NewListing() {
  const { userId } = await auth.protect();
  if (!(await getSeller(userId))?.whatsapp_number) redirect("/profile");

  return (
    <div className="mx-auto max-w-md space-y-6">
      <h1 className="text-2xl font-bold">New listing</h1>
      <ItemForm />
    </div>
  );
}
