import { z } from 'zod';
export const PaginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20),
  category: z.string().optional(),
  search: z.string().max(100).optional(),
});
export const ShippingSchema = z.object({
  name: z.string().min(2).max(100),
  address: z.string().min(5).max(300),
  city: z.string().min(2).max(100),
  country: z.string().length(2).toUpperCase(),
  phone: z.string().regex(/^\+?[0-9\s\-()]{7,20}$/),
  email: z.string().email().optional(),
});
export const CreateOrderSchema = z.object({
  items: z.array(z.object({
    productId: z.string().uuid(),
    quantity: z.number().int().min(1).max(10),
  })).min(1).max(20),
  shipping: ShippingSchema,
  paymentGateway: z.enum(['stripe', 'tap']),
  guestEmail: z.string().email().optional(),
});
export const CreatePaymentIntentSchema = z.object({
  orderId: z.string().uuid(),
  paymentGateway: z.enum(['stripe', 'tap']),
});
