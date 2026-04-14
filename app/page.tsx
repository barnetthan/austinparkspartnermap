import { createClient } from "@/lib/supabase/server";
import HomeMap from "@/components/home-map";
import Link from "next/link";
import { Suspense } from "react";

type Partner = {
  id: string | number;
  name: string | null;
  description: string | null;
  latitude: number | null;
  longitude: number | null;
  display_order: number;
};

// Load the partner list and current sign-in state before showing the home page.
async function HomePageContent() {
  const supabase = await createClient();

  // If someone is signed in, show the admin shortcuts near the top.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Get all partner records so the map and list show the same information.
  const { data, error } = await supabase.from("partners").select("*");
  const partners = (data ?? []) as Partner[];

  // Only partners with coordinates can appear on the map.
  const mappedPartners = partners
    .filter(
      (partner) =>
        typeof partner.latitude === "number" &&
        typeof partner.longitude === "number",
    )
    .map((partner) => ({
      id: String(partner.id),
      name: partner.name ?? "Untitled partner",
      description: partner.description,
      latitude: partner.latitude as number,
      longitude: partner.longitude as number,
      display_order: partner.display_order as number,
    }));

  return (
    <div className="space-y-8">
      {/* Top section with the page title and admin shortcuts. */}
      <section className="overflow-hidden rounded-2xl border">
        <div className="bg-gradient-to-r from-[#0a2b52] via-[#0c3a66] to-[#164d80] px-8 py-16 text-white">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300">
            Austin Parks Foundation
          </p>
          <h1 className="mt-3 max-w-2xl text-4xl font-extrabold leading-tight md:text-5xl">
            Partner Map
          </h1>
          <p className="mt-4 max-w-2xl text-sm text-slate-100/90 md:text-base">
            Discover organizations supporting Austin parks, trails, and green
            spaces. Click a marker to explore partner details.
          </p>

          {/* Only show the management buttons when someone is signed in. */}
          {user && (
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/admin/partners"
                className="rounded-md bg-white px-5 py-2 text-sm font-semibold text-[#0a2b52] hover:bg-slate-100"
              >
                Manage Partners
              </Link>
              <Link
                href="/admin"
                className="rounded-md border border-white/40 bg-white/10 px-5 py-2 text-sm font-semibold text-white hover:bg-white/20"
              >
                Open Admin Portal
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Map section showing partner locations. */}
      <section className="rounded-xl border bg-card p-5">
        <div className="mb-4">
          <h2 className="text-2xl font-bold">Partner Locations</h2>
          <p className="text-sm text-muted-foreground">
            Interactive map powered by OpenStreetMap and Leaflet.
          </p>
        </div>
        <div className="overflow-hidden rounded-xl border">
          <HomeMap partners={mappedPartners} />
        </div>
        {mappedPartners.length === 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">
            No coordinates found yet. Add latitude and longitude on the admin
            partners page to show markers.
          </p>
        ) : null}
      </section>

      {/* Text list of the same partner data shown on the map. */}
      <section className="rounded-xl border p-6">
        <h2 className="text-2xl font-bold">Current Partners</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Partner entries currently stored in Supabase.
        </p>
        {error ? (
          <p className="mt-4 text-sm text-red-600">
            Error loading partners: {error.message}
          </p>
        ) : partners.length === 0 ? (
          <p className="mt-4 text-sm text-muted-foreground">
            No partners found yet. Use the admin panel to add the first one.
          </p>
        ) : (
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {partners
              .sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0))
              .map((partner, index) => (
                <div
                  key={String(partner.id ?? index)}
                  className="rounded-lg border bg-muted/20 p-4"
                >
                  <h3 className="font-semibold uppercase tracking-wide text-[#0a2b52]">
                    {partner.name ?? "Untitled partner"}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {partner.description ?? "No description provided."}
                  </p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {typeof partner.latitude === "number" &&
                    typeof partner.longitude === "number"
                      ? `Coordinates: ${partner.latitude}, ${partner.longitude}`
                      : "Coordinates pending"}
                  </p>
                </div>
              ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense
      fallback={
        <div className="rounded-xl border p-6 text-sm text-muted-foreground">
          Loading partner map...
        </div>
      }
    >
      <HomePageContent />
    </Suspense>
  );
}
