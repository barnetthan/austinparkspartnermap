"use client";

import { useEffect, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

type PartnerLocation = {
  id: string;
  name: string;
  description: string | null;
  latitude: number;
  longitude: number;
};

type Props = { partners: PartnerLocation[] };

const defaultCenter: [number, number] = [30.2672, -97.7431];

export default function PartnersMap({ partners }: Props) {
  // Wait until the page loads in the browser before showing the map.
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Start the map at the first partner, or Austin if there are no partners yet.
  const center: [number, number] =
    partners.length > 0
      ? [partners[0].latitude, partners[0].longitude]
      : defaultCenter;

  // Show a loading message until the map is ready.
  if (!isMounted) {
    return (
      <div className="flex h-[430px] w-full items-center justify-center bg-muted/30 text-sm text-muted-foreground">
        Loading map...
      </div>
    );
  }

  return (
    <MapContainer
      // Give the map a fresh start when the partner list changes.
      key={partners.length === 0 ? "empty-map" : `map-${partners[0].id}`}
      center={center}
      zoom={11}
      scrollWheelZoom={false}
      className="h-[430px] w-full rounded-xl"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {partners.map((partner) => (
        <Marker key={partner.id} position={[partner.latitude, partner.longitude]}>
          <Popup>
            <div className="space-y-1">
              <p className="font-semibold">{partner.name}</p>
              <p className="text-sm text-slate-600">
                {partner.description || "No description provided."}
              </p>
              <p className="text-xs text-slate-500">
                {partner.latitude}, {partner.longitude}
              </p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
