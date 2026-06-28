import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: string | number, currency: string = 'SAR') {
  const amount = typeof price === 'string' ? parseFloat(price) : price;
  
  // إذا كانت العملة سعودي، أظهر التقريب اليمني تحتها (سعر الصرف 140)
  if (currency === 'SAR') {
    const yerAmount = Math.round(amount * 140).toLocaleString();
    return `${amount.toFixed(2)} ر.س`;
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
}

// دالة جديدة مخصصة لإظهار التقريب اليمني في الواجهة
export function getYemeniPrice(price: string | number) {
  const amount = typeof price === 'string' ? parseFloat(price) : price;
  return `(≈ ${(Math.round(amount * 140)).toLocaleString()} ريال يمني)`;
}

export function formatDate(date: string | Date) {
  return new Date(date).toLocaleDateString('ar-YE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
