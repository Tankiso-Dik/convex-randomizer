"use client";

import { useRouter } from "next/navigation";
import { useMutation } from "../../../lib/convexClient";
import { api } from "../../../convex/_generated/api";
import ProductForm, { ProductFormValues } from "../../components/ProductForm";

export default function NewProductPage() {
  const router = useRouter();
  const create = useMutation(api.products.create);

  const handleSubmit = async (values: ProductFormValues) => {
    const id = await create({ ...values, media: values.media ?? [] });
    router.push(`/products/${id}`);
  };

  return (
    <div>
      <h1>New Product</h1>
      <ProductForm onSubmit={handleSubmit} />
    </div>
  );
}
