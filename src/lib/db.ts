import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// service_role キーを使うサーバー専用クライアント。ブラウザには絶対に出さないこと。
// 環境変数が未設定の間は null を返し、呼び出し側は保存・送信をスキップする
// (チェッカー自体は DB なしでも動く設計を維持する)。

let cached: SupabaseClient | null | undefined;

export function getDb(): SupabaseClient | null {
  if (cached !== undefined) return cached;
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    cached = null;
    return cached;
  }
  cached = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return cached;
}
