"use client";

import React, { useEffect, useState } from "react";
import ProductForm from "@/components/product/form";
import ProductList from "@/components/product/list";
import { Product } from "@/lib/types/product";
import { getProducts, deleteProduct } from "@/lib/api/product";
import { Button } from "@/components/ui/button";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Product | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await getProducts();
      setProducts(data);
    } catch (err) {
      if (err instanceof Error) setError(err.message);
      else setError("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadProducts();
  }, []);

  const handleSave = (product: Product) => {
    setProducts((prev) => {
      const exists = prev.find((p) => p.id === product.id);
      return exists
        ? prev.map((p) => (p.id === product.id ? product : p))
        : [product, ...prev];
    });
    setEditing(null);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Could not delete product";
      alert(message);
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-8 p-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Products</h1>
        <Button variant="outline" size="sm" onClick={() => void loadProducts()}>
          Refresh
        </Button>
      </header>

      <section>
        <h2 className="mb-2 text-lg font-semibold">
          {editing ? "Edit Product" : "Add New Product"}
        </h2>
        <ProductForm
          initial={
            editing
              ? {
                  name: editing.name,
                  price: editing.price,
                  category: editing.category,
                }
              : undefined
          }
          editingId={editing?.id}
          onSaved={handleSave}
          onCancel={() => setEditing(null)}
        />
      </section>

      <section>
        <h2 className="mb-2 text-lg font-semibold">Product List</h2>
        {loading ? (
          <div className="text-muted-foreground text-sm">Loading...</div>
        ) : (
          <ProductList
            items={products}
            onEdit={setEditing}
            onDelete={handleDelete}
          />
        )}
      </section>

      {error && <div className="text-sm text-red-600">{error}</div>}
    </div>
  );
}
