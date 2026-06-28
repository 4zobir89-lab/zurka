'use client';
import { ShoppingCart, Check } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { useCartStore } from '@/lib/stores/cart.store';
import { cn } from '@/lib/utils';
import type { Product } from '@zurka/shared-types';

export function AddToCartButton({ product }: { product: Product }) {
  const addItem = useCartStore((s) => s.addItem);
  const[added, setAdded] = useState(false);

  const handleAdd = () => {
    addItem({
      productId: product.id,
      title: product.titleAr || product.title,
      price: parseFloat(product.sellingPrice),
      image: product.images[0] || '',
      quantity: 1,
    });
    setAdded(true);
    toast.success('Added to cart!', { description: product.title.slice(0, 50) });
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <button
      onClick={handleAdd}
      className={cn(
        'flex h-9 w-9 items-center justify-center rounded-full transition',
        added
          ? 'bg-green-500 text-white'
          : 'bg-indigo-600 text-white hover:bg-indigo-700'
      )}
      aria-label="Add to cart"
    >
      {added ? <Check className="h-4 w-4" /> : <ShoppingCart className="h-4 w-4" />}
    </button>
  );
}