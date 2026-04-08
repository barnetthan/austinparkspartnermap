"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function InviteAdminForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [dialog, setDialog] = useState<{
    title: string;
    message: string;
    variant: "default" | "destructive";
  } | null>(null);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/add-admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }), 
    });

    const result = await res.json();

    if (res.ok) {
      setDialog({
        title: "Invitation sent",
        message: `An invitation email has been sent to ${email}!`,
        variant: "default",
      });
      setEmail("");
    } else {
      setDialog({
        title: "Invitation failed",
        message: result.error || "Something went wrong while sending the invitation.",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  return (
    <>
      <form onSubmit={handleInvite} className="p-4 border rounded-lg bg-white shadow-sm space-y-4 max-w-md">
        <div>
          <h3 className="font-bold text-lg text-green-900">Invite New Admin</h3>
          <p className="text-xs text-gray-500">They will receive an email to set their own password.</p>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Email Address</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)}
            placeholder="colleague@austinparks.org"
            className="w-full p-2 border rounded mt-1 focus:ring-2 focus:ring-green-800 outline-none" 
            required 
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-green-800 text-white px-4 py-2 rounded font-semibold hover:bg-green-700 disabled:opacity-50 transition-colors"
        >
          {loading ? "Sending Invite..." : "Send Invitation"}
        </button>
      </form>

      {dialog ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-md rounded-lg border bg-background p-6 shadow-lg">
            <h3 className="text-lg font-semibold">{dialog.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{dialog.message}</p>
            <div className="mt-4 flex justify-end gap-2">
              <Button
                type="button"
                variant={dialog.variant === "destructive" ? "destructive" : "default"}
                onClick={() => setDialog(null)}
              >
                OK
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
