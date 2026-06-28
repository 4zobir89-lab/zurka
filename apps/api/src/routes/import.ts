import { Hono } from 'hono';
import { db } from '../db/client';
import { products } from '../db/schema';

const router = new Hono();

// قائمة منتجات واقعية لمحاكاة الاستيراد
const MOCK_PRODUCTS = [
  { title: "سماعات رأس لاسلكية محيطية لعشاق الألعاب", image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb", price: 45.00 },
  { title: "ساعة ذكية رياضية مقاومة للماء مع متتبع نبضات القلب", image: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a", price: 32.50 },
  { title: "حقيبة ظهر للسفر مضادة للسرقة بمنفذ USB", image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62", price: 28.00 },
  { title: "كاميرا مراقبة ذكية داخلية تعمل بالذكاء الاصطناعي", image: "https://images.unsplash.com/photo-1557438159-51eec7a6c9e8", price: 55.99 }
];

router.post('/', async (c) => {
  try {
    const { url } = await c.req.json();
    if (!url) return c.json({ error: 'الرابط مطلوب' }, 400);

    // اختيار منتج عشوائي لمحاكاة السحب
    const randomProduct = MOCK_PRODUCTS[Math.floor(Math.random() * MOCK_PRODUCTS.length)];
    const uniqueId = Math.random().toString(36).substring(2, 8);
    
    // حساب السعر (هامش ربح 40%)
    const sourcePrice = randomProduct.price;
    const sellingPrice = (sourcePrice * 1.40).toFixed(2);

    // حفظ المنتج الحقيقي في قاعدة البيانات
    const [newProduct] = await db.insert(products).values({
      sourceId: `ALIEX-${uniqueId}`,
      title: randomProduct.title,
      slug: `imported-item-${uniqueId}`,
      images: [`${randomProduct.image}?auto=format&fit=crop&w=800&q=80`],
      sourcePriceUsd: sourcePrice.toString(),
      sellingPrice: sellingPrice.toString(),
      currency: 'USD',
      shippingDays: 14,
      stock: 50,
      isActive: true,
    }).returning();

    console.log(`🔥 [IMPORT ENGINE]: تم استيراد وحفظ المنتج الجديد: ${newProduct.title}`);
    return c.json({ success: true, product: newProduct });
  } catch (err) {
    console.error("❌ [IMPORT ENGINE]: خطأ في الاستيراد", err);
    return c.json({ error: 'فشل الاستيراد' }, 500);
  }
});

export { router as importRouter };
