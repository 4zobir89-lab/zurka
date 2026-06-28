export interface CreatePaymentIntentRequest {
  orderId: string;
  amount: number;
  currency: string;
  gateway: 'stripe' | 'tap';
}

export interface PaymentIntentResponse {
  clientSecret: string;
  paymentIntentId: string;
  gateway: 'stripe' | 'tap';
  amount: number;
  currency: string;
}