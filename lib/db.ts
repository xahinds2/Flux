import mongoose, { Schema, Types } from "mongoose";
import { cache } from "react";
import type { ItemInput } from "@/lib/validate";

type UserDoc = {
  _id: string;
  email?: string;
  name: string;
  whatsapp_number: string;
  created_at: Date;
};

type ItemDoc = {
  _id: Types.ObjectId;
  user_id: string;
  title: string;
  description: string;
  price: number;
  images: string[];
  condition: string;
  brand: string;
  purchased_at: string;
  whatsapp_clicks: number;
  created_at: Date;
};

export type Seller = { id: string; name: string; whatsapp_number: string };

export type Item = {
  id: string;
  user_id: string;
  title: string;
  description: string;
  price: number;
  images: string[];
  condition: string;
  brand: string;
  purchased_at: string;
  whatsapp_clicks: number;
  created_at: string;
};

export type Listing = Item & { seller_name: string; seller_whatsapp: string };

const userSchema = new Schema<UserDoc>({
  _id: { type: String, required: true },
  email: String,
  name: { type: String, default: "" },
  whatsapp_number: { type: String, default: "" },
  created_at: { type: Date, default: Date.now },
});

const itemSchema = new Schema<ItemDoc>({
  user_id: { type: String, required: true, index: true },
  title: { type: String, required: true },
  description: { type: String, default: "" },
  price: { type: Number, required: true },
  images: { type: [String], default: [] },
  condition: { type: String, default: "" },
  brand: { type: String, default: "" },
  purchased_at: { type: String, default: "" },
  whatsapp_clicks: { type: Number, default: 0 },
  created_at: { type: Date, default: Date.now, index: true },
});

const User = (mongoose.models.User as mongoose.Model<UserDoc>) ?? mongoose.model<UserDoc>("User", userSchema);
const ItemModel = (mongoose.models.Item as mongoose.Model<ItemDoc>) ?? mongoose.model<ItemDoc>("Item", itemSchema);

let connecting: Promise<unknown> | undefined;

async function connectDB() {
  if (mongoose.connection.readyState === 1) return;
  connecting ??= mongoose.connect(process.env.MONGODB_URI!).catch((error) => {
    connecting = undefined;
    throw error;
  });
  await connecting;
}

const isObjectId = (id: string) => /^[a-f\d]{24}$/i.test(id);

function toItem(doc: ItemDoc): Item {
  return {
    id: doc._id.toString(),
    user_id: doc.user_id,
    title: doc.title,
    description: doc.description ?? "",
    price: doc.price,
    images: doc.images ?? [],
    condition: doc.condition ?? "",
    brand: doc.brand ?? "",
    purchased_at: doc.purchased_at ?? "",
    whatsapp_clicks: doc.whatsapp_clicks ?? 0,
    created_at: new Date(doc.created_at).toISOString(),
  };
}

function toSeller(doc: UserDoc): Seller {
  return { id: doc._id, name: doc.name || "Seller", whatsapp_number: (doc.whatsapp_number ?? "").replace(/\D/g, "") };
}

export async function getListings(sellerId?: string): Promise<Listing[]> {
  await connectDB();
  const docs = await ItemModel.find(sellerId ? { user_id: sellerId } : {}).sort({ created_at: -1 }).lean<ItemDoc[]>();
  const users = await User.find({ _id: { $in: [...new Set(docs.map((d) => d.user_id))] } }).lean<UserDoc[]>();
  const sellers = new Map(users.map((u) => [u._id, toSeller(u)]));
  return docs.map((d) => {
    const seller = sellers.get(d.user_id);
    return { ...toItem(d), seller_name: seller?.name ?? "Seller", seller_whatsapp: seller?.whatsapp_number ?? "" };
  });
}

export const getItem = cache(async (id: string): Promise<{ item: Item; seller: Seller | null } | null> => {
  if (!isObjectId(id)) return null;
  await connectDB();
  const doc = await ItemModel.findById(id).lean<ItemDoc>();
  if (!doc) return null;
  return { item: toItem(doc), seller: await getSeller(doc.user_id) };
});

export async function getSeller(userId: string): Promise<Seller | null> {
  await connectDB();
  const doc = await User.findById(userId).lean<UserDoc>();
  return doc ? toSeller(doc) : null;
}

export async function upsertSeller(userId: string, data: { name: string; whatsapp_number: string; email?: string }) {
  await connectDB();
  const doc = await User.findByIdAndUpdate(userId, { $set: data }, { upsert: true, new: true }).lean<UserDoc>();
  return toSeller(doc!);
}

export async function createItem(userId: string, data: ItemInput) {
  await connectDB();
  const doc = await ItemModel.create({ ...data, user_id: userId });
  return toItem(doc.toObject());
}

export async function updateItem(id: string, userId: string, data: ItemInput) {
  if (!isObjectId(id)) return null;
  await connectDB();
  const before = await ItemModel.findOneAndUpdate({ _id: id, user_id: userId }, { $set: data }).lean<ItemDoc>();
  return before ? { before: toItem(before), after: { ...toItem(before), ...data } } : null;
}

export async function deleteItem(id: string, userId: string) {
  if (!isObjectId(id)) return null;
  await connectDB();
  const doc = await ItemModel.findOneAndDelete({ _id: id, user_id: userId }).lean<ItemDoc>();
  return doc ? toItem(doc) : null;
}

export async function incrementClick(id: string) {
  if (!isObjectId(id)) return false;
  await connectDB();
  const res = await ItemModel.updateOne({ _id: id }, { $inc: { whatsapp_clicks: 1 } });
  return res.matchedCount > 0;
}
