import "./globals.css";
import { ReactNode } from "react";
import AuthGate from "./components/AuthGate";
import { ConvexProvider, convex } from "../lib/convexClient";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ConvexProvider client={convex}>
          <AuthGate>{children}</AuthGate>
        </ConvexProvider>
      </body>
    </html>
  );
}
