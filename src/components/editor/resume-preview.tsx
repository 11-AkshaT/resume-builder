"use client";

import type { ResumeData, TemplateKey } from "@/lib/types";
import { MinimalPreview } from "./templates/minimal-preview";
import { ProfessionalPreview } from "./templates/professional-preview";
import { ModernPreview } from "./templates/modern-preview";

interface ResumePreviewProps {
  data: ResumeData;
  sectionOrder?: string[];
  template?: TemplateKey;
}

export function ResumePreview({ data, sectionOrder, template = "minimal" }: ResumePreviewProps) {
  switch (template) {
    case "professional":
      return <ProfessionalPreview data={data} sectionOrder={sectionOrder} />;
    case "modern":
      return <ModernPreview data={data} sectionOrder={sectionOrder} />;
    case "minimal":
    default:
      return <MinimalPreview data={data} sectionOrder={sectionOrder} />;
  }
}
