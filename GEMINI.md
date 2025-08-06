Perfect timing for a README refresh. This will make Gemini CLI *laser-focused* and give it full context to finish everything smoothly.

---

### 🧾 Here’s what to put in the new `README.md` for the **Convex-based Product Randomizer**

---

```md
# Convex Product Randomizer

This is a minimal, monolithic project for managing and querying PLR Notion templates using Convex as a backend and terminal scripts as the interface. It is designed to run inside Replit or locally without needing a frontend or APIs.

## 📦 Purpose

- Store product data (templates) manually using the Convex UI.
- Fetch a **random product** using terminal scripts.
- Pass the random product to AI tools like Gemini CLI or Codex for generating:
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
│   └── randomize.ts           # Script to fetch a random product from Convex
├── .env.local                 # Convex cloud project info
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
- `features: string[]`
- `instructions: string`
- `tags: string[]`
- `categories: string[]`
- `imagePolished: string[]`
- `screenshots: string[]`
- `gifs: string[]`
- `videoUrls: string[]`
- `gumroadUrl: string`
- `etsyUrl: string`
- `creativeMarketUrl: string`
- `selectedPlatform: "gumroad" | "etsy" | "creativeMarket"`
- `selectedUrl: string`

Data is manually added through the [Convex Dashboard](https://dashboard.convex.dev/).

---

## 🌀 How It Works

1. Start Convex dev server:  
   ```bash
   npx convex dev
````

2. Insert products through the dashboard UI.

3. Run the randomizer script:

   ```bash
   npx tsx scripts/randomize.ts
   ```

4. Use the output in prompts for image generation, SEO writing, or markdown documentation.

---

## ✅ Done

* [x] Schema defined
* [x] Dev server working
* [x] Manual data entry working
* [x] Randomizer CLI script scaffolding
* [x] Gemini CLI ready to consume prompt input

---

## 🧠 Future Ideas

* Optional filtering by platform or category
* Markdown output format for the random product
* Frontend UI (deferred)
* Replit support (already works!)

---

## 👋 Usage Goals

This repo is part of a larger system for remaking and selling PLR Notion templates. The randomizer helps ensure consistent output pipelines while reducing burnout and cognitive fatigue.

```

---

Let me know if you'd like me to paste this into a real `README.md` scaffold or tweak any language. Once added, Gemini CLI will be ready to take over.
```
