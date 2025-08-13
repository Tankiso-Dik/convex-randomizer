import { ConvexReactClient, ConvexProvider, useQuery, useMutation } from "convex/react";

export const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export { ConvexProvider, useQuery, useMutation };
