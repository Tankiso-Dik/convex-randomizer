// convex/products.ts
import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";

// ---- Helpers ---------------------------------------------------------------

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

function isHttpsUrl(value: string) {
  try {
    const u = new URL(value);
    return u.protocol === "https:";
  } catch {
    return false;
  }
}

function assertMediaComplements(
  media: Array<{ url: string; altText: string; sceneDescription: string }>
) {
  if (!Array.isArray(media)) throw new Error("media must be an array");
  for (const m of media) {
    const url = m?.url?.trim();
    const alt = m?.altText?.trim();
    const scene = m?.sceneDescription?.trim();
    if (!url) throw new Error("media.url is required");
    if (!alt) throw new Error("media.altText is required");
    if (!scene) throw new Error("media.sceneDescription is required");
  }
}

function validatePlatforms(patch: Record<string, unknown>) {
  // Prefer leaving platform fields unset over storing 'N/A'.
  for (const key of PLATFORM_KEYS) {
    const raw = patch[key] as string | undefined;
    if (raw == null) continue; // optional
    const val = raw.trim();
    if (val === "" || val === "N/A") {
      delete patch[key]; // Omit the key instead of storing "N/A"
      continue;
    }
    if (!isHttpsUrl(val)) {
      throw new Error(`${key} must be a valid https URL`);
    }
    patch[key] = val; // normalized
  }
}

// ---- Types used by args ----------------------------------------------------

const mediaItemValidator = v.object({
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
});

// ---- Queries ---------------------------------------------------------------

export const get = query({
  // No args; adjust later if you add filters/pagination
  args: {},
  handler: async (ctx) => {
    // Newest first so randomizer “feels fresh” as you add content
    const items = await ctx.db.query("products").order("desc").collect();
    return items;
  },
});

// Optional: small, fast count query
export const count = query({
  args: {},
  handler: async (ctx) => {
    const items = await ctx.db.query("products").collect();
    return items.length;
  },
});

// ---- Mutations -------------------------------------------------------------

export const create = mutation({
  args: {
    listingName: v.string(),
    officialName: v.string(),
    shortDescription: v.string(),
    description: v.string(),
    instructions: v.string(),

    // Optional platform URLs (or "N/A")
    gumroadUrl: v.optional(v.string()),
    etsyUrl: v.optional(v.string()),
    creativeMarketUrl: v.optional(v.string()),
    notionUrl: v.optional(v.string()),
    notionery: v.optional(v.string()),
    notionEverything: v.optional(v.string()),
    prototion: v.optional(v.string()),
    notionLand: v.optional(v.string()),

    features: v.array(v.string()),
    categories: v.array(v.string()),
    tags: v.array(v.string()),

    media: v.array(mediaItemValidator),

    // Legacy (optional, for migration)
    imagePolished: v.optional(v.array(v.string())),
    screenshots: v.optional(v.array(v.string())),
    gifs: v.optional(v.array(v.string())),
    videoUrls: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    // Validate complements
    assertMediaComplements(args.media as any);

    // Normalize/validate platform URLs
    const patch: Record<string, unknown> = { ...args };
    validatePlatforms(patch);

    // Trim some core strings
    patch.listingName = (args.listingName || "").trim();
    patch.officialName = (args.officialName || "").trim();
    patch.shortDescription = (args.shortDescription || "").trim();
    patch.description = (args.description || "").trim();
    patch.instructions = (args.instructions || "").trim();

    const id = await ctx.db.insert("products", patch as any);
    return id;
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

      gumroadUrl: v.optional(v.string()),
      etsyUrl: v.optional(v.string()),
      creativeMarketUrl: v.optional(v.string()),
      notionUrl: v.optional(v.string()),
      notionery: v.optional(v.string()),
      notionEverything: v.optional(v.string()),
      prototion: v.optional(v.string()),
      notionLand: v.optional(v.string()),

      features: v.optional(v.array(v.string())),
      categories: v.optional(v.array(v.string())),
      tags: v.optional(v.array(v.string())),

      media: v.optional(v.array(mediaItemValidator)),

      imagePolished: v.optional(v.array(v.string())),
      screenshots: v.optional(v.array(v.string())),
      gifs: v.optional(v.array(v.string())),
      videoUrls: v.optional(v.array(v.string())),
    }),
  },
  handler: async (ctx, { id, patch }) => {
    // Validate complements if media is present
    if (patch.media) assertMediaComplements(patch.media as any);

    // Validate/normalize platform URLs if provided
    validatePlatforms(patch as any);

    // Trim changed core strings if provided
    if (patch.listingName) patch.listingName = patch.listingName.trim();
    if (patch.officialName) patch.officialName = patch.officialName.trim();
    if (patch.shortDescription) patch.shortDescription = patch.shortDescription.trim();
    if (patch.description) patch.description = patch.description.trim();
    if (patch.instructions) patch.instructions = patch.instructions.trim();

    await ctx.db.patch(id as Id<"products">, patch as any);
    return { ok: true };
  },
});

export const getById = query({
  args: { id: v.id("products") },
  handler: async (ctx, { id }) => {
    return await ctx.db.get(id as Id<"products">);
  },
});

export const upsert = mutation({
  args: {
    id: v.optional(v.id("products")),
    listingName: v.string(),
    officialName: v.string(),
    shortDescription: v.string(),
    description: v.string(),
    instructions: v.string(),
    features: v.array(v.string()),
    categories: v.array(v.string()),
    tags: v.array(v.string()),
    gumroadUrl: v.optional(v.string()),
    etsyUrl: v.optional(v.string()),
    creativeMarketUrl: v.optional(v.string()),
    notionUrl: v.optional(v.string()),
    notionery: v.optional(v.string()),
    notionEverything: v.optional(v.string()),
    prototion: v.optional(v.string()),
    notionLand: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    if (args.id) {
      const { id, ...patch } = args;
      await ctx.db.patch(id as Id<"products">, patch);
      return id;
    }
    const { id: _id, ...doc } = args;
    const newId = await ctx.db.insert("products", doc);
    return newId;
  },
});

export const remove = mutation({
  args: { id: v.id("products") },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id as Id<"products">);
    return { ok: true };
  },
});
