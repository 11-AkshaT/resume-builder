import Link from "next/link";
import { ArrowRight, Check, CircleDollarSign, FileCheck2, Layers3 } from "lucide-react";
import {
  FadeIn,
  FadeInOnScroll,
  ScaleIn,
  StaggerContainer,
  StaggerItem,
} from "@/components/marketing/landing-animations";
import { ResumeSkeleton } from "@/components/marketing/resume-skeleton";

const benefitCards = [
  {
    eyebrow: "No paywall up front",
    title: "Write your whole resume before you pay anything",
    body: "Most builders blur the preview or block exports immediately. Here you can write, edit, and see the final layout first.",
    icon: CircleDollarSign,
  },
  {
    eyebrow: "ATS-safe templates",
    title: "Layouts that recruiters and systems can actually read",
    body: "Clean structure, proper headings, no decorative columns that break parsing. Your content gets through.",
    icon: FileCheck2,
  },
  {
    eyebrow: "PDF and LaTeX export",
    title: "Download clean files you can use anywhere",
    body: "Get a polished PDF ready to attach, or a LaTeX source file you can keep editing in Overleaf.",
    icon: Layers3,
  },
];

const processSteps = [
  {
    step: "01",
    title: "Add your content",
    copy: "Fill in experience, projects, skills, and education. No account or payment needed to start.",
  },
  {
    step: "02",
    title: "Preview and switch templates",
    copy: "See how your resume looks. Try different templates without rewriting anything.",
  },
  {
    step: "03",
    title: "Pay once to export",
    copy: "Unlock exports for $2.99 per resume, or $19 for lifetime access to everything.",
  },
];

const comparisons = [
  {
    label: "Before paying",
    resumeOnce: "Full editor access. Complete preview.",
    others: "Blurred preview, watermarks, or checkout wall.",
  },
  {
    label: "Pricing",
    resumeOnce: "One-time payment. No recurring charges.",
    others: "Monthly subscription that bills after you land the job.",
  },
  {
    label: "Export",
    resumeOnce: "PDF and LaTeX. Keep editing after purchase.",
    others: "PDF only. Re-pay to update later.",
  },
];

const pricingTiers = [
  {
    name: "Free",
    price: "$0",
    note: "No card required",
    description: "Build and preview your resume. Pay later when you want to export.",
    cta: "Start building",
    href: "/sign-up",
    featured: false,
    features: [
      "Create unlimited resumes",
      "Preview every template",
      "Edit anytime",
    ],
  },
  {
    name: "Single resume",
    price: "$2.99",
    note: "One-time",
    description: "Unlock PDF and LaTeX export for one resume. Keep it forever.",
    cta: "Start free, unlock later",
    href: "/sign-up",
    featured: true,
    features: [
      "Export this resume forever",
      "PDF and LaTeX download",
      "Keep editing after purchase",
    ],
  },
  {
    name: "Lifetime",
    price: "$19",
    note: "All resumes, forever",
    description: "Export every resume. Includes hosted resume pages with a shareable link.",
    cta: "Get lifetime access",
    href: "/pricing",
    featured: false,
    features: [
      "Unlimited resume exports",
      "Hosted public resume page",
      "All future templates included",
    ],
  },
];

const faqs = [
  {
    question: "Do I have to pay before I can use the editor?",
    answer: "No. You can create, edit, and preview your entire resume for free. Payment is only required when you want to download the PDF or LaTeX file.",
  },
  {
    question: "What makes this different from free resume builders?",
    answer: "Most free builders add watermarks, limit templates, or require a subscription. ResumeOnce lets you build the full resume first, then charges a one-time fee only for export.",
  },
  {
    question: "Are the templates ATS-friendly?",
    answer: "Yes. Every template uses clean headings, standard sections, and simple formatting that applicant tracking systems can parse reliably.",
  },
  {
    question: "What happens after I unlock a resume?",
    answer: "You keep access forever. Continue editing and re-exporting without paying again.",
  },
  {
    question: "What is the hosted resume page?",
    answer: "Lifetime users can publish their resume to a public URL that they can share with recruiters or add to LinkedIn.",
  },
];

export default function HomePage() {
  return (
    <main className="overflow-x-hidden pt-28 text-[#17211c]">
      {/* ── Hero ── */}
      <section className="px-6 pb-20 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="grid items-center gap-16 lg:grid-cols-2">
            <div>
              <FadeIn delay={0.1}>
                <p className="text-sm font-medium tracking-wide text-[#215146]">
                  Free to build. Pay once to export.
                </p>
              </FadeIn>

              <FadeIn delay={0.2}>
                <h1 className="mt-5 text-4xl font-bold leading-[1.1] tracking-tight text-[#111814] sm:text-5xl xl:text-6xl">
                  Write the resume first.{" "}
                  <span className="text-[#215146]">Pay when it&apos;s ready.</span>
                </h1>
              </FadeIn>

              <FadeIn delay={0.35}>
                <p className="mt-6 max-w-md text-base leading-7 text-[#49534d] sm:text-lg sm:leading-8">
                  Build your resume for free with ATS-safe templates. Preview everything.
                  Unlock export with a one-time payment.
                </p>
              </FadeIn>

              <FadeIn delay={0.45}>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Link
                    href="/app"
                    className="group inline-flex items-center justify-center gap-2 rounded-full bg-[#215146] px-7 py-3.5 text-sm font-semibold text-white shadow-[0_16px_40px_-20px_rgba(33,81,70,0.5)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_20px_50px_-20px_rgba(33,81,70,0.6)]"
                  >
                    Create my resume
                    <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                  </Link>
                  <Link
                    href="#pricing"
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-[#ccd3cc] px-7 py-3.5 text-sm font-semibold text-[#17211c] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#215146] hover:text-[#215146]"
                  >
                    See pricing
                  </Link>
                </div>
              </FadeIn>

              <FadeIn delay={0.55}>
                <div className="mt-10 flex flex-wrap gap-x-5 gap-y-2 text-sm text-[#49534d]">
                  {["Free to build and edit", "ATS-safe layouts", "From $2.99"].map(
                    (point) => (
                      <span key={point} className="flex items-center gap-1.5">
                        <Check className="h-3.5 w-3.5 text-[#215146]" />
                        {point}
                      </span>
                    )
                  )}
                </div>
              </FadeIn>
            </div>

            <ScaleIn delay={0.3} className="hidden lg:block">
              <div className="relative">
                <div className="absolute -inset-4 rounded-3xl bg-[#215146]/[0.04] blur-2xl" />
                <div className="relative overflow-hidden rounded-xl border border-[#ddd9cf] bg-white shadow-[0_32px_80px_-20px_rgba(23,33,28,0.25)]">
                  <div className="border-b border-[#eee] px-4 py-2.5">
                    <div className="flex items-center gap-1.5">
                      <div className="h-2.5 w-2.5 rounded-full bg-[#e2ddd5]" />
                      <div className="h-2.5 w-2.5 rounded-full bg-[#e2ddd5]" />
                      <div className="h-2.5 w-2.5 rounded-full bg-[#e2ddd5]" />
                      <div className="ml-3 h-4 w-48 rounded bg-[#f0ebe3]" />
                    </div>
                  </div>
                  <div className="bg-white">
                    <ResumeSkeleton />
                  </div>
                </div>
              </div>
            </ScaleIn>
          </div>
        </div>
      </section>

      {/* ── Benefits ── */}
      <section className="px-6 py-16 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <FadeInOnScroll>
            <h2 className="max-w-lg text-3xl font-bold tracking-tight text-[#111814] sm:text-4xl">
              Why job seekers use ResumeOnce
            </h2>
          </FadeInOnScroll>

          <StaggerContainer className="mt-10 grid gap-5 lg:grid-cols-3" delay={0.1}>
            {benefitCards.map((card, i) => {
              const Icon = card.icon;
              const tones = [
                "border-[#d6d9d0] bg-white text-[#17211c]",
                "border-[#215146] bg-[#215146] text-[#f5f1e8]",
                "border-[#d6d9d0] bg-[#efe8db] text-[#17211c]",
              ];
              return (
                <StaggerItem key={card.title}>
                  <article
                    className={`h-full rounded-2xl border p-7 transition-shadow duration-300 hover:shadow-lg ${tones[i]}`}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] opacity-60">
                        {card.eyebrow}
                      </p>
                      <Icon className="h-5 w-5 shrink-0 opacity-60" />
                    </div>
                    <h3 className="mt-5 text-xl font-semibold leading-snug tracking-tight">
                      {card.title}
                    </h3>
                    <p className="mt-3 text-sm leading-7 opacity-75">{card.body}</p>
                  </article>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </div>
      </section>

      {/* ── How it works ── */}
      <section id="how-it-works" className="px-6 py-16 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <FadeInOnScroll>
            <h2 className="text-3xl font-bold tracking-tight text-[#111814] sm:text-4xl">
              How it works
            </h2>
            <p className="mt-3 max-w-md text-base leading-7 text-[#4c5751]">
              Three steps. No account needed to start writing.
            </p>
          </FadeInOnScroll>

          <StaggerContainer className="mt-10 grid gap-5 lg:grid-cols-3" delay={0.1}>
            {processSteps.map((item) => (
              <StaggerItem key={item.step}>
                <article className="h-full rounded-2xl border border-[#e2e5de] bg-[#f7f4ed] p-6 transition-shadow duration-300 hover:shadow-md">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#215146] text-sm font-semibold text-white">
                    {item.step}
                  </div>
                  <h3 className="mt-4 text-lg font-semibold tracking-tight text-[#17211c]">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-7 text-[#4b5550]">{item.copy}</p>
                </article>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ── Comparison ── */}
      <section className="px-6 py-12 sm:px-8 lg:px-10">
        <FadeInOnScroll className="mx-auto max-w-4xl">
          <div className="overflow-hidden rounded-2xl bg-[#17211c] text-[#f5f1e8]">
            <div className="px-7 pb-2 pt-8 sm:px-10">
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                ResumeOnce vs. typical resume tools
              </h2>
            </div>
            <div className="overflow-x-auto">
              <div className="min-w-[480px]">
                <div className="grid grid-cols-[1.1fr_1fr_1fr] border-b border-white/10 px-7 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-[#8a968f] sm:px-10">
                  <div />
                  <div>ResumeOnce</div>
                  <div>Others</div>
                </div>
                {comparisons.map((row) => (
                  <div
                    key={row.label}
                    className="grid grid-cols-[1.1fr_1fr_1fr] border-b border-white/5 px-7 py-5 sm:px-10"
                  >
                    <div className="text-sm font-medium text-white">{row.label}</div>
                    <div className="text-sm leading-6 text-[#d5ddd9]">
                      {row.resumeOnce}
                    </div>
                    <div className="text-sm leading-6 text-[#8a968f]">{row.others}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </FadeInOnScroll>
      </section>

      {/* ── Pricing ── */}
      <section id="pricing" className="px-6 py-16 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <FadeInOnScroll>
            <h2 className="text-3xl font-bold tracking-tight text-[#111814] sm:text-4xl">
              Simple pricing
            </h2>
            <p className="mt-3 max-w-lg text-base leading-7 text-[#4c5751]">
              Start free. Pay once when you need to export. No subscriptions.
            </p>
          </FadeInOnScroll>

          <StaggerContainer className="mt-10 grid gap-5 lg:grid-cols-3" delay={0.1}>
            {pricingTiers.map((tier) => {
              const bg = tier.featured
                ? "border-[#215146] bg-[#1f433b] text-[#f5f1e8] shadow-[0_22px_60px_-28px_rgba(31,67,59,0.55)]"
                : "border-[#d8dbd3] bg-white text-[#17211c]";
              return (
                <StaggerItem key={tier.name}>
                  <article
                    className={`flex h-full flex-col rounded-2xl border p-7 transition-shadow duration-300 hover:shadow-lg ${bg}`}
                  >
                    <div>
                      {tier.featured && (
                        <span className="inline-flex rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#d6e1dc]">
                          Most popular
                        </span>
                      )}
                      <h3 className="mt-3 text-xl font-semibold tracking-tight">
                        {tier.name}
                      </h3>
                      <div className="mt-2 flex items-end gap-1.5">
                        <span className="text-4xl font-bold tracking-tight">
                          {tier.price}
                        </span>
                        <span className="pb-1 text-sm opacity-55">{tier.note}</span>
                      </div>
                      <p className="mt-3 text-sm leading-6 opacity-70">
                        {tier.description}
                      </p>
                    </div>

                    <ul className="mt-6 flex-1 space-y-2.5">
                      {tier.features.map((feature) => (
                        <li
                          key={feature}
                          className="flex items-start gap-2.5 text-sm leading-6"
                        >
                          <Check className="mt-0.5 h-4 w-4 shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>

                    <Link
                      href={tier.href}
                      className={`group mt-7 inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5 ${
                        tier.featured
                          ? "bg-[#f5f1e8] text-[#1f433b] hover:bg-white"
                          : "border border-[#d8dbd3] hover:border-[#215146] hover:text-[#215146]"
                      }`}
                    >
                      {tier.cta}
                      <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                    </Link>
                  </article>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className="px-6 py-12 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-3xl">
          <FadeInOnScroll>
            <h2 className="text-3xl font-bold tracking-tight text-[#111814] sm:text-4xl">
              Questions
            </h2>
          </FadeInOnScroll>

          <div className="mt-8 divide-y divide-[#e2ddd5]">
            {faqs.map((item, i) => (
              <FadeInOnScroll key={item.question} delay={i * 0.05}>
                <div className="py-6">
                  <h3 className="text-base font-semibold text-[#17211c]">
                    {item.question}
                  </h3>
                  <p className="mt-2 text-sm leading-7 text-[#4d5752]">{item.answer}</p>
                </div>
              </FadeInOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="px-6 pb-24 pt-12 sm:px-8 lg:px-10">
        <FadeInOnScroll>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-[#111814] sm:text-4xl">
              Ready to build your resume?
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-base leading-7 text-[#4c5751]">
              Start writing for free. Export when you&apos;re happy with it.
            </p>
            <div className="mt-8">
              <Link
                href="/app"
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-[#215146] px-7 py-3.5 text-sm font-semibold text-white shadow-[0_16px_40px_-20px_rgba(33,81,70,0.5)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_20px_50px_-20px_rgba(33,81,70,0.6)]"
              >
                Create my resume
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>
        </FadeInOnScroll>
      </section>
    </main>
  );
}
