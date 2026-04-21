const REQUIRED_PRODUCTION_ENV = [
  "CLERK_SECRET_KEY",
  "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY",
  "RAZORPAY_KEY_ID",
  "RAZORPAY_KEY_SECRET",
  "RAZORPAY_WEBHOOK_SECRET",
  "NEXT_PUBLIC_RAZORPAY_KEY_ID",
  "NEXT_PUBLIC_APP_URL",
  "NEXT_PUBLIC_ROOT_DOMAIN",
] as const;

type EnvShape = Record<string, string | undefined>;

function readEnv(name: string) {
  const value = process.env[name];
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function formatMissingEnv(names: readonly string[]) {
  return names.map((name) => `- ${name}`).join("\n");
}

export function getProductionEnvIssues(values: EnvShape) {
  const missing = REQUIRED_PRODUCTION_ENV.filter((name) => !values[name]?.trim());
  const issues: string[] = [];

  if (missing.length > 0) {
    issues.push(
      `Missing required production environment variables:\n${formatMissingEnv(missing)}`
    );
  }

  if (values.DEV_BYPASS_AUTH === "true") {
    issues.push("DEV_BYPASS_AUTH must be false in production.");
  }

  if (values.RAZORPAY_WEBHOOK_SECRET === "REPLACE_ME") {
    issues.push("RAZORPAY_WEBHOOK_SECRET must be configured in production.");
  }

  if (values.NEXT_PUBLIC_APP_URL && !values.NEXT_PUBLIC_APP_URL.startsWith("https://")) {
    issues.push("NEXT_PUBLIC_APP_URL must be an https URL in production.");
  }

  if (values.NEXT_PUBLIC_ROOT_DOMAIN?.startsWith("http")) {
    issues.push("NEXT_PUBLIC_ROOT_DOMAIN must be a bare domain, for example resumeonce.co.");
  }

  if (values.NEXT_PUBLIC_APP_URL && values.NEXT_PUBLIC_ROOT_DOMAIN) {
    try {
      const appHost = new URL(values.NEXT_PUBLIC_APP_URL).hostname;
      const rootDomain = values.NEXT_PUBLIC_ROOT_DOMAIN.trim().toLowerCase();
      if (appHost !== rootDomain && appHost !== `www.${rootDomain}`) {
        issues.push("NEXT_PUBLIC_APP_URL must use NEXT_PUBLIC_ROOT_DOMAIN or www.NEXT_PUBLIC_ROOT_DOMAIN.");
      }
    } catch {
      issues.push("NEXT_PUBLIC_APP_URL must be a valid URL.");
    }
  }

  return issues;
}

export const env = {
  databaseUrl: readEnv("DATABASE_URL"),
  appUrl: readEnv("NEXT_PUBLIC_APP_URL"),
  clerkPublishableKey: readEnv("NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY"),
  clerkSecretKey: readEnv("CLERK_SECRET_KEY"),
  clerkSignInUrl: readEnv("NEXT_PUBLIC_CLERK_SIGN_IN_URL") ?? "/sign-in",
  clerkSignUpUrl: readEnv("NEXT_PUBLIC_CLERK_SIGN_UP_URL") ?? "/sign-up",
  devBypassAuth: readEnv("DEV_BYPASS_AUTH") === "true",
  rootDomain: readEnv("NEXT_PUBLIC_ROOT_DOMAIN"),
  razorpayKeyId: readEnv("RAZORPAY_KEY_ID"),
  razorpayKeySecret: readEnv("RAZORPAY_KEY_SECRET"),
  razorpayWebhookSecret: readEnv("RAZORPAY_WEBHOOK_SECRET"),
  publicRazorpayKeyId: readEnv("NEXT_PUBLIC_RAZORPAY_KEY_ID"),
  sentryDsn: readEnv("SENTRY_DSN"),
  nextPublicSentryDsn: readEnv("NEXT_PUBLIC_SENTRY_DSN"),
} as const;

function isProductionBuildPhase() {
  return process.env.NEXT_PHASE === "phase-production-build";
}

export function assertProductionEnv() {
  if (process.env.NODE_ENV !== "production" || isProductionBuildPhase()) {
    return;
  }

  const issues = getProductionEnvIssues(process.env);
  if (issues.length > 0) {
    throw new Error(issues.join("\n\n"));
  }
}
