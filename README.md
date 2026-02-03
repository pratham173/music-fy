# MusicFlow

Premium Apple-inspired music streaming experience built with React + Vite.

## Features
- Jamendo API streaming + search
- Offline downloads (IndexedDB)
- User uploads (MP3/WAV/OGG/AAC)
- PWA + Service Worker
- Light/Dark + accent themes
- Media Session API
- Playlists with covers, drag-and-drop ordering, and realtime collaboration
- Supabase authentication (magic link + Google/Apple OAuth)

## Setup

```bash
npm install
cp .env.example .env
npm run dev
```

## Environment Variables

```
VITE_JAMENDO_CLIENT_ID=YOUR_CLIENT_ID
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
```

## Supabase SQL

```sql
create table profiles (
  id uuid primary key references auth.users on delete cascade,
  email text unique
);

create table playlists (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  name text not null,
  cover_url text,
  created_at timestamptz default now()
);

create table playlist_tracks (
  playlist_id uuid references playlists on delete cascade,
  track_id text,
  title text,
  artist text,
  image text,
  audio text,
  order_index int default 0,
  primary key (playlist_id, track_id)
);

create table playlist_members (
  playlist_id uuid references playlists on delete cascade,
  user_id uuid references auth.users on delete cascade,
  primary key (playlist_id, user_id)
);
```

## Supabase Storage
Create a public bucket named `playlist-covers`.

## OAuth Redirects
Set site URL and redirect URL to:
```
http://localhost:5173
```
