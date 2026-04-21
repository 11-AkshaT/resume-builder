"use client";

import Script from "next/script";
import { env } from "@/lib/env";

export function RazorpayScript() {
  if (!env.publicRazorpayKeyId) {
    return null;
  }

  return (
    <Script
      src="https://checkout.razorpay.com/v1/checkout.js"
      strategy="lazyOnload"
    />
  );
}
