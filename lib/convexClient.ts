import { ReactNode, createElement } from "react";
import { ConvexProvider, ConvexReactClient } from "convex/react";

const client = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export function ConvexRootProvider({ children }: { children: ReactNode }) {
  return createElement(ConvexProvider, { client, children });
}

