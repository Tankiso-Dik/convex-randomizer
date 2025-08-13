import "./globals.css";
import { ReactNode } from "react";
import { ConvexRootProvider } from "../lib/convexClient";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ConvexRootProvider>{children}</ConvexRootProvider>
      </body>
    </html>
  );
}
