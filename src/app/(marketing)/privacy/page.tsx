import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — ResumeOnce",
};

export default function PrivacyPage() {
  return (
    <div className="py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 prose prose-slate">
        <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>

        <p className="text-muted-foreground mb-6">
          Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-3">Information We Collect</h2>
        <p className="text-muted-foreground mb-4">
          We collect the information you provide when creating your account (email,
          name) and the resume content you enter into our editor. We also collect
          payment information through our payment processor, Razorpay.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-3">How We Use Your Information</h2>
        <p className="text-muted-foreground mb-4">
          We use your information to provide the resume building service, process
          payments, and communicate with you about your account. We do not sell your
          personal data or resume content to third parties.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-3">Data Storage</h2>
        <p className="text-muted-foreground mb-4">
          Your resume data is stored securely in our database. You can delete your
          resumes at any time from your dashboard.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-3">Third-Party Services</h2>
        <p className="text-muted-foreground mb-4">
          We use Clerk for authentication, Razorpay for payment processing, and
          standard hosting providers for our infrastructure. Each of these services
          has their own privacy policy.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-3">Contact</h2>
        <p className="text-muted-foreground mb-4">
          For privacy-related questions, contact us at privacy@resumeonce.com.
        </p>
      </div>
    </div>
  );
}
