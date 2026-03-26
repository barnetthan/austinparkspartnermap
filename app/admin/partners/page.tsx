"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type PartnerRow = {
  id: string | number;
  name: string | null;
  description: string | null;
  latitude: number | null;
  longitude: number | null;
};

type Status = { ok: boolean; message: string } | null;

export default function AdminPartnersPage() {
  const supabase = useMemo(() => createClient(), []);
  const [partners, setPartners] = useState<PartnerRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<Status>(null);
  const [pending, setPending] = useState(false);

  const [editingId, setEditingId] = useState<string | number | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");

  const resetForm = () => {
    setEditingId(null);
    setName("");
    setDescription("");
    setLatitude("");
    setLongitude("");
  };

  const loadPartners = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("partners").select("*");
    if (error) {
      setStatus({ ok: false, message: error.message });
      setLoading(false);
      return;
    }
    setPartners((data ?? []) as PartnerRow[]);
    setLoading(false);
  };

  useEffect(() => {
    loadPartners();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const parseCoordinate = (value: string, type: "latitude" | "longitude") => {
    if (!value.trim()) return null;
    const parsed = Number.parseFloat(value.trim());
    if (Number.isNaN(parsed)) return `${type} must be a valid number`;
    if (type === "latitude" && (parsed < -90 || parsed > 90)) {
      return "latitude must be between -90 and 90";
    }
    if (type === "longitude" && (parsed < -180 || parsed > 180)) {
      return "longitude must be between -180 and 180";
    }
    return parsed;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPending(true);
    setStatus(null);

    if (!name.trim()) {
      setStatus({ ok: false, message: "name is required" });
      setPending(false);
      return;
    }

    const parsedLat = parseCoordinate(latitude, "latitude");
    const parsedLng = parseCoordinate(longitude, "longitude");
    if (typeof parsedLat === "string") {
      setStatus({ ok: false, message: parsedLat });
      setPending(false);
      return;
    }
    if (typeof parsedLng === "string") {
      setStatus({ ok: false, message: parsedLng });
      setPending(false);
      return;
    }

    const payload = {
      name: name.trim(),
      description: description.trim() || null,
      latitude: parsedLat,
      longitude: parsedLng,
    };

    const query = editingId
      ? supabase.from("partners").update(payload).eq("id", editingId)
      : supabase.from("partners").insert([payload]);

    const { error } = await query;

    if (error) {
      setStatus({ ok: false, message: error.message });
      setPending(false);
      return;
    }

    setStatus({
      ok: true,
      message: editingId ? "Partner updated." : "Partner added.",
    });
    resetForm();
    await loadPartners();
    setPending(false);
  };

  const onEdit = (partner: PartnerRow) => {
    setEditingId(partner.id);
    setName(partner.name ?? "");
    setDescription(partner.description ?? "");
    setLatitude(
      typeof partner.latitude === "number" ? String(partner.latitude) : "",
    );
    setLongitude(
      typeof partner.longitude === "number" ? String(partner.longitude) : "",
    );
    setStatus(null);
  };

  const onDelete = async (partnerId: string | number) => {
    setPending(true);
    setStatus(null);
    const { error } = await supabase.from("partners").delete().eq("id", partnerId);
    if (error) {
      setStatus({ ok: false, message: error.message });
      setPending(false);
      return;
    }
    if (editingId === partnerId) resetForm();
    setStatus({ ok: true, message: "Partner deleted." });
    await loadPartners();
    setPending(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Partners</h2>
        <p className="text-sm text-muted-foreground">
          Add and update organizations displayed on the public map.
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4 rounded-lg border p-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="partner-name">Partner Name</Label>
            <Input
              id="partner-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Organization name"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="partner-description">Description</Label>
            <Input
              id="partner-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Short description"
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="partner-lat">Latitude</Label>
            <Input
              id="partner-lat"
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
              placeholder="30.2672"
              inputMode="decimal"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="partner-lng">Longitude</Label>
            <Input
              id="partner-lng"
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
              placeholder="-97.7431"
              inputMode="decimal"
            />
          </div>
        </div>

        {status ? (
          <p
            className={`text-sm ${status.ok ? "text-green-700" : "text-red-600"}`}
            role="status"
          >
            {status.message}
          </p>
        ) : null}

        <div className="flex flex-wrap gap-2">
          <Button type="submit" disabled={pending}>
            {pending
              ? "Saving..."
              : editingId
                ? "Update partner"
                : "Add partner"}
          </Button>
          {editingId ? (
            <Button
              type="button"
              variant="outline"
              disabled={pending}
              onClick={resetForm}
            >
              Cancel edit
            </Button>
          ) : null}
        </div>
      </form>

      <div className="space-y-3">
        <h3 className="font-medium">Existing Partners</h3>
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading partners...</p>
        ) : partners.length === 0 ? (
          <p className="text-sm text-muted-foreground">No partners found yet.</p>
        ) : (
          <div className="overflow-x-auto rounded-lg border">
            <table className="w-full min-w-[680px] text-sm">
              <thead className="bg-muted/60 text-left">
                <tr>
                  <th className="px-3 py-2 font-medium">Name</th>
                  <th className="px-3 py-2 font-medium">Description</th>
                  <th className="px-3 py-2 font-medium">Coordinates</th>
                  <th className="px-3 py-2 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {partners.map((partner) => (
                  <tr key={String(partner.id)} className="border-t">
                    <td className="px-3 py-2">{partner.name ?? "-"}</td>
                    <td className="px-3 py-2">{partner.description ?? "-"}</td>
                    <td className="px-3 py-2 text-muted-foreground">
                      {typeof partner.latitude === "number" &&
                      typeof partner.longitude === "number"
                        ? `${partner.latitude}, ${partner.longitude}`
                        : "Not set"}
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => onEdit(partner)}
                          disabled={pending}
                        >
                          Edit
                        </Button>
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => onDelete(partner.id)}
                          disabled={pending}
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
