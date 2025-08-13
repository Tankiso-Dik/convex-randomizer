import { mutation } from "./_generated/server";

export const randomize = mutation({
  args: {},
  handler: async (ctx) => {
    const products = await ctx.db.query("products").collect();
    if (products.length === 0) {
      throw new Error("No products available");
    }
    const product = products[Math.floor(Math.random() * products.length)];
    return product;
  },
});
