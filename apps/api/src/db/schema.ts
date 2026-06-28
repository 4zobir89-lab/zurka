import { pgTable, uuid, varchar, text, decimal, integer, boolean, timestamp, jsonb, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const orderStatusEnum = pgEnum('order_status', ['pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled']);

export const categories = pgTable('categories', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  nameAr: varchar('name_ar', { length: 255 }),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
});

export const products = pgTable('products', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: text('title').notNull(),
  titleAr: text('title_ar'),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  description: text('description'),
  images: jsonb('images').notNull().default([]),
  sellingPrice: decimal('selling_price', { precision: 10, scale: 2 }).notNull(),
  currency: varchar('currency', { length: 3 }).default('SAR'),
  categoryId: uuid('category_id').references(() => categories.id, { onDelete: 'set null' }),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
});

export const orders = pgTable('orders', {
  id: uuid('id').defaultRandom().primaryKey(),
  orderNumber: varchar('order_number', { length: 50 }).notNull().unique(),
  shippingName: varchar('shipping_name', { length: 255 }).notNull(),
  shippingPhone: varchar('shipping_phone', { length: 50 }).notNull(),
  shippingAddress: text('shipping_address'),
  shippingCity: varchar('shipping_city', { length: 100 }),
  total: decimal('total', { precision: 10, scale: 2 }).notNull(),
  status: orderStatusEnum('status').default('pending').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const orderItems = pgTable('order_items', {
  id: uuid('id').defaultRandom().primaryKey(),
  orderId: uuid('order_id').references(() => orders.id, { onDelete: 'cascade' }),
  productId: uuid('product_id').references(() => products.id),
  quantity: integer('quantity').notNull(),
  unitPrice: decimal('unit_price', { precision: 10, scale: 2 }).notNull(),
  productSnapshot: jsonb('product_snapshot'),
});

export const ordersRelations = relations(orders, ({ many }) => ({ items: many(orderItems) }));
export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, { fields: [orderItems.orderId], references: [orders.id] }),
}));
