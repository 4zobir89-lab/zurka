'use client';
import { X, Trash2, Plus, Minus, ShoppingCart, ArrowRight } from 'lucide-react';
import { useCartStore } from '@/lib/stores/cart.store';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export function CartDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { items, removeItem, updateQuantity, totalAmount } = useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white dark:bg-gray-950 h-full shadow-2xl flex flex-col animate-fade-in">
        
        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50">
          <h2 className="text-xl font-black flex items-center gap-3"><ShoppingCart className="w-6 h-6 text-indigo-600" />سلة المشتريات</h2>
          <button onClick={onClose} className="p-2 bg-white dark:bg-gray-800 hover:bg-red-50 rounded-full transition shadow-sm"><X className="w-5 h-5" /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {!mounted || items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 space-y-4">
              <ShoppingCart className="w-16 h-16 opacity-50" />
              <p className="font-black text-lg">سلتك فارغة حالياً</p>
            </div>
          ) : (
            <ul className="space-y-4">
              {items.map((item, idx) => (
                <li key={`${item.productId}-${idx}`} className="flex gap-4 bg-white dark:bg-gray-900 p-4 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm">
                  <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0 border border-gray-100 dark:border-gray-700">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex flex-col flex-1 justify-between py-1">
                    <div className="flex justify-between items-start gap-2">
                      <h3 className="font-bold text-sm line-clamp-2 dark:text-white">{item.title}</h3>
                      <button onClick={() => removeItem(item.productId)} className="text-gray-300 hover:text-red-500 p-1.5 transition"><Trash2 className="w-4 h-4" /></button>
                    </div>
                    <div className="flex justify-between items-end mt-2">
                      <span className="font-black text-indigo-600">{Number(item.price).toFixed(2)} SAR</span>
                      <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-800 rounded-xl p-1 border border-gray-100 dark:border-gray-700">
                        <button onClick={() => updateQuantity(item.productId, item.quantity - 1)} className="p-1 hover:bg-white rounded-lg"><Minus className="w-3 h-3" /></button>
                        <span className="text-sm font-black w-4 text-center">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.productId, item.quantity + 1)} className="p-1 hover:bg-white rounded-lg"><Plus className="w-3 h-3" /></button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {mounted && items.length > 0 && (
          <div className="p-6 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950">
            <div className="flex justify-between items-center mb-6 bg-gray-50 dark:bg-gray-900 p-4 rounded-2xl">
              <span className="text-gray-600 dark:text-gray-400 font-black">الإجمالي:</span>
              <div className="text-left">
                <span className="text-2xl font-black text-indigo-600 block">{totalAmount().toFixed(2)} SAR</span>
                <span className="text-xs text-gray-400 font-bold">≈ {(totalAmount() * 140).toLocaleString()} YER</span>
              </div>
            </div>
            <Link href="/checkout" onClick={onClose} className="w-full bg-indigo-600 text-white py-5 rounded-[1.5rem] font-black text-lg flex items-center justify-center gap-3 hover:bg-indigo-700 transition">
              إتمام الطلب بأمان <ArrowRight className="w-6 h-6" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
