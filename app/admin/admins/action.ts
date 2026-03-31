// app/admin/admins/actions.ts
"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function deleteAdmin(adminId: string) {
  // 1. Create a standard client first to check who is making the request
  const authClient = await createClient(); 
  const { data: { user: currentUser } } = await authClient.auth.getUser();

  if (!currentUser) throw new Error("You must be logged in.");
  if (currentUser.id === adminId) throw new Error("You cannot delete yourself.");

  // 2. Create a ADMIN client using the Service Role Key
  // This provides the high-level "Bearer Token" required for auth.admin.deleteUser
  const adminClient = await createClient(true); 

  // 3. Delete from Supabase Auth
  const { error: authError } = await adminClient.auth.admin.deleteUser(adminId);
  if (authError) {
    console.error("Auth Delete Error:", authError);
    throw new Error("Could not remove user from Auth system.");
  }

  // 4. Delete from your 'admins' table
  const { error: tableError } = await adminClient
    .from("admins")
    .delete()
    .eq("id", adminId);

  if (tableError) throw tableError;

  revalidatePath("/admin/admins");
  return { success: true };
}