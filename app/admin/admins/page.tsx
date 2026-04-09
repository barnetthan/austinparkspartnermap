import { createClient } from "@/lib/supabase/server";
import AdminManagement from "@/components/AdminManagement";

export default async function AdminAdminsPage() {
  const supabase = await createClient();
  const { data: admins, error } = await supabase.from("admins").select("*").limit(25);

  return <AdminManagement admins={admins} error={error?.message ?? null} />;
}
