Got it — here’s the **updated README.md** with the new `altText` + `sceneDescription` requirement baked in, plus the note about legacy fields.

---

```md
# Convex Product Randomizer

This is a minimal, monolithic project for managing and querying PLR Notion templates using Convex as a backend and terminal scripts as the interface. It is designed to run inside Replit or locally without needing a frontend or APIs.

## 📦 Purpose

- Store product data (templates) manually using the Convex UI.
- Fetch a **random product** or a **batch of 20 random products** using terminal scripts.
- Pass the random product(s) to AI tools like Gemini CLI or Codex for generating:
  - Image prompts
  - SEO copy
  - Product descriptions
  - Listing metadata

No frontend. No API endpoints. Just Convex + CLI.

---

## 🗃️ Project Structure

```

convex-randomizer/
├── convex/
│   ├── schema.ts              # Product schema definition
│   ├── products.ts            # Query to get all products
│   └── \_generated/            # Convex auto-generated files
├── scripts/
│   ├── randomize.ts           # Script to fetch a random product from Convex
│   └── batchRandomize.ts      # Script to fetch 20 random products from Convex
├── .env.local                 # Convex cloud project info
├── logs.txt                   # Log file for the last 20 runs
├── package.json
├── tsconfig.json
├── README.md                  # You're reading this

````

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
   ```

2. **Insert products** through the dashboard UI.

3. **Run the randomizer scripts:**

   * Single random product:

     ```bash
     npx tsx scripts/randomize.ts
     ```
   * Batch of 20 random products:

     ```bash
     npx tsx scripts/batchRandomize.ts
     ```

4. **Use the output** in prompts for image generation, SEO writing, or markdown documentation.

---

## ✅ Done

* [x] Schema defined with `altText` and `sceneDescription` required for all media items
* [x] Dev server working
* [x] Manual data entry working
* [x] Randomizer CLI script for single products
* [x] Batch randomizer CLI script for 20 products
* [x] Logging implemented with rotation
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
