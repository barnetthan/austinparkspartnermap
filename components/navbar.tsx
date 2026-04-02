"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { LogoutButton } from "./logout-button";

export function Navbar({ initialUser }: { initialUser: any }) {
  const [user, setUser] = useState(initialUser);
  const supabase = createClient();
  const pathname = usePathname();

  useEffect(() => {
    // 1. Keep the UI in sync with the actual Supabase session
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  // 2. MODIFIED: Only hide the navbar on specific auth pages if you want 
  // (e.g., maybe hide it only on the "Update Password" page but keep it on "Login")
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
        
        {/* If they are logged in, show the Admin link even on the Login page! */}
        {user && <Link href="/admin/admins">Admin</Link>}

        <div style={{ marginLeft: "auto" }} />

        {user ? (
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span style={{ fontSize: "12px", opacity: 0.6 }}>{user.email}</span>
            <LogoutButton />
          </div>
        ) : (
          /* Only show the Login link if they aren't already on the login page */
          pathname !== "/auth/login" && <Link href="/auth/login">Login</Link>
        )}
      </nav>
    </header>
  );
}