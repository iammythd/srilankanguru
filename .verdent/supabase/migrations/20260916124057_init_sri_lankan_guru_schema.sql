-- ============================================================
-- Sri Lankan Guru — Supabase schema
-- Run in the Supabase SQL editor (or via supabase db push).
-- ============================================================

create extension if not exists "pgcrypto";

-- ---------- profiles ----------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  home_country text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------- destination content ----------
create table if not exists public.destinations (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  region text not null,
  lat double precision,
  lng double precision,
  summary text,
  description text,
  image_url text,
  duration_min int default 1,
  duration_max int default 2,
  created_at timestamptz not null default now()
);

create table if not exists public.destination_categories (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  label text not null
);

create table if not exists public.destination_category_map (
  destination_id uuid references public.destinations(id) on delete cascade,
  category_id uuid references public.destination_categories(id) on delete cascade,
  primary key (destination_id, category_id)
);

create table if not exists public.experiences (
  id uuid primary key default gen_random_uuid(),
  destination_id uuid references public.destinations(id) on delete cascade,
  title text not null,
  description text,
  category text,
  duration_minutes int default 90
);

create table if not exists public.travel_routes (
  id uuid primary key default gen_random_uuid(),
  from_destination uuid references public.destinations(id) on delete cascade,
  to_destination uuid references public.destinations(id) on delete cascade,
  typical_hours numeric(4,1) default 3,
  notes text
);

create index if not exists experiences_destination_idx on public.experiences (destination_id);
create index if not exists routes_from_idx on public.travel_routes (from_destination);
create index if not exists routes_to_idx on public.travel_routes (to_destination);

-- ---------- itineraries (user-owned) ----------
create table if not exists public.itineraries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  status text not null default 'saved' check (status in ('draft', 'saved', 'completed')),
  itinerary jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.itinerary_days (
  id uuid primary key default gen_random_uuid(),
  itinerary_id uuid not null references public.itineraries(id) on delete cascade,
  day_number int not null,
  location text not null,
  theme text,
  unique (itinerary_id, day_number)
);

create table if not exists public.itinerary_activities (
  id uuid primary key default gen_random_uuid(),
  itinerary_day_id uuid not null references public.itinerary_days(id) on delete cascade,
  position int not null default 0,
  time_slot text,
  title text not null,
  description text,
  duration_minutes int default 90
);

create index if not exists itineraries_user_idx on public.itineraries (user_id);
create index if not exists itineraries_updated_idx on public.itineraries (updated_at desc);
create index if not exists itinerary_days_itinerary_idx on public.itinerary_days (itinerary_id);
create index if not exists itinerary_activities_day_idx on public.itinerary_activities (itinerary_day_id);

-- ---------- user preferences ----------
create table if not exists public.user_preferences (
  user_id uuid primary key references auth.users(id) on delete cascade,
  traveller_type text,
  pace text,
  budget_level text,
  interests text[] default '{}',
  special_requirements text[] default '{}',
  updated_at timestamptz not null default now()
);

-- ---------- updated_at trigger ----------
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists itineraries_touch on public.itineraries;
create trigger itineraries_touch before update on public.itineraries
  for each row execute function public.touch_updated_at();

drop trigger if exists profiles_touch on public.profiles;
create trigger profiles_touch before update on public.profiles
  for each row execute function public.touch_updated_at();

-- Auto-create a profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id) values (new.id) on conflict do nothing;
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
-- Row Level Security
-- ============================================================
alter table public.profiles enable row level security;
alter table public.destinations enable row level security;
alter table public.destination_categories enable row level security;
alter table public.destination_category_map enable row level security;
alter table public.experiences enable row level security;
alter table public.travel_routes enable row level security;
alter table public.itineraries enable row level security;
alter table public.itinerary_days enable row level security;
alter table public.itinerary_activities enable row level security;
alter table public.user_preferences enable row level security;

-- Public content: readable by everyone, writable only by the service role.
create policy "content is public" on public.destinations for select using (true);
create policy "content is public" on public.destination_categories for select using (true);
create policy "content is public" on public.destination_category_map for select using (true);
create policy "content is public" on public.experiences for select using (true);
create policy "content is public" on public.travel_routes for select using (true);

-- Profiles: owner read/update.
create policy "own profile select" on public.profiles for select using (auth.uid() = id);
create policy "own profile update" on public.profiles for update using (auth.uid() = id);

-- Itineraries: strictly owner-scoped.
create policy "own itineraries select" on public.itineraries
  for select using (auth.uid() = user_id);
create policy "own itineraries insert" on public.itineraries
  for insert with check (auth.uid() = user_id);
create policy "own itineraries update" on public.itineraries
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own itineraries delete" on public.itineraries
  for delete using (auth.uid() = user_id);

-- Child tables inherit ownership through the itinerary.
create policy "own days select" on public.itinerary_days
  for select using (
    exists (select 1 from public.itineraries i where i.id = itinerary_days.itinerary_id and i.user_id = auth.uid())
  );
create policy "own days write" on public.itinerary_days
  for all using (
    exists (select 1 from public.itineraries i where i.id = itinerary_days.itinerary_id and i.user_id = auth.uid())
  ) with check (
    exists (select 1 from public.itineraries i where i.id = itinerary_days.itinerary_id and i.user_id = auth.uid())
  );

create policy "own activities select" on public.itinerary_activities
  for select using (
    exists (
      select 1 from public.itinerary_days d
      join public.itineraries i on i.id = d.itinerary_id
      where d.id = itinerary_activities.itinerary_day_id and i.user_id = auth.uid()
    )
  );
create policy "own activities write" on public.itinerary_activities
  for all using (
    exists (
      select 1 from public.itinerary_days d
      join public.itineraries i on i.id = d.itinerary_id
      where d.id = itinerary_activities.itinerary_day_id and i.user_id = auth.uid()
    )
  ) with check (
    exists (
      select 1 from public.itinerary_days d
      join public.itineraries i on i.id = d.itinerary_id
      where d.id = itinerary_activities.itinerary_day_id and i.user_id = auth.uid()
    )
  );

create policy "own preferences select" on public.user_preferences for select using (auth.uid() = user_id);
create policy "own preferences write" on public.user_preferences
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ============================================================
-- Seed: destination categories (the ten experience themes)
-- ============================================================
insert into public.destination_categories (slug, label) values
  ('culture-heritage', 'Culture & Heritage'),
  ('wildlife', 'Wildlife'),
  ('beaches', 'Beaches'),
  ('scenic', 'Scenic'),
  ('adventure', 'Adventure'),
  ('food', 'Food'),
  ('wellness', 'Wellness'),
  ('photography', 'Photography'),
  ('luxury', 'Luxury'),
  ('family', 'Family')
on conflict (slug) do nothing;

-- ============================================================
-- Optional: Storage bucket for generated PDFs
-- ============================================================
insert into storage.buckets (id, name, public) values ('itinerary-pdfs', 'itinerary-pdfs', false)
on conflict (id) do nothing;