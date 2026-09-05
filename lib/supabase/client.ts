import { createClient } from "@supabase/supabase-js";

const viteEnv = import.meta.env as unknown as Record<
  string,
  string | undefined
>;
const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || viteEnv.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  viteEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Supabase configuration is missing: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are required.",
  );
}

const supabaseConfig = { url: supabaseUrl, anonKey: supabaseAnonKey };

export const supabaseClient = createClient(
  supabaseConfig.url,
  supabaseConfig.anonKey,
);

export function getServiceSupabase() {
  const serviceKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY || viteEnv.SUPABASE_SERVICE_ROLE_KEY;

  if (!serviceKey) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY is required for service access.",
    );
  }

  return createClient(supabaseConfig.url, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
