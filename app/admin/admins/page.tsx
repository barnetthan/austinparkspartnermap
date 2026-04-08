import { createClient } from "@/lib/supabase/server";
import InviteAdminForm from "@/components/InviteAdminForm";
import { DeleteAdminButton } from "@/components/delete-admin-button";

export default async function AdminAdminsPage() {
  const supabase = await createClient();
  const { data: admins, error } = await supabase.from("admins").select("*").limit(25);

  return (
    <div className="space-y-8 p-6">
      {/* 1. HEADER SECTION */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-[#004d44]">Admin Management</h2>
        <p className="text-sm text-muted-foreground">
          Invite new team members and manage existing permissions.
        </p>
      </div>

      {/* 2. THE INVITE FORM SECTION */}
      <section className="max-w-md">
        <InviteAdminForm /> 
      </section>

      <hr className="my-8" />
      {/* 3. THE ADMINS TABLE SECTION */}
      <div>
        <p className="text-sm text-muted-foreground">
          View and manage team members who have access to this dashboard.
        </p>
      </div>

      <div className="rounded-md border bg-white">
        {error ? (
          <div className="p-8 text-center text-sm text-red-500">
            Error loading admins: {error.message}
          </div>
        ) : !admins || admins.length === 0 ? (
          <div className="p-8 text-center text-sm text-muted-foreground">
            No admins found in the system.
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50 transition-colors">
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Email</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Date Joined</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {admins.map((admin) => (
                <tr key={admin.id} className="hover:bg-muted/50 transition-colors">
                  <td className="p-4 align-middle font-medium">{admin.email}</td>
                  <td className="p-4 align-middle text-muted-foreground">
                    {new Date(admin.created_at).toLocaleDateString()}
                  </td>
                  <td className="p-4 align-middle">
                    {/* Lauren/Fareedah can add the Delete logic here later */}
                      <DeleteAdminButton adminId={admin.id} email={admin.email} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
