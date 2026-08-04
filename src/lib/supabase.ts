import { createClient } from '@supabase/supabase-js';

// Ключи берутся из .env локально и из Vercel → Settings → Environment Variables на проде.
const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

function isValidSupabaseUrl(value: string | undefined) {
  if (!value) return false;
  try {
    const parsed = new URL(value);
    return parsed.protocol === 'https:' || parsed.protocol === 'http:';
  } catch {
    return false;
  }
}

export const isSupabaseConfigured = Boolean(isValidSupabaseUrl(url) && anonKey);

// Запасные значения позволяют показать понятную подсказку в интерфейсе вместо белого экрана.
export const supabase = createClient(
  isSupabaseConfigured ? url! : 'https://not-configured.supabase.co',
  isSupabaseConfigured ? anonKey! : 'not-configured',
);
