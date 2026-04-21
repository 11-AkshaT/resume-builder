import Link from "next/link";

export function Footer() {
  return (
    <footer className="px-6 pb-10 pt-6 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl rounded-[2rem] border border-[#d9ddd4] bg-white/75 px-6 py-10 shadow-[0_22px_60px_-42px_rgba(23,33,28,0.4)] backdrop-blur sm:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr_0.8fr_0.9fr]">
          <div className="max-w-md">
            <Link
              href="/"
              className="text-sm font-semibold uppercase tracking-[0.2em] text-[#215146]"
            >
              ResumeOnce
            </Link>
            <p className="mt-4 font-serif text-3xl leading-tight tracking-[-0.04em] text-[#111814]">
              A resume builder with a cleaner offer.
            </p>
            <p className="mt-4 text-sm leading-7 text-[#53605a]">
              Create a free account, preview everything, and pay only when the resume is
              ready to export. Better for job seekers. Easier to trust.
            </p>
          </div>

          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#6a746e]">
              Product
            </p>
            <div className="mt-4 flex flex-col gap-3 text-sm text-[#44504b]">
              <Link href="/#how-it-works" className="transition hover:text-[#17211c]">
                How it works
              </Link>
              <Link href="/#pricing" className="transition hover:text-[#17211c]">
                Pricing
              </Link>
              <Link href="/#faq" className="transition hover:text-[#17211c]">
                FAQ
              </Link>
            </div>
          </div>

          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#6a746e]">
              Account
            </p>
            <div className="mt-4 flex flex-col gap-3 text-sm text-[#44504b]">
              <Link href="/sign-in" className="transition hover:text-[#17211c]">
                Sign in
              </Link>
              <Link href="/sign-up" className="transition hover:text-[#17211c]">
                Create account
              </Link>
              <Link href="/app" className="transition hover:text-[#17211c]">
                Dashboard
              </Link>
            </div>
          </div>

          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#6a746e]">
              Legal
            </p>
            <div className="mt-4 flex flex-col gap-3 text-sm text-[#44504b]">
              <Link href="/privacy" className="transition hover:text-[#17211c]">
                Privacy
              </Link>
              <Link href="/terms" className="transition hover:text-[#17211c]">
                Terms
              </Link>
              <Link href="/pricing" className="transition hover:text-[#17211c]">
                Pricing details
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-[#e2e5de] pt-6 text-xs text-[#7a847e]">
          &copy; {new Date().getFullYear()} ResumeOnce. One-time pricing for a
          send-ready resume workflow.
        </div>
      </div>
    </footer>
  );
}
