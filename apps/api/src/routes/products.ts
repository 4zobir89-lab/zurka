import { Hono } from 'hono';
import { db } from '../db/client';
import { eq, desc } from 'drizzle-orm';
import { products } from '../db/schema';

const router = new Hono();

router.get('/', async (c) => {
  try {
    const data = await db.query.products.findMany({
      orderBy: [desc(products.createdAt)],
    });
    return c.json({ data, pagination: { page: 1, limit: 20, total: data.length, totalPages: 1 } });
  } catch (err) {
    return c.json({ error: 'Failed to fetch products' }, 500);
  }
});

router.get('/:slug', async (c) => {
  const slug = c.req.param('slug');
  const product = await db.query.products.findFirst({
    where: (p, { eq }) => eq(p.slug, slug),
  });
  if (!product) return c.json({ error: 'Not found' }, 404);
  return c.json(product);
});

export { router as productsRouter };
