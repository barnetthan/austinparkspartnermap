import Link from "next/link";

const tabs = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/partners", label: "Partners" },
  { href: "/admin/admins", label: "Admins" },
];

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
      <nav className="flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <Link
            key={tab.href}
            href={tab.href}
            className="rounded-md border px-3 py-1.5 text-sm hover:bg-muted"
          >
            {tab.label}
          </Link>
        ))}
      </nav>
      <div className="rounded-lg border bg-card p-4 shadow-sm">
      {children}
      </div>
    </section>
  );
}
