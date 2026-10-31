@echo off
chcp 65001 >nul
echo ========================================================
echo PazarMax.mk - WorkRelay Inventory Manual Sync Tool
echo ========================================================
echo.
echo Испраќање на сите 32 производи директно во WorkRelay...
echo.

node -e "
const { PRODUCTS } = require('./src/data/products.js');

const formatted = PRODUCTS.map((p) => ({
  sku: p.id,
  name: p.title,
  stock: p.stock ?? (p.inStock ? 10 : 0),
  notify_on: 5,
  price_minor: Math.round((Number(p.price) || 0) * 100),
  currency: 'MKD',
  unit: 'pcs',
  category: p.category,
  updated_at: new Date().toISOString(),
}));

const payload = {
  products: formatted,
  synced_by: {
    name: 'Кирил Неранџоски',
    role: 'Admin'
  }
};

fetch('https://wayktzmupzrdcwosgnfg.supabase.co/functions/v1/inventory-webhook', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer wr_live_7b847f2c1add3658421721c15cf87207a4e49dd73f02463871f1ee11204f0cc2',
    'X-Store-Id': 'pazarmax'
  },
  body: JSON.stringify(payload)
})
.then(async r => {
  const data = await r.json();
  if (r.status === 200 || r.status === 201) {
    console.log('>>> УСПЕХ! Статус:', r.status);
    console.log('>>> Примени производи во WorkRelay:', data.applied || formatted.length);
    console.log('>>> Нотификација испратена: Кирил Неранџоски (Admin) has synced their products (pazarmax)');
  } else {
    console.log('>>> ОДГОВОР (' + r.status + '):', JSON.stringify(data));
  }
})
.catch(err => {
  console.error('>>> ГРЕШКА:', err.message);
});
"

echo.
echo ========================================================
pause
