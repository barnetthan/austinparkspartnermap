"use client";

import { useEffect, useRef, useState } from "react";

type MapPartner = {
  id: string;
  name: string;
  description: string;
  latitude: number;
  longitude: number;
};

type HomeMapProps = {
  partners: MapPartner[];
  hasApiKey: boolean;
  hasError: boolean;
};

declare global {
  interface Window {
    google?: {
      maps: {
        Animation: {
          DROP: unknown;
        };
        InfoWindow: new (options?: { content?: string }) => {
          close: () => void;
          open: (options: { anchor?: unknown; map?: unknown }) => void;
          setContent: (content: string) => void;
        };
        LatLngBounds: new () => {
          extend: (latLng: { lat: number; lng: number }) => void;
        };
        Map: new (
          element: HTMLElement,
          options: {
            center: { lat: number; lng: number };
            clickableIcons?: boolean;
            disableDefaultUI?: boolean;
            fullscreenControl?: boolean;
            mapTypeControl?: boolean;
            streetViewControl?: boolean;
            styles?: Array<Record<string, unknown>>;
            zoom: number;
          },
        ) => {
          fitBounds: (bounds: unknown, padding?: number) => void;
        };
        Marker: new (options: {
          animation?: unknown;
          map: unknown;
          position: { lat: number; lng: number };
          title?: string;
        }) => {
          addListener: (eventName: string, handler: () => void) => void;
        };
      };
    };
    __googleMapsInit?: () => void;
    __googleMapsPromise?: Promise<NonNullable<Window["google"]>>;
    gm_authFailure?: () => void;
  }
}

const AUSTIN_CENTER = { lat: 30.2672, lng: -97.7431 };
const MAP_STYLES = [
  { featureType: "poi", stylers: [{ visibility: "off" }] },
  { featureType: "transit", stylers: [{ visibility: "off" }] },
];

function loadGoogleMapsApi(apiKey: string) {
  if (window.google?.maps) {
    return Promise.resolve(window.google);
  }

  if (window.__googleMapsPromise) {
    return window.__googleMapsPromise;
  }

  window.__googleMapsPromise = new Promise((resolve, reject) => {
    const timeoutId = window.setTimeout(() => {
      reject(new Error("Google Maps timed out while loading."));
    }, 10000);

    window.__googleMapsInit = () => {
      if (window.google) {
        window.clearTimeout(timeoutId);
        resolve(window.google);
        return;
      }

      window.clearTimeout(timeoutId);
      reject(new Error("Google Maps failed to initialize."));
    };

    window.gm_authFailure = () => {
      window.clearTimeout(timeoutId);
      reject(
        new Error(
          "Google Maps rejected the API key. Check billing, Maps JavaScript API access, and localhost referrer restrictions.",
        ),
      );
    };

    const existingScript = document.getElementById("google-maps-script");
    if (existingScript) {
      return;
    }

    const script = document.createElement("script");
    script.id = "google-maps-script";
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=__googleMapsInit`;
    script.async = true;
    script.defer = true;
    script.onerror = () => {
      window.clearTimeout(timeoutId);
      reject(new Error("Google Maps failed to load."));
    };
    document.head.appendChild(script);
  });

  return window.__googleMapsPromise;
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export function HomeMap({ partners, hasApiKey, hasError }: HomeMapProps) {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    if (!hasApiKey || !mapRef.current) {
      return;
    }

    let cancelled = false;

    loadGoogleMapsApi(process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string)
      .then((google) => {
        if (cancelled || !mapRef.current) {
          return;
        }

        const map = new google.maps.Map(mapRef.current, {
          center: AUSTIN_CENTER,
          clickableIcons: false,
          disableDefaultUI: true,
          fullscreenControl: true,
          mapTypeControl: false,
          streetViewControl: false,
          styles: MAP_STYLES,
          zoom: 11,
        });

        if (partners.length === 0) {
          return;
        }

        const bounds = new google.maps.LatLngBounds();
        const infoWindow = new google.maps.InfoWindow();

        partners.forEach((partner) => {
          const marker = new google.maps.Marker({
            animation: google.maps.Animation.DROP,
            map,
            position: { lat: partner.latitude, lng: partner.longitude },
            title: partner.name,
          });

          bounds.extend({ lat: partner.latitude, lng: partner.longitude });
          marker.addListener("click", () => {
            infoWindow.setContent(
              `<div style="max-width:220px;"><strong>${escapeHtml(partner.name)}</strong>${
                partner.description
                  ? `<p style="margin:8px 0 0;">${escapeHtml(partner.description)}</p>`
                  : ""
              }</div>`,
            );
            infoWindow.open({ anchor: marker, map });
          });
        });

        map.fitBounds(bounds, 64);
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          setLoadError(error instanceof Error ? error.message : "Unable to load Google Maps.");
        }
      });

    return () => {
      cancelled = true;
    };
  }, [hasApiKey, partners]);

  if (hasError) {
    return (
      <section className="rounded-[1.75rem] border border-red-200 bg-card p-6 text-sm text-red-700 shadow-sm">
        Partner data could not be loaded, so the map is unavailable.
      </section>
    );
  }

  if (!hasApiKey) {
    return (
      <section className="rounded-[1.75rem] border border-primary/10 bg-card p-6 text-sm text-muted-foreground shadow-sm">
        Add <code>NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</code> to load the home map with Google Maps.
      </section>
    );
  }

  if (loadError) {
    return (
      <section className="rounded-[1.75rem] border border-red-200 bg-card p-6 text-sm text-red-700 shadow-sm">
        {loadError}
      </section>
    );
  }

  return (
    <section className="overflow-hidden rounded-[1.75rem] border border-primary/10 bg-card shadow-[0_30px_80px_-50px_rgba(34,86,57,0.45)]">
      <div className="flex items-center justify-between border-b border-primary/10 bg-secondary/35 px-5 py-4">
        <div>
          <h2 className="text-lg font-semibold text-primary">Home Map</h2>
          <p className="text-sm text-muted-foreground">
            {partners.length === 0
              ? "No partners with coordinates yet. Showing Austin by default."
              : "Select a marker to view partner details."}
          </p>
        </div>
      </div>
      <div ref={mapRef} className="h-[78vh] min-h-[620px] w-full" />
    </section>
  );
}
