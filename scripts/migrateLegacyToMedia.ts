// scripts/migrateLegacyToMedia.ts
import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api.js";
import dotenv from "dotenv";
import path from "path";

// Load env (same convention as other scripts)
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const url = process.env.CONVEX_URL;
if (!url || !url.startsWith("https://")) {
  throw new Error("CONVEX_URL is required and must start with https://");
}
const convex = new ConvexHttpClient(url as string);

// --- Types ------------------------------------------------------------------

type MediaType = "thumbnail" | "screenshot" | "banner" | "video" | "gif" | "icon";

type MediaItem = {
  url: string;
  type: MediaType;
  altText: string;
  sceneDescription: string;
};

type Product = {
  _id: string;
  listingName?: string;
  officialName?: string;
  media?: MediaItem[];
  imagePolished?: string[]; // legacy
  screenshots?: string[];   // legacy
  gifs?: string[];          // legacy
  videoUrls?: string[];     // legacy
} & Record<string, unknown>;

// ---------------------------------------------------------------------------

function buildPlaceholderAlt(field: string, productName: string): string {
  return `Placeholder alt text (migrated from ${field}) for ${productName}. Replace with meaningful alt text.`;
}

function buildPlaceholderScene(field: string): string {
  return `Placeholder scene description (migrated from ${field}). Replace with a clear, descriptive scene.`;
}

function dedupeByUrl(items: MediaItem[]): MediaItem[] {
  const seen = new Set<string>();
  const result: MediaItem[] = [];
  for (const item of items) {
    if (item?.url && !seen.has(item.url)) {
      seen.add(item.url);
      result.push(item);
    }
  }
  return result;
}

function toMediaItems(urls: string[] | undefined, type: MediaType, sourceField: string, productName: string): MediaItem[] {
  if (!Array.isArray(urls) || urls.length === 0) return [];
  return urls
    .map((u) => `${u}`.trim())
    .filter(Boolean)
    .map((url) => ({
      url,
      type,
      altText: buildPlaceholderAlt(sourceField, productName),
      sceneDescription: buildPlaceholderScene(sourceField),
    }));
}

async function main(): Promise<void> {
  const args = new Set(process.argv.slice(2));
  const apply = args.has("--apply");

  const products = (await convex.query(api.products.list)) as Product[];
  if (!products || products.length === 0) {
    console.log("No products found.");
    return;
  }

  let candidates = 0;
  let migrated = 0;

  for (const product of products) {
    const name = product.officialName || product.listingName || "product";

    const existingMedia = Array.isArray(product.media) ? product.media : [];

    // Build items from legacy fields
    const fromPolished = toMediaItems(product.imagePolished, "thumbnail", "imagePolished", name);
    const fromScreens = toMediaItems(product.screenshots, "screenshot", "screenshots", name);
    const fromGifs = toMediaItems(product.gifs, "gif", "gifs", name);
    const fromVideos = toMediaItems(product.videoUrls, "video", "videoUrls", name);

    const additions = dedupeByUrl([...fromPolished, ...fromScreens, ...fromGifs, ...fromVideos])
      .filter((add) => !existingMedia.some((m) => m?.url === add.url));

    const hasLegacy =
      (product.imagePolished && product.imagePolished.length > 0) ||
      (product.screenshots && product.screenshots.length > 0) ||
      (product.gifs && product.gifs.length > 0) ||
      (product.videoUrls && product.videoUrls.length > 0);

    if (!hasLegacy && additions.length === 0) {
      continue;
    }

    candidates += 1;

    const mergedMedia = dedupeByUrl([...existingMedia, ...additions]);

    if (!apply) {
      console.log(`DRY RUN — would update ${product._id} (${name})`);
      console.log(`  Additions: ${additions.length}, Total after merge: ${mergedMedia.length}`);
      continue;
    }

    await convex.mutation(api.products.upsert, {
      id: product._id as any, // runtime id is fine
      patch: {
        media: mergedMedia,
      },
    });

    migrated += 1;
    console.log(`Updated ${product._id} (${name}) — additions: ${additions.length}, total media: ${mergedMedia.length}`);
  }

  console.log("\nMigration complete.");
  console.log(`Candidates: ${candidates}, Migrated: ${migrated}${apply ? "" : " (dry run)"}`);
  if (!apply) {
    console.log("Run again with --apply to perform updates.");
  }
}

main().catch((err) => {
  console.error(err);
});
