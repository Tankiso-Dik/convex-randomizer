import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";

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
    let index: number;
    if (seed) {
      index = hash32(seed) % products.length;
    } else {
      index = Math.floor(Math.random() * products.length);
    }

    const product = products[index];

    // Choose a valid platform for the chosen product
    const validPlatforms = PLATFORM_KEYS.filter((key) =>
      isValidLink((product as any)[key])
    );

    // This should exist by construction, but guard anyway
    const platformKey =
      validPlatforms[Math.floor(Math.random() * validPlatforms.length)] ?? null;

    const platformUrl = platformKey ? (product as any)[platformKey] : null;

    // Lightweight telemetry (safe to keep or remove)
    console.log("Randomizer selection", {
      productId: product._id,
      platformKey,
    });

    // Log pick
    await ctx.db.insert("randomizerStats", {
      productId: product._id as Id<"products">,
      timestamp: Date.now(),
    });

    // Return both product and the chosen platform
    return {
      product,
      platformKey,
      platformUrl,
      seed: seed ?? null,
    };
  },
});

export const recentStats = query({
  args: { limit: v.number() },
  handler: async (ctx, { limit }) => {
    const entries = await ctx.db
      .query("randomizerStats")
      .order("desc")
      .take(limit);
    const counts: Record<string, { count: number; product: any }> = {};
    for (const e of entries) {
      const prod = await ctx.db.get(e.productId);
      if (!prod) continue;
      const key = e.productId as unknown as string;
      if (!counts[key]) counts[key] = { count: 0, product: prod };
      counts[key].count += 1;
    }
    return Object.values(counts);
  },
});

export const summaryStats = query({
  args: {},
  handler: async (ctx) => {
    const entries = await ctx.db.query("randomizerStats").collect();
    const counts: Record<string, { count: number; product: any }> = {};
    for (const e of entries) {
      const prod = await ctx.db.get(e.productId);
      if (!prod) continue;
      const key = e.productId as unknown as string;
      if (!counts[key]) counts[key] = { count: 0, product: prod };
      counts[key].count += 1;
    }
    return Object.values(counts);
  },
});
