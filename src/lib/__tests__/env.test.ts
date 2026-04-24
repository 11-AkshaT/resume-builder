import { describe, expect, it } from "vitest";
import { getProductionEnvIssues, getRootDomain } from "../env";

describe("getProductionEnvIssues", () => {
  it("returns no issues for a complete production env", () => {
    expect(
      getProductionEnvIssues({
        CLERK_SECRET_KEY: "secret",
        NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: "publishable",
        RAZORPAY_KEY_ID: "key",
        RAZORPAY_KEY_SECRET: "secret",
        RAZORPAY_WEBHOOK_SECRET: "webhook",
        NEXT_PUBLIC_RAZORPAY_KEY_ID: "public-key",
        NEXT_PUBLIC_APP_URL: "https://resumeonce.co",
        NEXT_PUBLIC_ROOT_DOMAIN: "resumeonce.co",
        DEV_BYPASS_AUTH: "false",
      })
    ).toEqual([]);
  });

  it("allows NEXT_PUBLIC_ROOT_DOMAIN to be inferred from NEXT_PUBLIC_APP_URL", () => {
    expect(
      getProductionEnvIssues({
        CLERK_SECRET_KEY: "secret",
        NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: "publishable",
        RAZORPAY_KEY_ID: "key",
        RAZORPAY_KEY_SECRET: "secret",
        RAZORPAY_WEBHOOK_SECRET: "webhook",
        NEXT_PUBLIC_RAZORPAY_KEY_ID: "public-key",
        NEXT_PUBLIC_APP_URL: "https://resumeonce.co",
        DEV_BYPASS_AUTH: "false",
      })
    ).toEqual([]);
  });

  it("flags missing and unsafe production settings", () => {
    const issues = getProductionEnvIssues({
      CLERK_SECRET_KEY: "",
      NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: "",
      RAZORPAY_KEY_ID: "",
      RAZORPAY_KEY_SECRET: "",
      RAZORPAY_WEBHOOK_SECRET: "REPLACE_ME",
      NEXT_PUBLIC_RAZORPAY_KEY_ID: "",
      NEXT_PUBLIC_APP_URL: "http://localhost:3000",
      NEXT_PUBLIC_ROOT_DOMAIN: "",
      DEV_BYPASS_AUTH: "true",
    });

    expect(issues.join("\n")).toContain("Missing required production environment variables");
    expect(issues).toContain("DEV_BYPASS_AUTH must be false in production.");
    expect(issues).toContain("RAZORPAY_WEBHOOK_SECRET must be configured in production.");
    expect(issues).toContain("NEXT_PUBLIC_APP_URL must be an https URL in production.");
  });

  it("flags app URLs that do not match the configured root domain", () => {
    const issues = getProductionEnvIssues({
      CLERK_SECRET_KEY: "secret",
      NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: "publishable",
      RAZORPAY_KEY_ID: "key",
      RAZORPAY_KEY_SECRET: "secret",
      RAZORPAY_WEBHOOK_SECRET: "webhook",
      NEXT_PUBLIC_RAZORPAY_KEY_ID: "public-key",
      NEXT_PUBLIC_APP_URL: "https://example.com",
      NEXT_PUBLIC_ROOT_DOMAIN: "resumeonce.co",
      DEV_BYPASS_AUTH: "false",
    });

    expect(issues).toContain(
      "NEXT_PUBLIC_APP_URL must use NEXT_PUBLIC_ROOT_DOMAIN or www.NEXT_PUBLIC_ROOT_DOMAIN."
    );
  });

  it("derives the root domain from NEXT_PUBLIC_APP_URL when needed", () => {
    expect(
      getRootDomain({
        NEXT_PUBLIC_APP_URL: "https://resumeonce.co",
      })
    ).toBe("resumeonce.co");
  });
});
