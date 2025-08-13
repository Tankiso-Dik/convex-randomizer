import "./globals.css";
import { ReactNode } from "react";
import AuthGate from "./components/AuthGate";
import { ConvexRootProvider } from "../lib/convexClient";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthGate>
          <ConvexRootProvider>{children}</ConvexRootProvider>
        </AuthGate>
      </body>
    </html>
  );
}
