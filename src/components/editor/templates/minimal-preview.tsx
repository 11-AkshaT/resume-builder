"use client";

import type { ResumeData } from "@/lib/types";
import { getSafeMailto, getSafeUrl } from "@/lib/safe-url";

interface MinimalPreviewProps {
  data: ResumeData;
  sectionOrder?: string[];
}

const DEFAULT_SECTION_ORDER = ["education", "experience", "projects", "skills"];

export function MinimalPreview({ data, sectionOrder }: MinimalPreviewProps) {
  const { personalInfo } = data;
  const order = sectionOrder ?? DEFAULT_SECTION_ORDER;

  const contactParts: React.ReactNode[] = [];
  if (personalInfo.phone) contactParts.push(personalInfo.phone);
  const emailHref = getSafeMailto(personalInfo.email);
  if (personalInfo.email)
    contactParts.push(
      emailHref ? (
        <a key="email" href={emailHref} className="underline">
          {personalInfo.email}
        </a>
      ) : (
        <span key="email">{personalInfo.email}</span>
      )
    );
  personalInfo.links.forEach((link, i) => {
    const safeUrl = getSafeUrl(link.url);
    if (link.url || link.label) {
      contactParts.push(
        safeUrl ? (
          <a key={`link-${i}`} href={safeUrl} className="underline" target="_blank" rel="noopener noreferrer">
            {link.label || link.url.replace(/^https?:\/\/(www\.)?/, "")}
          </a>
        ) : (
          <span key={`link-${i}`}>{link.label || link.url}</span>
        )
      );
    }
  });

  const sectionRenderers: Record<string, () => React.ReactNode> = {
    education: () => <EducationSection data={data} />,
    experience: () => <ExperienceSection data={data} />,
    projects: () => <ProjectsSection data={data} />,
    skills: () => <SkillsSection data={data} />,
    summary: () => <SummarySection data={data} />,
  };

  return (
    <div className="resume-page shadow-lg rounded border border-border bg-white" id="resume-preview">
      <div className="text-center mb-[1pt]">
        <h1 className="text-[22pt] font-bold" style={{ fontVariant: "small-caps" }}>
          {personalInfo.fullName || "\u00A0"}
        </h1>
        {contactParts.length > 0 && (
          <p className="text-[9.5pt] mt-[1pt]">
            {contactParts.map((part, i) => (
              <span key={i}>
                {i > 0 && " | "}
                {part}
              </span>
            ))}
          </p>
        )}
      </div>
      {order.map((key) => {
        const renderer = sectionRenderers[key];
        return renderer ? <span key={key}>{renderer()}</span> : null;
      })}
    </div>
  );
}

function SectionHeader({ title }: { title: string }) {
  return (
    <div className="border-b-[1px] border-black pb-[0pt] mt-[6pt] mb-[3pt]">
      <h2 className="text-[12pt] font-normal tracking-wide leading-tight" style={{ fontVariant: "small-caps" }}>
        {title}
      </h2>
    </div>
  );
}

function SubHeading({ line1Left, line1Right, line2Left, line2Right }: {
  line1Left: React.ReactNode; line1Right: React.ReactNode;
  line2Left?: React.ReactNode; line2Right?: React.ReactNode;
}) {
  return (
    <div className="mb-[2pt] ml-[6pt]" style={{ width: "97%" }}>
      <div className="flex justify-between items-baseline">
        <div className="text-[10.5pt] font-bold">{line1Left}</div>
        <div className="text-[10.5pt] shrink-0 ml-2 text-right">{line1Right}</div>
      </div>
      {(line2Left || line2Right) && (
        <div className="flex justify-between items-baseline">
          <div className="text-[9.5pt] italic">{line2Left}</div>
          <div className="text-[9.5pt] italic shrink-0 ml-2 text-right">{line2Right}</div>
        </div>
      )}
    </div>
  );
}

function BulletList({ items }: { items: string[] }) {
  const filtered = items.filter((b) => b.trim());
  if (filtered.length === 0) return null;
  return (
    <ul className="list-disc ml-[22pt] mt-[0pt] mb-[2pt] text-[10pt] space-y-[0pt] leading-[1.25]">
      {filtered.map((bullet, i) => <li key={i}>{bullet}</li>)}
    </ul>
  );
}

function EducationSection({ data }: { data: ResumeData }) {
  if (data.education.length === 0) return null;
  return (
    <>
      <SectionHeader title="Education" />
      {data.education.map((edu) => (
        <SubHeading key={edu.id} line1Left={edu.school} line1Right={edu.location}
          line2Left={<>{edu.degree}{edu.field && `, ${edu.field}`}</>}
          line2Right={(edu.startDate || edu.endDate) ? `${edu.startDate}${edu.endDate ? ` -- ${edu.endDate}` : ""}` : undefined}
        />
      ))}
    </>
  );
}

function ExperienceSection({ data }: { data: ResumeData }) {
  if (data.experience.length === 0) return null;
  return (
    <>
      <SectionHeader title="Experience" />
      {data.experience.map((exp) => (
        <div key={exp.id}>
          <SubHeading line1Left={exp.role}
            line1Right={(exp.startDate || exp.endDate) ? `${exp.startDate}${exp.endDate ? ` -- ${exp.endDate}` : ""}` : undefined}
            line2Left={exp.company} line2Right={exp.location}
          />
          <BulletList items={exp.bullets} />
        </div>
      ))}
    </>
  );
}

function ProjectsSection({ data }: { data: ResumeData }) {
  if (data.projects.length === 0) return null;
  return (
    <>
      <SectionHeader title="Projects" />
      {data.projects.map((proj) => (
        <div key={proj.id}>
          {(() => {
            const safeUrl = getSafeUrl(proj.link);
            return (
          <div className="mb-[2pt] ml-[6pt] flex justify-between items-baseline" style={{ width: "97%" }}>
            <div className="text-[10.5pt]">
              <span className="font-bold">{proj.name}</span>
              {proj.techStack && <>{" | "}<span className="italic">{proj.techStack}</span></>}
            </div>
            <div className="text-[10.5pt] shrink-0 ml-2 text-right">
              {safeUrl ? <a href={safeUrl} className="underline" target="_blank" rel="noopener noreferrer">{proj.link.replace(/^https?:\/\/(www\.)?/, "")}</a> : proj.link || null}
            </div>
          </div>
            );
          })()}
          <BulletList items={proj.bullets} />
        </div>
      ))}
    </>
  );
}

function SkillsSection({ data }: { data: ResumeData }) {
  if (data.skills.length === 0) return null;
  return (
    <>
      <SectionHeader title="Technical Skills" />
      <div className="ml-[6pt] text-[10pt] leading-[1.35]" style={{ width: "97%" }}>
        {data.skills.map((group) => (
          <p key={group.id}>
            {group.category && <span className="font-bold">{group.category}: </span>}
            {group.skills}
          </p>
        ))}
      </div>
    </>
  );
}

function SummarySection({ data }: { data: ResumeData }) {
  if (!data.summary) return null;
  return (
    <>
      <SectionHeader title="Summary" />
      <p className="ml-[6pt] text-[10pt] mb-[4pt] leading-[1.3]" style={{ width: "97%" }}>{data.summary}</p>
    </>
  );
}
