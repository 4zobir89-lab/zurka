import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import type { Product } from '@zurka/shared-types';
import { AddToCartButton } from '@/components/product/AddToCartButton';
import { formatPrice } from '@/lib/utils';
import { Package, Truck, Shield } from 'lucide-react';

async function getProduct(slug: string): Promise<Product | null> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/${slug}`, { next: { revalidate: 600 } });
  if (!res.ok) return null;
  return res.json();
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  const defaultImage = 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=600&auto=format&fit=crop';
  const imageUrl = product.images?.[0] || defaultImage;

  return (
    <>
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-2 bg-white dark:bg-gray-900 rounded-[3rem] p-6 md:p-10 shadow-xl border border-gray-100 dark:border-gray-800">
          
          {/* الصورة */}
          <div className="relative aspect-square overflow-hidden rounded-[2rem] bg-gray-50 dark:bg-gray-800/50 p-6 flex items-center justify-center border border-gray-100 dark:border-gray-800">
            <img src={imageUrl} alt={product.title} className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal" referrerPolicy="no-referrer" />
          </div>

          {/* التفاصيل */}
          <div className="flex flex-col gap-8 justify-center">
            <div>
              <h1 className="text-2xl font-black text-gray-900 dark:text-white sm:text-4xl leading-tight" dir="auto">
                {product.title}
              </h1>
              <div className="mt-6 inline-block bg-indigo-50 dark:bg-indigo-900/30 px-6 py-3 rounded-2xl border border-indigo-100 dark:border-indigo-800/50">
                <p className="text-4xl font-black text-indigo-600 dark:text-indigo-400">
                  {formatPrice(product.sellingPrice, product.currency)}
                </p>
              </div>
            </div>

            {/* مميزات الثقة */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { icon: Truck,   label: `شحن في ~${product.shippingDays} يوم` },
                { icon: Shield,  label: 'دفع مشفر وآمن' },
                { icon: Package, label: 'توصيل عالمي' },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex flex-col items-center justify-center gap-2 rounded-2xl bg-gray-50 dark:bg-gray-800/50 p-4 text-center border border-gray-100 dark:border-gray-700/50 transition-transform hover:scale-105">
                  <Icon className="h-7 w-7 text-indigo-500 dark:text-indigo-400" />
                  <span className="text-xs font-bold text-gray-700 dark:text-gray-300">{label}</span>
                </div>
              ))}
            </div>

            {/* أزرار الشراء */}
            <div className="flex items-center gap-4 bg-gray-50 dark:bg-gray-800/30 p-4 rounded-3xl border border-gray-100 dark:border-gray-800">
              <div className="flex-1 transform transition-transform hover:scale-[1.02]">
                <AddToCartButton product={product} />
              </div>
              <div className="px-4 text-center">
                <span className="block text-sm font-black text-gray-900 dark:text-white">{product.stock}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400 font-bold">قطعة متوفرة</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
