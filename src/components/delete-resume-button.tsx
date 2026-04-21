"use client";

import { useState } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { deleteResume } from "@/app/app/actions";
import { useRouter } from "next/navigation";

export function DeleteResumeButton({ resumeId }: { resumeId: string }) {
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!confirming) {
      setConfirming(true);
      setTimeout(() => setConfirming(false), 3000);
      return;
    }

    setDeleting(true);
    try {
      await deleteResume(resumeId);
      router.refresh();
    } catch {
      setDeleting(false);
      setConfirming(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={deleting}
      aria-label={confirming ? "Confirm delete resume" : "Delete resume"}
      className={`rounded-md p-1.5 text-xs transition-colors ${
        confirming
          ? "bg-destructive/10 text-destructive hover:bg-destructive/20"
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      }`}
      title={confirming ? "Click again to confirm" : "Delete resume"}
    >
      {deleting ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
      ) : (
        <Trash2 className="h-3.5 w-3.5" />
      )}
    </button>
  );
}
