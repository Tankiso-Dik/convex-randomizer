"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "convex/react";
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

export default function ProductsPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const products = useQuery(api.products.list, { search, category });

  return (
    <div className="p-4">
      <div className="flex justify-between mb-4">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border p-1"
          />
          <input
            type="text"
            placeholder="Category..."
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border p-1"
          />
        </div>
        <Link href="/products/new" className="border px-2 py-1 rounded">
          New
        </Link>
      </div>
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="border p-2 text-left">Listing Name</th>
            <th className="border p-2 text-left">Official Name</th>
            <th className="border p-2 text-left">Categories</th>
            <th className="border p-2 text-left">Tags</th>
            <th className="border p-2 text-left">Media</th>
            <th className="border p-2 text-left">Platforms</th>
            <th className="border p-2 text-left">Edit</th>
          </tr>
        </thead>
        <tbody>
          {products?.map((p) => {
            const mediaCount = p.media ? p.media.length : 0;
            const platformCount = PLATFORM_KEYS.reduce(
              (count, key) => (p[key] ? count + 1 : count),
              0
            );
            return (
              <tr key={p._id as string}>
                <td className="border p-2">{p.listingName}</td>
                <td className="border p-2">{p.officialName}</td>
                <td className="border p-2">{p.categories?.join(", ")}</td>
                <td className="border p-2">{p.tags?.join(", ")}</td>
                <td className="border p-2">{mediaCount}</td>
                <td className="border p-2">{platformCount}</td>
                <td className="border p-2">
                  <Link href={`/products/${p._id}`}>Edit</Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

