import { Request, Response, NextFunction } from "express";
import { randomUUID } from "crypto";
import { products, Product } from "../utils/types/product.types";
import { isNonEmptyString, isPositiveNumber } from "../utils/validate";

export const listProducts = (req: Request, res: Response) => {
  res.json(products);
};

export const getProduct = (req: Request, res: Response) => {
  const { id } = req.params;
  const p = products.find((x) => x.id === id);
  if (!p) return res.status(404).json({ message: "Product not found" });
  res.json(p);
};

export const createProduct = (req: Request, res: Response) => {
  const { name, price, category } = req.body;

  if (!isNonEmptyString(name)) {
    return res.status(400).json({ message: "Name is required" });
  }
  const priceNum = typeof price === "string" ? Number(price) : price;
  if (!isPositiveNumber(priceNum)) {
    return res
      .status(400)
      .json({ message: "Price must be a non-negative number" });
  }

  const newProduct: Product = {
    id: randomUUID(),
    name: name.trim(),
    price: Number(priceNum),
    category: typeof category === "string" ? category.trim() : undefined,
    createdAt: new Date().toISOString(),
  };

  products.push(newProduct);
  res.status(201).json(newProduct);
};

export const updateProduct = (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, price, category } = req.body;
  const idx = products.findIndex((x) => x.id === id);
  if (idx === -1) return res.status(404).json({ message: "Product not found" });

  if (name !== undefined && !isNonEmptyString(name)) {
    return res
      .status(400)
      .json({ message: "Name (if provided) must be non-empty" });
  }
  if (price !== undefined) {
    const priceNum = typeof price === "string" ? Number(price) : price;
    if (!isPositiveNumber(priceNum)) {
      return res
        .status(400)
        .json({ message: "Price (if provided) must be a non-negative number" });
    }
    products[idx].price = Number(priceNum);
  }

  if (name !== undefined) products[idx].name = name.trim();
  if (category !== undefined)
    products[idx].category = category ? String(category).trim() : undefined;

  products[idx].updatedAt = new Date().toISOString();

  res.json(products[idx]);
};

export const deleteProduct = (req: Request, res: Response) => {
  const { id } = req.params;
  const idx = products.findIndex((x) => x.id === id);
  if (idx === -1) return res.status(404).json({ message: "Product not found" });
  const [deleted] = products.splice(idx, 1);
  res.json({ message: "Deleted", product: deleted });
};
