"use client";

import React from "react";
import { Product } from "@/lib/types/product";
import { formatRupiah } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export default function ProductList({
  items,
  onEdit,
  onDelete,
}: {
  items: Product[];
  onEdit: (p: Product) => void;
  onDelete: (id: string) => void;
}) {
  if (!items.length)
    return (
      <div className="text-muted-foreground p-4 text-sm">No products yet.</div>
    );

  return (
    <div className="bg-card overflow-x-auto rounded-md border shadow-sm">
      <table className="w-full border-collapse text-sm">
        <thead className="bg-muted/50">
          <tr>
            <th className="border-b p-2 text-left font-medium">Name</th>
            <th className="border-b p-2 text-left font-medium">Price</th>
            <th className="border-b p-2 text-left font-medium">Category</th>
            <th className="border-b p-2 text-center font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((p) => (
            <tr key={p.id} className="even:bg-muted/20">
              <td className="border-b p-2">{p.name}</td>
              <td className="border-b p-2">{formatRupiah(p.price)}</td>
              <td className="border-b p-2">{p.category ?? "-"}</td>
              <td className="border-b p-2 text-center">
                <div className="flex justify-center gap-2">
                  <Button size="sm" variant="outline" onClick={() => onEdit(p)}>
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => {
                      if (!confirm("Delete product?")) return;
                      onDelete(p.id);
                    }}
                  >
                    Delete
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
