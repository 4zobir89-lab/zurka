'use server';
import { cookies } from 'next/headers';
import { SignJWT } from 'jose';

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'zurka-super-secret-key-2026');
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'zurka2026';

export async function loginAdmin(password: string) {
  if (password !== ADMIN_PASSWORD) {
    return { error: 'كلمة المرور غير صحيحة ❌' };
  }

  // توليد بطاقة عبور (JWT) مشفرة صالحة لـ 24 ساعة
  const token = await new SignJWT({ role: 'admin' })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('24h')
    .sign(SECRET);

  // زرع البطاقة في متصفح المدير بشكل آمن (HTTP-Only) لا يمكن للهكر سرقتها
  const cookieStore = await cookies();
  cookieStore.set('admin_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24,
  });

  return { success: true };
}
