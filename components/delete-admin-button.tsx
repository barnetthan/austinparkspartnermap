"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteAdmin } from "@/app/admin/admins/action";
import { Button } from "@/components/ui/button";

type Status = {
  ok: boolean;
  message: string;
};

export function DeleteAdminButton({
  adminId,
  email,
  onStatusChange,
}: {
  adminId: string;
  email: string;
  onStatusChange: (status: Status | null) => void;
}) {
  // Track whether the remove action is already running.
  const [isRemoving, setIsRemoving] = useState(false);
  // Ask for confirmation before removing an admin.
  const [showConfirm, setShowConfirm] = useState(false);
  const router = useRouter();

  const handleRemove = async () => {
    // This removes the user's login access and their admin record.
    setIsRemoving(true);
    onStatusChange(null);
    try {
      await deleteAdmin(adminId);
      onStatusChange({
        ok: true,
        message: `${email} was removed as an admin.`,
      });
      setShowConfirm(false);
      router.refresh();
    } catch (err: any) {
      setShowConfirm(false);
      onStatusChange({
        ok: false,
        message: err.message || "Failed to remove admin.",
      });
    } finally {
      setIsRemoving(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setShowConfirm(true)}
        disabled={isRemoving}
        className="text-red-600 hover:underline text-xs font-semibold disabled:opacity-50"
      >
        {isRemoving ? "Removing..." : "Remove"}
      </button>

      {showConfirm ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-md rounded-lg border bg-background p-6 shadow-lg">
            <h3 className="text-lg font-semibold">Remove admin?</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Are you sure you want to remove "{email}" as an admin? This will
              revoke their access immediately.
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowConfirm(false)}
                disabled={isRemoving}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="destructive"
                disabled={isRemoving}
                onClick={handleRemove}
              >
                {isRemoving ? "Removing..." : "Remove"}
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
