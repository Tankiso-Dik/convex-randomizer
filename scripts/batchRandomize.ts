import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api.js";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const convex = new ConvexHttpClient(process.env.CONVEX_URL!);

const PLATFORM_KEYS = [
  { key: "gumroadUrl", label: "gumroad" },
  { key: "etsyUrl", label: "etsy" },
  { key: "creativeMarketUrl", label: "creativeMarket" },
  { key: "notionUrl", label: "notion" },
  { key: "notionery", label: "notionery" },
  { key: "notionEverything", label: "notionEverything" },
  { key: "prototion", label: "prototion" },
  { key: "notionLand", label: "notionLand" },
];

async function main() {
  const products = await convex.query(api.products.get);
  if (products.length === 0) {
    console.log("No products found.");
    return;
  }

  const logs: string[] = [];
  const selectedIndices = new Set<number>();

  while (selectedIndices.size < 20 && selectedIndices.size < products.length) {
    const randomIndex = Math.floor(Math.random() * products.length);
    selectedIndices.add(randomIndex);
  }

  const results = Array.from(selectedIndices).map((index) => {
    const product = products[index];
    const validPlatforms = PLATFORM_KEYS
      .filter(({ key }) => product[key] && product[key] !== "N/A")
      .map(({ key, label }) => ({
        platform: label,
        url: product[key],
      }));

    if (validPlatforms.length > 0) {
      const selected = validPlatforms[Math.floor(Math.random() * validPlatforms.length)];
      product.selectedPlatform = selected.platform;
      product.selectedUrl = selected.url;
    } else {
      product.selectedPlatform = "N/A";
      product.selectedUrl = "";
    }

    logs.push(
      `Timestamp: ${new Date().toISOString()}, ID: ${product._id}, Platform: ${product.selectedPlatform}`
    );

    return product;
  });

  console.log(JSON.stringify(results, null, 2));

  // Keep only last 20 logs
  const newLogData = logs.slice(-20).join("\n") + "\n";
  fs.writeFileSync(path.join(process.cwd(), "logs.txt"), newLogData);
}

main().catch(console.error);
