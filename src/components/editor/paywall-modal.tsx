"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  CheckCircle,
  Crown,
  FileOutput,
  Globe,
  Loader2,
  ShieldCheck,
  X,
} from "lucide-react";
import { PRODUCTS } from "@/lib/types";
import { trackEvent } from "@/lib/analytics";

interface PaywallModalProps {
  resumeId: string;
  onClose: () => void;
}

export function PaywallModal({ resumeId, onClose }: PaywallModalProps) {
  const [loading, setLoading] = useState<string | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const headingId = useId();
  const descriptionId = useId();

  useEffect(() => {
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const handlePurchase = async (productType: "single_resume_unlock" | "lifetime_unlimited") => {
    setLoading(productType);
    try {
      trackEvent("create_order_started", {
        productType,
      });

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
        handler: async (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          try {
            const verifyRes = await fetch("/api/razorpay/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                orderId: data.orderId,
                ...response,
              }),
            });

            if (!verifyRes.ok) {
              throw new Error("Payment verified by checkout but not accepted by the server.");
            }

            trackEvent("payment_verified", {
              productType,
            });

            window.location.reload();
          } catch (verificationError) {
            console.error("Payment verification error:", verificationError);
            alert("Payment completed, but we could not confirm the unlock yet. Please refresh in a moment or contact support if it stays locked.");
          }
        },
        prefill: { email: data.email },
        theme: { color: "#0d9488" },
      };

      const rzp = new (window as unknown as { Razorpay: new (opts: unknown) => { open: () => void } }).Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Payment error:", err);
      alert("Failed to start checkout. Please try again.");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-[rgba(17,24,20,0.38)] p-4 backdrop-blur-sm sm:p-6"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={headingId}
        aria-describedby={descriptionId}
        className="relative mx-auto mt-8 w-full max-w-5xl overflow-hidden rounded-[2rem] border border-border/90 bg-card/95 shadow-[0_32px_90px_-36px_rgba(20,32,27,0.42)] animate-fade-in-up"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          ref={closeButtonRef}
          onClick={onClose}
          aria-label="Close export options"
          className="absolute right-5 top-5 rounded-full border border-border/70 bg-card/80 p-2 text-muted-foreground transition-colors duration-200 hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="grid gap-0 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="border-b border-border/80 bg-[linear-gradient(180deg,rgba(244,236,224,0.78)_0%,rgba(255,252,247,0.94)_100%)] p-6 sm:p-8 lg:border-b-0 lg:border-r">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
              Unlock export
            </p>
            <h2 id={headingId} className="mt-4 font-display text-4xl leading-[0.94] tracking-[-0.04em] text-marketing-ink sm:text-5xl">
              Keep the builder free.
              <span className="block text-primary">Pay when the resume is ready.</span>
            </h2>
            <p id={descriptionId} className="mt-5 max-w-lg text-sm leading-7 text-muted-foreground sm:text-base">
              ResumeOnce is designed around the real moment of value: when you want the
              finished file in hand. Choose the smallest unlock that gets you there.
            </p>

            <div className="mt-8 space-y-4">
              <div className="rounded-[1.4rem] border border-border/85 bg-card/75 p-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#efe7db] text-primary">
                    <FileOutput className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-foreground">Polished download files</p>
                    <p className="text-xs text-muted-foreground">
                      Open a clean download view and grab the LaTeX source when you are done editing.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-[1.4rem] border border-border/85 bg-card/75 p-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#efe7db] text-primary">
                    <ShieldCheck className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-foreground">One-time pricing</p>
                    <p className="text-xs text-muted-foreground">
                      No recurring subscription and no re-buying the same resume later.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-[1.4rem] border border-border/85 bg-card/75 p-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#efe7db] text-primary">
                    <Globe className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-foreground">Hosted resume page</p>
                    <p className="text-xs text-muted-foreground">
                      Included with lifetime for link sharing and future updates.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-8">
            <div className="grid gap-4 lg:grid-cols-2">
              <div className="relative rounded-[1.7rem] border-2 border-primary bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(246,242,234,0.94)_100%)] p-5 shadow-[0_24px_52px_-34px_rgba(33,81,70,0.38)]">
                <span className="absolute -top-2.5 left-5 rounded-full bg-primary px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary-foreground">
                  Recommended
                </span>
                <div className="mb-4">
                  <h3 className="font-semibold text-foreground">This resume</h3>
                  <p className="mt-2 text-4xl font-semibold tracking-[-0.05em] text-foreground">
                    {PRODUCTS.single_resume_unlock.displayPrice}
                  </p>
                  <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                    one-time payment
                  </p>
                </div>
                <ul className="mb-6 space-y-3">
                  {[
                    "Clean download view",
                    "LaTeX source export",
                    "Unlocked forever for this draft",
                    "Unlimited re-downloads later",
                  ].map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5 text-sm leading-6">
                      <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button
                  className="w-full"
                  onClick={() => handlePurchase("single_resume_unlock")}
                  disabled={loading !== null}
                >
                  {loading === "single_resume_unlock" ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <ArrowRight className="h-4 w-4" />
                  )}
                  Unlock this resume
                </Button>
              </div>

              <div className="relative rounded-[1.7rem] border border-border/90 bg-card/80 p-5">
                <div className="absolute -top-2.5 right-5 inline-flex items-center gap-1 rounded-full bg-[#f7ecd4] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#8a5a11]">
                  <Crown className="h-3 w-3" />
                  Best value
                </div>
                <div className="mb-4">
                  <h3 className="font-semibold text-foreground">Lifetime unlimited</h3>
                  <p className="mt-2 text-4xl font-semibold tracking-[-0.05em] text-foreground">
                    {PRODUCTS.lifetime_unlimited.displayPrice}
                  </p>
                  <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                    one-time for every resume
                  </p>
                </div>
                <ul className="mb-6 space-y-3">
                  {[
                    "Unlimited exports across all resumes",
                    "Hosted resume pages",
                    "Use on future job searches too",
                    "Best if you keep multiple versions",
                  ].map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5 text-sm leading-6">
                      <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      {feature}
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
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Crown className="h-4 w-4" />
                  )}
                  Get lifetime
                </Button>
              </div>
            </div>

            <p className="mt-5 text-center text-xs text-muted-foreground">
              Secure payment via Razorpay. No subscription, ever.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
