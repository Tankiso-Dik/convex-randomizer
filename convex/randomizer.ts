import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";

export const randomize = mutation({
  args: {},
  handler: async (ctx) => {
    const products = await ctx.db.query("products").collect();
    if (products.length === 0) {
      throw new Error("No products available");
    }
    const product = products[Math.floor(Math.random() * products.length)];
    await ctx.db.insert("randomizerStats", {
      productId: product._id as Id<"products">,
      timestamp: Date.now(),
    });
    return product;
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
