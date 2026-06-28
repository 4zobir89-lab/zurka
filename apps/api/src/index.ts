import 'dotenv/config';
import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { productsRouter } from './routes/products';
import { ordersRouter } from './routes/orders';
import { importRouter } from './routes/import';
import { categoriesRouter } from './routes/categories';
import { testConnection } from './db/client';

const app = new Hono();
app.use('*', cors({
  origin: (origin) => origin || 'http://localhost:3000',
  credentials: true,
}));

app.get('/health', (c) => c.json({ status: 'ok' }));
app.route('/api/products', productsRouter);
app.route('/api/orders', ordersRouter);
app.route('/api/import', importRouter);
app.route('/api/categories', categoriesRouter);

const PORT = 4000;
serve({ fetch: app.fetch, port: PORT }, async () => {
  await testConnection();
  console.log(`🚀🚀🚀 ZURKA API IS ALIVE ON PORT ${PORT}`);
});
