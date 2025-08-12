"use client";

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

const PLATFORM_KEYS = [
  "gumroadUrl",
  "etsyUrl",
  "creativeMarketUrl",
  "notionUrl",
  "notionery",
  "notionEverything",
  "prototion",
  "notionLand",
] as const;

export default function RandomizerPage() {
  const randomize = useMutation(api.randomizer.randomize);
  const recent = useQuery(api.randomizer.recentStats, { limit: 20 }) || [];
  const summary = useQuery(api.randomizer.summaryStats) || [];
  const [current, setCurrent] = useState<any>(null);

  const run = async () => {
    const result = await randomize();
    setCurrent(result);
  };

  const platform =
    current &&
    PLATFORM_KEYS.map((k) => (current as any)[k]).find((v) => v != null);

  const score =
    current &&
    (recent.find((r: any) => r.product._id === current._id)?.count || 0);

  return (
    <div>
      <button onClick={run}>Randomize</button>
      {current && (
        <div>
          <h2>{current.listingName}</h2>
          {platform && (
            <p>
              Platform: <a href={platform}>{platform}</a>
            </p>
          )}
          <p>Score (last 20): {score}</p>
        </div>
      )}
      <h3>Health</h3>
      <table>
        <thead>
          <tr>
            <th>Product</th>
            <th>Count</th>
          </tr>
        </thead>
        <tbody>
          {summary.map((s: any) => (
            <tr key={s.product._id}>
              <td>{s.product.listingName}</td>
              <td>{s.count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
