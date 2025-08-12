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
  const product = await client.mutation(api.randomizer.randomize, {});
  const { selectedPlatform, selectedUrl } = pickPlatform(product);
  const enriched = { ...product, selectedPlatform, selectedUrl };
  console.log(JSON.stringify(enriched, null, 2));

  const logsPath = path.join(process.cwd(), "logs.txt");
  const timestamp = new Date().toISOString();
  const line = `${timestamp}, ${product._id}, ${selectedPlatform}\n`;
  let existing: string[] = [];
  try {
    existing = fs.readFileSync(logsPath, "utf8").trim().split("\n").filter(Boolean);
  } catch {}
  existing.push(line.trim());
  const last20 = existing.slice(-20);
  fs.writeFileSync(logsPath, last20.join("\n") + "\n");
})();

