import { Hono } from 'hono';
import { db } from '../db/client';
import { orders, orderItems } from '../db/schema';
import { desc, eq } from 'drizzle-orm';

const router = new Hono();

router.get('/', async (c) => {
  try {
    const data = await db.query.orders.findMany({
      with: { items: true },
      orderBy: [desc(orders.createdAt)]
    });
    return c.json({ data });
  } catch (err) {
    return c.json({ data: [] });
  }
});

// 👈 النقطة الجديدة: جلب طلب واحد محدد عبر رقم التتبع
router.get('/:orderNumber', async (c) => {
  const orderNum = c.req.param('orderNumber');
  try {
    const data = await db.query.orders.findFirst({
      where: eq(orders.orderNumber, orderNum),
      with: { items: true }
    });
    if (!data) return c.json({ error: 'Order not found' }, 404);
    return c.json({ data });
  } catch (err) {
    return c.json({ error: 'Server error' }, 500);
  }
});

router.post('/', async (c) => {
  try {
    const body = await c.req.json();
    const orderNumber = `ZRK-${new Date().getFullYear()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    
    const validItems = Array.isArray(body.items) ? body.items : [];
    const total = validItems.reduce((sum: number, item: any) => sum + ((Number(item.price) || 0) * (Number(item.quantity) || 1)), 0);

    const [newOrder] = await db.insert(orders).values({
      orderNumber,
      shippingName: body.shipping?.name || 'عميل',
      shippingPhone: body.shipping?.phone || '',
      shippingAddress: body.shipping?.address || '',
      shippingCity: body.shipping?.city || '',
      shippingCountry: 'Yemen',
      total: total.toString(),
      subtotal: total.toString(),
      status: 'pending',
    }).returning();

    if (validItems.length > 0) {
      await db.insert(orderItems).values(validItems.map((i: any) => ({
        orderId: newOrder.id,
        productId: i.productId,
        quantity: Number(i.quantity) || 1,
        unitPrice: (Number(i.price) || 0).toString(),
        productSnapshot: { title: i.title || 'منتج', image: i.image }
      })));
    }

    return c.json({ success: true, order: newOrder });
  } catch (err) {
    return c.json({ error: 'Failed to process order' }, 500);
  }
});

export { router as ordersRouter };
