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

  const json = JSON.stringify(product, null, 2);

  const copyJson = async () => {
    try {
      await navigator.clipboard.writeText(json);
      alert("Copied JSON to clipboard");
    } catch {}
  };

  const downloadJson = () => {
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ display: "grid", gap: 16, gridTemplateColumns: "1fr", padding: 12 }}>
      <h1>Edit Product</h1>
      <div style={{ display: "grid", gap: 16, gridTemplateColumns: "1fr", alignItems: "start" }}>
        <div>
          <ProductForm defaultValues={product} onSubmit={handleSubmit} />
          <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
            <button onClick={handleDelete}>Delete</button>
            <button className="border px-2" onClick={handleClone}>Clone</button>
          </div>
        </div>

        <div style={{ border: "1px solid #333", borderRadius: 6, padding: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <strong>JSON Preview</strong>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={copyJson}>Copy</button>
              <button onClick={downloadJson}>Download</button>
            </div>
          </div>
          <pre style={{ marginTop: 8, whiteSpace: "pre-wrap", overflowX: "auto" }}>
            {json}
          </pre>
        </div>
      </div>
    </div>
  );
}
