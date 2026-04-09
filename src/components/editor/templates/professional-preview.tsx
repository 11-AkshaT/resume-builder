"use client";

import type { ResumeData } from "@/lib/types";

interface ProfessionalPreviewProps {
  data: ResumeData;
  sectionOrder?: string[];
}

export function ProfessionalPreview({ data, sectionOrder }: ProfessionalPreviewProps) {
  const { personalInfo } = data;
  const order = sectionOrder ?? ["education", "experience", "projects", "skills"];

  const leftSections = ["education", "experience", "projects", "summary"];
  const rightSections = ["skills"];

  const leftOrder = order.filter((k) => leftSections.includes(k));
  const rightOrder = order.filter((k) => rightSections.includes(k));

  const contactRows: { icon: string; text: React.ReactNode }[] = [];
  if (personalInfo.phone) contactRows.push({ icon: "📞", text: personalInfo.phone });
  if (personalInfo.email)
    contactRows.push({
      icon: "✉",
      text: <a href={`mailto:${personalInfo.email}`} className="underline">{personalInfo.email}</a>,
    });
  personalInfo.links.forEach((link) => {
    if (link.url || link.label)
      contactRows.push({
        icon: "🔗",
        text: link.url ? (
          <a href={link.url} className="underline" target="_blank" rel="noopener noreferrer">
            {link.label || link.url.replace(/^https?:\/\/(www\.)?/, "")}
          </a>
        ) : link.label,
      });
  });

  return (
    <div
      className="resume-page shadow-lg rounded border border-border bg-white"
      id="resume-preview"
      style={{ fontFamily: "'Libertine', 'Linux Libertine', Georgia, serif" }}
    >
      {/* Two-column: name left, contact right */}
      <div className="flex gap-4 mb-[6pt]">
        <div style={{ width: "63%" }}>
          <h1 className="text-[24pt] font-normal leading-tight">
            {personalInfo.fullName || "\u00A0"}
          </h1>
          {data.summary && (
            <p className="text-[9.5pt] text-gray-600 mt-[4pt] leading-[1.35]">
              {data.summary}
            </p>
          )}
        </div>
        <div style={{ width: "35%" }} className="pt-[4pt]">
          <table className="text-[9pt] leading-[1.6]">
            <tbody>
              {contactRows.map((row, i) => (
                <tr key={i}>
                  <td className="pr-2 text-gray-500 align-top">{row.icon}</td>
                  <td>{row.text}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Main two-column body */}
      <div className="flex gap-[2em]">
        {/* Left column — 65% */}
        <div style={{ width: "63%" }}>
          {leftOrder.map((key) => {
            const renderer = leftRenderers[key];
            return renderer ? <div key={key}>{renderer(data)}</div> : null;
          })}
        </div>

        {/* Right column — 35% */}
        <div style={{ width: "35%" }}>
          {rightOrder.map((key) => {
            const renderer = rightRenderers[key];
            return renderer ? <div key={key}>{renderer(data)}</div> : null;
          })}
        </div>
      </div>
    </div>
  );
}

function SectionHeader({ title }: { title: string }) {
  return (
    <div className="mt-[10pt] mb-[4pt]">
      <h2
        className="text-[14pt] font-normal tracking-wide leading-tight pb-[2pt] border-b border-black"
        style={{ fontVariant: "small-caps" }}
      >
        {title}
      </h2>
    </div>
  );
}

function BulletList({ items }: { items: string[] }) {
  const filtered = items.filter((b) => b.trim());
  if (filtered.length === 0) return null;
  return (
    <ul className="list-disc ml-[14pt] mt-[3pt] mb-[6pt] text-[9.5pt] space-y-[1pt] leading-[1.3]">
      {filtered.map((bullet, i) => <li key={i}>{bullet}</li>)}
    </ul>
  );
}

const leftRenderers: Record<string, (data: ResumeData) => React.ReactNode> = {
  education: (data) => {
    if (data.education.length === 0) return null;
    return (
      <>
        <SectionHeader title="Education" />
        {data.education.map((edu, i) => (
          <div key={edu.id} className={i > 0 ? "mt-[8pt]" : ""}>
            <div className="flex justify-between items-baseline">
              <span className="text-[10.5pt] font-bold">{edu.degree}{edu.field && `, ${edu.field}`}</span>
              <span className="text-[9.5pt] shrink-0 ml-2">{edu.startDate}{edu.endDate && ` – ${edu.endDate}`}</span>
            </div>
            <div className="text-[9.5pt] text-gray-700">
              {edu.school}{edu.location && `, ${edu.location}`}
            </div>
          </div>
        ))}
      </>
    );
  },

  experience: (data) => {
    if (data.experience.length === 0) return null;
    return (
      <>
        <SectionHeader title="Experience" />
        {data.experience.map((exp, i) => (
          <div key={exp.id} className={i > 0 ? "mt-[8pt]" : ""}>
            <div className="flex justify-between items-baseline">
              <span className="text-[10.5pt] font-bold">{exp.role}</span>
              <span className="text-[9.5pt] shrink-0 ml-2">{exp.startDate}{exp.endDate && ` – ${exp.endDate}`}</span>
            </div>
            <div className="text-[9.5pt] text-gray-700">
              {exp.company}{exp.location && `, ${exp.location}`}
            </div>
            <BulletList items={exp.bullets} />
          </div>
        ))}
      </>
    );
  },

  projects: (data) => {
    if (data.projects.length === 0) return null;
    return (
      <>
        <SectionHeader title="Projects" />
        {data.projects.map((proj, i) => (
          <div key={proj.id} className={i > 0 ? "mt-[8pt]" : ""}>
            <div className="flex justify-between items-baseline">
              <span className="text-[10.5pt]">
                <span className="font-bold">{proj.name}</span>
                {proj.techStack && <span className="text-gray-600"> · {proj.techStack}</span>}
              </span>
              {proj.link && (
                <a href={proj.link} className="text-[9pt] underline shrink-0 ml-2" target="_blank" rel="noopener noreferrer">
                  {proj.link.replace(/^https?:\/\/(www\.)?/, "")}
                </a>
              )}
            </div>
            <BulletList items={proj.bullets} />
          </div>
        ))}
      </>
    );
  },

  summary: (data) => {
    if (!data.summary) return null;
    return (
      <>
        <SectionHeader title="Profile" />
        <p className="text-[9.5pt] leading-[1.4] text-gray-800">{data.summary}</p>
      </>
    );
  },
};

const rightRenderers: Record<string, (data: ResumeData) => React.ReactNode> = {
  skills: (data) => {
    if (data.skills.length === 0) return null;
    return (
      <>
        <SectionHeader title="Skills" />
        <div className="text-[9.5pt] leading-[1.6]">
          {data.skills.map((group) => (
            <div key={group.id} className="mb-[4pt]">
              {group.category && (
                <div className="font-bold text-[8.5pt] uppercase tracking-wider text-gray-500">
                  {group.category}
                </div>
              )}
              <div>{group.skills}</div>
            </div>
          ))}
        </div>
      </>
    );
  },
};
