import { mutation, query } from "./_generated/server";
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
    // Query only published products
    const all = await ctx.db
      .query("products")
      .withIndex("by_published", (q) => q.eq("published", true))
      .collect();

    // Keep only those with at least one valid platform link
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

    // Optionally record a stat (behind env toggle)
    try {
      // @ts-ignore Convex functions run on Node; process is available
      if (process.env.RANDOMIZER_STATS === "1") {
        await ctx.db.insert("randomizerStats", {
          productId: (product as any)._id,
          timestamp: Date.now(),
        } as any);
      }
    } catch {}

    // Return product + chosen platform
    return {
      product,
      platformKey,
      platformUrl,
      seed: seed ?? null,
    };
  },
});

// Return counts for the most recent N picks with product attached
export const recentCounts = query({
  args: { limit: v.number() },
  handler: async (ctx, { limit }) => {
    const recent = await ctx.db
      .query("randomizerStats")
      .withIndex("by_time")
      .order("desc")
      .take(Math.max(0, Math.min(limit, 500)));

    const counts = new Map<string, number>();
    for (const row of recent as any[]) {
      const id = row.productId.id ?? row.productId; // tolerate shape
      const key = String(id);
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }

    const result: { count: number; product: any }[] = [];
    for (const [key, count] of counts) {
      const product = await ctx.db.get({
        // Convex Id type: coerce using as any; generated types available at call sites
        table: "products",
        id: key as any,
      } as any);
      if (product) result.push({ count, product });
    }

    // sort desc by count
    result.sort((a, b) => b.count - a.count);
    return result;
  },
});
