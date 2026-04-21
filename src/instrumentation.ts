import * as Sentry from "@sentry/nextjs";
import { env } from "./lib/env";

export async function register() {
  if (!env.sentryDsn) {
    return;
  }

  if (process.env.NEXT_RUNTIME === "nodejs") {
    Sentry.init({
      dsn: env.sentryDsn,
      enabled: process.env.NODE_ENV === "production",
      environment: process.env.NODE_ENV,
      tracesSampleRate: 0.1,
    });
  }

  if (process.env.NEXT_RUNTIME === "edge") {
    Sentry.init({
      dsn: env.sentryDsn,
      enabled: process.env.NODE_ENV === "production",
      environment: process.env.NODE_ENV,
      tracesSampleRate: 0.1,
    });
  }
}

export const onRequestError = Sentry.captureRequestError;
