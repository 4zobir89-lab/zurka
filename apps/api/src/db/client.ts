import pkg from 'pg';
const { Pool } = pkg;
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from './schema';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// 🌟 ممتص الصدمات: يمنع انهيار السيرفر إذا انقطع اتصال الإنترنت للحظة
pool.on('error', (err) => {
  console.error('⚠️ [DATABASE WARNING]: رَمشة في الاتصال بقاعدة البيانات وتم تجاوزها:', err.message);
});

export const db = drizzle(pool, { schema });

export async function testConnection() {
  try {
    const client = await pool.connect();
    client.release();
    return true;
  } catch (e) {
    console.error('❌ [DATABASE ERROR]: فشل الاتصال بقاعدة البيانات');
    return false;
  }
}
