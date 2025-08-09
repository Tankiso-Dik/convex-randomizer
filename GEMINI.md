Here’s the **updated GEMINI.md** with the new `altText` + `sceneDescription` rules, legacy field notes, and migration context so Gemini CLI stays in sync with the Convex schema.

---

````md
# 🧠 GEMINI.md — Convex Product Randomizer

This document defines the core functionality, schema contracts, and validation logic for the convex-randomizer project.

It is the source of truth used by Gemini CLI and other downstream agents (Codex, Makeover GPT, Product Preparer GPT) to ensure all scripts, schemas, and workflows remain aligned and deterministic.

---

## 🎯 Project Purpose

The Convex Product Randomizer is a zero-frontend, script-first system that:

- Stores PLR Notion template product data in a Convex database
- Allows terminal scripts to fetch random products from the DB
- Randomly selects a valid marketplace platform (excluding `"N/A"`)
- Outputs the enriched product with `selectedPlatform` and `selectedUrl`
- Logs the result into `logs.txt` (last 20 entries only)
- Supports Gemini CLI / Codex pipelines to generate:
  - Image prompts
  - SEO copy
  - Product descriptions
  - Marketplace metadata

This project is designed for use without a frontend, and may be run on local machines, Replit, or any CLI-compatible cloud system.

---

## 🧱 Schema Definition

**Collection:** `products`

```ts
{
  listingName: string;
  officialName: string;
  shortDescription: string;
  description: string;
  instructions: string;

  // Platform URLs are optional; if present they must be valid https URLs.
  gumroadUrl?: string;
  etsyUrl?: string;
  creativeMarketUrl?: string;
  notionUrl?: string;
  notionery?: string;
  notionEverything?: string;
  prototion?: string;
  notionLand?: string;

  features: string[];
  categories: string[];
  tags: string[];

  // Source of truth for all product media
  media: {
    url: string;
    type: "thumbnail" | "screenshot" | "banner" | "video" | "gif" | "icon";
    altText: string;          // mandatory for accessibility
    sceneDescription: string; // mandatory for contextual metadata
  }[];

  // Legacy arrays (for migration only)
  imagePolished?: string[];
  screenshots?: string[];
  gifs?: string[];
  videoUrls?: string[];
}
```

---

## 📏 Schema Rules

* **Platform URL fields are optional.** If present, they **must** be valid `https` URLs.
   Legacy entries may contain `"N/A"`; treat missing or `"N/A"` as not set.
* **`media[]` must exist** (can be empty)
* Each `media[]` item **must have**:

  * `url` (non-empty string)
  * `type` (enum)
  * `altText` (non-empty string)
  * `sceneDescription` (non-empty string)
* Legacy arrays are for migration purposes only — all media will eventually live in `media[]`.

---

## 🔁 Randomizer Behavior

**Script:** `scripts/randomize.ts`

* Selects a single random product from Convex
* Filters out platform fields with `"N/A"`
* Picks one valid platform at random
* Outputs `selectedPlatform` and `selectedUrl` to stdout
* Appends the run to `logs.txt` (max 20 entries)

**Script:** `scripts/batchRandomize.ts`

* Selects 20 random products (no duplicates)
* Filters platforms as above
* Picks one valid platform per product (or `"N/A"` if none)
* Writes all 20 runs to `logs.txt` (replaces older entries)
* Outputs all enriched products as a JSON array

---

## 📋 Validation Contracts

* Platform fields are optional; avoid storing 'N/A' going forward.
* Randomizers must ignore **missing** fields and **'N/A'** values.
* `media[]` must be an array (can be empty)
* All `media[]` items must have **both** `altText` and `sceneDescription` filled
* `logs.txt` contains a maximum of 20 entries

  * Each line: `Timestamp, ID, Platform`

---

## 🤖 Gemini CLI Integration

The output of `randomize.ts` or `batchRandomize.ts` is passed into:

* **Makeover GPT** → Generates visual identity, themes, prompts
* **Product Preparer GPT** → Generates SEO, instructions, categories, alt text
* **OBS GPT** → Determines walkthrough recording plan
* **Tags Generator GPT** → Creates marketplace tag metadata

Gemini CLI must:

* Enforce schema alignment when seeding entries
* Validate platform URL rules
* Confirm `altText` + `sceneDescription` for each media item
* Never assume `selectedPlatform` or `selectedUrl` exists in DB (script-only fields)

---

## 🛠️ Maintenance Notes

* Add new marketplaces as optional string fields; prefer leaving unset rather than storing 'N/A'.
* Seed at least 2 products with multiple valid platform URLs to test selection logic
* Remove legacy arrays after full migration to `media[]`
* Schema changes here must be mirrored in `schema.ts`

---

## ✅ Completion Criteria

This project is working as intended when:

* Schema matches `schema.ts`
* Scripts run without errors
* All randomizer outputs are valid and meet the above contracts
* Downstream GPTs consume outputs without manual fixes

```

---

If you want, I can also make a **migration checklist section** in GEMINI.md so future you knows exactly how to go from the legacy arrays to the unified `media[]`. That could prevent schema drift later. Would you like me to add that?
```
