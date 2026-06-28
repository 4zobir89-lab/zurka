'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginAdmin } from './actions';
import { ShieldCheck, Lock, Loader2, Package } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminLoginPage() {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await loginAdmin(password);
      if (res?.error) {
        toast.error(res.error);
        setLoading(false);
      } else {
        toast.success('تم التحقق بنجاح! جاري فتح الغرفة السرية... 🔓');
        router.push('/admin/orders');
      }
    } catch (err) {
      toast.error('حدث خطأ في الاتصال بالخادم المركزي');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 animate-fade-in-up">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Package className="mx-auto h-16 w-16 text-indigo-600 drop-shadow-md" />
        <h2 className="mt-6 text-center text-3xl font-black text-gray-900 dark:text-white">
          بوابة الإدارة <span className="text-indigo-600">السرية</span>
        </h2>
        <p className="mt-2 text-sm text-gray-500 font-bold">هذه المنطقة محظورة لغير المصرح لهم.</p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-gray-900 py-8 px-4 shadow-2xl sm:rounded-3xl sm:px-10 border border-gray-100 dark:border-gray-800">
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                كلمة المرور (Master Key)
              </label>
              <div className="relative">
                <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 py-4 pr-12 pl-4 focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-left font-mono tracking-widest"
                  dir="ltr"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center gap-2 rounded-2xl bg-indigo-600 py-4 px-4 text-lg font-black text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all disabled:opacity-50 shadow-lg shadow-indigo-500/30"
            >
              {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <ShieldCheck className="w-6 h-6" />}
              تأكيد الهوية والدخول
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
