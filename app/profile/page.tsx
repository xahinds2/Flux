import { auth, currentUser } from "@clerk/nextjs/server";
import ProfileForm from "@/components/ProfileForm";
import { getSeller } from "@/lib/db";

export const metadata = { title: "Profile" };

export default async function ProfilePage() {
  const { userId } = await auth.protect();
  const seller = await getSeller(userId);
  const clerkName = seller ? "" : ((await currentUser())?.fullName ?? "");

  return (
    <div className="mx-auto max-w-md space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold">Your seller profile</h1>
        <p className="text-sm text-slate-600">Buyers see your name and contact you on WhatsApp.</p>
      </div>
      <ProfileForm initialName={seller?.name ?? clerkName} initialWhatsapp={seller?.whatsapp_number ?? ""} />
    </div>
  );
}
