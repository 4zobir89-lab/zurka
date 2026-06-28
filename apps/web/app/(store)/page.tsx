'use client';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api.client';
import { Loader2, ShoppingCart, LayoutGrid, Zap } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { useCartStore } from '@/lib/stores/cart.store';
import { toast } from 'sonner';

export default function HomePage() {
  const { data: categories, isLoading: catsLoading } = useQuery({ queryKey: ['categories'], queryFn: () => api.get<{ data: any[] }>('/api/categories') });
  const { data: products, isLoading: prodsLoading } = useQuery({ queryKey: ['products'], queryFn: () => api.get<{ data: any[] }>('/api/products') });
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const addItem = useCartStore((s) => s.addItem);

  if (catsLoading || prodsLoading) return <div className="flex justify-center items-center h-[60vh]"><Loader2 className="animate-spin text-indigo-600 w-12 h-12" /></div>;

  const allProducts = products?.data || [];
  const categoriesList = categories?.data || [];
  const displayedProducts = activeCategory ? allProducts.filter((p: any) => p.categoryId === activeCategory) : allProducts;

  const renderProduct = (product: any, index: number) => {
    const handleQuickAdd = (e: React.MouseEvent) => {
      e.preventDefault();
      const rawPrice = String(product.sellingPrice || product.sourcePriceUsd || '0');
      const cleanPrice = Number(rawPrice.replace(/[^0-9.]/g, '')) || 0;
      const imageUrl = Array.isArray(product.images) && product.images.length > 0 ? product.images[0] : 'https://placehold.co/400';
      
      addItem({
        productId: product.id,
        title: product.titleAr || product.title || 'منتج زوركا',
        price: cleanPrice,
        image: imageUrl,
        quantity: 1
      });
      toast.success('تمت الإضافة للسلة بنجاح 🛒');
    };

    return (
      <Link href={`/product/${product.slug}`} key={`p-${product.id}-${index}`} className="group block bg-white dark:bg-gray-900 rounded-[2rem] p-4 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl transition-all relative overflow-hidden">
        <div className="aspect-square rounded-[1.5rem] overflow-hidden bg-gray-50 dark:bg-gray-800 mb-4 relative">
          <img src={product.images?.[0] || 'https://placehold.co/400'} alt={product.title} className="object-cover w-full h-full group-hover:scale-110 transition duration-500" />
        </div>
        <h3 className="font-bold text-gray-900 dark:text-white line-clamp-2 text-sm mb-2 leading-relaxed">{product.titleAr || product.title}</h3>
        <div className="flex justify-between items-end mt-4">
          <div>
            <span className="text-lg font-black text-indigo-600 block">{product.sellingPrice} {product.currency}</span>
            <span className="text-[10px] text-gray-400 block font-bold">≈ {(parseFloat(product.sellingPrice) * 140).toLocaleString()} ريال يمني</span>
          </div>
          <button onClick={handleQuickAdd} className="bg-gray-50 dark:bg-gray-800 p-3 rounded-[1rem] text-gray-900 dark:text-white hover:bg-indigo-600 hover:text-white transition shadow-sm z-10 relative">
            <ShoppingCart className="w-5 h-5" />
          </button>
        </div>
      </Link>
    );
  };

  return (
    <main className="max-w-7xl mx-auto px-4 py-8 animate-fade-in">
      {/* 🌟 البانر العربي المطور بلمسات هادئة وفخمة 🌟 */}
      <section className="mb-12 relative rounded-[3rem] bg-indigo-600 px-6 py-16 text-white text-center shadow-2xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-90"></div>
        <div className="relative z-10">
          <span className="bg-white/20 px-5 py-2 rounded-full text-sm font-bold mb-6 inline-flex items-center gap-2 backdrop-blur-md border border-white/20">
            <Zap className="w-4 h-4 text-yellow-300 fill-yellow-300" /> عروض حصرية
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-black mb-6 tracking-tight drop-shadow-md">
            متجر <span className="text-yellow-400">زوركا</span> العالمي
          </h1>
          <p className="text-lg text-indigo-100 max-w-2xl mx-auto font-semibold leading-relaxed">
            من الصين إلى باب بيتك مباشرة. شحن سريع وتجربة تسوق لا تُنسى تلبي كافة احتياجاتك.
          </p>
        </div>
      </section>

      {/* شريط الأقسام (تصميم Pills أنيق) */}
      <section className="mb-10">
        <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide items-center">
          <button onClick={() => setActiveCategory(null)} className={cn("whitespace-nowrap px-8 py-3.5 rounded-full font-bold transition-all shadow-sm", activeCategory === null ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900" : "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-300 hover:border-indigo-500")}>
            <LayoutGrid className="inline w-4 h-4 ml-2" />تصفح الكل
          </button>
          {categoriesList.map((cat: any) => (
            <button key={cat.id} onClick={() => setActiveCategory(cat.id)} className={cn("whitespace-nowrap px-8 py-3.5 rounded-full font-bold transition-all shadow-sm", activeCategory === cat.id ? "bg-indigo-600 text-white" : "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-300 hover:border-indigo-500")}>
              {cat.nameAr || cat.name}
            </button>
          ))}
        </div>
      </section>

      {/* شبكة المنتجات */}
      {displayedProducts.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
          {displayedProducts.map((p, i) => renderProduct(p, i))}
        </div>
      ) : (
        <div className="text-center py-32 bg-gray-50 dark:bg-gray-900/50 rounded-[3rem] border border-gray-100 dark:border-gray-800">
          <div className="w-20 h-20 bg-gray-200 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
            <LayoutGrid className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2">لا توجد منتجات هنا بعد</h3>
        </div>
      )}
    </main>
  );
}
