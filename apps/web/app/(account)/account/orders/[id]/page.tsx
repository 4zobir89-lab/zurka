import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Package, Truck } from 'lucide-react';
import { formatPrice, formatDate } from '@/lib/utils';
import type { Order } from '@zurka/shared-types';

async function getOrder(id: string): Promise<Order | null> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/orders/${id}`,
    { cache: 'no-store' }
  );
  if (!res.ok) return null;
  return res.json();
}

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order  = await getOrder(id);

  if (!order) notFound();

  return (
    <>
      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <Link href="/account/orders"
          className="mb-6 flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900">
          <ArrowLeft className="h-4 w-4" />
          Back to Orders
        </Link>

        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">{order.orderNumber}</h1>
            <p className="text-sm text-gray-500">Placed {formatDate(order.createdAt)}</p>
          </div>
          <span className="rounded-full bg-indigo-100 px-4 py-1.5 text-sm font-bold text-indigo-700 capitalize">
            {order.status}
          </span>
        </div>

        {order.trackingNumber && (
          <div className="mb-6 flex items-center gap-3 rounded-2xl border border-cyan-100 bg-cyan-50 p-4">
            <Truck className="h-5 w-5 text-cyan-600 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-cyan-900">
                Tracking: {order.trackingNumber}
              </p>
              {order.trackingUrl && (
                <a href={order.trackingUrl} target="_blank" rel="noreferrer"
                  className="text-xs text-cyan-600 underline">
                  Track Package →
                </a>
              )}
            </div>
          </div>
        )}

        <div className="mb-6 rounded-2xl border border-gray-100 bg-white p-5">
          <h2 className="mb-4 font-semibold">Items</h2>
          <ul className="divide-y divide-gray-100">
            {order.items.map((item) => (
              <li key={item.id} className="flex items-center gap-4 py-4">
                <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl bg-gray-50">
                  <Image
                    src={item.productSnapshot.image || '/placeholder.jpg'}
                    alt={item.productSnapshot.title}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium line-clamp-2">
                    {item.productSnapshot.title}
                  </p>
                  <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                </div>
                <p className="font-bold">
                  {formatPrice(Number(item.unitPrice) * item.quantity)}
                </p>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-gray-50 p-5">
          <h2 className="mb-4 font-semibold">Order Summary</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span>{formatPrice(order.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Shipping</span>
              <span className="text-green-600">Free</span>
            </div>
            <div className="flex justify-between border-t pt-2 font-bold text-base">
              <span>Total</span>
              <span>{formatPrice(order.total, order.currency)}</span>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}