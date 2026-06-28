import { ProductGrid } from '@/components/product/ProductGrid';
import { Search } from 'lucide-react';
import Link from 'next/link';

interface Props {
  searchParams: Promise<{ page?: string; category?: string; search?: string }>;
}

export default async function ProductsPage({ searchParams }: Props) {
  const { page, category, search } = await searchParams;

  const categories =[
    { name: 'الكل', slug: '' },
    { name: 'إلكترونيات', slug: 'electronics' },
    { name: 'صوتيات', slug: 'audio' },
    { name: 'ساعات', slug: 'watches' },
    { name: 'أزياء', slug: 'fashion' },
  ];

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      
      <div className="mb-10 text-center animate-fade-in-up">
        <h1 className="text-3xl md:text-5xl font-black text-gray-900 dark:text-white mb-4">
          {search ? (
            <span className="flex items-center justify-center gap-3">
              <Search className="w-8 h-8 text-indigo-500" />
              نتائج البحث عن "{search}"
            </span>
          ) : (
            'تصفح جميع المنتجات'
          )}
        </h1>
        <p className="text-gray-500 dark:text-gray-400 font-semibold">اكتشف أحدث العروض بأسعار الجملة مباشرة من الصين.</p>
      </div>

      {!search && (
        <div className="flex overflow-x-auto pb-4 hide-scrollbar mb-8 gap-3 hide-scrollbar animate-fade-in-up" style={{animationDelay: '0.1s'}}>
          {categories.map((cat) => {
            const isActive = (category || '') === cat.slug;
            return (
              <Link 
                key={cat.name} 
                href={cat.slug ? `/products?category=${cat.slug}` : '/products'}
                className={`whitespace-nowrap px-6 py-2.5 rounded-full font-bold text-sm transition-all ${
                  isActive 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' 
                  : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
              >
                {cat.name}
              </Link>
            );
          })}
        </div>
      )}

      <div className="animate-fade-in-up" style={{animationDelay: '0.2s'}}>
        <ProductGrid
          page={page ? Number(page) : 1}
          category={category}
          search={search}
        />
      </div>
    </main>
  );
}
