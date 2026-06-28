'use client';
import Link from 'next/link';
import { ShoppingCart, Search, PackageOpen, Truck, X, Layers } from 'lucide-react';
import { useCartStore } from '@/lib/stores/cart.store';
import { CartDrawer } from '../cart/CartDrawer';
import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export function Header() {
  const items = useCartStore((s) => s.items);
  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const [mounted, setMounted] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [trackModal, setTrackModal] = useState(false);
  const [trackId, setTrackId] = useState('');
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => setMounted(true), []);

  const isTrackActive = pathname.startsWith('/track') || trackModal;
  const isOrdersActive = pathname.startsWith('/account') && !trackModal;

  const btnClass = (active: boolean) => `flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl text-sm font-black transition-all border ${active ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-600/20' : 'bg-gray-50 dark:bg-gray-900 text-gray-500 border-gray-100 dark:border-gray-800'}`;

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-gray-100 dark:border-gray-800 bg-white/80 dark:bg-gray-950/80 backdrop-blur-2xl">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            <Link href="/" className="flex items-center gap-3 group shrink-0">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg group-hover:rotate-6 transition-transform">
                <Layers className="text-white w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black dark:text-white leading-none">زوركا</span>
                <span className="text-[8px] font-bold text-indigo-500 tracking-[0.4em] uppercase">Global</span>
              </div>
            </Link>

            <div className="hidden md:flex flex-1 max-w-md bg-gray-50 dark:bg-gray-900 rounded-2xl px-4 py-2 border border-gray-100 dark:border-gray-800">
               <Search className="text-gray-400 w-5 h-5 mr-2" />
               <input placeholder="ابحث عن منتجك المفضل..." className="bg-transparent outline-none w-full text-sm font-bold" />
            </div>

            <div className="flex items-center gap-3">
              <button onClick={() => setCartOpen(true)} className="relative w-12 h-12 flex items-center justify-center rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
                <ShoppingCart className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                {mounted && totalItems > 0 && <span className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center animate-bounce">{totalItems}</span>}
              </button>
            </div>
          </div>

          <div className="md:hidden mt-4 space-y-3">
            <div className="flex gap-2 w-full">
              <button onClick={() => setTrackModal(true)} className={btnClass(isTrackActive)}>
                <Truck className="w-5 h-5" /> تتبع شحنتك
              </button>
              <Link href="/account/orders" className={btnClass(isOrdersActive)}>
                <PackageOpen className="w-5 h-5" /> طلباتي
              </Link>
            </div>
          </div>
        </div>
      </header>
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
      
      {trackModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-900 w-full max-w-sm rounded-[2.5rem] p-8 shadow-2xl relative animate-in fade-in zoom-in duration-300">
            <button onClick={() => setTrackModal(false)} className="absolute top-6 left-6 p-2 bg-gray-50 dark:bg-gray-800 rounded-full"><X className="w-4 h-4" /></button>
            <h2 className="text-2xl font-black mb-2">تتبع شحنتك</h2>
            <p className="text-sm text-gray-500 mb-6 font-bold">أدخل رقم الطلب المكون من 10 أرقام</p>
            <input type="text" placeholder="ZRK-XXXX-XXXX" value={trackId} onChange={e => setTrackId(e.target.value)} className="w-full bg-gray-50 dark:bg-gray-800 rounded-2xl p-4 font-black text-center mb-4 border-2 border-transparent focus:border-indigo-600 outline-none" />
            <button onClick={() => { setTrackModal(false); router.push(`/track/${trackId.toUpperCase()}`); }} className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black shadow-lg">بدء التتبع المباشر</button>
          </div>
        </div>
      )}
    </>
  );
}
