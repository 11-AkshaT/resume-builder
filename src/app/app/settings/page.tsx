export const dynamic = "force-dynamic";

import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowRight,
  CircleDollarSign,
  FileText,
  Globe2,
  LockKeyhole,
  Sparkles,
  UserRound,
} from "lucide-react";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { hasLifetimeAccess } from "@/lib/entitlements";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Settings — ResumeOnce",
};

export default async function SettingsPage() {
  const user = await requireUser();

  const [resumeCount, publishedCount, paidOrders, recentOrders, lifetime, singleUnlocks] =
    await Promise.all([
      db.resume.count({ where: { userId: user.id } }),
      db.resume.count({ where: { userId: user.id, isPublished: true } }),
      db.order.count({ where: { userId: user.id, status: "paid" } }),
      db.order.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
        take: 3,
      }),
      hasLifetimeAccess(user.id),
      db.resumeUnlock.count({
        where: { userId: user.id, unlockType: "single", status: "paid" },
      }),
    ]);

  const unlockedCount = lifetime ? resumeCount : singleUnlocks;
  const joinedDate = new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  }).format(user.createdAt);

  return (
    <div className="space-y-8 pb-10">
      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.7fr)_360px]">
        <div className="app-panel app-card-glow overflow-hidden rounded-[2rem] p-7 sm:p-8">
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="success">Settings</Badge>
            <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
              account, access, and workspace signals
            </p>
          </div>

          <div className="mt-6 max-w-3xl">
            <h1 className="max-w-2xl font-display text-[clamp(2.5rem,5vw,4.3rem)] leading-[0.92] tracking-[-0.05em] text-marketing-ink">
              Keep your resume workspace clean, unlocked, and ready for the next search.
            </h1>
            <p className="mt-5 max-w-2xl text-[1.02rem] leading-7 text-muted-foreground">
              Review your account details, plan status, and purchase history without
              leaving the same warm workspace you use to write the resume.
            </p>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/app"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-[0_16px_36px_-22px_rgba(33,81,70,0.65)] transition hover:bg-primary-hover"
            >
              Back to workspace
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-border/90 bg-card/90 px-5 py-3 text-sm font-semibold text-foreground transition hover:bg-[#fcf8f2]"
            >
              Review pricing
            </Link>
          </div>

          <div className="mt-9 grid gap-4 sm:grid-cols-3">
            <div className="rounded-[1.5rem] border border-border/80 bg-card/80 p-5">
              <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                total resumes
              </p>
              <p className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-foreground">
                {resumeCount}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                Drafts, tailored versions, and archived edits all stay together.
              </p>
            </div>
            <div className="rounded-[1.5rem] border border-border/80 bg-card/80 p-5">
              <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                export ready
              </p>
              <p className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-foreground">
                {unlockedCount}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                Resumes with paid export access attached to them already.
              </p>
            </div>
            <div className="rounded-[1.5rem] border border-border/80 bg-card/80 p-5">
              <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                live pages
              </p>
              <p className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-foreground">
                {publishedCount}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                Public resume links currently published from this account.
              </p>
            </div>
          </div>
        </div>

        <aside className="app-panel app-card-glow rounded-[2rem] p-6">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                current plan
              </p>
              <h2 className="mt-1 text-xl font-semibold tracking-[-0.03em] text-foreground">
                {lifetime ? "Lifetime unlimited" : "Free workspace"}
              </h2>
            </div>
          </div>

          <p className="mt-5 text-sm leading-6 text-muted-foreground">
            {lifetime
              ? "Every resume in this workspace can export and publish without another checkout step."
              : "You can keep drafting and previewing for free. Pay only when a specific resume needs export access."}
          </p>

          <div className="mt-6 space-y-3">
            <div className="rounded-[1.35rem] border border-border/80 bg-card/75 p-4">
              <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                member since
              </p>
              <p className="mt-2 text-sm font-medium text-foreground">{joinedDate}</p>
            </div>
            <div className="rounded-[1.35rem] border border-border/80 bg-[#f2eadf] p-4">
              <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                paid orders
              </p>
              <p className="mt-2 text-sm font-medium text-foreground">
                {paidOrders} completed purchase{paidOrders === 1 ? "" : "s"}
              </p>
            </div>
          </div>
        </aside>
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
        <div className="app-panel app-card-glow rounded-[2rem] p-6 sm:p-7">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#efe7db] text-primary">
              <UserRound className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                Account details
              </p>
              <h2 className="mt-1 text-2xl font-semibold tracking-[-0.03em] text-foreground">
                Profile snapshot
              </h2>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-[1.5rem] border border-border/80 bg-card/75 p-5">
              <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                Name
              </p>
              <p className="mt-2 text-base font-medium text-foreground">
                {user.name || "Not provided yet"}
              </p>
            </div>
            <div className="rounded-[1.5rem] border border-border/80 bg-card/75 p-5">
              <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                Email
              </p>
              <p className="mt-2 text-base font-medium text-foreground">{user.email}</p>
            </div>
          </div>

          <div className="mt-5 rounded-[1.5rem] border border-border/80 bg-[#fcf8f2] p-5">
            <p className="text-sm leading-7 text-muted-foreground">
              Sign-in, passwords, and identity verification continue to be managed through
              Clerk. This page focuses on the product-side state tied to your resumes and
              purchases.
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="app-panel app-card-glow rounded-[2rem] p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#efe7db] text-primary">
                <CircleDollarSign className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                  Billing
                </p>
                <h2 className="mt-1 text-xl font-semibold tracking-[-0.03em] text-foreground">
                  Recent activity
                </h2>
              </div>
            </div>

            <div className="mt-5 space-y-3">
              {recentOrders.length > 0 ? (
                recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="rounded-[1.35rem] border border-border/80 bg-card/75 p-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-medium text-foreground">
                        {order.productType === "lifetime_unlimited"
                          ? "Lifetime unlimited"
                          : "Single resume unlock"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: order.currency,
                        }).format(order.amount / 100)}
                      </p>
                    </div>
                    <p className="mt-2 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                      {order.status} on{" "}
                      {new Intl.DateTimeFormat("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      }).format(order.createdAt)}
                    </p>
                  </div>
                ))
              ) : (
                <div className="rounded-[1.35rem] border border-border/80 bg-card/75 p-4">
                  <p className="text-sm text-muted-foreground">
                    No purchases yet. Your workspace can still draft and preview resumes for
                    free.
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="app-panel app-card-glow rounded-[2rem] p-6">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#efe7db] text-primary">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                    Access notes
                  </p>
                  <h2 className="mt-1 text-xl font-semibold tracking-[-0.03em] text-foreground">
                    What your plan unlocks
                  </h2>
                </div>
              </div>

              <div className="rounded-[1.35rem] border border-border/80 bg-card/75 p-4">
                <p className="flex items-start gap-2 text-sm text-foreground">
                  <LockKeyhole className="mt-0.5 h-4 w-4 text-primary" />
                  Export access follows the resume you unlocked, or all resumes if you are on
                  lifetime.
                </p>
              </div>
              <div className="rounded-[1.35rem] border border-border/80 bg-card/75 p-4">
                <p className="flex items-start gap-2 text-sm text-foreground">
                  <Globe2 className="mt-0.5 h-4 w-4 text-primary" />
                  Hosted resume pages are available with the lifetime plan and stay synced
                  from the editor.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
