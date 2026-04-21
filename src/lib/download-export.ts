import { db } from "./db";
import { requireUser } from "./auth";
import { canExportResume } from "./entitlements";
import { generateResumeHTMLByTemplate } from "./resume-html";
import { emptyResumeData, type ResumeData, type TemplateKey } from "./types";

function parseResumeData(raw: unknown): ResumeData {
  try {
    const parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
    return { ...emptyResumeData, ...parsed };
  } catch {
    return emptyResumeData;
  }
}

export async function getDownloadExportHtml(resumeId: string) {
  const user = await requireUser();

  const resume = await db.resume.findUnique({ where: { id: resumeId } });

  if (!resume || resume.userId !== user.id) {
    throw new Error("Not found");
  }

  const unlocked = await canExportResume(user.id, resumeId);
  if (!unlocked) {
    throw new Error("Export not unlocked");
  }

  const data = parseResumeData(resume.data);
  const template = (resume.templateKey as TemplateKey) || "minimal";

  return generateResumeHTMLByTemplate(data, resume.title, template);
}
