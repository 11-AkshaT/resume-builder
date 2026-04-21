import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service — ResumeOnce",
};

export default function TermsPage() {
  return (
    <div className="py-16">
      <div className="mx-auto max-w-3xl space-y-8 px-4 sm:px-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Terms of Service</h1>

          <p className="mt-3 text-sm text-muted-foreground">
            Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-foreground">1. Service Description</h2>
          <p className="leading-7 text-muted-foreground">
          ResumeOnce provides an online resume builder that allows users to create,
          edit, and export resumes. The basic building and preview features are free.
          Export features require a one-time payment.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-foreground">2. Payments</h2>
          <p className="leading-7 text-muted-foreground">
          Payments are one-time and non-recurring. Single resume unlocks apply to one
          specific resume. Lifetime unlocks apply to all current and future resumes
          on your account. All payments are processed through Razorpay.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-foreground">3. Refunds</h2>
          <p className="leading-7 text-muted-foreground">
          Since you can preview your resume before paying, refunds are generally not
          provided. If you experience a technical issue preventing export after
          payment, contact us for resolution.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-foreground">4. Account</h2>
          <p className="leading-7 text-muted-foreground">
          You are responsible for maintaining the security of your account. You must
          provide accurate information during registration.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-foreground">5. Content</h2>
          <p className="leading-7 text-muted-foreground">
          You retain ownership of all content you create using our service. We do not
          claim any rights to your resume data.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-foreground">6. Contact</h2>
          <p className="leading-7 text-muted-foreground">
          For questions about these terms, contact us at support@resumeonce.co.
          </p>
        </section>
      </div>
    </div>
  );
}
