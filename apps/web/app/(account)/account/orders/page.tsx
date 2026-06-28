'use client';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api.client';
import { formatPrice, formatDate } from '@/lib/utils';
import Link from 'next/link';
import type { Order } from '@zurka/shared-types';
import { Package, Clock, CheckCircle, Truck, XCircle } from 'lucide-react';

const getStatusInfo = (status: string) => {
  switch (status) {
    case 'pending': return { label: 'قيد المراجعة', color: 'bg-yellow-100 text-yellow-800', icon: Clock };
    case 'paid': return { label: 'تم الدفع', color: 'bg-blue-100 text-blue-800', icon: CheckCircle };
    case 'processing': return { label: 'جاري التجهيز', color: 'bg-purple-100 text-purple-800', icon: Package };
    case 'shipped': return { label: 'تم الشحن', color: 'bg-cyan-100 text-cyan-800', icon: Truck };
    case 'delivered': return { label: 'تم التوصيل', color: 'bg-emerald-100 text-emerald-800', icon: CheckCircle };
    default: return { label: 'ملغي', color: 'bg-red-100 text-red-800', icon: XCircle };
  }
};

export default function OrdersPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: () => api.get<{ data: Order[] }>('/api/orders'),
  });

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8 animate-fade-in-up">
      <div className="flex items-center gap-3 mb-10">
        <Package className="w-10 h-10 text-indigo-500" />
        <h1 className="text-3xl font-black text-gray-900 dark:text-white">طلباتي السابقة</h1>
      </div>

      {isLoading && (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (<div key={i} className="h-32 animate-pulse rounded-3xl bg-gray-100 dark:bg-gray-800" />))}
        </div>
      )}

      {!isLoading && data?.data.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Package className="w-20 h-20 text-gray-300 dark:text-gray-700 mb-4" />
          <h2 className="text-xl font-bold text-gray-500 dark:text-gray-400 mb-6">لم تقم بإجراء أي طلبات حتى الآن.</h2>
          <Link href="/products" className="rounded-full bg-indigo-600 px-8 py-3 font-bold text-white shadow-lg shadow-indigo-500/30">ابدأ التسوق الآن</Link>
        </div>
      )}

      <ul className="space-y-6">
        {data?.data.map((order) => {
          const statusInfo = getStatusInfo(order.status);
          const StatusIcon = statusInfo.icon;
          return (
            <li key={order.id}>
              <Link href={`/account/orders/${order.id}`} className="block rounded-3xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-sm transition hover:shadow-md hover:-translate-y-1">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  
                  <div className="flex items-center gap-4">
                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-2xl">
                      <StatusIcon className="w-8 h-8 text-indigo-500" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">طلب رقم: <span className="font-mono">{order.orderNumber}</span></p>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-xl text-gray-900 dark:text-white">{formatPrice(order.total, order.currency)}</span>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${statusInfo.color}`}>
                          {statusInfo.label}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right text-sm text-gray-500 font-medium">
                    <p>التاريخ: {formatDate(order.createdAt)}</p>
                    <p className="mt-1">عدد المنتجات: {order.items.length}</p>
                  </div>

                </div>
              </Link>
            </li>
          )
        })}
      </ul>
    </main>
  );
}
