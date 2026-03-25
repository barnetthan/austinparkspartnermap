import Link from "next/link";
import { getAdminStatus } from "@/lib/supabase/admin";
import { LogoutButton } from "@/components/logout-button";

export async function Navbar() {
  const { user, isAdmin } = await getAdminStatus();

  return (
    <nav className="flex w-full flex-wrap items-center gap-3">
      <Link href="/" className="flex items-center gap-3">
        <div className="flex h-14 w-14 items-center justify-center rounded-[1.15rem] border-2 border-[#63c67a] bg-[#f5f6ee] text-[#63c67a] shadow-sm">
          <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-current text-[11px] font-black uppercase tracking-[0.22em]">
            AP
          </div>
        </div>
        <div className="space-y-0.5 leading-none">
          <p className="text-[2rem] font-black uppercase tracking-[-0.06em] text-[#63c67a]">
            Austin
          </p>
          <p className="text-[2rem] font-black uppercase tracking-[-0.06em] text-[#63c67a]">
            Parks
          </p>
          <p className="pl-0.5 text-[0.72rem] font-black uppercase tracking-[0.16em] text-[#63c67a]">
            Foundation
          </p>
        </div>
      </Link>

      <div className="ml-auto flex flex-wrap items-center gap-1 text-sm font-medium text-primary">
        <Link className="rounded-full px-4 py-2 hover:bg-primary/5" href="/">
          Home
        </Link>
        {isAdmin && (
          <Link className="rounded-full px-4 py-2 hover:bg-primary/5" href="/partners">
            Partners
          </Link>
        )}
        {isAdmin && (
          <Link className="rounded-full px-4 py-2 hover:bg-primary/5" href="/admins">
            Admins
          </Link>
        )}
        {user ? (
          <LogoutButton />
        ) : (
          <Link
            className="rounded-full bg-accent px-5 py-2.5 font-semibold text-accent-foreground shadow-sm hover:bg-accent/90"
            href="/auth/login"
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}
