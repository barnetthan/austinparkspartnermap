import { createClient } from "@/lib/supabase/server";
import AdminManagement from "@/components/AdminManagement";

export default async function AdminAdminsPage() {
  // Load the admin list for the management table.
  const supabase = await createClient();
  const { data: admins, error } = await supabase.from("admins").select("*").limit(25);

  // Reuse the same admin management component here.
  return <AdminManagement admins={admins} error={error?.message ?? null} />;
}
