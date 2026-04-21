import { describe, expect, it, vi } from "vitest";
import type { NextRequest } from "next/server";

const { getDownloadExportHtml } = vi.hoisted(() => ({
  getDownloadExportHtml: vi.fn(),
}));

vi.mock("@/lib/download-export", () => ({
  getDownloadExportHtml,
}));

import { GET } from "./route";

describe("download export route", () => {
  it("returns printable html for unlocked resumes", async () => {
    getDownloadExportHtml.mockResolvedValue("<html><body>resume</body></html>");

    const response = await GET({} as NextRequest, {
      params: Promise.resolve({ resumeId: "resume_1" }),
    });

    expect(response.status).toBe(200);
    expect(response.headers.get("Content-Type")).toContain("text/html");
    await expect(response.text()).resolves.toContain("resume");
  });

  it("returns 403 when export is still locked", async () => {
    getDownloadExportHtml.mockRejectedValue(new Error("Export not unlocked"));

    const response = await GET({} as NextRequest, {
      params: Promise.resolve({ resumeId: "resume_1" }),
    });

    expect(response.status).toBe(403);
  });
});
