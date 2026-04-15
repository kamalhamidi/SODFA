-- SODFA v2 - Supabase schema
-- Run this in Supabase SQL Editor

create table if not exists public.categories (
  id text primary key,
  name text not null,
  "nameAr" text,
  emoji text,
  description text,
  "order" integer default 0
);

create table if not exists public.products (
  id text primary key,
  name text not null,
  "nameAr" text,
  description text,
  "categoryId" text references public.categories(id) on delete set null,
  notes jsonb,
  sizes jsonb,
  price numeric not null default 0,
  stock integer not null default 0,
  image text,
  status text not null default 'active',
  "createdAt" timestamptz not null default now()
);

create table if not exists public.orders (
  id text primary key,
  customer jsonb not null,
  items jsonb not null,
  subtotal numeric not null default 0,
  shipping numeric not null default 0,
  total numeric not null default 0,
  status text not null default 'pending',
  timeline jsonb not null default '[]'::jsonb,
  "createdAt" timestamptz not null default now()
);

alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;

-- Demo policies for quick start.
-- For production, restrict admin writes and protect orders.
drop policy if exists "public read categories" on public.categories;
create policy "public read categories" on public.categories
for select using (true);

drop policy if exists "public write categories" on public.categories;
create policy "public write categories" on public.categories
for all using (true) with check (true);

drop policy if exists "public read products" on public.products;
create policy "public read products" on public.products
for select using (true);

drop policy if exists "public write products" on public.products;
create policy "public write products" on public.products
for all using (true) with check (true);

drop policy if exists "public read orders" on public.orders;
create policy "public read orders" on public.orders
for select using (true);

drop policy if exists "public write orders" on public.orders;
create policy "public write orders" on public.orders
for all using (true) with check (true);
