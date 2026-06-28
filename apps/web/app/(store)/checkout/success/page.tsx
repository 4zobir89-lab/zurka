import Link from 'next/link';
import { CheckCircle2, PackageSearch } from 'lucide-react';

interface Props {
  searchParams: Promise<{ orderId?: string }>;
}

export default async function SuccessPage({ searchParams }: Props) {
  const { orderId } = await searchParams;

  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center animate-fade-in-up">
      <div className="bg-emerald-50 dark:bg-emerald-900/20 p-6 rounded-full mb-8">
        <CheckCircle2 className="h-24 w-24 text-emerald-500" />
      </div>
      <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-4">تم استلام طلبك بنجاح! 🎉</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md text-lg font-medium">
        شكراً لتسوقك من ZURKA. سنقوم بتجهيز طلبك وشحنه في أسرع وقت ممكن.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
        {orderId && (
          <Link href={`/account/orders/${orderId}`} className="flex items-center justify-center gap-2 rounded-full bg-indigo-600 px-8 py-4 text-lg font-black text-white hover:bg-indigo-700 shadow-lg shadow-indigo-500/30">
            <PackageSearch className="w-5 h-5" />
            تتبع حالة الطلب
          </Link>
        )}
        <Link href="/" className="rounded-full border-2 border-gray-200 dark:border-gray-800 px-8 py-4 text-lg font-black text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900">
          متابعة التسوق
        </Link>
      </div>
    </main>
  );
}
