/**
 * NEXT_PUBLIC_SUPABASE_URL - プロジェクトベースURL（APIエンドポイント）
 * NEXT_PUBLIC_SUPABASE_ANON_KEY - アクセス用APIキー（パブリックキー）
 **/
import { createClient } from '@supabase/supabase-js';

// Supabase（公式で推奨の書き方）
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// 汎用コード（動かないが雛形としてとっておく）
// const getEnvOrThrow = (key: string): string => {
//   const value = process.env[key];
//   if (!value) throw new Error(`環境変数 ${key} が未設定です`);
//   return value;
// };

// const url = getEnvOrThrow('NEXT_PUBLIC_SUPABASE_URL');
// const anonKey = getEnvOrThrow('NEXT_PUBLIC_SUPABASE_ANON_KEY');

// export const supabase = createClient(url, anonKey);
