"use client";

import React, { useState, useEffect } from "react";
import {
  createProduct,
  updateProduct,
  CreateProductDto,
} from "@/lib/api/product";
import { Product } from "@/lib/types/product";
import { Button } from "@/components/ui/button";

type Props = {
  initial?: { name: string; price: number | ""; category?: string };
  onCancel?: () => void;
  onSaved: (product: Product) => void;
  editingId?: string | null;
};

export default function ProductForm({
  initial,
  onCancel,
  onSaved,
  editingId,
}: Props) {
  const [name, setName] = useState(initial?.name ?? "");
  const [price, setPrice] = useState<string | number>(initial?.price ?? "");
  const [category, setCategory] = useState(initial?.category ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setName(initial?.name ?? "");
    setPrice(initial?.price ?? "");
    setCategory(initial?.category ?? "");
  }, [initial]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Name is required");
      return;
    }
    const priceNum = Number(price);
    if (!Number.isFinite(priceNum) || priceNum < 0) {
      setError("Price must be a non-negative number");
      return;
    }

    const payload: CreateProductDto = {
      name: name.trim(),
      price: priceNum,
      category: category?.trim() || undefined,
    };

    try {
      setLoading(true);
      const product = editingId
        ? await updateProduct(editingId, payload)
        : await createProduct(payload);
      onSaved(product);

      if (!editingId) {
        setName("");
        setPrice("");
        setCategory("");
      }
    } catch (err) {
      if (err instanceof Error) setError(err.message);
      else setError("An unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-card space-y-4 rounded-md border p-4 shadow-sm"
    >
      {error && <div className="text-destructive text-sm">{error}</div>}

      <div className="grid gap-2">
        <label className="text-sm font-medium">Name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border-input bg-background focus-visible:ring-ring w-full rounded-md border p-2 text-sm focus-visible:ring-2 focus-visible:outline-none"
        />
      </div>

      <div className="grid gap-2">
        <label className="text-sm font-medium">Price</label>
        <input
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="border-input bg-background focus-visible:ring-ring w-full rounded-md border p-2 text-sm focus-visible:ring-2 focus-visible:outline-none"
          inputMode="decimal"
        />
      </div>

      <div className="grid gap-2">
        <label className="text-sm font-medium">Category</label>
        <input
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border-input bg-background focus-visible:ring-ring w-full rounded-md border p-2 text-sm focus-visible:ring-2 focus-visible:outline-none"
        />
      </div>

      <div className="flex gap-2 pt-2">
        <Button type="submit" disabled={loading}>
          {editingId ? "Save" : "Add"}
        </Button>
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            disabled={loading}
            onClick={onCancel}
          >
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
