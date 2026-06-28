'use client';
import { useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api.client';
import { toast } from 'sonner';
import { CreditCard, Lock, ShieldCheck, Loader2 } from 'lucide-react';
import { useCartStore } from '@/lib/stores/cart.store';

export default function PaymentPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const clearCart = useCartStore((s) => s.clearCart);
  
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [loading, setLoading] = useState(false);

  // تنسيق رقم البطاقة تلقائياً بمسافات
  const handleCardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\s/g, '').replace(/[^0-9]/gi, '');
    const formatted = val.match(/.{1,4}/g)?.join(' ') || val;
    setCardNumber(formatted.substring(0, 19));
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // إرسال البطاقة للسيرفر المركزي
      await api.post(`/api/orders/${resolvedParams.id}/pay`, { cardNumber });
      
      // تفريغ السلة بعد نجاح الدفع والانتقال للنجاح
      clearCart();
      toast.success('تمت عملية الدفع بنجاح! 🎉');
      router.push(`/checkout/success?orderId=${resolvedParams.id}`);
    } catch (err: any) {
      toast.error(err.message || 'تم رفض البطاقة');
      setLoading(false);
    }
  };

  return (
    <main className="min-h-[80vh] flex flex-col items-center justify-center px-4 animate-fade-in-up py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mb-4 shadow-inner">
            <Lock className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white">الدفع الآمن</h1>
          <p className="text-gray-500 mt-2 font-medium">بوابة ZURKA Pay مشفرة بتقنية 256-bit SSL</p>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-800 p-8">
          {/* بطاقة عرض تفاعلية */}
          <div className="w-full h-48 bg-gradient-to-tr from-gray-900 to-gray-800 rounded-2xl p-6 text-white mb-8 relative overflow-hidden shadow-2xl flex flex-col justify-between">
            <div className="absolute -right-10 -top-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
            <div className="flex justify-between items-center relative z-10">
              <ShieldCheck className="w-8 h-8 text-emerald-400" />
              <span className="font-black italic text-xl tracking-wider">VISA</span>
            </div>
            <div className="relative z-10">
              <p className="font-mono text-xl tracking-[0.2em] mb-2 text-gray-200 shadow-sm">
                {cardNumber || '•••• •••• •••• ••••'}
              </p>
              <div className="flex justify-between text-xs text-gray-400 font-bold uppercase tracking-wider">
                <span>Card Holder</span>
                <span>Expires</span>
              </div>
              <div className="flex justify-between font-mono text-sm shadow-sm">
                <span>ZURKA CUSTOMER</span>
                <span>{expiry || 'MM/YY'}</span>
              </div>
            </div>
          </div>

          <form onSubmit={handlePayment} className="space-y-5">
            <div className="bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 p-4 rounded-xl text-sm font-bold border border-indigo-100 dark:border-indigo-800/50 mb-6 flex gap-3">
              <span className="text-xl">💡</span>
              <p>للاختبار، استخدم بطاقة الاختبار العالمية:<br/> <code className="bg-white dark:bg-black px-2 py-1 rounded mt-1 inline-block select-all">4242 4242 4242 4242</code></p>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">رقم البطاقة</label>
              <div className="relative">
                <CreditCard className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type="text" value={cardNumber} onChange={handleCardChange} placeholder="4242 4242 4242 4242" className="w-full rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 py-4 pr-12 pl-4 text-left font-mono focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-lg tracking-wider" dir="ltr" required />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">تاريخ الانتهاء</label>
                <input type="text" value={expiry} onChange={(e) => setExpiry(e.target.value)} placeholder="MM/YY" maxLength={5} className="w-full rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 py-4 px-4 text-center font-mono focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-lg" dir="ltr" required />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">رمز CVC</label>
                <input type="password" value={cvc} onChange={(e) => setCvc(e.target.value.replace(/\D/g, ''))} placeholder="•••" maxLength={3} className="w-full rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 py-4 px-4 text-center font-mono focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-lg tracking-widest" dir="ltr" required />
              </div>
            </div>

            <button type="submit" disabled={loading || cardNumber.length < 19} className="w-full rounded-2xl bg-indigo-600 py-4 mt-4 text-lg font-black text-white transition hover:bg-indigo-700 disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/30">
              {loading ? <><Loader2 className="w-6 h-6 animate-spin" /> جاري التحقق من البنك...</> : 'دفع وإتمام الطلب'}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
