import Link from 'next/link';
import type { Product } from '@zurka/shared-types';
import { formatPrice } from '@/lib/utils';
import { AddToCartButton } from './AddToCartButton';

export function ProductCard({ product }: { product: Product }) {
  const imageUrl = product.images[0] ?? '/placeholder.jpg';

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-3xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1">
      <Link href={`/products/${product.slug}`} className="relative aspect-square overflow-hidden bg-gray-50 dark:bg-gray-800 p-4 flex items-center justify-center">
        {/* نستخدم img العادية لكسر حماية Next.js للصور الخارجية */}
        <img
          src={imageUrl}
          alt={product.title}
          className="object-contain w-full h-full transition-transform duration-500 group-hover:scale-110 drop-shadow-md"
        />
        <div className="absolute top-3 right-3 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-black px-3 py-1 rounded-full backdrop-blur-sm border border-emerald-500/20 z-10">
          شحن ~{product.shippingDays} يوم
        </div>
      </Link>
      <div className="flex flex-1 flex-col gap-3 p-5 z-20 bg-white dark:bg-gray-900">
        <Link href={`/products/${product.slug}`}>
          <h3 className="line-clamp-2 text-sm font-bold text-gray-800 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors leading-relaxed">
            {product.title}
          </h3>
        </Link>
        <div className="mt-auto flex items-center justify-between gap-2 pt-2 border-t border-gray-50 dark:border-gray-800">
          <p className="text-xl font-black text-gray-900 dark:text-white tracking-tight">
            {formatPrice(product.sellingPrice, product.currency)}
          </p>
          <AddToCartButton product={product} />
        </div>
      </div>
    </div>
  );
}
