import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function AdminPage() {
  const supabase = await createClient();
  const { count: partnerCount } = await supabase
    .from("partners")
    .select("*", { count: "exact", head: true });

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border p-4">
          <p className="text-sm text-muted-foreground">Total Partners</p>
          <p className="mt-1 text-3xl font-semibold">{partnerCount ?? 0}</p>
        </div>
        <div className="rounded-lg border p-4">
          <p className="text-sm text-muted-foreground">Admin Accounts</p>
          <p className="mt-1 text-3xl font-semibold">Pending setup</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Link href="/admin/partners" className="rounded-lg border p-4 hover:bg-muted">
          <h2 className="font-medium">Manage Partners</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Add, edit, and remove organizations shown on the map.
          </p>
        </Link>
        <Link href="/admin/admins" className="rounded-lg border p-4 hover:bg-muted">
          <h2 className="font-medium">Manage Admins</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Invite and manage who can access this admin portal.
          </p>
        </Link>
      </div>
    </div>
  );
}
