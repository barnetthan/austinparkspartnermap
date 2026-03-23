"use client";

import { useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function AdminPage() {
  const supabase = useMemo(() => createClient(), []);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");

  const [status, setStatus] = useState<
    | { ok: true; message: string }
    | { ok: false; message: string }
    | null
  >(null);

  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setStatus(null);

    const payload: Record<string, unknown> = {};

    if (name.trim()) payload.name = name.trim();
    if (description.trim()) payload.description = description.trim();

    if (latitude.trim()) {
      const n = Number.parseFloat(latitude.trim());
      if (Number.isNaN(n)) {
        setStatus({ ok: false, message: "Latitude must be a valid number." });
        setPending(false);
        return;
      }
      payload.latitude = n;
    }

    if (longitude.trim()) {
      const n = Number.parseFloat(longitude.trim());
      if (Number.isNaN(n)) {
        setStatus({ ok: false, message: "Longitude must be a valid number." });
        setPending(false);
        return;
      }
      payload.longitude = n;
    }

    const { error } = await supabase.from("partners").insert([payload]);

    if (error) {
      setStatus({
        ok: false,
        message: error.message || "Failed to insert partner.",
      });
      setPending(false);
      return;
    }

    setStatus({ ok: true, message: "Partner inserted." });
    setName("");
    setDescription("");
    setLatitude("");
    setLongitude("");
    setPending(false);
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">Admin - Add Partner</h1>
      <p className="mt-2 text-sm text-gray-600">
        Simple test UI. Fields are optional; enter what you have.
      </p>

      <form onSubmit={onSubmit} className="mt-6 max-w-md space-y-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="name" className="text-sm font-medium">
            Name
          </label>
          <input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="rounded border px-3 py-2 text-sm"
            placeholder="Test Charity"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="description" className="text-sm font-medium">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="rounded border px-3 py-2 text-sm"
            placeholder="Optional note"
            rows={3}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="latitude" className="text-sm font-medium">
              Latitude
            </label>
            <input
              id="latitude"
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
              className="rounded border px-3 py-2 text-sm"
              placeholder="30.2672"
              inputMode="decimal"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="longitude" className="text-sm font-medium">
              Longitude
            </label>
            <input
              id="longitude"
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
              className="rounded border px-3 py-2 text-sm"
              placeholder="-97.7431"
              inputMode="decimal"
            />
          </div>
        </div>

        {status ? (
          <p
            className={`text-sm ${
              status.ok ? "text-green-700" : "text-red-600"
            }`}
            role="status"
          >
            {status.message}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={pending}
          className="rounded bg-black px-4 py-2 text-sm text-white disabled:opacity-50"
        >
          {pending ? "Saving..." : "Insert partner"}
        </button>
      </form>
    </div>
  );
}
