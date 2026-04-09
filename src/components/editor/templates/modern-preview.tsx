"use client";

import type { ResumeData } from "@/lib/types";

interface ModernPreviewProps {
  data: ResumeData;
  sectionOrder?: string[];
}

const ACCENT = "#304263";

export function ModernPreview({ data, sectionOrder }: ModernPreviewProps) {
  const { personalInfo } = data;
  const order = sectionOrder ?? ["education", "experience", "projects", "skills"];

  const mainSections = ["experience", "education", "projects"];
  const mainOrder = order.filter((k) => mainSections.includes(k));

  return (
    <div
      className="resume-page shadow-lg rounded border border-border overflow-hidden flex"
      id="resume-preview"
      style={{ fontFamily: "'Fira Sans', 'Inter', system-ui, sans-serif", padding: 0 }}
    >
      {/* Left sidebar */}
      <div
        className="shrink-0 text-white p-[16pt] flex flex-col"
        style={{ width: "33%", backgroundColor: ACCENT }}
      >
        {/* Name */}
        <div className="mb-[12pt]">
          <h1 className="text-[16pt] font-light leading-tight">
            {personalInfo.fullName ? (
              <>
                {personalInfo.fullName.split(" ").slice(0, -1).join(" ")}{" "}
                <span className="font-bold uppercase tracking-wide">
                  {personalInfo.fullName.split(" ").slice(-1)[0]}
                </span>
              </>
            ) : "\u00A0"}
          </h1>
        </div>

        {/* Profile / Summary */}
        {data.summary && (
          <>
            <SidebarHeader>Profile</SidebarHeader>
            <p className="text-[8pt] leading-[1.5] opacity-90 mb-[10pt]">
              {data.summary}
            </p>
          </>
        )}

        {/* Contact */}
        <SidebarHeader>Contact</SidebarHeader>
        <div className="text-[8pt] leading-[1.7] opacity-90 mb-[10pt]">
          {personalInfo.email && (
            <div className="flex gap-[4pt] items-start">
              <span className="opacity-60 shrink-0">@</span>
              <span className="break-all">{personalInfo.email}</span>
            </div>
          )}
          {personalInfo.phone && (
            <div className="flex gap-[4pt] items-start">
              <span className="opacity-60 shrink-0">☎</span>
              <span>{personalInfo.phone}</span>
            </div>
          )}
          {personalInfo.location && (
            <div className="flex gap-[4pt] items-start">
              <span className="opacity-60 shrink-0">⌂</span>
              <span>{personalInfo.location}</span>
            </div>
          )}
          {personalInfo.links.map((link, i) => (
            link.url || link.label ? (
              <div key={i} className="flex gap-[4pt] items-start">
                <span className="opacity-60 shrink-0">⟶</span>
                <a href={link.url || "#"} className="underline break-all" target="_blank" rel="noopener noreferrer">
                  {link.label || link.url?.replace(/^https?:\/\/(www\.)?/, "")}
                </a>
              </div>
            ) : null
          ))}
        </div>

        {/* Skills */}
        {data.skills.length > 0 && (
          <>
            <SidebarHeader>Skills</SidebarHeader>
            <div className="text-[8pt] leading-[1.7] opacity-90">
              {data.skills.map((group) => (
                <div key={group.id} className="mb-[4pt]">
                  {group.category && (
                    <div className="font-bold text-[7.5pt] uppercase tracking-wider opacity-70">
                      {group.category}
                    </div>
                  )}
                  <div>{group.skills}</div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Right main content */}
      <div className="flex-1 p-[18pt] pl-[20pt]">
        {mainOrder.map((key) => {
          const renderer = mainRenderers[key];
          return renderer ? <div key={key}>{renderer(data)}</div> : null;
        })}
      </div>
    </div>
  );
}

function SidebarHeader({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-[4pt]">
      <h2
        className="text-[9pt] font-bold uppercase tracking-wider pb-[2pt] mb-[2pt]"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.3)" }}
      >
        {children}
      </h2>
    </div>
  );
}

function MainSectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-[8pt] mb-[4pt]">
      <h2
        className="text-[13pt] font-normal tracking-wide leading-tight pb-[2pt]"
        style={{ color: ACCENT, borderBottom: `1.5px solid ${ACCENT}`, fontVariant: "small-caps" }}
      >
        {children}
      </h2>
    </div>
  );
}

function BulletText({ text }: { text: string }) {
  return (
    <div className="flex gap-[4pt] items-start text-[8.5pt] leading-[1.4] text-gray-700">
      <span className="text-gray-400 shrink-0 mt-[1pt]">◆</span>
      <span>{text}</span>
    </div>
  );
}

const mainRenderers: Record<string, (data: ResumeData) => React.ReactNode> = {
  experience: (data) => {
    if (data.experience.length === 0) return null;
    return (
      <>
        <MainSectionHeader>Experience</MainSectionHeader>
        {data.experience.map((exp, i) => (
          <div key={exp.id} className={i > 0 ? "mt-[8pt]" : ""}>
            <div className="flex justify-between items-baseline">
              <span className="text-[10pt] font-bold" style={{ fontVariant: "small-caps" }}>
                {exp.role}
              </span>
              <span
                className="text-[8pt] font-bold text-white px-[6pt] py-[1pt] rounded-sm shrink-0 ml-2"
                style={{ backgroundColor: ACCENT }}
              >
                {exp.startDate}{exp.endDate && ` – ${exp.endDate}`}
              </span>
            </div>
            <div className="text-[8.5pt] text-gray-600 italic">
              {exp.company}{exp.location && ` (${exp.location})`}
            </div>
            <div className="mt-[2pt]">
              {exp.bullets.filter((b) => b.trim()).map((b, j) => (
                <BulletText key={j} text={b} />
              ))}
            </div>
          </div>
        ))}
      </>
    );
  },

  education: (data) => {
    if (data.education.length === 0) return null;
    return (
      <>
        <MainSectionHeader>Education</MainSectionHeader>
        {data.education.map((edu, i) => (
          <div key={edu.id} className={i > 0 ? "mt-[8pt]" : ""}>
            <div className="flex justify-between items-baseline">
              <span className="text-[10pt] font-bold" style={{ fontVariant: "small-caps" }}>
                {edu.degree}{edu.field && `, ${edu.field}`}
              </span>
              <span
                className="text-[8pt] font-bold text-white px-[6pt] py-[1pt] rounded-sm shrink-0 ml-2"
                style={{ backgroundColor: ACCENT }}
              >
                {edu.startDate}{edu.endDate && ` – ${edu.endDate}`}
              </span>
            </div>
            <div className="text-[8.5pt] text-gray-600 italic">
              {edu.school}{edu.location && ` (${edu.location})`}
            </div>
          </div>
        ))}
      </>
    );
  },

  projects: (data) => {
    if (data.projects.length === 0) return null;
    return (
      <>
        <MainSectionHeader>Projects</MainSectionHeader>
        {data.projects.map((proj, i) => (
          <div key={proj.id} className={i > 0 ? "mt-[8pt]" : ""}>
            <div className="flex justify-between items-baseline">
              <span className="text-[10pt]">
                <span className="font-bold">{proj.name}</span>
                {proj.techStack && <span className="text-gray-500 text-[8.5pt]"> · {proj.techStack}</span>}
              </span>
              {proj.link && (
                <a href={proj.link} className="text-[8pt] underline shrink-0 ml-2" style={{ color: ACCENT }} target="_blank" rel="noopener noreferrer">
                  {proj.link.replace(/^https?:\/\/(www\.)?/, "")}
                </a>
              )}
            </div>
            <div className="mt-[2pt]">
              {proj.bullets.filter((b) => b.trim()).map((b, j) => (
                <BulletText key={j} text={b} />
              ))}
            </div>
          </div>
        ))}
      </>
    );
  },
};
