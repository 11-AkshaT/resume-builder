import { describe, expect, it } from "vitest";
import { getSafeMailto, getSafeUrl } from "../safe-url";

describe("safe URL helpers", () => {
  it("allows http, https, and mailto URLs", () => {
    expect(getSafeUrl("https://example.com/profile")).toBe("https://example.com/profile");
    expect(getSafeUrl("http://example.com")).toBe("http://example.com");
    expect(getSafeMailto("person@example.com")).toBe("mailto:person@example.com");
  });

  it("rejects script, data, malformed, and whitespace-bearing URLs", () => {
    expect(getSafeUrl("javascript:alert(1)")).toBeNull();
    expect(getSafeUrl("data:text/html,<script>alert(1)</script>")).toBeNull();
    expect(getSafeUrl("example.com")).toBeNull();
    expect(getSafeUrl("java\nscript:alert(1)")).toBeNull();
  });
});
