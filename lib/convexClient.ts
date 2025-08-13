import { ReactNode, createElement } from "react";
import { ConvexProvider, ConvexReactClient } from "convex/react";

const url = process.env.NEXT_PUBLIC_CONVEX_URL;
if (!url) {
  throw new Error(
    "NEXT_PUBLIC_CONVEX_URL is not set. Rebuild with it defined."
  );
}

const client = new ConvexReactClient(url);

export function ConvexRootProvider({ children }: { children: ReactNode }) {
  return createElement(ConvexProvider, { client, children });
}

// Re-export hooks for consistent imports across the app
export { useQuery, useMutation, useConvex, useAction } from "convex/react";
