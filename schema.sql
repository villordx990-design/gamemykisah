-- Jalankan semua isi file ini di Supabase: SQL Editor > New Query > Run

create extension if not exists pgcrypto;

create table games (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  cover_image text,
  developer text,
  size text,
  version text,
  synopsis text,
  android_url text,
  pc_url text,
  patch_url text,
  tutorial_url text,
  created_at timestamptz default now()
);

create table site_settings (
  id int primary key default 1,
  banner_image text,
  background_image text,
  wa_group_url text,
  discord_url text
);

insert into site_settings (id) values (1);

alter table games enable row level security;
alter table site_settings enable row level security;

-- Semua orang boleh baca (tampil di halaman utama)
create policy "public read games" on games for select using (true);
create policy "public read settings" on site_settings for select using (true);

-- Hanya admin yang login yang boleh tambah/ubah/hapus
create policy "auth write games" on games for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "auth write settings" on site_settings for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
