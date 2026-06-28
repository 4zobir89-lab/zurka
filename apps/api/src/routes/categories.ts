import { Hono } from 'hono';
import { db } from '../db/client';
import { categories } from '../db/schema';
import { eq } from 'drizzle-orm';

const router = new Hono();

router.get('/', async (c) => {
  try {
    const data = await db.select().from(categories);
    return c.json({ data });
  } catch (err) {
    console.error("Categories Fetch Error:", err);
    return c.json({ data: [] });
  }
});

router.post('/', async (c) => {
  try {
    const body = await c.req.json();
    const uniqueSuffix = Math.random().toString(36).substring(2, 6);
    const slug = (body.name || 'cat').toLowerCase().replace(/\s+/g, '-') + '-' + uniqueSuffix;
    
    const [newCat] = await db.insert(categories).values({
      name: body.name,
      nameAr: body.nameAr || body.name,
      slug: slug,
    }).returning();
    
    return c.json(newCat);
  } catch (err) {
    console.error("Categories Insert Error:", err);
    return c.json({ error: 'Failed to insert' }, 500);
  }
});

router.patch('/:id', async (c) => {
  const id = c.req.param('id');
  const body = await c.req.json();
  const [updated] = await db.update(categories).set({ name: body.name, nameAr: body.nameAr }).where(eq(categories.id, id)).returning();
  return c.json(updated);
});

router.delete('/:id', async (c) => {
  const id = c.req.param('id');
  await db.delete(categories).where(eq(categories.id, id));
  return c.json({ success: true });
});

export { router as categoriesRouter };
