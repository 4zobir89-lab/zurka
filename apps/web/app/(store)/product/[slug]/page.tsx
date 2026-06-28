'use client';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api.client';
import { Loader2, ShoppingCart, ArrowRight, ShieldCheck, Truck, Zap } from 'lucide-react';
import { useCartStore } from '@/lib/stores/cart.store';
import { toast } from 'sonner';
import { useParams, useRouter } from 'next/navigation';

export default function ProductPage() {
  const { slug } = useParams();
  const router = useRouter();
  const addItem = useCartStore((s) => s.addItem);

  const { data: products, isLoading } = useQuery({ queryKey: ['products'], queryFn: () => api.get<{ data: any[] }>('/api/products') });

  if (isLoading) return <div className="flex justify-center items-center h-screen"><Loader2 className="animate-spin text-indigo-600 w-12 h-12" /></div>;
  
  const product = products?.data?.find((p: any) => p.slug === slug);
  if (!product) return <div className="text-center py-40 font-black">المنتج غير موجود</div>;

  // السطر الذي كان يسبب المشكلة - تم مسح الشرطة المائلة الزائدة (Backslash) تماماً
  const imageUrl = product.images?.[0] || 'https://placehold.co/800';

  return (
    <main className="max-w-7xl mx-auto px-4 py-6 md:py-12 animate-fade-in">
      <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-start">
        <div className="relative w-full aspect-square rounded-[2.5rem] overflow-hidden bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 lg:sticky lg:top-28">
           <img src={imageUrl} alt={product.title} className="w-full h-full object-cover" />
           <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full shadow-sm">
             <span className="text-xs font-black text-indigo-600">الأكثر مبيعاً 🔥</span>
           </div>
        </div>
        <div className="flex flex-col py-4">
          <h1 className="text-3xl md:text-5xl font-black text-gray-900 dark:text-white mb-6 leading-tight">
            {product.titleAr || product.title}
          </h1>
          <div className="flex items-center gap-4 mb-8">
            <div className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-black text-2xl">
              {product.sellingPrice} <span className="text-sm">SAR</span>
            </div>
            <div className="text-gray-400 font-bold line-through text-lg">
              {(parseFloat(product.sellingPrice) * 1.4).toFixed(0)} SAR
            </div>
          </div>
          <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800 p-4 rounded-2xl mb-8 flex items-center gap-3">
             <Zap className="w-5 h-5 text-emerald-500 fill-emerald-500" />
             <span className="text-emerald-700 dark:text-emerald-400 font-bold text-sm text-right">وفر 40% اليوم - العرض ينتهي قريباً!</span>
          </div>
          <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed mb-10 font-medium text-right">
            {product.description || 'منتج عالي الجودة مستورد خصيصاً من مصادرنا العالمية لضمان أفضل تجربة تسوق.'}
          </p>
          <button onClick={() => { addItem({ productId: product.id, title: product.titleAr || product.title, price: parseFloat(product.sellingPrice), image: imageUrl, quantity: 1 }); toast.success('تمت الإضافة للسلة 🛒'); }} className="w-full bg-gray-900 dark:bg-white text-white dark:text-black py-6 rounded-[1.5rem] font-black text-xl shadow-2xl hover:scale-[1.02] transition-all active:scale-95 flex items-center justify-center gap-3">
            <ShoppingCart className="w-6 h-6" /> أضف للسلة الآن
          </button>
          <div className="grid grid-cols-3 gap-4 mt-12 border-t border-gray-100 dark:border-gray-800 pt-8">
            {[ {i: Truck, t: 'شحن سريع'}, {i: ShieldCheck, t: 'ضمان جودة'}, {i: Zap, t: 'دفع آمن'} ].map((item, idx) => (
              <div key={idx} className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center"><item.i className="w-6 h-6 text-indigo-500" /></div>
                <span className="text-[10px] font-black text-gray-500">{item.t}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
