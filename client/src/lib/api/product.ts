import { fetcher } from "./default";
import { Product } from "../types/product";

export async function getProducts(): Promise<Product[]> {
  return fetcher<Product[]>("/products");
}

export async function getProduct(id: string): Promise<Product> {
  return fetcher<Product>(`/products/${id}`);
}

export type CreateProductDto = {
  name: string;
  price: number;
  category?: string;
};

export async function createProduct(data: CreateProductDto): Promise<Product> {
  return fetcher<Product>("/products", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export type UpdateProductDto = Partial<CreateProductDto>;

export async function updateProduct(
  id: string,
  data: UpdateProductDto,
): Promise<Product> {
  return fetcher<Product>(`/products/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteProduct(id: string): Promise<void> {
  await fetcher(`/products/${id}`, { method: "DELETE" });
}
