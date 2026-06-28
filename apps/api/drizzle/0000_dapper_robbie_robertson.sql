CREATE TYPE "public"."order_status" AS ENUM('pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."payment_gateway" AS ENUM('stripe', 'paypal', 'local', 'cash');--> statement-breakpoint
CREATE TABLE "categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"name_ar" varchar(255),
	"slug" varchar(255) NOT NULL,
	"parent_id" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "categories_name_unique" UNIQUE("name"),
	CONSTRAINT "categories_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "order_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_id" uuid NOT NULL,
	"product_id" uuid NOT NULL,
	"quantity" integer NOT NULL,
	"unit_price" numeric(10, 2) NOT NULL,
	"product_snapshot" jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE "orders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_number" varchar(50) NOT NULL,
	"user_id" uuid,
	"guest_email" varchar(255),
	"shipping_name" varchar(255) NOT NULL,
	"shipping_address" text NOT NULL,
	"shipping_city" varchar(255) NOT NULL,
	"shipping_country" varchar(255) NOT NULL,
	"shipping_phone" varchar(50) NOT NULL,
	"shipping_cost" numeric(10, 2),
	"subtotal" numeric(10, 2) NOT NULL,
	"total" numeric(10, 2) NOT NULL,
	"currency" varchar(3) DEFAULT 'SAR' NOT NULL,
	"payment_gateway" "payment_gateway",
	"payment_intent_id" varchar(255),
	"status" "order_status" DEFAULT 'pending' NOT NULL,
	"source_order_id" varchar(255),
	"tracking_number" varchar(255),
	"tracking_url" text,
	"paid_at" timestamp,
	"shipped_at" timestamp,
	"delivered_at" timestamp,
	"updated_at" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "orders_order_number_unique" UNIQUE("order_number")
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"source_id" varchar(255),
	"source_platform" varchar(50),
	"title" text NOT NULL,
	"title_ar" text,
	"slug" varchar(255) NOT NULL,
	"description" text,
	"images" jsonb NOT NULL,
	"source_price_usd" numeric(10, 2) NOT NULL,
	"selling_price" numeric(10, 2) NOT NULL,
	"currency" varchar(3) DEFAULT 'SAR' NOT NULL,
	"shipping_days" integer DEFAULT 14,
	"stock" integer DEFAULT 0,
	"is_active" boolean DEFAULT true,
	"category_id" uuid,
	"metadata" jsonb,
	"synced_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "products_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE no action ON UPDATE no action;