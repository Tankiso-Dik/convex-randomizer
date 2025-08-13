// convex/schema.ts
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  products: defineTable({
    // Core text fields
    listingName: v.string(),
    officialName: v.string(),
    shortDescription: v.string(),
    description: v.string(),
    instructions: v.string(),

    // Platform URLs (optional so you don't need to store "N/A")
    gumroadUrl: v.optional(v.string()),
    etsyUrl: v.optional(v.string()),
    creativeMarketUrl: v.optional(v.string()),
    notionUrl: v.optional(v.string()),
    notionery: v.optional(v.string()),
    notionEverything: v.optional(v.string()),
    prototion: v.optional(v.string()),
    notionLand: v.optional(v.string()),

    // Metadata
    published: v.boolean(),
    features: v.array(v.string()),
    categories: v.array(v.string()),
    tags: v.array(v.string()),

    // Canonical media store (mandatory complements)
    media: v.array(
      v.object({
        url: v.string(),
        type: v.union(
          v.literal("thumbnail"),
          v.literal("screenshot"),
          v.literal("banner"),
          v.literal("video"),
          v.literal("gif"),
          v.literal("icon")
        ),
        altText: v.string(),
        sceneDescription: v.string(),
      })
    ),

    // Legacy arrays (for migration only; remove after backfill)
    imagePolished: v.optional(v.array(v.string())),
    screenshots: v.optional(v.array(v.string())),
    gifs: v.optional(v.array(v.string())),
    videoUrls: v.optional(v.array(v.string())),
  })
    // Minimal useful indexes (tune later as real filters emerge)
    .index("by_published", ["published"])
    .index("by_gumroadUrl", ["gumroadUrl"])
    .index("by_etsyUrl", ["etsyUrl"])
    .index("by_creativeMarketUrl", ["creativeMarketUrl"])
    .index("by_notionUrl", ["notionUrl"])
    .index("by_notionery", ["notionery"])
    .index("by_notionEverything", ["notionEverything"])
    .index("by_prototion", ["prototion"])
    .index("by_notionLand", ["notionLand"]),

  randomizerStats: defineTable({
    productId: v.id("products"),
    timestamp: v.number(),
  })
    .index("by_product", ["productId"]) 
    .index("by_time", ["timestamp"]),
});
