'use client';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api.client';
import { useParams, useRouter } from 'next/navigation';
import { Loader2, Package, Truck, CheckCircle2, MapPin, ArrowRight, XCircle } from 'lucide-react';
import Link from 'next/link';

export default function TrackOrderPage() {
  const { id } = useParams();
  const router = useRouter();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['order', id],
    queryFn: () => api.get<{ data: any }>(`/api/orders/${id}`),
    retry: false
  });

  if (isLoading) return <div className="flex justify-center items-center h-[60vh]"><Loader2 className="animate-spin text-indigo-600 w-16 h-16" /></div>;

  if (isError || !data?.data) {
    return (
      <div className="max-w-md mx-auto text-center py-32 animate-fade-in px-4">
        <div className="w-24 h-24 bg-red-50 dark:bg-red-900/20 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6"><XCircle className="w-12 h-12" /></div>
        <h1 className="text-3xl font-black mb-4 dark:text-white">الطلب غير موجود</h1>
        <p className="text-gray-500 font-bold mb-8 leading-relaxed">عذراً، لم نتمكن من العثور على أي طلب يحمل الرقم <span className="text-indigo-600" dir="ltr">{id}</span>. تأكد من الرقم وحاول مجدداً.</p>
        <button onClick={() => router.push('/')} className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-full font-black shadow-lg transition-transform hover:scale-105">العودة للمتجر</button>
      </div>
    );
  }

  const order = data.data;

  // خريطة حالات الطلب الأنيقة
  const statuses = {
    'pending': { label: 'قيد المراجعة', icon: Package, color: 'text-yellow-600', bg: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-100' },
    'paid': { label: 'تم الدفع', icon: CheckCircle2, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20 border-blue-100' },
    'processing': { label: 'جاري التجهيز', icon: Package, color: 'text-orange-600', bg: 'bg-orange-50 dark:bg-orange-900/20 border-orange-100' },
    'shipped': { label: 'تم الشحن', icon: Truck, color: 'text-indigo-600', bg: 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-100' },
    'delivered': { label: 'تم التوصيل', icon: MapPin, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100' },
    'cancelled': { label: 'تم الإلغاء', icon: XCircle, color: 'text-red-600', bg: 'bg-red-50 dark:bg-red-900/20 border-red-100' },
  };

  const currentStatus = statuses[order.status as keyof typeof statuses] || statuses['pending'];

  return (
    <main className="max-w-3xl mx-auto px-4 py-12 animate-fade-in">
      <button onClick={() => router.back()} className="inline-flex items-center gap-2 text-gray-500 hover:text-indigo-600 font-bold mb-8 transition">
        <ArrowRight className="w-5 h-5" /> العودة
      </button>
      
      <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-6 md:p-10 shadow-sm border border-gray-100 dark:border-gray-800 mb-8">
        {/* رأس الطلب */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 border-b border-gray-100 dark:border-gray-800 pb-8">
          <div>
            <p className="text-sm text-gray-500 font-bold mb-2">رقم الطلب الخاص بك</p>
            <h1 className="text-3xl font-black text-gray-900 dark:text-white" dir="ltr">{order.orderNumber}</h1>
          </div>
          <div className={`px-6 py-4 rounded-2xl flex items-center gap-3 font-black border ${currentStatus.bg} ${currentStatus.color}`}>
            <currentStatus.icon className="w-6 h-6" /> {currentStatus.label}
          </div>
        </div>

        {/* المنتجات المطلوبة */}
        <h2 className="text-xl font-black mb-6 flex items-center gap-2"><Package className="w-6 h-6 text-indigo-500" /> المنتجات المطلوبة</h2>
        <div className="space-y-4 mb-10">
          {order.items?.map((item: any, idx: number) => (
            <div key={idx} className="flex items-center gap-5 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-2xl border border-transparent hover:border-gray-200 transition">
              <div className="w-20 h-20 bg-white dark:bg-gray-800 rounded-xl overflow-hidden shrink-0 border border-gray-100 dark:border-gray-700">
                <img src={item.productSnapshot?.image || 'https://placehold.co/400'} alt={item.productSnapshot?.title} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-sm md:text-base line-clamp-1 dark:text-white">{item.productSnapshot?.title}</h3>
                <p className="text-indigo-600 font-black mt-2">{Number(item.unitPrice).toFixed(2)} SAR <span className="text-gray-400 text-xs ml-3 bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded-md">الكمية: {item.quantity}</span></p>
              </div>
            </div>
          ))}
        </div>

        {/* تفاصيل التوصيل والفاتورة */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-indigo-50 dark:bg-indigo-900/10 p-6 rounded-2xl border border-indigo-100 dark:border-indigo-800/30">
            <h2 className="text-lg font-black mb-4 flex items-center gap-2"><Truck className="w-5 h-5 text-indigo-500" /> معلومات التوصيل</h2>
            <div className="space-y-3 text-sm font-bold text-gray-700 dark:text-gray-300">
              <p><span className="text-indigo-400 block text-xs mb-1">المستلم</span> {order.shippingName}</p>
              <p><span className="text-indigo-400 block text-xs mb-1">رقم التواصل</span> <span dir="ltr">{order.shippingPhone}</span></p>
              <p><span className="text-indigo-400 block text-xs mb-1">عنوان التوصيل</span> {order.shippingCity} - {order.shippingAddress}</p>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 flex flex-col justify-center">
            <h2 className="text-lg font-black mb-4">ملخص الفاتورة</h2>
            <div className="flex justify-between items-end border-t border-gray-200 dark:border-gray-700 pt-4 mt-auto">
              <span className="text-gray-500 font-bold">الإجمالي المدفوع:</span>
              <div className="text-left">
                <span className="text-3xl font-black text-indigo-600 block">{Number(order.total).toFixed(2)} SAR</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
