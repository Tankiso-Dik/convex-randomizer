import { mutation } from "./_generated/server";
import { v } from "convex/values";

const PLATFORM_KEYS = [
  "gumroadUrl",
  "etsyUrl",
  "creativeMarketUrl",
  "notionUrl",
  "notionery",
  "notionEverything",
  "prototion",
  "notionLand",
] as const;

function isValidLink(x: unknown): x is string {
  return typeof x === "string" && x.trim() !== "" && x.trim().toLowerCase() !== "n/a";
}

// Simple deterministic string hash (unsigned 32-bit)
function hash32(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h >>> 0;
}

export const randomize = mutation({
  args: { seed: v.optional(v.string()) },
  handler: async (ctx, { seed }) => {
    const all = await ctx.db.query("products").collect();

    // Keep only products with at least one valid platform link
    const products = all.filter((p) =>
      PLATFORM_KEYS.some((k) => isValidLink((p as any)[k]))
    );

    if (products.length === 0) {
      throw new Error("No products with valid platform links available");
    }

    // Choose product index (deterministic if seed provided)
    const index = seed
      ? (hash32(seed) % products.length)
      : Math.floor(Math.random() * products.length);

    const product = products[index];

    // Choose a valid platform for the chosen product
    const validPlatforms = PLATFORM_KEYS.filter((key) =>
      isValidLink((product as any)[key])
    );
    const platformKey =
      validPlatforms[Math.floor(Math.random() * validPlatforms.length)] ?? null;
    const platformUrl = platformKey ? (product as any)[platformKey] : null;

    // Return both product and chosen platform (no analytics/stat writes)
    return {
      product,
      platformKey,
      platformUrl,
      seed: seed ?? null,
    };
  },
});
