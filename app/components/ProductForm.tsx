"use client";

import { useState, FormEvent } from "react";

export type ProductFormValues = {
  listingName: string;
  officialName: string;
  shortDescription: string;
  description: string;
  instructions: string;
  features: string[];
  categories: string[];
  tags: string[];
};

interface ProductFormProps {
  defaultValues?: ProductFormValues;
  onSubmit: (values: ProductFormValues) => void | Promise<void>;
}

export default function ProductForm({ defaultValues, onSubmit }: ProductFormProps) {
  const [listingName, setListingName] = useState(defaultValues?.listingName ?? "");
  const [officialName, setOfficialName] = useState(defaultValues?.officialName ?? "");
  const [shortDescription, setShortDescription] = useState(defaultValues?.shortDescription ?? "");
  const [description, setDescription] = useState(defaultValues?.description ?? "");
  const [instructions, setInstructions] = useState(defaultValues?.instructions ?? "");
  const [features, setFeatures] = useState((defaultValues?.features || []).join(", "));
  const [categories, setCategories] = useState((defaultValues?.categories || []).join(", "));
  const [tags, setTags] = useState((defaultValues?.tags || []).join(", "));

  const submit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit({
      listingName,
      officialName,
      shortDescription,
      description,
      instructions,
      features: features.split(",").map((s) => s.trim()).filter(Boolean),
      categories: categories.split(",").map((s) => s.trim()).filter(Boolean),
      tags: tags.split(",").map((s) => s.trim()).filter(Boolean),
    });
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <label>Listing Name</label>
        <input value={listingName} onChange={(e) => setListingName(e.target.value)} className="border" />
      </div>
      <div>
        <label>Official Name</label>
        <input value={officialName} onChange={(e) => setOfficialName(e.target.value)} className="border" />
      </div>
      <div>
        <label>Short Description</label>
        <textarea value={shortDescription} onChange={(e) => setShortDescription(e.target.value)} className="border" />
      </div>
      <div>
        <label>Description</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="border" />
      </div>
      <div>
        <label>Instructions</label>
        <textarea value={instructions} onChange={(e) => setInstructions(e.target.value)} className="border" />
      </div>
      <div>
        <label>Features (comma separated)</label>
        <input value={features} onChange={(e) => setFeatures(e.target.value)} className="border" />
      </div>
      <div>
        <label>Categories (comma separated)</label>
        <input value={categories} onChange={(e) => setCategories(e.target.value)} className="border" />
      </div>
      <div>
        <label>Tags (comma separated)</label>
        <input value={tags} onChange={(e) => setTags(e.target.value)} className="border" />
      </div>
      <button type="submit">Save</button>
    </form>
  );
}
