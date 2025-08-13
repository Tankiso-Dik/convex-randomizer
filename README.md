Got it — here’s the **updated README.md** with the new `altText` + `sceneDescription` requirement baked in, plus the note about legacy fields.

---

```md
# Product Image Studio — Personal CRM + Randomizer

A personal Next.js + Convex tool:
- `/products`: lightweight CRM for listing/creating/editing products, with JSON import/export and inline JSON preview.
- `/randomizer`: picks a published product with a valid platform URL (Etsy/CM/etc). Supports `?seed=...` for deterministic picks.

## 📦 Purpose

- Store product data (templates) manually using the Convex UI.
- Fetch a **random product** from Convex.
- Pass the random product(s) to AI tools like Gemini CLI or Codex for generating:
  - Image prompts
  - SEO copy
  - Product descriptions
  - Listing metadata

Minimal Next.js frontend with Convex as the backend.

---

## 🗃️ Project Structure

```

convex-randomizer/
├── convex/
│   ├── schema.ts              # Product + randomizerStats schema definitions
│   ├── products.ts            # CRUD + seed
│   ├── randomizer.ts          # Randomize + recentCounts (optional stats)
│   └── _generated/            # Convex auto-generated files
├── app/                       # Next.js app (products + randomizer)
├── lib/convexClient.ts        # Convex provider + hook exports
├── middleware.ts              # Basic Auth for /products (optional)
├── render.yaml                # Render deploy blueprint
├── package.json
├── tsconfig.json
├── README.md                  # You're reading this

````

---

## 🔑 Environment Variables

Define the Convex deployment URL in `.env.local` using the `NEXT_PUBLIC_CONVEX_URL` key so it is available to the browser:

```bash
NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud
```

Client-side code should reference this via `process.env.NEXT_PUBLIC_CONVEX_URL`. The `CONVEX_DEPLOYMENT` variable may remain for the Convex CLI but is not used in frontend code.

### Randomizer Stats (optional)
Set `RANDOMIZER_STATS=1` to enable collection of recent randomizer picks. Without it, nothing is collected. When enabled, `/randomizer` shows a small recent-picks panel.

---

## 🧠 Schema Overview

Each product in Convex includes:

- `listingName: string`
- `officialName: string`
- `shortDescription: string`
- `description: string`
- `instructions: string`

**Platform URLs** (optional; only stored if a valid https:// URL is provided. "N/A" is accepted on input but not stored.):
- `gumroadUrl`
- `etsyUrl`
- `creativeMarketUrl`
- `notionUrl`
- `notionery`
- `notionEverything`
- `prototion`
- `notionLand`

**Metadata Arrays**:
- `features: string[]`
- `categories: string[]`
- `tags: string[]`

**Media** *(source of truth)*:
```ts
media: {
  url: string;
  type: "thumbnail" | "screenshot" | "banner" | "video" | "gif" | "icon";
  altText: string;          // mandatory for accessibility
  sceneDescription: string; // mandatory for contextual metadata
}[]
````

**Legacy fields** *(for migration only — to be removed once backfilled into `media[]`)*:

* `imagePolished: string[]`
* `screenshots: string[]`
* `gifs: string[]`
* `videoUrls: string[]`

Data is manually added through the [Convex Dashboard](https://dashboard.convex.dev/).

---

## 🌀 How It Works

1. **Start Convex dev server:**

   ```bash
   npx convex dev
   # After schema changes:
   npx convex push
   ```

2. **Insert products** through the dashboard UI.

3. **Use the randomizer page** to fetch a random product.

4. **Use the output** in prompts for image generation, SEO writing, or markdown documentation.

## 🩺 Health Check

The endpoint `/api/health` returns `{ "ok": true }` and can be used by deployment monitoring services to verify the app is running.

---

## ✅ Done

* [x] Schema defined with `altText` and `sceneDescription` required for all media items
* [x] Dev server working
* [x] Manual data entry working
* [x] Gemini CLI ready to consume prompt input

---

## 🧠 Future Ideas

* Optional filtering by platform or category
* Markdown output format for the random product
* Automatic migration and removal of legacy arrays
* Frontend UI (deferred)
* Replit support (already works!)

---

## 👋 Usage Goals

This repo is part of a larger system for remaking and selling PLR Notion templates. The randomizer helps ensure consistent output pipelines while reducing burnout and cognitive fatigue.

```

---

Do you want me to follow this immediately with the **updated GEMINI.md** in the same style so they match perfectly? That way both will be in sync.
```
