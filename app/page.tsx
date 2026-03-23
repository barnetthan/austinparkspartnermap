import { createClient } from "@/lib/supabase/server";
import { Suspense } from "react";

async function PartnersList() {
  const supabase = await createClient();
  const { data: partners, error } = await supabase.from("partners").select("*");

  if (error) {
    return (
      <p className="mt-4 text-red-600">Error loading partners: {error.message}</p>
    );
  }

  if (!partners || partners.length === 0) {
    return <p className="mt-4 text-gray-600">No partners found.</p>;
  }

  return (
    <div className="mt-4 space-y-3">
      {partners.map((partner, index) => (
        <div key={String(partner.id ?? index)} className="rounded border p-3">
          <pre className="text-sm whitespace-pre-wrap">
            {JSON.stringify(partner, null, 2)}
          </pre>
        </div>
      ))}
    </div>
  );
}

export default function HomePage() {
  return (
    <main>
      <h1 className="text-4xl font-bold">Home</h1>
      <p className="text-lg text-gray-600">Partner data loaded on page load.</p>
      <Suspense fallback={<p className="mt-4 text-gray-600">Loading partners...</p>}>
        <PartnersList />
      </Suspense>
    </main>
  );
}