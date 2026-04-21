import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — ResumeOnce",
};

export default function PrivacyPage() {
  return (
    <div className="py-16">
      <div className="mx-auto max-w-3xl space-y-8 px-4 sm:px-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Privacy Policy</h1>

          <p className="mt-3 text-sm text-muted-foreground">
            Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-foreground">Information We Collect</h2>
          <p className="leading-7 text-muted-foreground">
          We collect the information you provide when creating your account (email,
          name) and the resume content you enter into our editor. We also collect
          payment information through our payment processor, Razorpay.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-foreground">How We Use Your Information</h2>
          <p className="leading-7 text-muted-foreground">
          We use your information to provide the resume building service, process
          payments, and communicate with you about your account. We do not sell your
          personal data or resume content to third parties.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-foreground">Data Storage</h2>
          <p className="leading-7 text-muted-foreground">
          Your resume data is stored securely in our database. You can delete your
          resumes at any time from your dashboard.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-foreground">Third-Party Services</h2>
          <p className="leading-7 text-muted-foreground">
          We use Clerk for authentication, Razorpay for payment processing, and
          standard hosting providers for our infrastructure. Each of these services
          has their own privacy policy.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-foreground">Contact</h2>
          <p className="leading-7 text-muted-foreground">
          For privacy-related questions, contact us at privacy@resumeonce.co.
          </p>
        </section>
      </div>
    </div>
  );
}
