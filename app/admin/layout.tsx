import { AdminNav } from "@/components/admin-nav";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">Admin Portal</h1>
        <p className="text-sm text-muted-foreground">
          Manage partner organizations and admin access.
        </p>
      </div>
      <AdminNav />
      <div className="rounded-lg border bg-card p-4 shadow-sm">
      {children}
      </div>
    </section>
  );
}
