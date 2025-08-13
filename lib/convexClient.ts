import { ReactNode, createElement } from "react";
import { ConvexProvider, ConvexReactClient } from "convex/react";

const url = process.env.NEXT_PUBLIC_CONVEX_URL;
if (!url) {
  throw new Error("NEXT_PUBLIC_CONVEX_URL is not set. Check your env and rebuild.");
}

const client = new ConvexReactClient(url);

export function ConvexRootProvider({ children }: { children: ReactNode }) {
  return createElement(ConvexProvider, { client, children });
}
