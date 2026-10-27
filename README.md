# PazarMax.mk - Premium Frontend-Only General E-Commerce Marketplace

An authentic, modern, and high-performance general e-commerce marketplace named **PazarMax.mk**. Built with **React 19**, **Tailwind CSS v4**, **Lucide Icons**, **Canvas Confetti**, and **LocalStorage**.

---

## 🌟 Key Features

### 1. 🛍️ Brand Experience & Balkan Marketplace UX
- **Identity**: Warm amber/orange signature branding with modern typography (`Plus Jakarta Sans`), subtle shadows, and crisp product-focused card designs.
- **Dual Currency Switch**: Instant real-time conversion between Macedonian Denar (**ден. MKD**) and Euro (**€ EUR**) across all products, carts, installments, and receipts.
- **Service Badges**:
  - **⚡ PazarMax Direkt 24h**: Guaranteed fast next-day dispatch from the central fulfillment hub.
  - **📦 PazarMax Paketomat 24/7**: Automated parcel lockers available around the clock.
  - **0% Installments**: Simulated 12/24 month zero-interest rate calculator (`од 1.250 ден./мес.`).
  - **14 Days Easy Returns & Official Warranty**: 24-month manufacturer warranties on verified products.

### 2. 🏠 Dynamic Homepage
- **Hero Slider**: Auto-rotating promotional campaign slides with custom badge highlights, imagery, and CTAs.
- **Side Highlights**: "PazarMax Direkt Hub" and "PazarMax Paketomat 24/7" quick-access cards.
- **Flash Deals of the Day ("Супер Зделки")**: Real-time ticking countdown timer (Hours:Minutes:Seconds) with discount tags.
- **Category Grid**: Visual category pills covering 11 comprehensive departments.
- **Best Sellers Tabs**: Tabbed category filtering for high-demand items.
- **Voucher Promo Banners**: Copyable discount coupons with instant clipboard feedback (`PAZAR10`, `FREESHIP`).
- **Partner Brands**: Apple, Samsung, Sony, Philips, Bosch, Dyson, Nike, Makita, Xiaomi, and more.
- **Personalized Recommendations**: Dynamic "Препорачано за тебе" based on browsing history and top ratings.
- **Recently Viewed**: Persisted across sessions via `localStorage`.

### 3. 📂 11 Realistic Product Categories & 32+ Mock Products
1. **Електроника & Телефони** (Smartphones, Smartwatches, Headphones, Audio)
2. **Компјутери & Гејминг** (Laptops, Gaming PCs, Monitors, Peripherals)
3. **Бела техника & Апарати** (Large Appliances, Kitchen, Airfryers, Vacuums)
4. **Мебел & Домување** (Office, Living Room, Lighting)
5. **Облека, Обувки & Мода** (Men's & Women's clothing, Nike sneakers, Michael Kors bags)
6. **Убавина & Лична нега** (Perfumes, Oral-B AI toothbrushes, Skincare)
7. **Спорт & Опрема на отворено** (Xiaomi Scooters, Adjustable dumbells)
8. **Маркет & Кафе** (Lavazza coffee, Greek Extra Virgin Olive Oil)
9. **Играчки & Бебешка опрема** (LEGO Icons Porsche, Board games)
10. **Алати & Авто опрема** (Makita cordless drills, Castrol EDGE motor oil)
11. **Кујна & Домаќинство** (Tefal cookware sets, Egyptian cotton bedding)

### 4. 🔍 Live Autocomplete Search & Category MegaMenu
- **Live Search**: Autocomplete drop-down providing immediate matching product suggestions, matching categories, and clickable popular search queries.
- **MegaMenu**: 2-level hierarchical navigation with subcategory counts and promotional banner.

### 5. 🎛️ Catalog & Filter System
- **Layout Switcher**: Toggle between 3/4 column **Grid View** and detailed **List View**.
- **Sidebar Filters**:
  - Category hierarchy with live counts
  - Price range slider + Min/Max inputs
  - Brand multi-selection with dedicated search filter
  - Minimum rating filter (4★ & up, 3★ & up)
  - "Само на залиха" (In-stock only)
  - "Само со попуст" (Discounts only)
  - "PazarMax Direkt 24h" filter
  - "Бесплатна достава" filter
- **Sorting**: Popularity, Price (Low to High), Price (High to Low), Customer Rating, Discount %, and Newest.
- **Active Filter Chips**: 1-click removal of individual filters or "Исчисти сѐ".
- **Pagination & Load More**: Smooth pagination with page count indicator.

### 6. 📱 Interactive Product Detail Page (PDP)
- **High-Definition Gallery**: Clickable thumbnail selector and hover zoom.
- **Product Options**: Color and storage/size variant selectors.
- **Stock Limit & Quantity Controls**: Step-by-step quantity adjuster.
- **Dual CTAs**: "Во кошничка" (Add to Cart) and "Купи веднаш" (Buy Now direct to checkout).
- **Tabbed Information**:
  - Description & bullet features
  - Full technical specifications table
  - Customer reviews breakdown + **Live "Напиши рецензија" form modal** that dynamically recalculates average ratings!
  - Delivery and warranty guide
- **Frequently Bought Together**: 2-product discounted bundle with 1-click add to cart.
- **Related Products**: Recommended products from the same category.

### 7. 🛒 Shopping Cart & Slide-Over Drawer
- Quick **Cart Drawer** accessible from anywhere on the site + dedicated full **Cart Page**.
- **Free Shipping Progress Meter**: Real-time visual progress bar towards the free delivery threshold (`1.500 ден.`).
- **Working Coupons**:
  - `PAZAR10`: 10% discount on entire cart
  - `POPUST500`: 500 ден. discount on orders over 3,000 ден.
  - `FREESHIP`: 100% free delivery on any order

### 8. ⚖️ Product Comparison Matrix
- Bottom floating dock when 1+ products are selected.
- Side-by-side comparison matrix of up to 4 items with specs, ratings, prices, and a "Означи разлики" (Highlight differences) toggle.

### 9. 💳 Simulated Checkout & Order Confirmation
- 4-step streamlined checkout:
  1. Shipping Address & Contact info (pre-filled with demo user profile)
  2. Delivery Method (PazarMax Direkt 24h, Standard courier, or Paketomat 24/7)
  3. Payment Method (Cash on delivery, simulated Credit Card with live validation, or 0% Installments)
  4. Order Summary & Agreement
- **Celebratory Confirmation Screen**: Confetti celebration (`canvas-confetti`), Order ID generation, simulated tracking timeline, and order storage in user history.

### 10. 👤 Demo User Profile
- Pre-populated demo user (`Александар Петровски`).
- Order history with tracking timeline and item breakdown.
- Editable personal details (saved to `localStorage`).
- Saved delivery addresses (Home & Office).
- Notification preferences.

---

## 🚀 Running the Project

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Build for production
npm run build

# 4. Preview production build
npm run preview
```
