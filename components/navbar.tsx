import Link from "next/link";
import { getAdminStatus } from "@/lib/supabase/admin";
import { LogoutButton } from "@/components/logout-button";

export async function Navbar() {
  const { user, isAdmin } = await getAdminStatus();

  return (
    <nav
      style={{
        display: "flex",
        gap: 12,
        alignItems: "center",
        width: "100%",
      }}
    >
      <Link href="/">Home</Link>

      {isAdmin && <Link href="/partners">Partners</Link>}
      {isAdmin && <Link href="/admins">Admins</Link>}

      <div style={{ marginLeft: "auto" }} />

      {user ? <LogoutButton /> : <Link href="/auth/login">Login</Link>}
    </nav>
  );
}