"use client";

import { Suspense, useState } from "react";
import { useMutation, useQuery } from "../../lib/convexClient";
import { useSearchParams } from "next/navigation";
import { api } from "../../convex/_generated/api";

type RandomizeResult = {
  product: any;
  platformKey: string | null;
  platformUrl: string | null;
  seed: string | null;
};

function RandomizerContent() {
  const randomize = useMutation(api.randomizer.randomize);
  const recent = useQuery(api.randomizer.recentCounts, { limit: 50 });
  const searchParams = useSearchParams();
  const seed = searchParams.get("seed") ?? undefined;

  const [current, setCurrent] = useState<RandomizeResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const run = async () => {
    try {
      setLoading(true);
      setErr(null);
      const result = await randomize(seed ? { seed } : {});
      setCurrent(result as RandomizeResult);
    } catch (e: any) {
      setErr(e?.message ?? "Randomizer failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 16 }}>
      <button onClick={run} disabled={loading}>
        {loading ? "Picking…" : "Randomize"}
      </button>

      {err && <div style={{ marginTop: 12, color: "crimson" }}>⚠️ {err}</div>}

      {current && (
        <div style={{ marginTop: 16 }}>
          <h2 style={{ margin: 0 }}>
            {current.product?.listingName ?? "Untitled"}
          </h2>

          {current.platformUrl ? (
            <p style={{ marginTop: 8 }}>
              Platform (<code>{current.platformKey}</code>):{" "}
              <a href={current.platformUrl} target="_blank" rel="noreferrer">
                {current.platformUrl}
              </a>
            </p>
          ) : (
            <p style={{ marginTop: 8 }}>No valid platform link found.</p>
          )}

          {current.seed && (
            <p style={{ marginTop: 8 }}>
              Seed: <code>{current.seed}</code>
            </p>
          )}
        </div>
      )}

      <div style={{ marginTop: 24 }}>
        <details>
          <summary>Recent picks (last 50)</summary>
          <div style={{ marginTop: 8 }}>
            {!recent?.length ? (
              <small>No recent stats</small>
            ) : (
              <ul style={{ paddingLeft: 16 }}>
                {recent.slice(0, 10).map((row: any, idx: number) => (
                  <li key={idx}>
                    <strong>{row.count}</strong> — {row.product?.listingName ?? "Untitled"}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </details>
      </div>
    </div>
  );
}

export default function RandomizerPage() {
  return (
    <Suspense fallback={<div style={{ padding: 16 }}>Loading…</div>}>
      <RandomizerContent />
    </Suspense>
  );
}
