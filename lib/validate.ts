export const MAX_IMAGES = 5;
export const CONDITIONS = ["New", "Like new", "Good", "Fair"] as const;

export type ItemInput = {
  title: string;
  description: string;
  price: number;
  images: string[];
  condition: string;
  brand: string;
  purchased_at: string;
  active: boolean;
};

type Result<T> = { ok: true; data: T } | { ok: false; error: string };

const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");
const obj = (v: unknown) => (v && typeof v === "object" ? v : {}) as Record<string, unknown>;

function isOwnBlobUrl(v: unknown, userId: string): v is string {
  if (typeof v !== "string") return false;
  try {
    const url = new URL(v);
    return (
      url.protocol === "https:" &&
      url.hostname.endsWith(".public.blob.vercel-storage.com") &&
      url.pathname.startsWith(`/items/${userId}/`)
    );
  } catch {
    return false;
  }
}

export function parseItemInput(input: unknown, userId: string): Result<ItemInput> {
  const body = obj(input);
  const title = str(body.title);
  const description = str(body.description);
  const price = typeof body.price === "number" ? body.price : NaN;
  const images = Array.isArray(body.images) ? body.images : [];
  const condition = str(body.condition);
  const brand = str(body.brand);
  const purchased_at = str(body.purchased_at);
  const active = body.active !== false;

  if (!title || title.length > 120) return { ok: false, error: "Title is required (max 120 characters)" };
  if (description.length > 2000) return { ok: false, error: "Description is too long (max 2000 characters)" };
  if (!Number.isFinite(price) || price < 0 || price > 1_000_000_000) return { ok: false, error: "Enter a valid price" };
  if (images.length > MAX_IMAGES) return { ok: false, error: `Up to ${MAX_IMAGES} photos allowed` };
  if (!images.every((url) => isOwnBlobUrl(url, userId)) || new Set(images).size !== images.length) {
    return { ok: false, error: "Invalid image" };
  }
  if (condition && !(CONDITIONS as readonly string[]).includes(condition)) return { ok: false, error: "Invalid condition" };
  if (brand.length > 60) return { ok: false, error: "Brand is too long (max 60 characters)" };
  if (purchased_at && (!/^\d{4}-(0[1-9]|1[0-2])$/.test(purchased_at) || purchased_at > new Date().toISOString().slice(0, 7))) {
    return { ok: false, error: "Enter a valid purchase month" };
  }

  return {
    ok: true,
    data: { title, description, price: Math.round(price * 100) / 100, images, condition, brand, purchased_at, active },
  };
}

export function parseProfileInput(input: unknown): Result<{ name: string; whatsapp_number: string }> {
  const body = obj(input);
  const name = str(body.name);
  const digits = str(body.whatsapp_number).replace(/\D/g, "").replace(/^0+/, "");
  const whatsapp_number = digits.length === 10 ? `91${digits}` : digits;

  if (!name || name.length > 60) return { ok: false, error: "Name is required (max 60 characters)" };
  if (whatsapp_number.length < 8 || whatsapp_number.length > 15) {
    return { ok: false, error: "Enter your WhatsApp number with country code, e.g. +91 98765 43210" };
  }

  return { ok: true, data: { name, whatsapp_number } };
}
