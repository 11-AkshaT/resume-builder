"use client";

import Link from "next/link";
import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";

export function Navbar() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 py-4 sm:px-6">
      <div className="mx-auto flex max-w-7xl items-center justify-between rounded-full border border-[#d7dbd2] bg-[rgba(247,244,237,0.78)] px-4 py-3 shadow-[0_22px_60px_-36px_rgba(23,33,28,0.42)] backdrop-blur-xl sm:px-6">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#215146] text-sm font-semibold text-white shadow-[0_10px_24px_-14px_rgba(33,81,70,0.75)]">
            R
          </div>
          <div>
            <div className="text-sm font-semibold uppercase tracking-[0.18em] text-[#215146]">
              ResumeOnce
            </div>
            <div className="hidden text-xs text-[#6b7570] sm:block">
              Build first. Pay later.
            </div>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium text-[#44504b] md:flex">
          <Link href="/#how-it-works" className="transition hover:text-[#215146]">
            How it works
          </Link>
          <Link href="/#pricing" className="transition hover:text-[#215146]">
            Pricing
          </Link>
          <Link href="/#faq" className="transition hover:text-[#215146]">
            FAQ
          </Link>
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <Show when="signed-out">
            <SignInButton>
              <button className="rounded-full px-4 py-2 text-sm font-medium text-[#44504b] transition hover:bg-white/70 hover:text-[#17211c]">
                Sign in
              </button>
            </SignInButton>
            <SignUpButton>
              <button className="inline-flex items-center justify-center rounded-full bg-[#17211c] px-4 py-2.5 text-sm font-semibold text-[#f6f2ea] transition hover:-translate-y-0.5 hover:bg-[#111814] sm:px-5">
                Start free
              </button>
            </SignUpButton>
          </Show>

          <Show when="signed-in">
            <Link
              href="/app"
              className="rounded-full px-4 py-2 text-sm font-medium text-[#44504b] transition hover:bg-white/70 hover:text-[#17211c]"
            >
              Dashboard
            </Link>
            <UserButton />
          </Show>
        </div>
      </div>
    </header>
  );
}
