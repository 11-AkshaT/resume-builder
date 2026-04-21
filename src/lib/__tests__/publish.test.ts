import { describe, expect, it } from "vitest";
import {
  getResumeSlugValidationError,
  isValidResumeSlug,
  normalizeResumeSlug,
} from "../publish";

describe("publish helpers", () => {
  it("normalizes slugs before validation", () => {
    expect(normalizeResumeSlug("  Jane-Doe  ")).toBe("jane-doe");
  });

  it("accepts valid slugs", () => {
    expect(isValidResumeSlug("jane-doe-2026")).toBe(true);
    expect(getResumeSlugValidationError("jane-doe-2026")).toBeNull();
  });

  it("rejects invalid slugs", () => {
    expect(isValidResumeSlug("Jane Doe")).toBe(false);
    expect(getResumeSlugValidationError("Jane Doe")).toContain("Slug must be");
  });

  it("rejects reserved production subdomains", () => {
    expect(isValidResumeSlug("www")).toBe(false);
    expect(isValidResumeSlug("api")).toBe(false);
    expect(getResumeSlugValidationError("pricing")).toContain("reserved");
  });
});
