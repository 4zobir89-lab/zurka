'use client';
import { useCartStore } from '@/lib/stores/cart.store';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, CheckCircle2, Lock, MapPin, User, Phone, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { api } from '@/lib/api.client';
import Link from 'next/link';

export default function CheckoutPage() {
  const { items, clearCart } = useCartStore();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [formData, setFormData] = useState({ name: '', phone: '', city: '', address: '' });

  const validItems = items.filter(item => !isNaN(Number(item.price)) && item.title);
  const cartTotal = validItems.reduce((sum: number, item: any) => sum + (Number(item.price) * Number(item.quantity)), 0);

  useEffect(() => {
    setMounted(true);
    if (items.length === 0) router.push('/');
  }, [items, router]);

  if (!mounted || items.length === 0) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/api/orders', { shipping: formData, items: validItems });
      clearCart();
      toast.success('تم استلام طلبك بنجاح! 🎉');
      router.push('/account/orders');
    } catch (error) {
      toast.error('حدث خطأ أثناء تأكيد الطلب. تأكد من اتصالك.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-6xl mx-auto px-4 py-8 md:py-12 animate-fade-in bg-gray-50/50 dark:bg-gray-950 min-h-screen">
      
      {/* رأس صفحة الدفع الفخم */}
      <div className="flex flex-col items-center text-center mb-10">
        <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-500 rounded-full flex items-center justify-center mb-4 shadow-sm">
          <Lock className="w-8 h-8" />
        </div>
        <h1 className="text-3xl md:text-4xl font-black mb-2 dark:text-white">إتمام الطلب بأمان</h1>
        <p className="text-gray-500 font-bold">بوابة دفع مشفرة وحماية كاملة لبياناتك</p>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        
        {/* العمود الأول: نموذج البيانات (مظهر كروت منفصلة) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white dark:bg-gray-900 p-6 md:p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm">
            <h2 className="text-xl font-black mb-6 flex items-center gap-3">
              <div className="bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 w-8 h-8 rounded-full flex items-center justify-center text-sm">1</div>
              معلومات المستلم
            </h2>
            <form id="checkout-form" onSubmit={handleSubmit} className="space-y-5">
              <div className="relative">
                <User className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-gray-50 dark:bg-gray-800 border-2 border-transparent focus:border-indigo-500 rounded-2xl py-4 pr-12 pl-4 font-bold outline-none transition-colors" placeholder="الاسم الكامل (كما في الهوية)" />
              </div>
              <div className="relative">
                <Phone className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input required type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full bg-gray-50 dark:bg-gray-800 border-2 border-transparent focus:border-indigo-500 rounded-2xl py-4 pr-12 pl-4 font-bold outline-none text-left transition-colors" placeholder="رقم الهاتف للتواصل" dir="ltr" />
              </div>
            </form>
          </div>

          <div className="bg-white dark:bg-gray-900 p-6 md:p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm">
            <h2 className="text-xl font-black mb-6 flex items-center gap-3">
              <div className="bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 w-8 h-8 rounded-full flex items-center justify-center text-sm">2</div>
              عنوان التوصيل
            </h2>
            <div className="space-y-5">
              <div className="relative">
                <MapPin className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input form="checkout-form" required type="text" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} className="w-full bg-gray-50 dark:bg-gray-800 border-2 border-transparent focus:border-indigo-500 rounded-2xl py-4 pr-12 pl-4 font-bold outline-none transition-colors" placeholder="المدينة (مثال: صنعاء)" />
              </div>
              <textarea form="checkout-form" required value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full bg-gray-50 dark:bg-gray-800 border-2 border-transparent focus:border-indigo-500 rounded-2xl p-4 font-bold outline-none resize-none transition-colors" placeholder="العنوان بالتفصيل (الحي، الشارع، أقرب معلم للمنزل...)" rows={4} />
            </div>
          </div>
        </div>

        {/* العمود الثاني: ملخص الفاتورة (مظهر فاتورة أنيق - Sticky) */}
        <div className="lg:col-span-5">
          <div className="bg-white dark:bg-gray-900 p-6 md:p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] sticky top-24">
            <h2 className="text-xl font-black mb-6 border-b border-gray-100 dark:border-gray-800 pb-4">مراجعة الفاتورة</h2>
            
            <div className="space-y-4 mb-6 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
              {validItems.map((item: any, idx: number) => (
                <div key={`chk-${item.productId}-${idx}`} className="flex justify-between items-center bg-gray-50 dark:bg-gray-800/50 p-3 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-100 dark:border-gray-700 shrink-0">
                       <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <p className="font-bold text-sm line-clamp-1 dark:text-white max-w-[150px]">{item.title}</p>
                      <p className="text-xs text-gray-500 mt-1">الكمية: {item.quantity}</p>
                    </div>
                  </div>
                  <span className="font-black text-sm whitespace-nowrap">{(Number(item.price) * Number(item.quantity)).toFixed(2)} SAR</span>
                </div>
              ))}
            </div>

            <div className="bg-gray-50 dark:bg-gray-800/50 p-5 rounded-2xl mb-6">
               <div className="flex justify-between items-center mb-2 text-sm font-bold text-gray-500">
                 <span>المجموع الفرعي:</span>
                 <span>{cartTotal.toFixed(2)} SAR</span>
               </div>
               <div className="flex justify-between items-center mb-4 text-sm font-bold text-emerald-500 border-b border-gray-200 dark:border-gray-700 pb-4">
                 <span>تكلفة الشحن:</span>
                 <span>مجاني</span>
               </div>
               <div className="flex justify-between items-end">
                 <span className="font-black text-lg">الإجمالي النهائي:</span>
                 <div className="text-left">
                   <span className="text-3xl font-black text-indigo-600 block">{cartTotal.toFixed(2)} <span className="text-lg">SAR</span></span>
                   <span className="text-sm font-bold text-gray-500 block text-right mt-1">≈ {(cartTotal * 140).toLocaleString()} YER</span>
                 </div>
               </div>
            </div>

            <button form="checkout-form" disabled={loading} type="submit" className="w-full bg-gray-900 dark:bg-white dark:text-gray-900 hover:bg-indigo-600 dark:hover:bg-indigo-600 text-white py-5 rounded-[1.5rem] font-black text-xl flex items-center justify-center gap-3 disabled:opacity-50 transition-all shadow-lg active:scale-95 group">
              {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                <>
                  تأكيد الطلب والدفع <ArrowRight className="w-5 h-5 group-hover:-translate-x-2 transition-transform" />
                </>
              )}
            </button>
            <p className="text-center text-xs text-gray-400 font-bold mt-4 flex items-center justify-center gap-1">
              <Lock className="w-3 h-3" /> بضغطك على زر التأكيد، أنت توافق على شروط الاستخدام.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
