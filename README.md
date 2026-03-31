# Mojgan Wellness Tracker

A personal wellness tracker for daily habits, workouts, and progress trends.

## Setup (one time, ~15 minutes)

### Step 1: Supabase (database)

1. Go to [supabase.com](https://supabase.com) → Sign up with email
2. Click "New project" → name it `mojgan-tracker` → create a strong password → click Create
3. Wait ~2 min for it to provision
4. Go to **Settings → API** → copy:
   - `Project URL` → this is your `VITE_SUPABASE_URL`
   - `anon public` key → this is your `VITE_SUPABASE_ANON_KEY`
5. Go to **SQL Editor** → click "New query" → paste this and click Run:

```sql
create table daily_logs (
  id uuid default gen_random_uuid() primary key,
  date date not null unique,
  yoga boolean default false,
  sunlight boolean default false,
  midday_walk boolean default false,
  dinner_walk boolean default false,
  workout_done boolean default false,
  workout_type text,
  exercise_logs jsonb default '{}',
  notes text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

create index daily_logs_date_idx on daily_logs(date);
```

---

### Step 2: GitHub (code hosting)

1. Go to [github.com](https://github.com) → Sign up
2. Click **+** → New repository → name it `mojgan-tracker` → Public → Create
3. Download this project folder as a ZIP, unzip it
4. Open Terminal (Mac: Cmd+Space → type Terminal)
5. Run these commands one by one:

```bash
cd ~/Downloads/mojgan-tracker
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/mojgan-tracker.git
git push -u origin main
```

(Replace YOUR_USERNAME with your GitHub username)

---

### Step 3: Vercel (hosting)

1. Go to [vercel.com](https://vercel.com) → Sign up with GitHub
2. Click **Add New Project** → Import your `mojgan-tracker` repo
3. Before deploying, click **Environment Variables** and add:
   - `VITE_SUPABASE_URL` = your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY` = your Supabase anon key
4. Click **Deploy**
5. In ~1 minute you'll have a URL like `mojgan-tracker.vercel.app` — bookmark this!

---

## That's it

Open the URL on your phone, add it to your home screen (Share → Add to Home Screen on iPhone), and it works like an app.

## Features

- **Today** — daily habit check-ins (yoga, sunlight, walks) + workout logging
- **Workout** — exercise log with weights for Mon/Wed/Fri sessions
- **Trends** — weekly charts for habit score, morning routine, walks, workouts
- **History** — calendar view of all past logs, tap any day for details

## Reporting to Claude

At the end of each week, screenshot your Trends page and share it in your Claude conversation for adjustments and check-ins.
