export type ProductVariantOption = {
  label: string;
  value: string;
  inStock: boolean;
  priceDelta?: number;
};

export type ProductVariant = {
  type: 'size' | 'color' | 'storage';
  options: ProductVariantOption[];
};

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
  variants?: ProductVariant[];
};
