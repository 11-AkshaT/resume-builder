import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ResumePreview } from "@/components/editor/resume-preview";
import { defaultResumeData } from "@/lib/types";
import {
  FileText,
  Download,
  CreditCard,
  Shield,
  Zap,
  CheckCircle,
  ChevronDown,
} from "lucide-react";

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-20 md:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
              <CreditCard className="h-4 w-4" />
              No subscription — pay once, own forever
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-[1.1]">
              Build your resume free.
              <br />
              <span className="text-primary">Pay once to export.</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-xl mx-auto">
              ATS-safe resume builder with clean PDF and LaTeX export. Build and
              preview for free — only pay $2.99 when you&apos;re ready to download.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/sign-up">
                <Button size="lg" className="w-full sm:w-auto">
                  Start Building — It&apos;s Free
                </Button>
              </Link>
              <Link href="/pricing">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  View Pricing
                </Button>
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(37,99,235,0.08),transparent)]" />
      </section>

      {/* Trust Points */}
      <section className="border-y border-border bg-muted/30">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              {
                icon: CreditCard,
                title: "One-Time Payment",
                desc: "No monthly fees. Ever.",
              },
              {
                icon: Download,
                title: "PDF & LaTeX Export",
                desc: "Clean, ATS-readable output",
              },
              {
                icon: Shield,
                title: "ATS-Safe Layout",
                desc: "Passes automated screening",
              },
              {
                icon: Zap,
                title: "Fast Editor",
                desc: "First draft in under 10 min",
              },
            ].map((item) => (
              <div key={item.title} className="text-center">
                <item.icon className="h-8 w-8 mx-auto mb-3 text-primary" />
                <h3 className="font-semibold text-sm">{item.title}</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold text-center mb-12">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                step: "1",
                title: "Build for Free",
                desc: "Fill in your details using our simple editor. Live preview shows you exactly how your resume will look.",
              },
              {
                step: "2",
                title: "Preview Everything",
                desc: "See your complete ATS-safe resume before spending a cent. Edit until it's perfect.",
              },
              {
                step: "3",
                title: "Pay Once to Export",
                desc: "Unlock clean PDF and LaTeX export for $2.99. That resume stays unlocked forever.",
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo / Preview */}
      <section className="py-20 bg-muted/30">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">
              Clean, Professional, ATS-Ready
            </h2>
            <p className="mt-3 text-muted-foreground">
              One excellent template designed for readability and ATS parsing
            </p>
          </div>
          <div className="mx-auto max-w-2xl">
            <ResumePreview
              data={defaultResumeData}
              sectionOrder={defaultResumeData.sectionOrder}
            />
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Simple, Honest Pricing</h2>
            <p className="mt-3 text-muted-foreground">
              No trials. No monthly fees. No surprises.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <PricingCard
              title="Free"
              price="$0"
              description="Build and preview"
              features={[
                "Full editor access",
                "Live preview",
                "Unlimited edits",
                "Autosave",
              ]}
              cta="Start Building"
              ctaHref="/sign-up"
            />
            <PricingCard
              title="Single Unlock"
              price="$2.99"
              description="Per resume, forever"
              features={[
                "Everything in Free",
                "Clean PDF export",
                "LaTeX source export",
                "Unlocked forever",
              ]}
              cta="Start Building"
              ctaHref="/sign-up"
              highlighted
            />
            <PricingCard
              title="Lifetime"
              price="$19"
              description="All resumes, forever"
              features={[
                "Everything in Single",
                "Unlimited resume exports",
                "Future templates included",
                "Best value",
              ]}
              cta="Start Building"
              ctaHref="/sign-up"
            />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 bg-muted/30">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold text-center mb-12">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {[
              {
                q: "Do I need to pay before building my resume?",
                a: "No. You can build your entire resume and preview it for free. You only pay when you're ready to export a clean PDF or LaTeX file.",
              },
              {
                q: "What happens after I pay?",
                a: "That resume stays unlocked forever. You can edit it, re-export it, and download it as many times as you want.",
              },
              {
                q: "Is this a subscription?",
                a: "No. It's a one-time payment. Single resume unlock is $2.99, lifetime unlimited is $19. No recurring charges.",
              },
              {
                q: "Can I edit my resume after paying?",
                a: "Yes. Your resume is always editable, and the export stays unlocked. Edit as much as you want.",
              },
              {
                q: "What makes this ATS-safe?",
                a: "We use a clean, structured layout with proper heading hierarchy, standard fonts, and machine-readable text. No tables, no graphics, no fancy formatting that trips up applicant tracking systems.",
              },
            ].map((item) => (
              <details
                key={item.q}
                className="group rounded-lg border border-border bg-background p-4"
              >
                <summary className="flex cursor-pointer items-center justify-between font-medium">
                  {item.q}
                  <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform group-open:rotate-180" />
                </summary>
                <p className="mt-3 text-sm text-muted-foreground">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 text-center">
          <h2 className="text-3xl font-bold">
            Ready to build your resume?
          </h2>
          <p className="mt-3 text-muted-foreground">
            It&apos;s free to start. No credit card required.
          </p>
          <div className="mt-8">
            <Link href="/sign-up">
              <Button size="lg">Start Building — Free</Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

function PricingCard({
  title,
  price,
  description,
  features,
  cta,
  ctaHref,
  highlighted,
}: {
  title: string;
  price: string;
  description: string;
  features: string[];
  cta: string;
  ctaHref: string;
  highlighted?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border p-6 flex flex-col ${
        highlighted
          ? "border-primary bg-primary/5 ring-2 ring-primary shadow-md"
          : "border-border"
      }`}
    >
      {highlighted && (
        <span className="text-xs font-semibold text-primary mb-3 uppercase tracking-wide">
          Most Popular
        </span>
      )}
      <h3 className="text-lg font-semibold">{title}</h3>
      <div className="mt-2">
        <span className="text-3xl font-bold">{price}</span>
        {price !== "$0" && (
          <span className="text-sm text-muted-foreground ml-1">one-time</span>
        )}
      </div>
      <p className="text-sm text-muted-foreground mt-1">{description}</p>
      <ul className="mt-5 space-y-2 flex-1">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2 text-sm">
            <CheckCircle className="h-4 w-4 text-primary mt-0.5 shrink-0" />
            {f}
          </li>
        ))}
      </ul>
      <Link href={ctaHref} className="mt-6">
        <Button
          variant={highlighted ? "primary" : "outline"}
          className="w-full"
        >
          {cta}
        </Button>
      </Link>
    </div>
  );
}
