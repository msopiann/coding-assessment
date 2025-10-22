export type Product = {
  id: string;
  name: string;
  price: number;
  category?: string;
  createdAt: string;
  updatedAt?: string;
};

export const products: Product[] = [
  {
    id: "1",
    name: "Sample Product A",
    price: 100_000,
    category: "General",
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Sample Product B",
    price: 100_000,
    category: "Featured",
    createdAt: new Date().toISOString(),
  },
];
