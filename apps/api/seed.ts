import 'dotenv/config';
import pkg from 'pg';
const { Pool } = pkg;
import { drizzle } from 'drizzle-orm/node-postgres';
import { products, categories } from './src/db/schema.js';

const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});
const db = drizzle(pool);

async function seed() {
  console.log('⏳ Updating Images to Stable High-Res Versions...');
  try {
    await db.delete(products);
    await db.delete(categories);
    
    const cats = await db.insert(categories).values([
      { name: 'Electronics', nameAr: 'إلكترونيات', slug: 'electronics' },
      { name: 'Audio', nameAr: 'صوتيات', slug: 'audio' },
      { name: 'Watches', nameAr: 'ساعات', slug: 'watches' },
      { name: 'Fashion', nameAr: 'أزياء', slug: 'fashion' }
    ]).returning();

    await db.insert(products).values([
      {
        sourceId: 'LNV-1', title: 'Lenovo LP40 Pro TWS Bluetooth Earphones', slug: 'lenovo-lp40-pro',
        images: ['https://images.unsplash.com/photo-1590658268037-6f5947c66576?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
        categoryId: cats.find(c => c.slug === 'audio')?.id,
        sourcePriceUsd: '9.00', sellingPrice: '24.99', currency: 'USD', shippingDays: 12, stock: 150, isActive: true
      },
      {
        sourceId: 'ANK-1', title: 'Anker Soundcore Life Q30 Active Noise Cancelling', slug: 'anker-life-q30',
        images: ['https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
        categoryId: cats.find(c => c.slug === 'audio')?.id,
        sourcePriceUsd: '55.00', sellingPrice: '89.99', currency: 'USD', shippingDays: 15, stock: 40, isActive: true
      },
      {
        sourceId: 'XIA-1', title: 'Xiaomi Smart Band 8 Blood Oxygen Tracker', slug: 'xiaomi-mi-band-8',
        images: ['https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
        categoryId: cats.find(c => c.slug === 'electronics')?.id,
        sourcePriceUsd: '35.00', sellingPrice: '49.99', currency: 'USD', shippingDays: 10, stock: 200, isActive: true
      },
      {
        sourceId: 'UG-1', title: 'UGREEN 100W GaN Fast Charger Mac/Phone', slug: 'ugreen-100w-charger',
        images: ['https://images.unsplash.com/photo-1583863788434-e58a36340cf0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
        categoryId: cats.find(c => c.slug === 'electronics')?.id,
        sourcePriceUsd: '25.00', sellingPrice: '45.00', currency: 'USD', shippingDays: 14, stock: 85, isActive: true
      },
      {
        sourceId: 'CUR-1', title: 'Curren Luxury Men Quartz Watch Stainless Steel', slug: 'curren-luxury-watch',
        images: ['https://images.unsplash.com/photo-1524592094714-0f0654e20314?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
        categoryId: cats.find(c => c.slug === 'watches')?.id,
        sourcePriceUsd: '14.00', sellingPrice: '39.99', currency: 'USD', shippingDays: 18, stock: 60, isActive: true
      },
      {
        sourceId: 'LIG-1', title: 'LIGE Digital Smart Watch Men Bluetooth Call', slug: 'lige-smart-watch',
        images: ['https://images.unsplash.com/photo-1546868871-7041f2a55e12?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
        categoryId: cats.find(c => c.slug === 'watches')?.id,
        sourcePriceUsd: '18.00', sellingPrice: '55.00', currency: 'USD', shippingDays: 15, stock: 120, isActive: true
      },
      {
        sourceId: 'FAS-1', title: 'Men Premium Leather Jacket Winter Coat', slug: 'premium-leather-jacket',
        images: ['https://images.unsplash.com/photo-1551028719-00167b16eac5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
        categoryId: cats.find(c => c.slug === 'fashion')?.id,
        sourcePriceUsd: '28.00', sellingPrice: '75.00', currency: 'USD', shippingDays: 20, stock: 30, isActive: true
      },
      {
        sourceId: 'FAS-2', title: 'Breathable Running Sneakers Lightweight', slug: 'running-sneakers',
        images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
        categoryId: cats.find(c => c.slug === 'fashion')?.id,
        sourcePriceUsd: '12.00', sellingPrice: '29.99', currency: 'USD', shippingDays: 15, stock: 300, isActive: true
      }
    ]);
    console.log('✅✅✅ IMAGES FIXED! Store is ready.');
  } catch (e) {
    console.error('❌ Error details:', e);
  } finally {
    await pool.end();
    process.exit(0);
  }
}
seed();
