import { createClient } from "@supabase/supabase-js";

// Public connection details for the Up Mission backend. The publishable key is
// safe in the browser — all access is gated by Row Level Security.
const SUPABASE_URL = "https://nwoscxzuekjplgevlamn.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_8xNr6hsF-yZGFPrQVL7p5Q_QX2Cbcbe";

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false,
  },
});
