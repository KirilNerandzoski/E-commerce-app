-- ==============================================================================
-- PazarMax.mk - Complete Supabase Database Schema & Seed Data
-- ==============================================================================
-- Run this script in the Supabase SQL Editor (https://app.supabase.com -> Project -> SQL Editor)

-- 1. EXTENSIONS
create extension if not exists "uuid-ossp";

-- 2. CATEGORIES TABLE
create table if not exists public.categories (
  id text primary key,
  name text not null,
  name_en text,
  icon text,
  slug text,
  image text,
  item_count int default 0,
  featured boolean default false,
  subcategories jsonb default '[]'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 3. PRODUCTS TABLE
create table if not exists public.products (
  id text primary key,
  title text not null,
  category text references public.categories(id) on delete set null,
  subcategory text,
  brand text not null,
  price numeric not null,
  original_price numeric,
  discount int default 0,
  rating numeric default 5.0,
  review_count int default 0,
  in_stock boolean default true,
  stock int default 10,
  is_direct_delivery boolean default false,
  is_deal_of_the_day boolean default false,
  is_best_seller boolean default false,
  is_trending boolean default false,
  is_new boolean default false,
  free_shipping boolean default false,
  images jsonb not null default '[]'::jsonb,
  description text,
  features jsonb default '[]'::jsonb,
  specifications jsonb default '{}'::jsonb,
  variants jsonb default null,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 4. USER PROFILES TABLE (Linked with Supabase Auth)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  full_name text,
  phone text,
  street text,
  city text,
  postal_code text,
  avatar_url text,
  role text default 'customer',
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- 5. ORDERS TABLE
create table if not exists public.orders (
  id text primary key,
  user_id uuid references auth.users on delete set null,
  date text not null,
  status text not null default 'Во обработка',
  status_code text not null default 'processing',
  tracking_number text not null,
  delivery_method text not null,
  payment_method text not null,
  address text not null,
  subtotal numeric not null,
  shipping numeric not null default 0,
  discount numeric not null default 0,
  total numeric not null,
  items jsonb not null default '[]'::jsonb,
  timeline jsonb not null default '[]'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 6. REVIEWS TABLE
create table if not exists public.reviews (
  id text primary key,
  product_id text references public.products(id) on delete cascade,
  user_id uuid references auth.users on delete set null,
  user_name text not null,
  rating int not null check (rating >= 1 and rating <= 5),
  date text not null,
  comment text not null,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 7. ENABLE ROW LEVEL SECURITY (RLS)
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.profiles enable row level security;
alter table public.orders enable row level security;
alter table public.reviews enable row level security;

-- Policies for public reading
create policy "Allow public read access on categories" on public.categories for select using (true);
create policy "Allow public read access on products" on public.products for select using (true);
create policy "Allow public read access on reviews" on public.reviews for select using (true);

-- Allow public insertion of reviews
create policy "Allow insert on reviews" on public.reviews for insert with check (true);

-- Allow public/authenticated insert on orders
create policy "Allow insert on orders" on public.orders for insert with check (true);
create policy "Allow read on orders" on public.orders for select using (true);

-- Profile policies
create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);
create policy "Users can insert own profile" on public.profiles for insert with check (auth.uid() = id);

-- Trigger to auto-create profile on Supabase Auth Signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, phone)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'phone');
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ==============================================================================
-- 8. SEED CATEGORIES DATA
-- ==============================================================================
insert into public.categories (id, name, name_en, icon, slug, image, item_count, featured, subcategories)
values
  ('electronics', 'Електроника & Телефони', 'Electronics & Phones', 'Smartphone', 'electronics', 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=80', 1420, true, '[{"id":"smartphones","name":"Паметни телефони (Smartphones)","count":480},{"id":"tablets","name":"Таблети & Читачи","count":180},{"id":"smartwatches","name":"Паметни часовници & Нараквици","count":260},{"id":"headphones","name":"Слушалки & Звучници","count":320},{"id":"chargers","name":"Полначи & Додатоци","count":180}]'::jsonb),
  ('computers', 'Компјутери & Гејминг', 'Computers & Gaming', 'Laptop', 'computers', 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&auto=format&fit=crop&q=80', 980, true, '[{"id":"laptops","name":"Лаптопи (Преносни компјутери)","count":340},{"id":"gaming-pc","name":"Гејминг десктопи & Конзоли","count":210},{"id":"monitors","name":"Монитори","count":160},{"id":"pc-peripherals","name":"Тастатури, Глувчиња & Падови","count":270}]'::jsonb),
  ('appliances', 'Бела техника & Апарати', 'Home Appliances', 'Refrigerator', 'appliances', 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=600&auto=format&fit=crop&q=80', 840, true, '[{"id":"large-appliances","name":"Фрижидери & Машини за перење","count":290},{"id":"kitchen-appliances","name":"Кафемати, Блендери & Air Fryer","count":310},{"id":"vacuum-cleaners","name":"Правосмукалки & Роботи","count":140},{"id":"air-conditioning","name":"Клима уреди & Прочистувачи","count":100}]'::jsonb),
  ('furniture', 'Мебел & Домување', 'Furniture & Living', 'Armchair', 'furniture', 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&auto=format&fit=crop&q=80', 650, true, '[{"id":"living-room","name":"Дневна соба & Гарнитури","count":190},{"id":"bedroom","name":"Спална соба & Душеци","count":220},{"id":"office-furniture","name":"Канцелариски столици & Бироа","count":140},{"id":"lighting","name":"Осветлување & Ламби","count":100}]'::jsonb),
  ('fashion', 'Облека, Обувки & Мода', 'Clothing, Shoes & Fashion', 'Shirt', 'fashion', 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&auto=format&fit=crop&q=80', 1890, true, '[{"id":"mens-clothing","name":"Машка облека","count":620},{"id":"womens-clothing","name":"Женска облека","count":710},{"id":"shoes","name":"Патики & Обувки","count":410},{"id":"accessories","name":"Ташни, Часовници & Очила","count":150}]'::jsonb),
  ('beauty', 'Убавина & Лична нега', 'Beauty & Personal Care', 'Sparkles', 'beauty', 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&auto=format&fit=crop&q=80', 720, true, '[{"id":"perfumes","name":"Парфеми & Тоалетни води","count":280},{"id":"skincare","name":"Нега на лице & Тело","count":240},{"id":"hair-care","name":"Фен, Преси & Нега на коса","count":120},{"id":"oral-care","name":"Електрични четки за заби","count":80}]'::jsonb),
  ('sports', 'Спорт & Опрема на отворено', 'Sports & Outdoors', 'Activity', 'sports', 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80', 560, false, '[{"id":"fitness","name":"Фитнес опрема & Тегови","count":180},{"id":"bicycles","name":"Велосипеди & Електрични тротинети","count":140},{"id":"outdoor","name":"Кампување & Планинарење","count":120},{"id":"sportswear","name":"Спортска опрема & Топки","count":120}]'::jsonb),
  ('groceries', 'Маркет & Кафе', 'Supermarket & Coffee', 'ShoppingBasket', 'groceries', 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&auto=format&fit=crop&q=80', 1100, false, '[{"id":"coffee-tea","name":"Кафе во зрно & Капсули","count":320},{"id":"sweets-snacks","name":"Слатки, Грицки & Чоколади","count":380},{"id":"olive-oil-pantry","name":"Маслиново масло & Тестенини","count":240},{"id":"drinks","name":"Пијалоци & Сокови","count":160}]'::jsonb),
  ('toys', 'Играчки & Бебешка опрема', 'Toys & Baby', 'Gamepad2', 'toys', 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=600&auto=format&fit=crop&q=80', 680, false, '[{"id":"lego-building","name":"LEGO сетови & Коцки","count":240},{"id":"board-games","name":"Друштвени игри & Сложувалки","count":170},{"id":"baby-gear","name":"Бебешки колички & Хранење","count":150},{"id":"plush-action","name":"Акциони фигури & Плишани играчки","count":120}]'::jsonb),
  ('tools-auto', 'Алати & Авто опрема', 'Tools & Automotive', 'Wrench', 'tools-auto', 'https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?w=600&auto=format&fit=crop&q=80', 750, false, '[{"id":"power-tools","name":"Електрични & Акумулаторски алати","count":290},{"id":"hand-tools","name":"Рачни алати & Куфери","count":210},{"id":"car-care","name":"Авто козметика & Моторни масла","count":140},{"id":"car-electronics","name":"Авто камери & Навигација","count":110}]'::jsonb),
  ('household', 'Кујна & Домаќинство', 'Kitchen & Household', 'Home', 'household', 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=600&auto=format&fit=crop&q=80', 890, false, '[{"id":"cookware","name":"Тенџериња, Тави & Ножеви","count":320},{"id":"bedding-textiles","name":"Постелнини, Пешкири & Ќебиња","count":280},{"id":"cleaning-supplies","name":"Средства & Организатори","count":170},{"id":"bathroom-decor","name":"Бања & Декоративни детали","count":120}]'::jsonb)
on conflict (id) do nothing;

-- ==============================================================================
-- 9. SEED INITIAL PRODUCTS
-- ==============================================================================
insert into public.products (id, title, category, subcategory, brand, price, original_price, discount, rating, review_count, in_stock, stock, is_direct_delivery, is_deal_of_the_day, is_best_seller, is_trending, is_new, free_shipping, images, description, features, specifications)
values
  ('prod-1', 'Apple iPhone 15 Pro Max 256GB Natural Titanium', 'electronics', 'smartphones', 'Apple', 79990, 89990, 11, 4.9, 142, true, 14, true, false, true, true, true, true, '["https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&auto=format&fit=crop&q=80","https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&auto=format&fit=crop&q=80"]'::jsonb, 'iPhone 15 Pro Max изработен од титаниум од воздушна класа. Опремен со моќниот A17 Pro чип и Pro систем на камери со 5x оптички зум.', '["A17 Pro чип со 6-јадрен GPU","6.7-инчен Super Retina XDR OLED дисплеј","Титаниумско куќиште"]'::jsonb, '{"Екран":"6.7 Super Retina XDR","Процесор":"Apple A17 Pro","RAM":"8 GB","Гаранција":"24 Месеци"}'::jsonb),
  ('prod-2', 'Samsung Galaxy S24 Ultra 5G 12GB/512GB Titanium Gray', 'electronics', 'smartphones', 'Samsung', 68990, 79990, 14, 4.8, 98, true, 9, true, true, true, true, true, true, '["https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800&auto=format&fit=crop&q=80"]'::jsonb, 'Samsung Galaxy S24 Ultra ја носи новата ера на Galaxy AI со вградено S Pen пенкало и 200MP камера.', '["Galaxy AI интелигентни алатки","200MP Quad Tele камера","5000 mAh батерија"]'::jsonb, '{"Екран":"6.8 Dynamic AMOLED 2X","RAM":"12 GB","Батерија":"5000 mAh"}'::jsonb),
  ('prod-8', 'Philips Airfryer XXL 3000 Серија со дигитален екран 7.2L', 'appliances', 'kitchen-appliances', 'Philips', 9990, 13990, 28, 4.8, 185, true, 25, true, true, true, true, false, true, '["https://images.unsplash.com/photo-1585515320310-259814833e62?w=800&auto=format&fit=crop&q=80"]'::jsonb, 'Гответе вкусно со до 90% помалку маснотии со технологијата Rapid Air. Голем капацитет од 7.2 литри идеален за семејни ручеци.', '["Капацитет 7.2 литри","Rapid Air технологија","16 програми"]'::jsonb, '{"Моќност":"2000 W","Капацитет":"7.2 L"}'::jsonb),
  ('prod-14', 'Nike Air Max 270 Машки Спортски Патики Triple Black', 'fashion', 'shoes', 'Nike', 9490, 11990, 20, 4.8, 240, true, 28, true, false, true, true, false, true, '["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80"]'::jsonb, 'Nike Air Max 270 имаат најголема пета со воздух на Nike досега, за супер меко газење што изгледа толку неверојатно колку што се чувствува.', '["270 Max Air перница","Дишлив горен дел"]'::jsonb, '{"Ѓон":"Air Max","Стил":"Спортски / Lifestyle"}'::jsonb),
  ('prod-21', 'Lavazza Qualità Oro Кафе во зрно 100% Arabica 1kg', 'groceries', 'coffee-tea', 'Lavazza', 1390, 1790, 22, 4.9, 380, true, 80, true, true, true, false, false, false, '["https://images.unsplash.com/photo-1587734195503-904fca47e0e9?w=800&auto=format&fit=crop&q=80"]'::jsonb, 'Италијанска кафе симфонија од 1956 година. 100% одбрани зрна Arabica со слатки цветни ноти.', '["100% Premium Arabica","Интензитет 5/10"]'::jsonb, '{"Нето тежина":"1 kg","Потекло":"Италија"}'::jsonb)
on conflict (id) do nothing;
