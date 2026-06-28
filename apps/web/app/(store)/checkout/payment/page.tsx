'use client';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { api } from '@/lib/api.client';
import { toast } from 'sonner';
import type { PaymentIntentResponse } from '@zurka/shared-types';
import { useCartStore } from '@/lib/stores/cart.store';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);

function StripePaymentForm({ clientSecret, orderId }: { clientSecret: string; orderId: string }) {
  const stripe   = useStripe();
  const elements = useElements();
  const clearCart = useCartStore((s) => s.clearCart);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/checkout/success?orderId=${orderId}`,
      },
    });

    if (error) {
      toast.error(error.message ?? 'Payment failed');
      setLoading(false);
    } else {
      clearCart();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement options={{ layout: 'tabs' }} />
      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full rounded-full bg-indigo-600 py-3.5 text-sm font-bold text-white
                   transition hover:bg-indigo-700 disabled:opacity-50"
      >
        {loading ? 'Processing Payment...' : 'Pay Now'}
      </button>
    </form>
  );
}

function PaymentPageInner() {
  const searchParams = useSearchParams();
  const orderId  = searchParams.get('orderId')!;
  const gateway  = searchParams.get('gateway') as 'stripe' | 'tap';
  const [intent, setIntent]   = useState<PaymentIntentResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId || !gateway) return;
    api.post<PaymentIntentResponse>(`/api/orders/${orderId}/payment-intent`, {
      orderId,
      paymentGateway: gateway,
    })
      .then(setIntent)
      .catch(() => toast.error('Failed to initialize payment'))
      .finally(() => setLoading(false));
  }, [orderId, gateway]);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
      </div>
    );
  }

  if (!intent) {
    return (
      <div className="flex h-64 items-center justify-center text-red-500">
        Payment initialization failed. Please go back and try again.
      </div>
    );
  }

  if (gateway === 'tap') {
    window.location.href = intent.clientSecret;
    return null;
  }

  return (
    <Elements
      stripe={stripePromise}
      options={{ clientSecret: intent.clientSecret, appearance: { theme: 'stripe' } }}
    >
      <StripePaymentForm clientSecret={intent.clientSecret} orderId={orderId} />
    </Elements>
  );
}

export default function PaymentPage() {
  return (
    <main className="mx-auto max-w-lg px-4 py-12 sm:px-6">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold">Complete Your Payment</h1>
        <p className="mt-2 text-sm text-gray-500">Your order is reserved for 15 minutes</p>
      </div>
      <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
        <Suspense fallback={
          <div className="h-64 animate-pulse rounded-xl bg-gray-100" />
        }>
          <PaymentPageInner />
        </Suspense>
      </div>
    </main>
  );
}