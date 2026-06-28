'use client';
import { Instagram, Facebook, MessageCircle } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-900 dark:bg-black text-white mt-auto py-10 rounded-t-[2.5rem] shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="text-center md:text-right">
          <h2 className="text-3xl font-black tracking-tighter mb-2">ZUR<span className="text-indigo-500">KA</span></h2>
          <p className="text-gray-400 text-sm max-w-sm">منتجات العالم بين يديك. تجربة تسوق فريدة، آمنة، وسريعة.</p>
        </div>
        
        <div className="flex gap-5">
          <a href="https://wa.me/967778140990" target="_blank" rel="noreferrer" aria-label="WhatsApp"
             className="bg-green-500 p-3.5 rounded-full hover:scale-110 hover:shadow-[0_0_20px_rgba(34,197,94,0.6)] transition-all duration-300">
            <MessageCircle className="w-6 h-6 text-white" />
          </a>
          <a href="https://www.instagram.com/zo__i6?igsh=cHp6bnluZHU1NWU4" target="_blank" rel="noreferrer" aria-label="Instagram"
             className="bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-500 p-3.5 rounded-full hover:scale-110 hover:shadow-[0_0_20px_rgba(236,72,153,0.6)] transition-all duration-300">
            <Instagram className="w-6 h-6 text-white" />
          </a>
          <a href="https://www.facebook.com/profile.php?id=100084545326942&mibextid=ZbWKwL" target="_blank" rel="noreferrer" aria-label="Facebook"
             className="bg-blue-600 p-3.5 rounded-full hover:scale-110 hover:shadow-[0_0_20px_rgba(37,99,235,0.6)] transition-all duration-300">
            <Facebook className="w-6 h-6 text-white" />
          </a>
        </div>
      </div>
      <div className="text-center text-gray-500 text-xs mt-10 border-t border-gray-800 pt-6 font-semibold">
        تصميم وتطوير: وسيم الزبيري © {new Date().getFullYear()} | جميع الحقوق محفوظة
      </div>
    </footer>
  );
}
