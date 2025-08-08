🧠 GEMINI.md — Convex Product Randomizer

This document defines the core functionality, schema contracts, and validation logic for the convex-randomizer project.

It is the source of truth used by Gemini CLI and other downstream agents (Codex, Makeover GPT, Product Preparer GPT) to ensure all scripts, schemas, and workflows remain aligned and deterministic.

🎯 Project Purpose

The Convex Product Randomizer is a zero-frontend, script-first system that:

Stores PLR Notion template product data in a Convex database

Allows terminal scripts to fetch random products from the DB

Randomly selects a valid marketplace platform (excluding "N/A")

Outputs the enriched product with selectedPlatform and selectedUrl

Logs the result into logs.txt (last 20 entries only)

Supports Gemini CLI / Codex pipelines to generate:

Image prompts

SEO copy

Product descriptions

Marketplace metadata

This project is designed for use without a frontend, and may be run on local machines, Replit, or any CLI-compatible cloud system.

🧱 Schema Definition

Collection: products

{
  listingName: string;
  officialName: string;
  shortDescription: string;
  description: string;
  instructions: string;

  gumroadUrl: string;
  etsyUrl: string;
  creativeMarketUrl: string;
  notionUrl: string;
  notionery: string;
  notionEverything: string;
  prototion: string;
  notionLand: string;

  features: string[];
  categories: string[];
  tags: string[];

  imagePolished: string[];
  screenshots: string[];
  gifs: string[];
  videoUrls: string[];

  media: {
    url: string;
    type: "thumbnail" | "screenshot" | "banner" | "video" | "gif" | "icon";
    altText: string;
  }[];
}

All platform URL fields must either:

Contain a valid URL (https)

Or be the string "N/A"

The field media[] is required (can be empty) and supports structured access by image type.

🔁 Randomizer Behavior

Script: scripts/randomize.ts

Selects a single random product from Convex

Filters platforms with URLs that are not "N/A"

Picks one valid platform at random

Outputs selectedPlatform and selectedUrl to stdout

Appends the run to logs.txt (maintaining a maximum of 20 entries)

Script: scripts/batchRandomize.ts

Selects 20 random products (no duplicates)

Filters platforms as above

Picks one valid platform per product (or marks N/A if none)

Writes all 20 runs to logs.txt (replacing older entries)

Outputs all enriched products as a JSON array

📋 Validation Contracts (Enforced in Schema + Logic)

All platform fields default to "N/A"

Randomizers must ignore platform fields with "N/A"

media[] must be an array (can be empty)

Each item in media[] must include:

url (string)

type (enum)

altText (string)

logs.txt should contain a maximum of 20 entries

Each line: Timestamp, ID, Platform

🤖 Gemini CLI Integration

This project is designed for direct use with Gemini CLI tools.
The output of randomize.ts or batchRandomize.ts is passed into:

Makeover GPT → Generates visual identity, themes, prompts

Product Preparer GPT → Generates SEO, instructions, categories, alt text

OBS GPT → Determines walkthrough recording plan

Tags Generator GPT → Creates marketplace tag metadata

Gemini CLI must enforce:

Schema alignment when seeding entries

Valid URL or "N/A" for each platform field

Presence of at least one media[] item when needed by a downstream GPT

Never assume presence of selectedPlatform or selectedUrl inside Convex DB — they are script-generated only

🛠️ Maintenance Notes

Add new marketplaces only as wildcards (string, default: "N/A")

To test platform selection logic, always seed at least 2 products with multiple valid platform URLs

Convex schema changes must be mirrored here and in schema.ts

✅ Completion Criteria

This project is working as intended when:

