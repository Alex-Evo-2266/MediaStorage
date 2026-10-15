create extension if not exists "pgcrypto";

create type public.media_type as enum ('image', 'video', 'audio');

create table if not exists public.media_items (
    id uuid primary key default gen_random_uuid(),
    owner_id uuid not null references auth.users (id) on delete cascade,
    title text not null,
    type public.media_type not null,
    size bigint not null check (size >= 0),
    file_path text not null unique,
    preview_url text not null,
    duration_seconds integer null check (duration_seconds is null or duration_seconds >= 0),
    tags text[] not null default '{}',
    created_at timestamptz not null default now(),
    constraint media_items_title_not_empty check (length(trim(title)) > 0),
    constraint media_items_file_path_not_empty check (length(trim(file_path)) > 0),
    constraint media_items_preview_url_not_empty check (length(trim(preview_url)) > 0)
);

create table if not exists public.collections (
    id uuid primary key default gen_random_uuid(),
    owner_id uuid not null references auth.users (id) on delete cascade,
    name text not null,
    description text not null default '',
    created_at timestamptz not null default now(),
    constraint collections_name_not_empty check (length(trim(name)) > 0)
);

create table if not exists public.collection_items (
    id uuid primary key default gen_random_uuid(),
    collection_id uuid not null references public.collections (id) on delete cascade,
    media_item_id uuid not null references public.media_items (id) on delete cascade,
    created_at timestamptz not null default now(),
    constraint collection_items_unique unique (collection_id, media_item_id)
);

create index if not exists idx_media_items_owner_created_at
    on public.media_items (owner_id, created_at desc);

create index if not exists idx_media_items_owner_type_created_at
    on public.media_items (owner_id, type, created_at desc);

create index if not exists idx_media_items_owner_title
    on public.media_items (owner_id, title);

create index if not exists idx_media_items_tags_gin
    on public.media_items using gin (tags);

create index if not exists idx_collections_owner_created_at
    on public.collections (owner_id, created_at desc);

create index if not exists idx_collections_owner_name
    on public.collections (owner_id, name);

create index if not exists idx_collection_items_collection_id
    on public.collection_items (collection_id);

create index if not exists idx_collection_items_media_item_id
    on public.collection_items (media_item_id);

alter table public.media_items enable row level security;
alter table public.collections enable row level security;
alter table public.collection_items enable row level security;

create policy "Media items are viewable by owner only"
on public.media_items for select
to authenticated
using (owner_id = auth.uid());

create policy "Users can insert their own media items"
on public.media_items for insert
to authenticated
with check (owner_id = auth.uid());

create policy "Users can update their own media items"
on public.media_items for update
to authenticated
using (owner_id = auth.uid())
with check (owner_id = auth.uid());

create policy "Users can delete their own media items"
on public.media_items for delete
to authenticated
using (owner_id = auth.uid());

create policy "Collections are viewable by owner only"
on public.collections for select
to authenticated
using (owner_id = auth.uid());

create policy "Users can insert their own collections"
on public.collections for insert
to authenticated
with check (owner_id = auth.uid());

create policy "Users can update their own collections"
on public.collections for update
to authenticated
using (owner_id = auth.uid())
with check (owner_id = auth.uid());

create policy "Users can delete their own collections"
on public.collections for delete
to authenticated
using (owner_id = auth.uid());

create policy "Collection items are viewable only for collection owner"
on public.collection_items for select
to authenticated
using (
    exists (
        select 1
        from public.collections c
        where c.id = collection_id and c.owner_id = auth.uid()
    )
);

create policy "Users can add only own files to their own collections"
on public.collection_items for insert
to authenticated
with check (
    exists (
        select 1
        from public.collections c
        where c.id = collection_id and c.owner_id = auth.uid()
    )
    and exists (
        select 1
        from public.media_items m
        where m.id = media_item_id and m.owner_id = auth.uid()
    )
);

create policy "Users can delete rows from their own collections"
on public.collection_items for delete
to authenticated
using (
    exists (
        select 1
        from public.collections c
        where c.id = collection_id and c.owner_id = auth.uid()
    )
);

comment on table public.media_items is 'Metadata of uploaded files stored in Supabase Storage by the owner user.';
comment on table public.collections is 'User collections that group media items into logical sets.';
comment on table public.collection_items is 'Many-to-many link between collections and media items with uniqueness guarantee.';
