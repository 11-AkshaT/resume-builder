import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { canExportResume } from "@/lib/entitlements";
import { db } from "@/lib/db";
import { generateResumeHTMLByTemplate } from "@/lib/resume-html";
import { emptyResumeData, type ResumeData, type TemplateKey } from "@/lib/types";

type Params = Promise<{ resumeId: string }>;

function parseResumeData(raw: unknown): ResumeData {
  try {
    const parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
    return { ...emptyResumeData, ...parsed };
  } catch {
    return emptyResumeData;
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: Params }
) {
  try {
    const user = await requireUser();
    const { resumeId } = await params;

    const resume = await db.resume.findUnique({ where: { id: resumeId } });

    if (!resume || resume.userId !== user.id) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const canExport = await canExportResume(user.id, resumeId);
    if (!canExport) {
      return NextResponse.json(
        { error: "Export not unlocked" },
        { status: 403 }
      );
    }

    const data = parseResumeData(resume.data);
    const template = (resume.templateKey as TemplateKey) || "minimal";
    const html = generateResumeHTMLByTemplate(data, resume.title, template);

    return new NextResponse(html, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Content-Disposition": `inline; filename="${resume.title.replace(/[^a-zA-Z0-9]/g, "_")}.html"`,
      },
    });
  } catch (error) {
    console.error("PDF export error:", error);
    return NextResponse.json({ error: "Export failed" }, { status: 500 });
  }
}
