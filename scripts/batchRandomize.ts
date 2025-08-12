import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const client = new ConvexHttpClient(process.env.CONVEX_URL!);

function pickPlatform(product: any) {
  const platforms: Record<string, string> = {
    gumroadUrl: product.gumroadUrl,
    etsyUrl: product.etsyUrl,
    creativeMarketUrl: product.creativeMarketUrl,
    notionUrl: product.notionUrl,
    notionery: product.notionery,
    notionEverything: product.notionEverything,
    prototion: product.prototion,
    notionLand: product.notionLand,
  };
  const entries = Object.entries(platforms).filter(([, url]) =>
    typeof url === "string" && url.trim() !== "" && url !== "N/A"
  );
  if (entries.length === 0) return { selectedPlatform: "N/A", selectedUrl: "" };
  const [platform, url] = entries[Math.floor(Math.random() * entries.length)];
  return { selectedPlatform: platform, selectedUrl: url };
}

(async () => {
  const products: any[] = [];
  const seen = new Set<string>();
  while (products.length < 20) {
    const product = await client.mutation(api.randomizer.randomize, {});
    const id = product._id as string;
    if (seen.has(id)) continue;
    seen.add(id);
    products.push(product);
  }

  const enriched = products.map((p) => ({ ...p, ...pickPlatform(p) }));
  console.log(JSON.stringify(enriched, null, 2));

  const logsPath = path.join(process.cwd(), "logs.txt");
  const timestamp = new Date().toISOString();
  const lines = enriched.map((p) => `${timestamp}, ${p._id}, ${p.selectedPlatform}`);
  fs.writeFileSync(logsPath, lines.join("\n") + "\n");
})();

