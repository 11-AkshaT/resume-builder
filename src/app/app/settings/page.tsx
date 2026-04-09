export const dynamic = "force-dynamic";

import { requireUser } from "@/lib/auth";
import { hasLifetimeAccess } from "@/lib/entitlements";
import { db } from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Settings — ResumeOnce",
};

export default async function SettingsPage() {
  const user = await requireUser();
  const isLifetime = await hasLifetimeAccess(user.id);

  const orders = await db.order.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  const unlocks = await db.resumeUnlock.findMany({
    where: { userId: user.id, status: "paid" },
    include: { resume: { select: { id: true, title: true } } },
  });

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your account and view your purchases
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Account</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <p>
              <span className="font-medium">Name:</span> {user.name || "—"}
            </p>
            <p>
              <span className="font-medium">Email:</span> {user.email}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Plan Status</CardTitle>
        </CardHeader>
        <CardContent>
          {isLifetime ? (
            <div className="flex items-center gap-3">
              <Badge variant="success">Lifetime Unlimited</Badge>
              <span className="text-sm text-muted-foreground">
                You have unlimited exports for all resumes.
              </span>
            </div>
          ) : unlocks.length > 0 ? (
            <div>
              <p className="text-sm mb-3">
                You have {unlocks.length} unlocked resume(s):
              </p>
              <ul className="space-y-1">
                {unlocks.map((u) => (
                  <li key={u.id} className="text-sm flex items-center gap-2">
                    <Badge variant="success">Unlocked</Badge>
                    {u.resume?.title || "Deleted resume"}
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Free plan — build and preview resumes for free. Pay to export.
            </p>
          )}
        </CardContent>
      </Card>

      {orders.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Order History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between py-2 border-b border-border last:border-0"
                >
                  <div>
                    <p className="text-sm font-medium">
                      {order.productType === "lifetime_unlimited"
                        ? "Lifetime Unlimited"
                        : "Single Resume Unlock"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium">
                      ${(order.amount / 100).toFixed(2)}
                    </span>
                    <Badge
                      variant={
                        order.status === "paid"
                          ? "success"
                          : order.status === "failed"
                            ? "destructive"
                            : "default"
                      }
                    >
                      {order.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
