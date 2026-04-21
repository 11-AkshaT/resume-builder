import { describe, expect, it } from "vitest";
import { getHostedResumeSlugFromHost } from "../subdomains";

describe("getHostedResumeSlugFromHost", () => {
  it("extracts hosted resume slugs from the production root domain", () => {
    expect(getHostedResumeSlugFromHost("akshat.resumeonce.co", "resumeonce.co")).toBe("akshat");
    expect(getHostedResumeSlugFromHost("Akshat.ResumeOnce.Co:443", "resumeonce.co")).toBe("akshat");
  });

  it("ignores root, www, preview, localhost, and unrelated hosts", () => {
    expect(getHostedResumeSlugFromHost("resumeonce.co", "resumeonce.co")).toBeNull();
    expect(getHostedResumeSlugFromHost("www.resumeonce.co", "resumeonce.co")).toBeNull();
    expect(getHostedResumeSlugFromHost("resumeonce-git-main.vercel.app", "resumeonce.co")).toBeNull();
    expect(getHostedResumeSlugFromHost("localhost:3000", "resumeonce.co")).toBeNull();
    expect(getHostedResumeSlugFromHost("akshat.example.com", "resumeonce.co")).toBeNull();
  });

  it("ignores nested subdomains so only slug.resumeonce.co is handled", () => {
    expect(getHostedResumeSlugFromHost("a.b.resumeonce.co", "resumeonce.co")).toBeNull();
  });
});
