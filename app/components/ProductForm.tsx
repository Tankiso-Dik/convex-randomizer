"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const productSchema = z.object({
  listingName: z.string().min(1, "Required"),
  officialName: z.string().min(1, "Required"),
  shortDescription: z.string().min(1, "Required"),
  description: z.string().min(1, "Required"),
  instructions: z.string().min(1, "Required"),
  features: z.array(z.string().min(1, "Required")).default([""]),
  categories: z.array(z.string().min(1, "Required")).default([""]),
  tags: z.array(z.string().min(1, "Required")).default([""]),
});

export type ProductFormValues = z.infer<typeof productSchema>;

interface ProductFormProps {
  defaultValues?: ProductFormValues;
  onSubmit: (values: ProductFormValues) => void | Promise<void>;
}

export default function ProductForm({ defaultValues, onSubmit }: ProductFormProps) {
  const { register, control, handleSubmit } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: defaultValues ?? {
      listingName: "",
      officialName: "",
      shortDescription: "",
      description: "",
      instructions: "",
      features: [""],
      categories: [""],
      tags: [""],
    },
  });

  const {
    fields: featureFields,
    append: addFeature,
    remove: removeFeature,
  } = useFieldArray({ control, name: "features" });

  const {
    fields: categoryFields,
    append: addCategory,
    remove: removeCategory,
  } = useFieldArray({ control, name: "categories" });

  const {
    fields: tagFields,
    append: addTag,
    remove: removeTag,
  } = useFieldArray({ control, name: "tags" });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label>Listing Name</label>
        <input {...register("listingName")} className="border" />
      </div>
      <div>
        <label>Official Name</label>
        <input {...register("officialName")} className="border" />
      </div>
      <div>
        <label>Short Description</label>
        <textarea {...register("shortDescription")} className="border" />
      </div>
      <div>
        <label>Description</label>
        <textarea {...register("description")} className="border" />
      </div>
      <div>
        <label>Instructions</label>
        <textarea {...register("instructions")} className="border" />
      </div>

      <div>
        <label>Features</label>
        {featureFields.map((field, index) => (
          <div key={field.id}>
            <input {...register(`features.${index}` as const)} className="border" />
            <button type="button" onClick={() => removeFeature(index)}>Remove</button>
          </div>
        ))}
        <button type="button" onClick={() => addFeature("")}>Add Feature</button>
      </div>

      <div>
        <label>Categories</label>
        {categoryFields.map((field, index) => (
          <div key={field.id}>
            <input {...register(`categories.${index}` as const)} className="border" />
            <button type="button" onClick={() => removeCategory(index)}>Remove</button>
          </div>
        ))}
        <button type="button" onClick={() => addCategory("")}>Add Category</button>
      </div>

      <div>
        <label>Tags</label>
        {tagFields.map((field, index) => (
          <div key={field.id}>
            <input {...register(`tags.${index}` as const)} className="border" />
            <button type="button" onClick={() => removeTag(index)}>Remove</button>
          </div>
        ))}
        <button type="button" onClick={() => addTag("")}>Add Tag</button>
      </div>

      <button type="submit">Save</button>
    </form>
  );
}

