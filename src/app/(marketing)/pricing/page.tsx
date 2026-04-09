import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing — ResumeOnce",
  description: "Simple one-time pricing. Build free, pay once to export.",
};

export default function PricingPage() {
  return (
    <div className="py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold">Simple, Honest Pricing</h1>
          <p className="mt-3 text-lg text-muted-foreground">
            Build and preview for free. Pay only when you export.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="rounded-xl border border-border p-6 flex flex-col">
            <h3 className="text-lg font-semibold">Free</h3>
            <div className="mt-2">
              <span className="text-3xl font-bold">$0</span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Build and preview, no limits
            </p>
            <ul className="mt-5 space-y-2 flex-1">
              {[
                "Full editor access",
                "Live in-app preview",
                "Unlimited edits",
                "Autosave",
                "All sections available",
              ].map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <Link href="/sign-up" className="mt-6">
              <Button variant="outline" className="w-full">
                Start Building
              </Button>
            </Link>
          </div>

          <div className="rounded-xl border border-primary p-6 flex flex-col bg-primary/5 ring-2 ring-primary shadow-md">
            <span className="text-xs font-semibold text-primary mb-3 uppercase tracking-wide">
              Most Popular
            </span>
            <h3 className="text-lg font-semibold">Single Resume</h3>
            <div className="mt-2">
              <span className="text-3xl font-bold">$2.99</span>
              <span className="text-sm text-muted-foreground ml-1">
                one-time
              </span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Unlock one resume forever
            </p>
            <ul className="mt-5 space-y-2 flex-1">
              {[
                "Everything in Free",
                "Clean PDF export",
                "LaTeX source export",
                "Unlocked forever",
                "Unlimited re-downloads",
              ].map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <Link href="/sign-up" className="mt-6">
              <Button className="w-full">Get Started</Button>
            </Link>
          </div>

          <div className="rounded-xl border border-border p-6 flex flex-col">
            <span className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wide">
              Best Value
            </span>
            <h3 className="text-lg font-semibold">Lifetime Unlimited</h3>
            <div className="mt-2">
              <span className="text-3xl font-bold">$19</span>
              <span className="text-sm text-muted-foreground ml-1">
                one-time
              </span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              All resumes, forever
            </p>
            <ul className="mt-5 space-y-2 flex-1">
              {[
                "Everything in Single",
                "Unlimited resume exports",
                "Future templates included",
                "Priority support",
                "7 resumes = breakeven",
              ].map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <Link href="/sign-up" className="mt-6">
              <Button variant="outline" className="w-full">
                Get Lifetime
              </Button>
            </Link>
          </div>
        </div>

        <div className="mt-16 text-center">
          <h3 className="text-lg font-semibold mb-4">
            Frequently asked about pricing
          </h3>
          <div className="max-w-2xl mx-auto space-y-4 text-left">
            <div className="border border-border rounded-lg p-4">
              <h4 className="font-medium">
                Is the single unlock really permanent?
              </h4>
              <p className="text-sm text-muted-foreground mt-1">
                Yes. Once you pay $2.99 for a resume, that resume stays
                unlocked forever. You can edit it, re-export, and download
                as many times as you want.
              </p>
            </div>
            <div className="border border-border rounded-lg p-4">
              <h4 className="font-medium">
                When should I choose Lifetime?
              </h4>
              <p className="text-sm text-muted-foreground mt-1">
                If you plan to create multiple tailored resumes for different
                job applications, Lifetime pays for itself after 7 resumes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
