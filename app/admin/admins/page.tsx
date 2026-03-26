import { createClient } from "@/lib/supabase/server";

export default async function AdminAdminsPage() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("admins").select("*").limit(25);

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold">Admins</h2>
        <p className="text-sm text-muted-foreground">
          Admin management UI scaffold. Integrate with your final auth flow next.
        </p>
      </div>

      <div className="rounded-lg border p-4">
        {error ? (
          <p className="text-sm text-muted-foreground">
            Could not load the `admins` table yet: {error.message}
          </p>
        ) : !data || data.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No admins found. Ask backend to create/populate the `admins` table.
          </p>
        ) : (
          <div className="space-y-2">
            {data.map((admin, index) => (
              <div
                key={String(admin.id ?? index)}
                className="rounded border p-3 text-sm"
              >
                <pre className="whitespace-pre-wrap">
                  {JSON.stringify(admin, null, 2)}
                </pre>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
