import { SignUp } from "@clerk/nextjs";
import Link from "next/link";

const clerkAppearance = {
  elements: {
    rootBox: "w-full",
    cardBox: "w-full",
    card: "w-full border-none bg-transparent p-0 shadow-none",
    headerTitle: "hidden",
    headerSubtitle: "hidden",
    socialButtonsBlockButton:
      "rounded-xl border border-[#ddd3c6] bg-white text-[#17211c] shadow-none hover:bg-[#fcf8f2]",
    dividerLine: "bg-[#e6ddcf]",
    dividerText: "text-[#7b827c]",
    formFieldLabel:
      "text-[11px] font-semibold uppercase tracking-[0.22em] text-[#6a736d]",
    formFieldInput:
      "h-11 rounded-xl border border-[#ddd3c6] bg-[#fffaf2] text-[#17211c] shadow-none placeholder:text-[#968f85] focus:border-[#215146] focus:ring-[#215146]/20",
    formButtonPrimary:
      "h-11 rounded-xl bg-[#215146] text-white shadow-[0_16px_36px_-20px_rgba(33,81,70,0.65)] hover:bg-[#183d35]",
    footerActionLink: "text-[#215146] hover:text-[#163c33]",
    identityPreviewText: "text-[#17211c]",
    formResendCodeLink: "text-[#215146] hover:text-[#163c33]",
  },
};

export default function SignUpPage() {
  return (
    <main className="marketing-grid min-h-[100dvh] px-6 pb-10 pt-28 text-[#17211c] sm:px-8 lg:px-10">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.95fr_0.85fr] lg:items-center">
        <section className="max-w-2xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#6a746e]">
            Start free
          </p>
          <h1 className="mt-4 font-serif text-5xl leading-[0.94] tracking-[-0.045em] text-[#111814] sm:text-6xl">
            Build the resume first.
            <span className="block text-[#215146]">Decide on export later.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-[#4e5853]">
            ResumeOnce is built for job seekers who want a clean, ATS-safe workflow
            without getting pushed into a subscription before the document is ready.
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <div className="rounded-[1.5rem] border border-[#d8dbd3] bg-white/78 p-5 shadow-[0_18px_44px_-34px_rgba(23,33,28,0.32)]">
              <p className="text-sm font-semibold text-[#17211c]">Draft without pressure</p>
              <p className="mt-2 text-sm leading-6 text-[#53605a]">
                Build, preview, and refine before you ever reach a checkout step.
              </p>
            </div>
            <div className="rounded-[1.5rem] border border-[#d8dbd3] bg-[#1f433b] p-5 text-[#f5f1e8] shadow-[0_20px_48px_-30px_rgba(31,67,59,0.45)]">
              <p className="text-sm font-semibold">Clear one-time pricing</p>
              <p className="mt-2 text-sm leading-6 text-[#d7e1dc]">
                Unlock one resume or every future version only when you actually need it.
              </p>
            </div>
          </div>

          <p className="mt-8 text-sm text-[#53605a]">
            Already have an account?{" "}
            <Link href="/sign-in" className="font-semibold text-[#215146] hover:text-[#163c33]">
              Sign in here
            </Link>
          </p>
        </section>

        <section className="app-panel app-card-glow rounded-[2rem] p-5 sm:p-7">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
            Create account
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-foreground">
            Open your free workspace
          </h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Start your first draft now and upgrade only when the file is worth sending.
          </p>

          <div className="mt-6">
            <SignUp appearance={clerkAppearance} />
          </div>
        </section>
      </div>
    </main>
  );
}
