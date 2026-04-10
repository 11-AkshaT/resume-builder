export const dynamic = "force-dynamic";

import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { canExportResume, hasLifetimeAccess } from "@/lib/entitlements";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, FileText, Clock, Lock, Unlock } from "lucide-react";
import Link from "next/link";
import { createResume } from "./actions";
import { DeleteResumeButton } from "@/components/delete-resume-button";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard — ResumeOnce",
};

export default async function DashboardPage() {
  const user = await requireUser();

  const resumes = await db.resume.findMany({
    where: { userId: user.id },
    orderBy: { updatedAt: "desc" },
  });

  const isLifetime = await hasLifetimeAccess(user.id);

  const resumeStatuses = await Promise.all(
    resumes.map(async (r) => ({
      ...r,
      unlocked: isLifetime || (await canExportResume(user.id, r.id)),
    }))
  );

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Your Resumes
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Create and manage your resumes
          </p>
        </div>
        <div className="flex items-center gap-3">
          {isLifetime && <Badge variant="success">Lifetime Access</Badge>}
          <form action={createResume}>
            <Button type="submit">
              <Plus className="mr-2 h-4 w-4" />
              New Resume
            </Button>
          </form>
        </div>
      </div>

      {resumeStatuses.length === 0 ? (
        <div className="py-20 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-muted">
            <FileText className="h-6 w-6 text-muted-foreground" />
          </div>
          <h2 className="mt-5 text-lg font-semibold text-foreground">
            No resumes yet
          </h2>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Create your first resume and start building for free.
          </p>
          <form action={createResume} className="mt-6">
            <Button type="submit">
              <Plus className="mr-2 h-4 w-4" />
              Create Your First Resume
            </Button>
          </form>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {resumeStatuses.map((resume) => (
            <Link key={resume.id} href={`/app/resumes/${resume.id}`}>
              <div className="group h-full rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/30 hover:shadow-sm">
                <div className="flex items-start justify-between">
                  <h3 className="line-clamp-1 text-base font-semibold text-foreground">
                    {resume.title}
                  </h3>
                  <div className="flex shrink-0 items-center gap-1">
                    {resume.unlocked ? (
                      <Unlock className="h-4 w-4 text-primary" />
                    ) : (
                      <Lock className="h-4 w-4 text-muted-foreground" />
                    )}
                    <DeleteResumeButton resumeId={resume.id} />
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  Updated{" "}
                  {new Date(resume.updatedAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </div>
                <div className="mt-3">
                  {resume.unlocked ? (
                    <Badge variant="success">Export Unlocked</Badge>
                  ) : (
                    <Badge>Free Preview</Badge>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
