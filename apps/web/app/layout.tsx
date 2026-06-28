import type { Metadata } from 'next';
import { Toaster } from 'sonner';
import { Providers } from './providers';
import { Header } from '@/components/shared/Header';
import { Footer } from '@/components/shared/Footer';
import './globals.css';

export const metadata: Metadata = {
  title: { default: 'زوركا ZURKA | تسوق من الصين بأسعار الجملة', template: '%s | ZURKA' },
  description: 'موقع زوركا (ZURKA) العالمي. تصميم وتطوير وسيم الزبيري.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        <meta name="referrer" content="no-referrer" />
      </head>
      <body className="antialiased min-h-screen flex flex-col selection:bg-indigo-500 selection:text-white">
        <Providers>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <Toaster position="top-center" richColors closeButton />
        </Providers>
      </body>
    </html>
  );
}
