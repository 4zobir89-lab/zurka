import { db } from '../db/client';
import { orders, orderItems, products } from '../db/schema';
import { eq, desc } from 'drizzle-orm';

export async function createOrder(input: any, userId?: string) {
  const orderNumber = `ZRK-${new Date().getFullYear()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
  const productIds = input.items.map((i: any) => i.productId);
  const realProducts = await db.query.products.findMany({ where: (p, { inArray }) => inArray(p.id, productIds) });

  let totalAmount = 0;
  const itemsToSave: any[] = [];
  for (const item of input.items) {
    const product = realProducts.find(p => p.id === item.productId);
    if (!product) continue;
    totalAmount += Number(product.sellingPrice) * item.quantity;
    itemsToSave.push({
      productId: product.id, quantity: item.quantity, unitPrice: product.sellingPrice,
      productSnapshot: { title: product.title, image: product.images[0] || '', slug: product.slug }
    });
  }

  const [newOrder] = await db.transaction(async (tx) => {
    const [order] = await tx.insert(orders).values({
      orderNumber, userId: userId ?? null, guestEmail: input.guestEmail ?? null,
      shippingName: input.shipping.name, shippingAddress: input.shipping.address,
      shippingCity: input.shipping.city, shippingCountry: input.shipping.country, shippingPhone: input.shipping.phone,
      subtotal: totalAmount.toFixed(2), total: totalAmount.toFixed(2), currency: 'USD',
      paymentGateway: input.paymentGateway, status: 'pending',
    }).returning();
    if (itemsToSave.length > 0) {
       await tx.insert(orderItems).values(itemsToSave.map(i => ({ ...i, orderId: order.id })));
    }
    return [order];
  });
  return newOrder;
}

export async function getOrderById(id: string) {
  return await db.query.orders.findFirst({ where: eq(orders.id, id), with: { items: true } });
}

export async function getUserOrders() {
  return await db.query.orders.findMany({ with: { items: true }, orderBy: [desc(orders.createdAt)], limit: 100 });
}

export async function updateOrderStatus(id: string, newStatus: string) {
  const [updatedOrder] = await db.update(orders).set({ status: newStatus }).where(eq(orders.id, id)).returning();
  return updatedOrder;
}

// 🌟 الدالة الجديدة: البحث برقم الطلب (ZRK-...)
export async function getOrderByNumber(orderNumber: string) {
  return await db.query.orders.findFirst({
    where: eq(orders.orderNumber, orderNumber),
    with: { items: true },
  });
}
