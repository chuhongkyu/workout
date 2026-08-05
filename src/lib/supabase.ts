import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
// 신규 publishable 키 우선, 없으면 legacy anon 키
const publishableKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/** .env.local (또는 Vercel 환경변수)에 URL/키가 설정됐는지 */
export const isSupabaseConfigured = Boolean(url && publishableKey);

let client: SupabaseClient | null = null;

/** 브라우저 싱글턴 Supabase 클라이언트. 미설정 시 null */
export function getSupabase(): SupabaseClient | null {
  if (!isSupabaseConfigured) {
    return null;
  }
  if (!client) {
    client = createClient(url as string, publishableKey as string, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
  }
  return client;
}
