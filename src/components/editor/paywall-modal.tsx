"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle, X, Loader2, Crown } from "lucide-react";
import { PRODUCTS } from "@/lib/types";

interface PaywallModalProps {
  resumeId: string;
  onClose: () => void;
}

export function PaywallModal({ resumeId, onClose }: PaywallModalProps) {
  const [loading, setLoading] = useState<string | null>(null);

  const handlePurchase = async (productType: "single_resume_unlock" | "lifetime_unlimited") => {
    setLoading(productType);
    try {
      const res = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productType, resumeId }),
      });

      const data = await res.json();
      if (!data.orderId) throw new Error("Failed to create order");

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: data.currency,
        name: "ResumeOnce",
        description: PRODUCTS[productType].description,
        order_id: data.providerOrderId,
        handler: () => {
          window.location.reload();
        },
        prefill: { email: data.email },
        theme: { color: "#2563eb" },
      };

      const rzp = new (window as unknown as { Razorpay: new (opts: unknown) => { open: () => void } }).Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Payment error:", err);
      alert("Failed to initiate payment. Please try again.");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-background rounded-xl border border-border shadow-xl max-w-lg w-full mx-4 p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="text-center mb-6">
          <h2 className="text-xl font-bold">Unlock Export</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Build free. Pay once when you&apos;re ready to export.
          </p>
        </div>

        <div className="grid gap-4">
          {/* Single unlock */}
          <div className="border border-primary rounded-lg p-4 bg-primary/5 ring-2 ring-primary">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold">This Resume</h3>
                <p className="text-2xl font-bold mt-1">$2.99</p>
                <p className="text-xs text-muted-foreground">one-time</p>
              </div>
            </div>
            <ul className="space-y-1.5 mb-4">
              {["Clean PDF export", "LaTeX source export", "Unlocked forever", "Unlimited re-downloads"].map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-3.5 w-3.5 text-primary shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <Button
              className="w-full"
              onClick={() => handlePurchase("single_resume_unlock")}
              disabled={loading !== null}
            >
              {loading === "single_resume_unlock" ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              Unlock This Resume — $2.99
            </Button>
          </div>

          {/* Lifetime */}
          <div className="border border-border rounded-lg p-4 relative">
            <div className="absolute -top-2.5 right-4 bg-amber-100 text-amber-800 text-xs font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
              <Crown className="h-3 w-3" />
              Best Value
            </div>
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold">Lifetime Unlimited</h3>
                <p className="text-2xl font-bold mt-1">$19</p>
                <p className="text-xs text-muted-foreground">one-time · all resumes</p>
              </div>
            </div>
            <ul className="space-y-1.5 mb-4">
              {["Unlimited resume exports", "Hosted resume page with shareable link", "All future templates", "Priority support"].map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-3.5 w-3.5 text-primary shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => handlePurchase("lifetime_unlimited")}
              disabled={loading !== null}
            >
              {loading === "lifetime_unlimited" ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              Get Lifetime — $19
            </Button>
          </div>
        </div>

        <p className="text-xs text-center text-muted-foreground mt-4">
          Secure payment via Razorpay. No subscription.
        </p>
      </div>
    </div>
  );
}
