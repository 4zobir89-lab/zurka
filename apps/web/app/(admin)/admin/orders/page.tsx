'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api.client';
import { formatPrice, formatDate } from '@/lib/utils';
import { toast } from 'sonner';
import { Loader2, Truck, CheckCircle, Clock, Package } from 'lucide-react';

export default function AdminOrdersPage() {
  const queryClient = useQueryClient();

  // جلب الطلبات
  const { data, isLoading } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: () => api.get<{ data: any[] }>('/api/orders'),
  });

  // تحديث حالة الطلب
  const updateStatus = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => 
      api.patch(`/api/orders/${id}/status`, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      toast.success('تم تحديث حالة الطلب بنجاح! ✅');
    },
    onError: () => toast.error('فشل تحديث الحالة ❌')
  });

  if (isLoading) return <div className="flex justify-center py-20"><Loader2 className="w-10 h-10 animate-spin text-indigo-600" /></div>;

  return (
    <div className="animate-fade-in-up">
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white flex items-center gap-3">
            <Package className="w-8 h-8 text-indigo-500" />
            غرفة العمليات (إدارة الطلبات)
          </h1>
          <p className="text-gray-500 mt-2 font-medium">هنا يمكنك متابعة طلبات العملاء وتغيير حالتها لبدء الشحن.</p>
        </div>
        <div className="bg-white dark:bg-gray-900 px-6 py-3 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
          <p className="text-sm text-gray-500">إجمالي الطلبات</p>
          <p className="text-2xl font-black text-indigo-600">{data?.data.length || 0}</p>
        </div>
      </header>

      <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-right">
            <thead className="bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 font-bold border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="px-6 py-4">رقم الطلب</th>
                <th className="px-6 py-4">العميل</th>
                <th className="px-6 py-4">التاريخ</th>
                <th className="px-6 py-4">الإجمالي</th>
                <th className="px-6 py-4">الحالة الحالية</th>
                <th className="px-6 py-4">إجراء (تحديث الحالة)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {data?.data.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition">
                  <td className="px-6 py-4 font-mono font-bold text-indigo-600">{order.orderNumber}</td>
                  <td className="px-6 py-4">
                    <p className="font-bold text-gray-900 dark:text-white">{order.shippingName}</p>
                    <p className="text-xs text-gray-500">{order.shippingCountry} - {order.shippingPhone}</p>
                  </td>
                  <td className="px-6 py-4 text-gray-500">{formatDate(order.createdAt)}</td>
                  <td className="px-6 py-4 font-black text-gray-900 dark:text-white">{formatPrice(order.total, order.currency)}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1
                      ${order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                        order.status === 'processing' ? 'bg-purple-100 text-purple-800' :
                        order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                        'bg-emerald-100 text-emerald-800'}`}>
                      {order.status === 'pending' ? 'قيد المراجعة' : 
                       order.status === 'processing' ? 'جاري التجهيز' :
                       order.status === 'shipped' ? 'تم الشحن' : 'تم التوصيل'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <select 
                      disabled={updateStatus.isPending}
                      value={order.status}
                      onChange={(e) => updateStatus.mutate({ id: order.id, status: e.target.value })}
                      className="bg-gray-100 dark:bg-gray-950 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white text-xs rounded-xl focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2 cursor-pointer outline-none"
                    >
                      <option value="pending">⏳ قيد المراجعة</option>
                      <option value="processing">📦 جاري التجهيز</option>
                      <option value="shipped">🚚 تم الشحن</option>
                      <option value="delivered">✅ تم التوصيل</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
