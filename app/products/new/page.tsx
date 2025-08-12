"use client";

import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import ProductForm, { ProductFormValues } from "../../components/ProductForm";

export default function NewProductPage() {
  const router = useRouter();
  const upsert = useMutation(api.products.upsert);

  const handleSubmit = async (values: ProductFormValues) => {
    const id = await upsert(values);
    router.push(`/products/${id}`);
  };

  return (
    <div>
      <h1>New Product</h1>
      <ProductForm onSubmit={handleSubmit} />
    </div>
  );
}

