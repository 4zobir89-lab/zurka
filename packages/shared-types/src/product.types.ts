export interface Product {
  id: string;
  sourceId: string;
  sourcePlatform: 'aliexpress';
  title: string;
  titleAr: string | null;
  slug: string;
  description: string | null;
  images: string[];
  categoryId: string | null;
  sourcePriceUsd: string;
  sellingPrice: string;
  currency: string;
  shippingDays: number;
  stock: number;
  isActive: boolean;
  syncedAt: string;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  nameAr: string | null;
  slug: string;
  parentId: string | null;
}

export interface ProductListResponse {
  data: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}