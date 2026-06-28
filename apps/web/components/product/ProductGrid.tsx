'use client';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api.client';
import { ProductCard } from './ProductCard';
import type { ProductListResponse } from '@zurka/shared-types';

export function ProductGrid({ page = 1, limit = 20, category, search }: any) {
  const params = new URLSearchParams({ page: String(page), limit: String(limit), ...(category && { category }), ...(search && { search }) });
  
  const { data, isLoading, isError } = useQuery({
    queryKey: ['products', page, limit, category, search],
    queryFn: () => api.get<ProductListResponse>(`/api/products?${params}`),
  });

  if (isLoading) return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => <div key={i} className="aspect-square animate-pulse rounded-3xl bg-gray-200 dark:bg-gray-800" />)}
    </div>
  );

  if (isError) return <div className="flex h-40 items-center justify-center text-red-500 font-bold bg-red-50 dark:bg-red-900/20 rounded-2xl">حدث خطأ في تحميل المنتجات. تأكد من اتصال السيرفر.</div>;
  if (!data?.data.length) return <div className="flex h-40 items-center justify-center text-gray-500 font-bold bg-gray-50 dark:bg-gray-800 rounded-2xl">لا توجد منتجات حالياً.</div>;

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {data.data.map((product) => <ProductCard key={product.id} product={product} />)}
    </div>
  );
}
