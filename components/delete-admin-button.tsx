"use client";

import { useState } from "react";
import { deleteAdmin } from "@/app/admin/admins/action";

export function DeleteAdminButton({ adminId, email }: { adminId: string, email: string }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    const confirmed = window.confirm(
      `Are you sure you want to remove ${email}? This will revoke their access immediately.`
    );

    if (!confirmed) return;

    setIsDeleting(true);
    try {
      await deleteAdmin(adminId);
    } catch (err: any) {
      alert(err.message || "Failed to delete admin");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="text-red-600 hover:underline text-xs font-semibold disabled:opacity-50"
    >
      {isDeleting ? "Removing..." : "Remove"}
    </button>
  );
}