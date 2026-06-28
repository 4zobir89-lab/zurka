import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'zurka-super-secret-key-2026');

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // حماية كل المسارات التي تبدأ بـ /admin
  if (pathname.startsWith('/admin')) {
    const token = request.cookies.get('admin_token')?.value;

    // إذا لم يكن هناك توكن، اطرده لصفحة الدخول
    if (!token) {
      return NextResponse.redirect(new URL('/admin-login', request.url));
    }

    try {
      // التحقق من صحة التوكن والتشفير
      await jwtVerify(token, SECRET);
      return NextResponse.next();
    } catch (err) {
      // إذا كان التوكن مزوراً أو منتهي الصلاحية
      return NextResponse.redirect(new URL('/admin-login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'], // تطبيق الجدار على كل الغرف السرية
};
