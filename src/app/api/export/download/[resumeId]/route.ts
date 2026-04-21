import { NextRequest, NextResponse } from "next/server";
import { getDownloadExportHtml } from "@/lib/download-export";

type Params = Promise<{ resumeId: string }>;

export async function GET(
  req: NextRequest,
  { params }: { params: Params }
) {
  try {
    const { resumeId } = await params;
    const html = await getDownloadExportHtml(resumeId);

    return new NextResponse(html, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Export failed";
    if (message === "Not found") {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    if (message === "Export not unlocked") {
      return NextResponse.json({ error: "Export not unlocked" }, { status: 403 });
    }

    console.error("Download export error:", error);
    return NextResponse.json({ error: "Export failed" }, { status: 500 });
  }
}
