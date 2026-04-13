"use client";

import { useMemo, useState } from "react";

type PartnerLocation = {
  id: string;
  name: string;
  description: string | null;
  latitude: number;
  longitude: number;
  display_order: number;
};

const defaultCenter: [number, number] = [30.2672, -97.7431];

export default function HomeMap({ partners }: { partners: PartnerLocation[] }) {
  const [selectedId, setSelectedId] = useState<string | null>(
    partners[0]?.id ?? null,
  );

  const selectedPartner = useMemo(
    () => partners.find((p) => p.id === selectedId) ?? null,
    [partners, selectedId],
  );

  const center: [number, number] = selectedPartner
    ? [selectedPartner.latitude, selectedPartner.longitude]
    : partners.length > 0
      ? [partners[0].latitude, partners[0].longitude]
      : defaultCenter;

  const mapSrc = `https://maps.google.com/maps?q=${center[0]},${center[1]}&z=13&output=embed`;

  return (
    <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
      <div className="overflow-hidden rounded-xl border">
        <iframe
          title="Partner map"
          src={mapSrc}
          className="h-[430px] w-full"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>

      <div className="rounded-xl border bg-muted/20 p-3">
        <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-[#0a2b52]">
          Partners
        </h3>
        {partners.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No partners with coordinates yet.
          </p>
        ) : (
          <div className="space-y-2">
            {partners.sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0)).map((partner) => {
              const isActive = partner.id === selectedId;
              return (
                <button
                  key={partner.id}
                  type="button"
                  onClick={() => setSelectedId(partner.id)}
                  className={`w-full rounded-md border px-3 py-2 text-left text-sm transition ${
                    isActive
                      ? "border-primary bg-primary/10"
                      : "bg-background hover:bg-muted"
                  }`}
                >
                  <p className="font-medium">{partner.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {partner.latitude}, {partner.longitude}
                  </p>
                  <a
                    href={`https://www.google.com/maps?q=${partner.latitude},${partner.longitude}`}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-1 inline-block text-xs text-primary underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Open in Google Maps
                  </a>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
