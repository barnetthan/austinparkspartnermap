import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  // This client runs in the browser and uses the public Supabase key.
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  );
}
