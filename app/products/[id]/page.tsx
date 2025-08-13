"use client";

import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "../../../lib/convexClient";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import ProductForm, { ProductFormValues } from "../../components/ProductForm";

interface Params {
  id: string;
}

export default function EditProductPage({ params }: { params: Params }) {
  const router = useRouter();
  const id = params.id as Id<"products">;
  const product = useQuery(api.products.get, { id });
  const update = useMutation(api.products.update);
  const remove = useMutation(api.products.remove);
  const create = useMutation(api.products.create);

  if (product === undefined) return <div>Loading...</div>;
  if (product === null) return <div>Not found</div>;

  const handleSubmit = async (values: ProductFormValues) => {
    await update({ id, patch: { ...values, media: values.media ?? [] } });
    router.push(`/products/${id}`);
  };

  const handleDelete = async () => {
    await remove({ id });
    router.push("/");
  };

  const handleClone = async () => {
    const { _id, _creationTime, ...data } = product!;
    const newId = await create({ ...data });
    router.push(`/products/${newId}`);
  };

  return (
    <div>
      <h1>Edit Product</h1>
      <ProductForm defaultValues={product} onSubmit={handleSubmit} />
      <button onClick={handleDelete}>Delete</button>
      <button className="border px-2" onClick={handleClone}>
        Clone
      </button>
    </div>
  );
}
