import { Suspense } from "react";

import { createClient } from "@/lib/supabase/server";
import { HomeMap } from "@/components/home-map";

type PartnerRecord = {
  id?: number | string | null;
  name?: string | null;
  description?: string | null;
  latitude?: number | string | null;
  longitude?: number | string | null;
  lat?: number | string | null;
  lng?: number | string | null;
  [key: string]: unknown;
};

type MapPartner = {
  id: string;
  name: string;
  description: string;
  latitude: number;
  longitude: number;
};

function parseCoordinate(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return null;
}

function normalizePartner(partner: PartnerRecord, index: number): MapPartner | null {
  const latitude = parseCoordinate(partner.latitude ?? partner.lat);
  const longitude = parseCoordinate(partner.longitude ?? partner.lng);

  if (latitude === null || longitude === null) {
    return null;
  }

  return {
    id: String(partner.id ?? index),
    name: typeof partner.name === "string" && partner.name.trim() ? partner.name : "Unnamed partner",
    description: typeof partner.description === "string" ? partner.description : "",
    latitude,
    longitude,
  };
}

function HomePageFallback() {
  return (
    <main>
      <section className="rounded-[1.9rem] border border-primary/10 bg-card p-6 text-sm text-muted-foreground shadow-sm">
        Loading map data...
      </section>
    </main>
  );
}

async function HomePageContent() {
  const supabase = await createClient();
  const { data: partners, error } = await supabase.from("partners").select("*");

  const partnerRecords = (partners ?? []) as PartnerRecord[];
  const mapPartners = partnerRecords
    .map((partner, index) => normalizePartner(partner, index))
    .filter((partner): partner is MapPartner => partner !== null);

  return (
    <main>
      <HomeMap
        partners={mapPartners}
        hasError={Boolean(error)}
        hasApiKey={Boolean(process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY)}
      />
    </main>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<HomePageFallback />}>
      <HomePageContent />
    </Suspense>
  );
}
