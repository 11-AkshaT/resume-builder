"use client";

import { ClerkProvider } from "@clerk/nextjs";

const isDev = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.startsWith("pk_test_REPLACE")
  || !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

export function AuthProvider({ children }: { children: React.ReactNode }) {
  if (isDev) {
    return <>{children}</>;
  }

  return <ClerkProvider>{children}</ClerkProvider>;
}
