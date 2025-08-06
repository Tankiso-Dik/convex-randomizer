// convex/schema.ts
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  products: defineTable({
    listingName: v.string(),
    officialName: v.string(),
    shortDescription: v.string(),
    description: v.string(),
    instructions: v.string(),

    gumroadUrl: v.string(),
    etsyUrl: v.string(),
    creativeMarketUrl: v.string(),

    features: v.array(v.string()),
    categories: v.array(v.string()),
    tags: v.array(v.string()),

    imagePolished: v.array(v.string()),
    screenshots: v.array(v.string()),
    gifs: v.array(v.string()),
    videoUrls: v.array(v.string()),
  }),
});
