export type OrderStatus =
  | 'pending'
  | 'paid'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded';

export type PaymentGateway = 'stripe' | 'tap';

export interface OrderItem {
  id: string;
  productId: string;
  quantity: number;
  unitPrice: string;
  productSnapshot: {
    title: string;
    image: string;
    slug: string;
  };
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string | null;
  guestEmail: string | null;
  shippingName: string;
  shippingAddress: string;
  shippingCity: string;
  shippingCountry: string;
  shippingPhone: string;
  subtotal: string;
  shippingCost: string;
  total: string;
  currency: string;
  status: OrderStatus;
  paymentGateway: PaymentGateway | null;
  paymentIntentId: string | null;
  paidAt: string | null;
  sourceOrderId: string | null;
  trackingNumber: string | null;
  trackingUrl: string | null;
  shippedAt: string | null;
  deliveredAt: string | null;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}