export const dynamic = "force-dynamic";

import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { canExportResume, hasLifetimeAccess } from "@/lib/entitlements";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, FileText, Clock, Lock, Unlock } from "lucide-react";
import Link from "next/link";
import { createResume } from "./actions";
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
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Your Resumes</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Create and manage your resumes
          </p>
        </div>
        <div className="flex items-center gap-3">
          {isLifetime && (
            <Badge variant="success">Lifetime Access</Badge>
          )}
          <form action={createResume}>
            <Button type="submit">
              <Plus className="h-4 w-4 mr-2" />
              New Resume
            </Button>
          </form>
        </div>
      </div>

      {resumeStatuses.length === 0 ? (
        <div className="text-center py-20">
          <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-lg font-semibold mb-2">No resumes yet</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Create your first resume and start building for free.
          </p>
          <form action={createResume}>
            <Button type="submit">
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Resume
            </Button>
          </form>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {resumeStatuses.map((resume) => (
            <Link key={resume.id} href={`/app/resumes/${resume.id}`}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-base line-clamp-1">
                      {resume.title}
                    </CardTitle>
                    {resume.unlocked ? (
                      <Unlock className="h-4 w-4 text-green-600 shrink-0" />
                    ) : (
                      <Lock className="h-4 w-4 text-muted-foreground shrink-0" />
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    Updated{" "}
                    {new Date(resume.updatedAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </div>
                  <div className="mt-2">
                    {resume.unlocked ? (
                      <Badge variant="success">Export Unlocked</Badge>
                    ) : (
                      <Badge>Free Preview</Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
