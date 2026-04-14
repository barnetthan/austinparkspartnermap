import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { hasEnvVars } from "../utils";

// Set this to `true` if you want most pages to require a login.
export const REQUIRE_LOGIN = false;

export async function updateSession(request: NextRequest) {
  // Start with a normal response so login cookies can be updated.
  let supabaseResponse = NextResponse.next({
    request,
  });

  // If the app is missing settings, let the request continue as usual.
  if (!hasEnvVars) {
    return supabaseResponse;
  }

  // Create a new client for each request.
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // Keep this section simple so sign-in stays working.

  // This check helps keep signed-in users logged in.
  const { data } = await supabase.auth.getClaims();
  const user = data?.claims;

  // Login protection is off for now.
  if (REQUIRE_LOGIN) {
    if (
      request.nextUrl.pathname !== "/" &&
      !user &&
      !request.nextUrl.pathname.startsWith("/login") &&
      !request.nextUrl.pathname.startsWith("/auth") &&
      !request.nextUrl.pathname.startsWith("/map")
    ) {
      // If nobody is signed in, send them to login.
      const url = request.nextUrl.clone();
      url.pathname = "/auth/login";
      return NextResponse.redirect(url);
    }
  }

  // Return the response with the updated cookies.
  return supabaseResponse;
}
