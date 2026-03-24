import { createClient as createBrowserClient } from "@/lib/supabase/client";
import { createClient as createServerClient } from "@/lib/supabase/server";

// Used right after login on the client
export async function isLoggedInUserAdmin() {
  const supabase = createBrowserClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    return false;
  }

  const email = user.email.toLowerCase();

  const { data: admin } = await supabase
    .from("admins")
    .select("email")
    .eq("email", email)
    .maybeSingle();

  return !!admin;
}

// Used by the navbar on the server
export async function getAdminStatus() {
  const supabase = await createServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    return { user: null, isAdmin: false };
  }

  const email = user.email.toLowerCase();

  const { data: admin } = await supabase
    .from("admins")
    .select("email")
    .eq("email", email)
    .maybeSingle();

  return {
    user,
    isAdmin: !!admin,
  };
}
