export type Product = {
  id: number;
  name: string;
  price: number;
  category: string;
  rating: number;
  imgUrl: string;
  originalPrice?: number;
  brand?: string;
  badge?: string;
  stock?: number;
  description?: string;
  features?: string[];
  specs?: Record<string, string | undefined>;
  gallery?: string[];
};

