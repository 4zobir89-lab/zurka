'use client';
import Link from 'next/link';
import { ShoppingBag, Radar, FolderTree, LogOut } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const links = [
    { href: '/admin/orders', label: 'الطلبات', icon: ShoppingBag },
    { href: '/admin/categories', label: 'الأقسام', icon: FolderTree },
    { href: '/admin/import', label: 'الرادار', icon: Radar },
  ];

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Sidebar Desktop */}
      <aside className="w-64 bg-white dark:bg-gray-900 border-l hidden md:flex flex-col sticky top-0 h-screen p-6">
        <h2 className="text-xl font-black mb-8">لوحة التحكم</h2>
        <nav className="space-y-2">
          {links.map(l => (
            <Link key={l.href} href={l.href} className={cn("flex items-center gap-3 p-3 rounded-xl font-bold", pathname === l.href ? "bg-indigo-50 text-indigo-600" : "text-gray-500")}>
              <l.icon size={20} /> {l.label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 mb-24 md:mb-0">
        {children}
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t flex justify-around p-3 z-50">
        {links.map(l => (
          <Link key={l.href} href={l.href} className={cn("flex flex-col items-center gap-1", pathname === l.href ? "text-indigo-600" : "text-gray-400")}>
            <l.icon size={24} />
            <span className="text-[10px] font-black">{l.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
