import { Redis } from '@upstash/redis';
import { logger } from './logger';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_URL!,
  token: process.env.UPSTASH_REDIS_TOKEN!,
});

const DEFAULT_TTL = 300; // 5 minutes

export const cache = {
  async get<T>(key: string): Promise<T | null> {
    try {
      return await redis.get<T>(key);
    } catch (err) {
      logger.warn({ err, key }, 'Cache GET failed — falling through to DB');
      return null;
    }
  },

  async set(key: string, value: unknown, ttlSeconds = DEFAULT_TTL): Promise<void> {
    try {
      await redis.set(key, value, { ex: ttlSeconds });
    } catch (err) {
      logger.warn({ err, key }, 'Cache SET failed — continuing without cache');
    }
  },

  async invalidate(pattern: string): Promise<void> {
    try {
      const keys = await redis.keys(pattern);
      if (keys.length > 0) {
        await redis.del(...keys);
      }
    } catch (err) {
      logger.warn({ err, pattern }, 'Cache invalidation failed');
    }
  },
};

export const CACHE_KEYS = {
  products: (page: number, limit: number, category?: string) =>
    `products:list:${page}:${limit}:${category ?? 'all'}`,
  product: (slug: string) => `products:detail:${slug}`,
  categories: () => 'categories:list',
} as const;