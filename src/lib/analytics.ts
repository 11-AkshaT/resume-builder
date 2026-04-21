"use client";

export type AnalyticsEventName =
  | "create_order_started"
  | "payment_verified"
  | "resume_published";

type AnalyticsProps = Record<string, string | number | boolean | null | undefined>;

declare global {
  interface Window {
    analytics?: {
      track?: (eventName: AnalyticsEventName, props?: AnalyticsProps) => void;
    };
    dataLayer?: Array<Record<string, unknown>>;
  }
}

export function trackEvent(eventName: AnalyticsEventName, props?: AnalyticsProps) {
  if (typeof window === "undefined") {
    return;
  }

  window.analytics?.track?.(eventName, props);
  window.dataLayer?.push({
    event: eventName,
    ...props,
  });
}
