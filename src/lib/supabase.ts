import { createClient } from '@supabase/supabase-js';

// Keys come from .env locally and Vercel → Settings → Environment Variables in production.
const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const isSupabaseConfigured = Boolean(url && anonKey);

// Fallback values let the UI show a useful setup message instead of a blank screen.
export const supabase = createClient(
  url ?? 'https://not-configured.supabase.co',
  anonKey ?? 'not-configured',
);
