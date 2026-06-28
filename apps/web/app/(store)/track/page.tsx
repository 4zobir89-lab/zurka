'use client';
import { useState } from 'react';
import { api } from '@/lib/api.client';
import { Search, Loader2, Package, CheckCircle2, Truck, Box, MapPin } from 'lucide-react';
import { formatPrice, formatDate } from '@/lib/utils';
import { toast } from 'sonner';

export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<any>(null);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderNumber.trim()) return;
    setLoading(true);
    setOrder(null);
    try {
      const data = await api.get(`/api/orders/track/${orderNumber.trim()}`);
      setOrder(data);
      toast.success('تم العثور على الطلب!');
    } catch (err: any) {
      toast.error(err.message || 'لم نتمكن من العثور على طلب بهذا الرقم.');
    } finally {
      setLoading(false);
    }
  };

  // تحديد المرحلة المكتملة بناءً على الحالة
  const getStepLevel = (status: string) => {
    switch (status) {
      case 'pending': return 1;
      case 'paid': return 1;
      case 'processing': return 2;
      case 'shipped': return 3;
      case 'delivered': return 4;
      default: return 1;
    }
  };

  return (
    <main className="min-h-[80vh] flex flex-col items-center py-12 px-4 animate-fade-in-up">
      <div className="w-full max-w-3xl">
        <div className="text-center mb-10">
          <div className="mx-auto w-16 h-16 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mb-4">
            <MapPin className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white">تتبع شحنتك</h1>
          <p className="text-gray-500 mt-2 font-medium">أدخل رقم الطلب (ZRK-...) لمعرفة حالة شحنتك فوراً.</p>
        </div>

        {/* مربع البحث */}
        <form onSubmit={handleTrack} className="flex gap-2 mb-12 bg-white dark:bg-gray-900 p-2 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 relative z-20">
          <div className="relative flex-1">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input type="text" value={orderNumber} onChange={(e) => setOrderNumber(e.target.value)} placeholder="مثال: ZRK-2026-AB320" className="w-full rounded-xl bg-gray-50 dark:bg-gray-800 py-4 pr-12 pl-4 text-left font-mono font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500 text-lg uppercase transition-all" dir="ltr" required />
          </div>
          <button type="submit" disabled={loading} className="rounded-xl bg-indigo-600 px-8 font-black text-white transition hover:bg-indigo-700 disabled:opacity-50 flex items-center justify-center gap-2">
            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'تتبع الآن'}
          </button>
        </form>

        {/* النتيجة والخط الزمني */}
        {order && (
          <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden animate-fade-in-up">
            <div className="p-6 md:p-8 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50 flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500 font-bold mb-1">الطلب رقم</p>
                <p className="font-mono text-2xl font-black text-indigo-600">{order.orderNumber}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500 font-bold mb-1">تاريخ الطلب</p>
                <p className="font-bold text-gray-900 dark:text-white">{formatDate(order.createdAt)}</p>
              </div>
            </div>

            <div className="p-6 md:p-8">
              {/* الخط الزمني */}
              <div className="relative mb-12 mt-4">
                <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-100 dark:bg-gray-800 -translate-y-1/2 z-0 rounded-full"></div>
                <div className="absolute top-1/2 right-0 h-1 bg-emerald-500 -translate-y-1/2 z-0 transition-all duration-1000 ease-in-out rounded-full" style={{ width: `${(getStepLevel(order.status) - 1) * 33.33}%` }}></div>
                
                <div className="relative z-10 flex justify-between">
                  {/* Step 1 */}
                  <div className="flex flex-col items-center gap-2">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center border-4 border-white dark:border-gray-900 transition-colors duration-500 ${getStepLevel(order.status) >= 1 ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30' : 'bg-gray-200 dark:bg-gray-700 text-gray-400'}`}>
                      <Package className="w-5 h-5" />
                    </div>
                    <span className={`text-xs font-bold ${getStepLevel(order.status) >= 1 ? 'text-gray-900 dark:text-white' : 'text-gray-400'}`}>تم التأكيد</span>
                  </div>
                  {/* Step 2 */}
                  <div className="flex flex-col items-center gap-2">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center border-4 border-white dark:border-gray-900 transition-colors duration-500 ${getStepLevel(order.status) >= 2 ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30' : 'bg-gray-200 dark:bg-gray-700 text-gray-400'}`}>
                      <Box className="w-5 h-5" />
                    </div>
                    <span className={`text-xs font-bold ${getStepLevel(order.status) >= 2 ? 'text-gray-900 dark:text-white' : 'text-gray-400'}`}>جاري التجهيز</span>
                  </div>
                  {/* Step 3 */}
                  <div className="flex flex-col items-center gap-2">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center border-4 border-white dark:border-gray-900 transition-colors duration-500 ${getStepLevel(order.status) >= 3 ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30' : 'bg-gray-200 dark:bg-gray-700 text-gray-400'}`}>
                      <Truck className="w-5 h-5" />
                    </div>
                    <span className={`text-xs font-bold ${getStepLevel(order.status) >= 3 ? 'text-gray-900 dark:text-white' : 'text-gray-400'}`}>تم الشحن</span>
                  </div>
                  {/* Step 4 */}
                  <div className="flex flex-col items-center gap-2">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center border-4 border-white dark:border-gray-900 transition-colors duration-500 ${getStepLevel(order.status) >= 4 ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30' : 'bg-gray-200 dark:bg-gray-700 text-gray-400'}`}>
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <span className={`text-xs font-bold ${getStepLevel(order.status) >= 4 ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-400'}`}>تم التوصيل</span>
                  </div>
                </div>
              </div>

              {/* تفاصيل العميل والمنتجات */}
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white mb-4 border-b border-gray-100 dark:border-gray-800 pb-2">بيانات الشحن</h3>
                  <p className="text-gray-600 dark:text-gray-400 font-medium">{order.shippingName}</p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">{order.shippingAddress}, {order.shippingCity}</p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">{order.shippingCountry} | {order.shippingPhone}</p>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white mb-4 border-b border-gray-100 dark:border-gray-800 pb-2">المنتجات (الإجمالي: {formatPrice(order.total, order.currency)})</h3>
                  <div className="space-y-3">
                    {order.items.map((item: any) => (
                      <div key={item.id} className="flex items-center gap-3 bg-gray-50 dark:bg-gray-800/50 p-2 rounded-xl border border-gray-100 dark:border-gray-800">
                        <img src={item.productSnapshot.image || '/placeholder.jpg'} alt="" className="w-12 h-12 rounded-lg object-cover" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{item.productSnapshot.title}</p>
                          <p className="text-xs text-gray-500">الكمية: {item.quantity}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
