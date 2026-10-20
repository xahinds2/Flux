"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DeleteButton({ itemId }: { itemId: string }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Delete this listing? This can't be undone.")) return;

    setDeleting(true);
    const res = await fetch(`/api/items/${itemId}`, { method: "DELETE" });
    if (res.ok) {
      router.refresh();
    } else {
      alert("Couldn't delete this listing. Please try again.");
      setDeleting(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={deleting}
      className="flex-1 rounded-md bg-red-50 px-2 py-1.5 text-center text-sm text-red-600 hover:bg-red-100 disabled:opacity-50"
    >
      {deleting ? "Deleting…" : "Delete"}
    </button>
  );
}
