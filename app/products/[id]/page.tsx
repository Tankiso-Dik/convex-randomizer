"use client";

import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import ProductForm, { ProductFormValues } from "../../components/ProductForm";

interface Params {
  id: string;
}

export default function EditProductPage({ params }: { params: Params }) {
  const router = useRouter();
  const id = params.id as Id<"products">;
  const product = useQuery(api.products.getById, { id });
  const upsert = useMutation(api.products.upsert);
  const remove = useMutation(api.products.remove);

  if (product === undefined) {
    return <div>Loading...</div>;
  }
  if (product === null) {
    return <div>Not found</div>;
  }

  const handleSubmit = async (values: ProductFormValues) => {
    await upsert({ id, ...values });
    router.push(`/products/${id}`);
  };

  const handleDelete = async () => {
    await remove({ id });
    router.push("/");
  };

  return (
    <div>
      <h1>Edit Product</h1>
      <ProductForm defaultValues={product} onSubmit={handleSubmit} />
      <button onClick={handleDelete}>Delete</button>
    </div>
  );
}

