"use client";
import { ReactNode } from "react";
import { useSession, signIn } from "@auth/nextjs";

export default function AuthGate({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  if (status === "loading") return <p>Loading...</p>;
  if (!session) return <button onClick={() => signIn()}>Sign in</button>;
  return <>{children}</>;
}
