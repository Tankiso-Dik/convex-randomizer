"use client";

import Link from "next/link";
import { useState, ChangeEvent } from "react";
import { useMutation, useQuery } from "../../lib/convexClient";
import { api } from "../../convex/_generated/api";
import { downloadJson } from "../utils/downloadJson";

export default function ProductsPage() {
  const products = useQuery(api.products.list);
  const seed = useMutation(api.products.seed);
  const [selected, setSelected] = useState<string[]>([]);

  const toggle = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleExportAll = () => {
    downloadJson(products ?? [], "products.json");
  };

  const handleExportSelected = () => {
    const selectedProducts =
      products?.filter((p) => selected.includes(p._id as string)) ?? [];
    downloadJson(selectedProducts, "products.json");
  };

  const handleImport = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    const data = JSON.parse(text);
    if (Array.isArray(data)) {
      await seed({ products: data });
    }
    e.target.value = ""; // reset for subsequent imports
  };

  return (
    <div className="p-4">
      <div className="flex justify-between mb-4">
        <div className="flex gap-2">
          <button
            onClick={handleExportAll}
            disabled={!products?.length}
            className="border px-2 py-1 rounded disabled:opacity-50"
          >
            Export JSON
          </button>
          <button
            onClick={handleExportSelected}
            disabled={selected.length === 0}
            className="border px-2 py-1 rounded disabled:opacity-50"
          >
            Export Selected
          </button>
          <label
            htmlFor="import-json"
            className="border px-2 py-1 rounded cursor-pointer"
          >
            Import JSON
          </label>
          <input
            id="import-json"
            type="file"
            accept="application/json"
            onChange={handleImport}
            className="hidden"
          />
        </div>
        <Link href="/products/new" className="border px-2 py-1 rounded">
          New
        </Link>
      </div>
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="border p-2">
              <span className="sr-only">Select</span>
            </th>
            <th className="border p-2 text-left">Listing Name</th>
            <th className="border p-2 text-left">Official Name</th>
            <th className="border p-2 text-left">Categories</th>
            <th className="border p-2 text-left">Tags</th>
            <th className="border p-2 text-left">Edit</th>
          </tr>
        </thead>
        <tbody>
          {products?.map((p) => (
            <tr key={p._id as string}>
              <td className="border p-2 text-center">
                <input
                  type="checkbox"
                  checked={selected.includes(p._id as string)}
                  onChange={() => toggle(p._id as string)}
                />
              </td>
              <td className="border p-2">{p.listingName}</td>
              <td className="border p-2">{p.officialName}</td>
              <td className="border p-2">{p.categories?.join(", ")}</td>
              <td className="border p-2">{p.tags?.join(", ")}</td>
              <td className="border p-2">
                <Link href={`/products/${p._id}`}>Edit</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
