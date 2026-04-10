import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Check,
  CircleDollarSign,
  Layers3,
  ShieldCheck,
} from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing — ResumeOnce",
  description:
    "Build your resume for free, then choose a simple one-time unlock when you need export access.",
};

const planRows = [
  {
    name: "Free build",
    price: "$0",
    note: "Use the editor first",
    description:
      "For people who want to draft, test, and preview their resume before paying for anything.",
    href: "/sign-up",
    cta: "Start building free",
    tone: "border-[#d8dbd3] bg-white text-[#17211c]",
    features: [
      "Create and edit resumes",
      "Preview every template",
      "No card required",
      "Good for drafting your first version",
    ],
  },
  {
    name: "Single resume unlock",
    price: "$2.99",
    note: "One-time",
    description:
      "For one active job search when you want export access without getting trapped in a monthly plan.",
    href: "/sign-up",
    cta: "Create my resume free",
    featured: true,
    tone:
      "border-[#215146] bg-[#1f433b] text-[#f5f1e8] shadow-[0_22px_60px_-28px_rgba(31,67,59,0.55)]",
    features: [
      "Unlock this resume forever",
      "Export when payments are enabled",
      "Keep editing after purchase",
      "Best fit for most job seekers",
    ],
  },
  {
    name: "Lifetime unlimited",
    price: "$19",
    note: "Pay once",
    description:
      "For people who want multiple resumes, future flexibility, and hosted resume access when that feature is live.",
    href: "/sign-up",
    cta: "Choose lifetime",
    tone: "border-[#d8dbd3] bg-[#efe8db] text-[#17211c]",
    features: [
      "Use across all resumes",
      "Good for future job moves",
      "Includes hosted resume access",
      "Best value if you update often",
    ],
  },
];

const proofCards = [
  {
    title: "The offer is easy to understand",
    body:
      "Visitors do not have to decode a trial, a freemium trap, or a recurring billing plan. That usually lowers hesitation fast.",
    icon: CircleDollarSign,
  },
  {
    title: "The product earns trust before the purchase",
    body:
      "People can see the editor, shape the resume, and decide when it actually feels worth paying for.",
    icon: ShieldCheck,
  },
  {
    title: "The upgrade aligns with the real moment of value",
    body:
      "Most candidates only need to pay when they are ready to export and start applying.",
    icon: BadgeCheck,
  },
];

const comparisons = [
  {
    label: "What happens before payment",
    resumOnce: "You build and preview the full resume.",
    others: "You often hit a blurred export or forced checkout first.",
  },
  {
    label: "How pricing feels",
    resumOnce: "One-time unlocks with a clear reason to buy.",
    others: "Monthly billing for a problem that is often temporary.",
  },
  {
    label: "What a buyer is really paying for",
    resumOnce: "A finished, send-ready resume workflow.",
    others: "Ongoing access to software you may only need for a short stretch.",
  },
];

const faqs = [
  {
    question: "Can I really use the builder before I pay?",
    answer:
      "Yes. The point of the product is to let you write and preview the resume first, then unlock export access only when you are happy with it.",
  },
  {
    question: "Why not charge a subscription like other resume tools?",
    answer:
      "A job search is usually time-bound. One-time pricing better matches the real use case and makes the decision easier for buyers.",
  },
  {
    question: "Who should pick the single unlock?",
    answer:
      "Most people. If you mainly need one strong resume for the current search, the single unlock keeps the cost low and the choice simple.",
  },
  {
    question: "Who should pick lifetime unlimited?",
    answer:
      "Choose lifetime if you maintain several resume versions, expect to change roles often, or want the hosted resume feature later.",
  },
];

export default function PricingPage() {
  return (
    <main className="marketing-grid pt-24 text-[#17211c]">
      <section className="px-6 pb-12 pt-10 sm:px-8 lg:px-10">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
          <div className="max-w-3xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#6a746e]">
              Pricing
            </p>
            <h1 className="mt-4 font-serif text-5xl leading-[0.94] tracking-[-0.045em] text-[#111814] sm:text-6xl lg:text-[5rem]">
              Pay for the unlock.
              <span className="block text-[#215146]">
                Not for another monthly habit.
              </span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[#4e5853] sm:text-xl">
              The pricing is designed to remove friction, not create it. Build
              your resume for free, then choose the smallest clear commitment
              that gets you to a send-ready file.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/sign-up"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#215146] px-7 py-4 text-sm font-semibold text-white shadow-[0_18px_45px_-24px_rgba(33,81,70,0.6)] transition duration-200 hover:-translate-y-0.5 hover:bg-[#183d35]"
              >
                Start building free
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/#faq"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-[#ccd3cc] bg-white/80 px-7 py-4 text-sm font-semibold text-[#17211c] transition duration-200 hover:-translate-y-0.5 hover:border-[#215146] hover:text-[#215146]"
              >
                Read common questions
              </Link>
            </div>
          </div>

          <div className="rounded-[2rem] border border-[#d6dbd2] bg-white/82 p-7 shadow-[0_28px_70px_-40px_rgba(23,33,28,0.32)] backdrop-blur">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#6a746e]">
              Buying logic
            </p>
            <div className="mt-5 space-y-4">
              <div className="rounded-[1.3rem] border border-[#e0e5dc] bg-[#f7f4ed] p-5">
                <p className="text-sm font-semibold text-[#17211c]">
                  Free first
                </p>
                <p className="mt-2 text-sm leading-7 text-[#515b56]">
                  Let people write the resume before they decide if the export is worth paying for.
                </p>
              </div>
              <div className="rounded-[1.3rem] border border-[#d1dad4] bg-[#1f433b] p-5 text-[#f5f1e8]">
                <p className="text-sm font-semibold">Best conversion path</p>
                <p className="mt-2 text-sm leading-7 text-[#d4dfda]">
                  The single unlock is the easiest yes for most visitors, so the page should make that choice feel safe and obvious.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-8 sm:px-8 lg:px-10">
        <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-3">
          {proofCards.map((card) => {
            const Icon = card.icon;
            return (
              <article
                key={card.title}
                className="rounded-[1.8rem] border border-[#d8dbd3] bg-white/78 p-6 shadow-[0_20px_50px_-38px_rgba(23,33,28,0.38)] backdrop-blur"
              >
                <div className="flex items-center justify-between gap-4">
                  <h2 className="max-w-xs text-xl font-semibold tracking-[-0.03em] text-[#17211c]">
                    {card.title}
                  </h2>
                  <Icon className="h-5 w-5 shrink-0 text-[#215146]" />
                </div>
                <p className="mt-4 text-sm leading-7 text-[#51605a]">
                  {card.body}
                </p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="px-6 py-14 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#6a746e]">
              Plans
            </p>
            <h2 className="mt-4 font-serif text-4xl leading-tight tracking-[-0.04em] text-[#111814] sm:text-5xl">
              Pick the smallest plan that gets the job done.
            </h2>
          </div>

          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {planRows.map((plan) => (
              <article
                key={plan.name}
                className={`flex h-full flex-col rounded-[2rem] border p-7 ${plan.tone}`}
              >
                <div className="min-h-[9rem]">
                  {plan.featured ? (
                    <span className="inline-flex rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#e8efeb]">
                      Best starter offer
                    </span>
                  ) : null}
                  <h3 className="mt-4 text-2xl font-semibold tracking-[-0.04em]">
                    {plan.name}
                  </h3>
                  <div className="mt-3 flex items-end gap-2">
                    <span className="text-5xl font-semibold tracking-[-0.06em]">
                      {plan.price}
                    </span>
                    <span className="pb-2 text-sm opacity-70">{plan.note}</span>
                  </div>
                  <p className="mt-4 max-w-sm text-sm leading-7 opacity-85">
                    {plan.description}
                  </p>
                </div>

                <ul className="mt-7 flex-1 space-y-3">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-3 text-sm leading-7"
                    >
                      <Check className="mt-1 h-4 w-4 shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={plan.href}
                  className={`mt-8 inline-flex items-center justify-center gap-2 rounded-full px-5 py-3.5 text-sm font-semibold transition duration-200 hover:-translate-y-0.5 ${
                    plan.featured
                      ? "bg-[#f5f1e8] text-[#1f433b]"
                      : "border border-current/15 bg-white/70"
                  }`}
                >
                  {plan.cta}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-10 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl rounded-[2.4rem] bg-[#17211c] px-7 py-10 text-[#f5f1e8] shadow-[0_32px_90px_-50px_rgba(23,33,28,0.7)] sm:px-10 lg:px-12">
          <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#bac8c1]">
                Comparison
              </p>
              <h2 className="mt-4 font-serif text-4xl leading-tight tracking-[-0.04em] text-balance">
                A pricing page should make the buyer feel calmer, not more cornered.
              </h2>
              <p className="mt-5 max-w-md text-sm leading-7 text-[#c9d2cd]">
                The more clearly the model matches the user&apos;s real use case,
                the easier it is to say yes.
              </p>
            </div>

            <div className="overflow-hidden rounded-[1.8rem] border border-white/10">
              <div className="grid grid-cols-[1.1fr_1fr_1fr] bg-white/5 text-xs font-semibold uppercase tracking-[0.18em] text-[#d0d7d3]">
                <div className="px-5 py-4">Decision point</div>
                <div className="border-l border-white/10 px-5 py-4">ResumeOnce</div>
                <div className="border-l border-white/10 px-5 py-4">Typical tools</div>
              </div>
              {comparisons.map((row, index) => (
                <div
                  key={row.label}
                  className={`grid grid-cols-[1.1fr_1fr_1fr] ${
                    index < comparisons.length - 1 ? "border-t border-white/10" : ""
                  }`}
                >
                  <div className="bg-white/[0.02] px-5 py-5 text-sm font-medium text-white">
                    {row.label}
                  </div>
                  <div className="border-l border-white/10 px-5 py-5 text-sm leading-7 text-[#d5ddd9]">
                    {row.resumOnce}
                  </div>
                  <div className="border-l border-white/10 px-5 py-5 text-sm leading-7 text-[#9eaba5]">
                    {row.others}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="faq" className="px-6 py-10 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl rounded-[2.4rem] border border-[#d9ddd4] bg-[#f7f4ed] p-8 sm:p-10 lg:p-12">
          <div className="max-w-2xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#6a746e]">
              FAQ
            </p>
            <h2 className="mt-4 font-serif text-4xl leading-tight tracking-[-0.04em] text-[#111814]">
              Questions that usually decide whether someone converts.
            </h2>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {faqs.map((item) => (
              <article
                key={item.question}
                className="rounded-[1.7rem] border border-[#ddd8cf] bg-white/85 p-6 shadow-[0_18px_40px_-34px_rgba(23,33,28,0.24)]"
              >
                <h3 className="text-lg font-semibold leading-7 tracking-[-0.03em] text-[#17211c]">
                  {item.question}
                </h3>
                <p className="mt-3 text-sm leading-7 text-[#4d5752]">
                  {item.answer}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 pb-20 pt-10 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-5xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#ccd4cd] bg-white/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#215146]">
            <Layers3 className="h-3.5 w-3.5" />
            Simple pricing, stronger trust
          </div>
          <h2 className="mt-5 font-serif text-4xl leading-tight tracking-[-0.04em] text-[#111814] sm:text-5xl">
            Start with the free build.
            <span className="block">Upgrade only when the resume is worth sending.</span>
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-[#4c5751]">
            That keeps the decision clean, lowers hesitation, and makes the value
            feel earned instead of forced.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/sign-up"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#215146] px-7 py-4 text-sm font-semibold text-white shadow-[0_18px_45px_-24px_rgba(33,81,70,0.6)] transition duration-200 hover:-translate-y-0.5 hover:bg-[#183d35]"
            >
              Create my resume free
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-[#ccd3cc] bg-white/80 px-7 py-4 text-sm font-semibold text-[#17211c] transition duration-200 hover:-translate-y-0.5 hover:border-[#215146] hover:text-[#215146]"
            >
              Back to homepage
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
