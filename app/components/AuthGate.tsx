"use client";
import { ReactNode, useState, useEffect, FormEvent } from "react";

const PASSWORD = "admin";

export default function AuthGate({ children }: { children?: ReactNode }) {
  const [allowed, setAllowed] = useState(false);
  const [input, setInput] = useState("");

  useEffect(() => {
    if (localStorage.getItem("admin_password") === PASSWORD) {
      setAllowed(true);
    }
  }, []);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (input === PASSWORD) {
      localStorage.setItem("admin_password", input);
      setAllowed(true);
    }
  };

  if (!allowed) {
    return (
      <form onSubmit={submit} className="p-4 space-x-2">
        <input
          type="password"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="border p-1"
        />
        <button type="submit" className="border px-2">
          Enter
        </button>
      </form>
    );
  }

  return <>{children}</>;
}
