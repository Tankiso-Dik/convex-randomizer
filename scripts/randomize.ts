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

  const randomIndex = Math.floor(Math.random() * products.length);
  const product = products[randomIndex];

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

  console.log(JSON.stringify(product, null, 2));

  // Load existing logs and truncate
  const logPath = path.join(process.cwd(), "logs.txt");
  let existingLogs = "";

  try {
    existingLogs = fs.readFileSync(logPath, "utf-8");
  } catch {
    existingLogs = "";
  }

  const logLines = existingLogs.trim().split("\n").filter(Boolean);
  const newLog = `Timestamp: ${new Date().toISOString()}, ID: ${product._id}, Platform: ${product.selectedPlatform}`;
  const updatedLogs = [...logLines.slice(-19), newLog].join("\n") + "\n";

  fs.writeFileSync(logPath, updatedLogs);
}

main().catch(console.error);
