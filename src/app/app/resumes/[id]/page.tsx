import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { canExportResume, hasLifetimeAccess } from "@/lib/entitlements";
import { notFound } from "next/navigation";
import { ResumeEditor } from "@/components/editor/resume-editor";
import { emptyResumeData, type ResumeData, type TemplateKey } from "@/lib/types";
import type { Metadata } from "next";

type Params = Promise<{ id: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { id } = await params;
  const resume = await db.resume.findUnique({ where: { id } });
  return { title: `${resume?.title ?? "Resume"} — ResumeOnce` };
}

function parseResumeData(raw: unknown): ResumeData {
  try {
    const parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
    return {
      ...emptyResumeData,
      ...parsed,
      sectionOrder: parsed.sectionOrder ?? ["education", "experience", "projects", "skills"],
    };
  } catch {
    return emptyResumeData;
  }
}

export default async function ResumeEditorPage({
  params,
}: {
  params: Params;
}) {
  const user = await requireUser();
  const { id } = await params;

  const resume = await db.resume.findUnique({ where: { id } });

  if (!resume || resume.userId !== user.id) {
    notFound();
  }

  const [unlocked, lifetime] = await Promise.all([
    canExportResume(user.id, resume.id),
    hasLifetimeAccess(user.id),
  ]);
  const data = parseResumeData(resume.data);

  return (
    <ResumeEditor
      resumeId={resume.id}
      initialTitle={resume.title}
      initialData={data}
      initialTemplate={(resume.templateKey as TemplateKey) || "minimal"}
      unlocked={unlocked}
      hasLifetime={lifetime}
      initialSlug={resume.slug}
      initialPublished={resume.isPublished}
    />
  );
}
