"use server";

import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { hasLifetimeAccess } from "@/lib/entitlements";
import { defaultResumeData, type ResumeData, type TemplateKey } from "@/lib/types";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function createResume() {
  const user = await requireUser();

  const resume = await db.resume.create({
    data: {
      userId: user.id,
      title: "Untitled Resume",
      data: JSON.stringify(defaultResumeData),
    },
  });

  redirect(`/app/resumes/${resume.id}`);
}

export async function updateResumeData(resumeId: string, data: ResumeData) {
  const user = await requireUser();

  const serialized = JSON.stringify(data);
  if (serialized.length > 500_000) {
    throw new Error("Resume data too large");
  }

  const resume = await db.resume.findUnique({
    where: { id: resumeId },
  });

  if (!resume || resume.userId !== user.id) {
    throw new Error("Resume not found");
  }

  await db.resume.update({
    where: { id: resumeId },
    data: { data: serialized },
  });

  return { success: true };
}

export async function updateResumeTitle(resumeId: string, title: string) {
  const user = await requireUser();

  const resume = await db.resume.findUnique({
    where: { id: resumeId },
  });

  if (!resume || resume.userId !== user.id) {
    throw new Error("Resume not found");
  }

  await db.resume.update({
    where: { id: resumeId },
    data: { title },
  });

  revalidatePath("/app");
  return { success: true };
}

export async function updateResumeTemplate(resumeId: string, templateKey: TemplateKey) {
  const user = await requireUser();

  const resume = await db.resume.findUnique({ where: { id: resumeId } });
  if (!resume || resume.userId !== user.id) {
    throw new Error("Resume not found");
  }

  await db.resume.update({
    where: { id: resumeId },
    data: { templateKey },
  });

  revalidatePath(`/app/resumes/${resumeId}`);
  return { success: true };
}

export async function deleteResume(resumeId: string) {
  const user = await requireUser();

  const resume = await db.resume.findUnique({
    where: { id: resumeId },
  });

  if (!resume || resume.userId !== user.id) {
    throw new Error("Resume not found");
  }

  await db.resume.delete({ where: { id: resumeId } });

  revalidatePath("/app");
  redirect("/app");
}

const SLUG_REGEX = /^[a-z0-9](?:[a-z0-9-]{0,38}[a-z0-9])?$/;

export async function publishResume(resumeId: string, slug: string) {
  const user = await requireUser();

  const lifetime = await hasLifetimeAccess(user.id);
  if (!lifetime) {
    throw new Error("Lifetime plan required to publish a hosted resume");
  }

  const resume = await db.resume.findUnique({ where: { id: resumeId } });
  if (!resume || resume.userId !== user.id) {
    throw new Error("Resume not found");
  }

  const normalized = slug.toLowerCase().trim();
  if (!SLUG_REGEX.test(normalized)) {
    throw new Error(
      "Slug must be 2-40 characters, lowercase letters, numbers, and hyphens only"
    );
  }

  const existing = await db.resume.findUnique({ where: { slug: normalized } });
  if (existing && existing.id !== resumeId) {
    throw new Error("This URL is already taken. Try a different one.");
  }

  await db.resume.update({
    where: { id: resumeId },
    data: { slug: normalized, isPublished: true },
  });

  revalidatePath(`/r/${normalized}`);
  return { success: true, slug: normalized };
}

export async function unpublishResume(resumeId: string) {
  const user = await requireUser();

  const resume = await db.resume.findUnique({ where: { id: resumeId } });
  if (!resume || resume.userId !== user.id) {
    throw new Error("Resume not found");
  }

  await db.resume.update({
    where: { id: resumeId },
    data: { isPublished: false },
  });

  if (resume.slug) {
    revalidatePath(`/r/${resume.slug}`);
  }
  return { success: true };
}

export async function checkSlugAvailability(slug: string, resumeId: string) {
  await requireUser();
  const normalized = slug.toLowerCase().trim();
  if (!SLUG_REGEX.test(normalized)) {
    return { available: false, reason: "Invalid format" };
  }

  const existing = await db.resume.findUnique({ where: { slug: normalized } });
  if (existing && existing.id !== resumeId) {
    return { available: false, reason: "Already taken" };
  }

  return { available: true };
}
