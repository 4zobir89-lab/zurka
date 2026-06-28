'use client';
import { useState } from 'react';
import { Radar, DownloadCloud, Link as LinkIcon, Loader2, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

export default function ImportProductsPage() {
  const [url, setUrl] = useState('');
  const [isScraping, setIsScraping] = useState(false);

  const handleImport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.includes('aliexpress.com')) {
      toast.error('يرجى إدخال رابط صحيح من موقع علي إكسبريس!');
      return;
    }

    setIsScraping(true);
    try {
      // الاتصال الحقيقي بالسيرفر لزرع المنتج في قاعدة البيانات
      const res = await fetch('http://127.0.0.1:4000/api/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      });
      
      if (!res.ok) throw new Error('فشل الاستيراد');
      
      toast.success('تم استيراد المنتج بنجاح! تم نشره في متجرك الآن. 🚀');
      setUrl('');
    } catch (err) {
      toast.error('حدث خطأ أثناء الاتصال بخادم الاستيراد!');
    } finally {
      setIsScraping(false);
    }
  };

  return (
    <div className="animate-fade-in-up">
      <header className="mb-8">
        <h1 className="text-3xl font-black text-gray-900 dark:text-white flex items-center gap-3 mb-2">
          <Radar className="w-8 h-8 text-emerald-500" />
          رادار الاستيراد الذكي
        </h1>
        <p className="text-gray-500 font-medium">اجلب أي منتج من الصين بضغطة زر. المحرك سيقوم بتسعيره تلقائياً ونشره في متجرك.</p>
      </header>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-gray-900 p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-3 mb-6 border-b border-gray-100 dark:border-gray-800 pb-4">
            <div className="p-3 bg-emerald-50 dark:bg-emerald-900/30 rounded-xl">
              <DownloadCloud className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <h2 className="font-bold text-xl text-gray-900 dark:text-white">جلب عبر الرابط</h2>
              <p className="text-xs text-gray-500">AliExpress Link Importer</p>
            </div>
          </div>

          <form onSubmit={handleImport} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">رابط المنتج (URL)</label>
              <div className="relative">
                <LinkIcon className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input 
                  type="url" 
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://ar.aliexpress.com/item/..." 
                  className="w-full rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 py-4 pr-12 pl-4 text-left focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                  dir="ltr"
                  required
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isScraping}
              className="w-full rounded-2xl bg-emerald-600 py-4 text-lg font-black text-white transition hover:bg-emerald-700 disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/30"
            >
              {isScraping ? (
                <><Loader2 className="w-6 h-6 animate-spin" /> جاري زرع المنتج في السحابة...</>
              ) : (
                <><Sparkles className="w-6 h-6" /> استيراد ونشر فوراً</>
              )}
            </button>
          </form>
        </div>

        <div className="bg-gradient-to-br from-indigo-900 to-gray-900 p-8 rounded-3xl text-white relative overflow-hidden">
          <Radar className="absolute -left-10 -bottom-10 w-48 h-48 text-white/5" />
          <h3 className="text-2xl font-black mb-4 relative z-10">كيف يعمل المحرك؟</h3>
          <ul className="space-y-4 relative z-10 text-indigo-100 font-medium">
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-xs mt-0.5">1</span>
              <p>يستقبل الرابط ويفكك كود المنتج.</p>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-xs mt-0.5">2</span>
              <p>يُطبق هامش الربح الذي نحدده (حالياً 40%) على سعر الجملة الأصلي.</p>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-xs mt-0.5">3</span>
              <p>يُحقن المنتج مباشرة في قاعدة بيانات (Neon) السحابية ليظهر لعملائك فوراً.</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
