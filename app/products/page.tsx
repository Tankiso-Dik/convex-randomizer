"use client";

import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export default function ProductsPage() {
  const products = useQuery(api.products.list);
  return (
    <div className="p-4">
      <div className="flex justify-end mb-4">
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
            <th className="border p-2 text-left">Edit</th>
          </tr>
        </thead>
        <tbody>
          {products?.map((p) => (
            <tr key={p._id as string}>
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
