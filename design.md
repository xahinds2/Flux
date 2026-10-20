# Flux - Multi-Vendor Marketplace

## Overview
Multi-vendor listing app. Anyone can sign up as a seller, configure their WhatsApp, list items. Buyers browse & message sellers. Simple, fast, no middleman.

## Auth Model
- **Buyers**: Public, no auth (can message sellers)
- **Sellers**: Clerk protected (can list items, configure contact)

## Tech Stack
- **Framework**: Next.js (App Router)
- **Styling**: Tailwind CSS
- **Database**: MongoDB (Mongoose)
- **Storage**: Vercel Blob (100GB free tier)
- **Auth**: Clerk
- **Deploy**: Vercel

## Core Features
1. **Seller Dashboard** (Clerk protected)
   - Set WhatsApp number in profile/settings
   - Add item: title, description, price, up to 5 photos, condition, brand, purchase month
   - View your listings
   - Delete your items
   - Edit item details

2. **Public Buyer Browse** (No auth)
   - List of all items from all sellers: image left; title, description, condition/age/brand tags, price, WhatsApp icon right
   - Click item → detail page with seller name + WhatsApp
   - "Message Seller on WhatsApp" button (pre-filled with item details)
   - Link to seller's other items

## Data Model
```
User (Seller)
- id (string) [Clerk ID]
- email (string)
- name (string)
- whatsapp_number (string) [digits only, with country code]
- created_at (timestamp)

Item
- id (ObjectId)
- user_id (string) [Clerk ID of seller]
- title (string)
- description (text)
- price (decimal)
- images (string[]) [Vercel Blob URLs, max 5, first is cover]
- condition (string) [New | Like new | Good | Fair, optional]
- brand (string) [optional]
- purchased_at (string) [YYYY-MM, optional; shown as "6 months old"]
- whatsapp_clicks (integer) [count of WhatsApp button clicks]
- created_at (timestamp)
```

## Routes

### Public
- `GET /` — browse all items (list, all sellers)
- `GET /item/[id]` — item detail + seller contact
- `GET /seller/[user_id]` — all items from one seller
- `GET /api/items` — fetch all items
- `GET /api/items?seller_id=...` — filter by seller
- `POST /api/items/[id]/click` — increment WhatsApp click counter (anonymous)

### Protected (Clerk)
- `GET /dashboard` — your listings + profile
- `GET /profile` — edit name, WhatsApp number
- `GET /new` — create listing form
- `GET /item/[id]/edit` — edit your listing
- `POST /api/items` — create item
- `PUT /api/items/[id]` — update your item
- `POST /api/upload` — upload item photo to Vercel Blob (JPEG/PNG/WebP/GIF, max 4MB)
- `DELETE /api/items/[id]` — delete your item
- `PUT /api/profile` — update WhatsApp, name

## User Flows

### Seller (First Time)
1. Sign in with Clerk (or sign up)
2. Redirect to `/profile` to set WhatsApp number
3. Click "List Item"
4. Fill: title, description, price, upload up to 5 photos
5. Submit → stored in DB
6. Item appears on homepage

### Seller (Returning)
1. Sign in
2. Click "Dashboard" → see all your listings with **interest count** (WhatsApp clicks)
3. Add new, delete, or edit items
4. WhatsApp number already configured
5. See how many people clicked to message you

### Buyer
1. Browse homepage (list of all items, all sellers)
2. Click item → see: title, description, price, photo gallery, seller name
3. Click "Message [Seller Name] on WhatsApp" → opens WhatsApp with pre-filled:
   ```
   Hey, interested in [Item Title] for ₹[Price]
   ```
4. Conversation happens on WhatsApp (seller replies directly)
5. Can click "View more from [Seller]" → see their other items

## WhatsApp Integration
- Each seller stores their WhatsApp number in profile
- Pre-fill link: `https://wa.me/{seller_whatsapp}?text=...`
- No backend messaging, direct seller contact only
- **Click Tracking**: Each "Message Seller" click increments counter
  - Frontend: `POST /api/items/[id]/click` before opening WhatsApp
  - Seller sees click count in dashboard (interest gauge)
  - Anonymous tracking (no user ID required)

## Design Principles
- Minimal UI (Tailwind, no extra libraries)
- No comments in code
- Image upload → Vercel Blob (simple `put()` API)
- Multi-vendor: anyone can sell
- Sellers own only their items (Clerk protected)
- Buyers have zero friction (public browse, direct seller contact via WhatsApp)
- No messaging system (direct WhatsApp only)
- No ratings/reviews (MVP)

## Env Vars Needed
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=...
CLERK_SECRET_KEY=...
BLOB_READ_WRITE_TOKEN=... (auto from Vercel)
MONGODB_URI=... (MongoDB Atlas)
```

**Note**: WhatsApp numbers are stored per seller in database, not in .env

## Next Steps
1. Scaffold Next.js + Clerk
2. Set up Vercel Blob
3. Build database schema + API
4. Create UI components
5. Deploy to Vercel
