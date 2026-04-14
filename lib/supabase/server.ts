import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Especially important if using Fluid compute: Don't put this client in a
 * global variable. Always create a new client within each function when using
 * it.
 */
export async function createClient(useServiceRole = false) {
  // Read the current cookies so Supabase knows who is signed in.
  const cookieStore = await cookies();

  // Most pages use the public key, but admin tasks need the service key.
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    useServiceRole 
      ? process.env.SUPABASE_SERVICE_ROLE_KEY! 
      : process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // This can happen in server code and can be ignored here.
          }
        },
      },
    },
  );
}
