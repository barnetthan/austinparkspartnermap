"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

type Status = {
  ok: boolean;
  message: string;
};

export default function InviteAdminForm({
  onStatusChange,
}: {
  onStatusChange: (status: Status | null) => void;
}) {
  // Keep the email address here until the invite is sent.
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    // Clear the old message before sending a new invite.
    setLoading(true);
    onStatusChange(null);

    // Call the server route that sends the invite email.
    const res = await fetch("/api/add-admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }), 
    });

    const result = await res.json();

    if (res.ok) {
      onStatusChange({
        ok: true,
        message: `Invitation sent to ${email}.`,
      });
      setEmail("");
      router.refresh();
    } else {
      onStatusChange({
        ok: false,
        message: result.error ?? "Failed to add admin.",
      });
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleInvite} className="p-4 border rounded-lg bg-white shadow-sm space-y-4 max-w-md">
      <div>
        <h3 className="font-bold text-lg text-green-900">Invite New Admin</h3>
        <p className="text-xs text-gray-500">
          They will receive an email to set their own password.
        </p>
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
  );
}
