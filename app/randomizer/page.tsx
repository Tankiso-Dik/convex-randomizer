"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
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
  const [current, setCurrent] = useState<any>(null);

  const run = async () => {
    const result = await randomize();
    setCurrent(result);
  };

  const platform =
    current &&
    PLATFORM_KEYS.map((k) => (current as any)[k]).find((v) => v != null);

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
        </div>
      )}
    </div>
  );
}
