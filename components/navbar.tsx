"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { LogoutButton } from "./logout-button";

export function Navbar({ initialUser }: { initialUser: any }) {
  // Start with the signed-in user from the server, then keep it updated in the browser.
  const [user, setUser] = useState(initialUser);
  const supabase = createClient();
  const pathname = usePathname();

  useEffect(() => {
    // Watch for login changes so the header stays correct.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  // Hide the navbar on the password reset page to keep that screen simple.
  if (pathname === "/auth/update-password") return null;

  return (
    <header
      style={{
        borderBottom: "1px solid rgba(0,0,0,0.1)",
        padding: "12px 16px",
      }}
    >
      <nav
        style={{
          display: "flex",
          gap: 12,
          alignItems: "center",
          width: "100%",
        }}
      >
        <Link href="/">Home</Link>
        
        {/* Signed-in users get a link to the admin area. */}
        {user && <Link href="/admin/admins">Admin</Link>}

        <div style={{ marginLeft: "auto" }} />

        {user ? (
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span style={{ fontSize: "12px", opacity: 0.6 }}>{user.email}</span>
            <LogoutButton />
          </div>
        ) : (
          // Only show the login link when the user is not already on that page.
          pathname !== "/auth/login" && <Link href="/auth/login">Login</Link>
        )}
      </nav>
    </header>
  );
}
