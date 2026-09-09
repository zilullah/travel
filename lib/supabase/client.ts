import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "Supabase configuration is missing: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are required for real-time persistence.",
  );
}

const supabaseConfig = {
  url: supabaseUrl || "https://placeholder.supabase.co",
  anonKey: supabaseAnonKey || "placeholder-anon-key",
};

export const supabaseClient = createClient(
  supabaseConfig.url,
  supabaseConfig.anonKey,
);

export function getServiceSupabase() {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseConfig.anonKey;

  return createClient(supabaseConfig.url, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
