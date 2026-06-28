export const cache = {
  get: async () => null,
  set: async () => {},
  invalidate: async () => {}
};
export const CACHE_KEYS = {
  products: () => 'products',
  product: (s: string) => `product:${s}`
};
