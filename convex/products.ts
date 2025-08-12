import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";

function trimAndOmitEmpty(obj: Record<string, any>) {
  for (const [k, val] of Object.entries(obj)) {
    if (typeof val === "string") {
      const t = val.trim();
      if (t === "" || t === "N/A") delete obj[k];
      else obj[k] = t;
    } else if (Array.isArray(val)) {
      obj[k] = val
        .map((s: any) => (typeof s === "string" ? s.trim() : s))
        .filter((s: any) => s !== "" && s !== "N/A");
    }
  }
}

const platformFields = {
  gumroadUrl: v.optional(v.string()), etsyUrl: v.optional(v.string()),
  creativeMarketUrl: v.optional(v.string()), notionUrl: v.optional(v.string()),
  notionery: v.optional(v.string()), notionEverything: v.optional(v.string()),
  prototion: v.optional(v.string()), notionLand: v.optional(v.string()),
};

const baseArgs = {
  listingName: v.string(),
  officialName: v.string(),
  shortDescription: v.string(),
  description: v.string(),
  instructions: v.string(),
  published: v.boolean(),
  ...platformFields,
  features: v.array(v.string()),
  categories: v.array(v.string()),
  tags: v.array(v.string()),
  media: v.optional(v.array(v.any())),
};

export const list = query({ args: {}, handler: (ctx) => ctx.db.query("products").collect() });

export const get = query({ args: { id: v.id("products") }, handler: (ctx, { id }) => ctx.db.get(id as Id<"products">) });

export const create = mutation({
  args: baseArgs,
  handler: async (ctx, args) => {
    trimAndOmitEmpty(args as any);
    return await ctx.db.insert("products", { ...args, media: args.media ?? [] });
  },
});

export const update = mutation({
  args: {
    id: v.id("products"),
    patch: v.object({
      listingName: v.optional(v.string()),
      officialName: v.optional(v.string()),
      shortDescription: v.optional(v.string()),
      description: v.optional(v.string()),
      instructions: v.optional(v.string()),
      published: v.optional(v.boolean()),
      ...platformFields,
      features: v.optional(v.array(v.string())),
      categories: v.optional(v.array(v.string())),
      tags: v.optional(v.array(v.string())),
      media: v.optional(v.array(v.any())),
    }),
  },
  handler: async (ctx, { id, patch }) => {
    trimAndOmitEmpty(patch as any);
    await ctx.db.patch(
      id as Id<"products">,
      { ...patch, media: patch.media ?? [] } as any
    );
    return id;
  },
});

export const remove = mutation({
  args: { id: v.id("products") },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id as Id<"products">);
    return { ok: true };
  },
});
