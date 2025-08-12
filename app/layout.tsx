import "./globals.css";
import { ReactNode } from "react";
import AuthGate from "./components/AuthGate";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthGate>{children}</AuthGate>
      </body>
    </html>
  );
}
