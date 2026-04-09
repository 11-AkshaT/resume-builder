import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service — ResumeOnce",
};

export default function TermsPage() {
  return (
    <div className="py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 prose prose-slate">
        <h1 className="text-3xl font-bold mb-8">Terms of Service</h1>

        <p className="text-muted-foreground mb-6">
          Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-3">1. Service Description</h2>
        <p className="text-muted-foreground mb-4">
          ResumeOnce provides an online resume builder that allows users to create,
          edit, and export resumes. The basic building and preview features are free.
          Export features require a one-time payment.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-3">2. Payments</h2>
        <p className="text-muted-foreground mb-4">
          Payments are one-time and non-recurring. Single resume unlocks apply to one
          specific resume. Lifetime unlocks apply to all current and future resumes
          on your account. All payments are processed through Razorpay.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-3">3. Refunds</h2>
        <p className="text-muted-foreground mb-4">
          Since you can preview your resume before paying, refunds are generally not
          provided. If you experience a technical issue preventing export after
          payment, contact us for resolution.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-3">4. Account</h2>
        <p className="text-muted-foreground mb-4">
          You are responsible for maintaining the security of your account. You must
          provide accurate information during registration.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-3">5. Content</h2>
        <p className="text-muted-foreground mb-4">
          You retain ownership of all content you create using our service. We do not
          claim any rights to your resume data.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-3">6. Contact</h2>
        <p className="text-muted-foreground mb-4">
          For questions about these terms, contact us at support@resumeonce.com.
        </p>
      </div>
    </div>
  );
}
