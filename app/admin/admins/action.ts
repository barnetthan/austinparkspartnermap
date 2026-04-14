"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function deleteAdmin(adminId: string) {
  // First check who is trying to make this change.
  const authClient = await createClient();
  const { data: { user: currentUser } } = await authClient.auth.getUser();

  if (!currentUser) throw new Error("You must be logged in.");
  if (currentUser.id === adminId) throw new Error("You cannot remove yourself.");

  // Use the service key because removing users needs extra permission.
  const adminClient = await createClient(true);

  // Remove the user's login account.
  const { error: authError } = await adminClient.auth.admin.deleteUser(adminId);
  if (authError) {
    console.error("Auth Delete Error:", authError);
    throw new Error("Could not remove user from Auth system.");
  }

  // Remove the matching row from the admin list too.
  const { error: tableError } = await adminClient
    .from("admins")
    .delete()
    .eq("id", adminId);

  if (tableError) throw tableError;

  revalidatePath("/admin/admins");
  return { success: true };
}
