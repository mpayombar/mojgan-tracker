import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseKey)

// SQL to run in Supabase SQL editor to create tables:
// 
// create table daily_logs (
//   id uuid default gen_random_uuid() primary key,
//   date date not null unique,
//   yoga boolean default false,
//   sunlight boolean default false,
//   midday_walk boolean default false,
//   dinner_walk boolean default false,
//   workout_done boolean default false,
//   workout_type text,
//   exercise_logs jsonb default '{}',
//   notes text,
//   created_at timestamp with time zone default now(),
//   updated_at timestamp with time zone default now()
// );
//
// create index daily_logs_date_idx on daily_logs(date);
