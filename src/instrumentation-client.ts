import * as Sentry from "@sentry/nextjs";
import { env } from "./lib/env";

if (env.nextPublicSentryDsn) {
  Sentry.init({
    dsn: env.nextPublicSentryDsn,
    enabled: process.env.NODE_ENV === "production",
    environment: process.env.NODE_ENV,
    tracesSampleRate: 0.1,
    replaysSessionSampleRate: 0,
    replaysOnErrorSampleRate: 0,
  });
}

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
