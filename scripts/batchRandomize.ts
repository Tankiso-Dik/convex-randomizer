// scripts/batchRandomize.ts
import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api.js";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const url = process.env.CONVEX_URL;
if (!url || !url.startsWith("https://")) {
  throw new Error("CONVEX_URL is required and must start with https://");
}
const convex = new ConvexHttpClient(url as string);

// --- Types ------------------------------------------------------------------

type PlatformKey =
  | "gumroadUrl"
  | "etsyUrl"
  | "creativeMarketUrl"
  | "notionUrl"
  | "notionery"
  | "notionEverything"
  | "prototion"
  | "notionLand";

type MediaItem = {
  url: string;
  type: "thumbnail" | "screenshot" | "banner" | "video" | "gif" | "icon";
  altText?: string;          // might be missing on legacy data
  sceneDescription?: string; // until migration is complete
};

type Product = {
  _id?: string;
  media?: MediaItem[];
} & {
  [K in PlatformKey]?: string | undefined;
} & Record<string, unknown>;

// ---------------------------------------------------------------------------

const PLATFORM_KEYS = [
  { key: "gumroadUrl", label: "gumroad" },
  { key: "etsyUrl", label: "etsy" },
  { key: "creativeMarketUrl", label: "creativeMarket" },
  { key: "notionUrl", label: "notion" },
  { key: "notionery", label: "notionery" },
  { key: "notionEverything", label: "notionEverything" },
  { key: "prototion", label: "prototion" },
  { key: "notionLand", label: "notionLand" },
] as const satisfies ReadonlyArray<{ key: PlatformKey; label: string }>;

function pickValidPlatform(product: Product) {
  const valid = PLATFORM_KEYS
    .map(({ key, label }) => {
      const url = product[key];
      return url && url !== "N/A" && url.startsWith("https://") ? { platform: label, url } : null;
    })
    .filter(Boolean) as Array<{ platform: string; url: string }>;

  if (valid.length === 0) return null;
  return valid[Math.floor(Math.random() * valid.length)];
}

function warnIfMediaIncomplete(media?: MediaItem[]) {
  if (!Array.isArray(media)) return;
  for (const m of media) {
    if (!m?.altText || !m?.sceneDescription) {
      console.warn(
        "[WARN] Media item missing complements:",
        JSON.stringify({
          url: m?.url,
          type: m?.type,
          altText: m?.altText,
          sceneDescription: m?.sceneDescription,
        })
      );
    }
  }
}

async function main(): Promise<void> {
  const products = (await convex.query(api.products.list)) as Product[];
  if (!products || products.length === 0) {
    console.log("No products found.");
    return;
  }

  // pick up to 20 unique random indices
  const target = Math.min(20, products.length);
  const selected = new Set<number>();
  while (selected.size < target) {
    selected.add(Math.floor(Math.random() * products.length));
  }

  const results: Product[] = [];

  for (const idx of selected) {
    const product: Product = { ...products[idx] };

    // Optional: warn if media complements are missing
    warnIfMediaIncomplete(product.media);

    const selection = pickValidPlatform(product);
    (product as any).selectedPlatform = selection ? selection.platform : "N/A";
    (product as any).selectedUrl = selection ? selection.url : "";

    // Record run for scoring
    await convex.mutation(api.randomizerStats.insert, {
      productId: product._id ?? "unknown",
      platform: (product as any).selectedPlatform,
    });

    results.push(product);
  }

  // Output enriched products
  console.log(JSON.stringify(results, null, 2));
}

main().catch((err) => {
  console.error(err);
  // avoid process.exit() to keep TS/types light without @types/node requirement
});
