import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { emptyResumeData, type ResumeData, type TemplateKey } from "@/lib/types";
import { ResumePreview } from "@/components/editor/resume-preview";
import type { Metadata } from "next";
import Link from "next/link";

type Params = Promise<{ slug: string }>;

function parseResumeData(raw: unknown): ResumeData {
  try {
    const parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
    return {
      ...emptyResumeData,
      ...parsed,
      sectionOrder:
        parsed.sectionOrder ?? ["education", "experience", "projects", "skills"],
    };
  } catch {
    return emptyResumeData;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const resume = await db.resume.findUnique({ where: { slug } });

  if (!resume || !resume.isPublished) {
    return { title: "Resume Not Found" };
  }

  const data = parseResumeData(resume.data);
  const name = data.personalInfo.fullName || "Resume";
  const title = data.personalInfo.fullName
    ? `${name} — Resume`
    : resume.title;

  return {
    title,
    description: `${name}'s professional resume`,
    openGraph: {
      title,
      description: `${name}'s professional resume`,
      type: "profile",
    },
  };
}

export default async function PublicResumePage({
  params,
}: {
  params: Params;
}) {
  const { slug } = await params;

  const resume = await db.resume.findUnique({ where: { slug } });

  if (!resume || !resume.isPublished) {
    notFound();
  }

  const data = parseResumeData(resume.data);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Minimal top bar */}
      <div className="bg-white border-b border-gray-200 px-4 py-2.5 flex items-center justify-between">
        <Link
          href="/"
          className="text-sm font-semibold text-gray-900 hover:text-gray-600 transition-colors"
        >
          ResumeOnce
        </Link>
        <Link
          href="/"
          className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
        >
          Build your own &rarr;
        </Link>
      </div>

      {/* Resume centered on page */}
      <div className="flex justify-center py-8 px-4">
        <ResumePreview data={data} sectionOrder={data.sectionOrder} template={(resume.templateKey as TemplateKey) || "minimal"} />
      </div>
    </div>
  );
}
