"use client";

import { useState } from "react";
import { deleteAdmin } from "@/app/admin/admins/action";
import { Button } from "@/components/ui/button";

export function DeleteAdminButton({ adminId, email }: { adminId: string, email: string }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteAdmin(adminId);
      setShowConfirm(false);
    } catch (err: any) {
      setShowConfirm(false);
      setErrorMessage(err.message || "Failed to delete admin");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Button
        type="button"
        variant="destructive"
        size="sm"
        onClick={() => setShowConfirm(true)}
        disabled={isDeleting}
      >
        {isDeleting ? "Removing..." : "Remove"}
      </Button>

      {showConfirm ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-md rounded-lg border bg-background p-6 shadow-lg">
            <h3 className="text-lg font-semibold">Remove admin?</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Are you sure you want to remove "{email.trim() || "this admin"}" as an admin? This action is permanent and
              cannot be undone.
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowConfirm(false)}
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="destructive"
                disabled={isDeleting}
                onClick={handleDelete}
              >
                {isDeleting ? "Removing..." : "Remove"}
              </Button>
            </div>
          </div>
        </div>
      ) : null}

      {errorMessage ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-md rounded-lg border bg-background p-6 shadow-lg">
            <h3 className="text-lg font-semibold">Unable to remove admin</h3>
            <p className="mt-2 text-sm text-muted-foreground">{errorMessage}</p>
            <div className="mt-4 flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setErrorMessage(null)}
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
