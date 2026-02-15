alter table if exists public.listings
add column if not exists image_url text;
