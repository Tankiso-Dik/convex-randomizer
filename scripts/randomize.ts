import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api.js";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const convex = new ConvexHttpClient(process.env.CONVEX_URL!)

async function main() {
  const products = await convex.query(api.products.get);
  if (products.length === 0) {
    console.log("No products found.");
    return;
  }

  const randomIndex = Math.floor(Math.random() * products.length);
  const randomProduct = products[randomIndex];

  const platforms = [];
  if (randomProduct.gumroadUrl) {
    platforms.push({ platform: "gumroad", url: randomProduct.gumroadUrl });
  }
  if (randomProduct.etsyUrl) {
    platforms.push({ platform: "etsy", url: randomProduct.etsyUrl });
  }
  if (randomProduct.creativeMarketUrl) {
    platforms.push({ platform: "creativeMarket", url: randomProduct.creativeMarketUrl });
  }

  if (platforms.length > 0) {
    const randomPlatformIndex = Math.floor(Math.random() * platforms.length);
    const selected = platforms[randomPlatformIndex];
    randomProduct.selectedPlatform = selected.platform;
    randomProduct.selectedUrl = selected.url;
  }

  console.log(JSON.stringify(randomProduct, null, 2));

  // Log to file
  const logEntry = `Timestamp: ${new Date().toISOString()}, ID: ${randomProduct._id}, Platform: ${randomProduct.selectedPlatform}\n`;
  fs.appendFileSync(path.join(process.cwd(), "logs.txt"), logEntry);
}

main().catch(console.error);
