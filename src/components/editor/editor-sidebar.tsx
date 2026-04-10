"use client";

import { useState } from "react";
import type {
  ResumeData,
  WorkExperience,
  Project,
  Education,
  SectionKey,
} from "@/lib/types";
import { SECTION_LABELS } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  GripVertical,
  User,
  Briefcase,
  FolderOpen,
  GraduationCap,
  Wrench,
  FileText,
  Link2,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { v4 as uuid } from "uuid";

const SECTION_ICONS: Record<SectionKey, React.ReactNode> = {
  education: <GraduationCap className="h-4 w-4" />,
  experience: <Briefcase className="h-4 w-4" />,
  projects: <FolderOpen className="h-4 w-4" />,
  skills: <Wrench className="h-4 w-4" />,
  summary: <FileText className="h-4 w-4" />,
};

interface EditorSidebarProps {
  data: ResumeData;
  onChange: (data: ResumeData) => void;
}

export function EditorSidebar({ data, onChange }: EditorSidebarProps) {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    personal: true,
    summary: true,
    experience: true,
    projects: true,
    skills: true,
    education: true,
  });

  const toggleSection = (key: string) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const update = (partial: Partial<ResumeData>) => {
    onChange({ ...data, ...partial });
  };

  const moveSection = (index: number, direction: "up" | "down") => {
    const order = [...data.sectionOrder];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= order.length) return;
    [order[index], order[targetIndex]] = [order[targetIndex], order[index]];
    update({ sectionOrder: order });
  };

  const sectionContent: Record<SectionKey, () => React.ReactNode> = {
    education: () => (
      <EducationContent data={data} update={update} />
    ),
    experience: () => (
      <ExperienceContent data={data} update={update} />
    ),
    projects: () => (
      <ProjectsContent data={data} update={update} />
    ),
    skills: () => (
      <SkillsContent data={data} update={update} />
    ),
    summary: () => (
      <Textarea
        value={data.summary}
        onChange={(e) => update({ summary: e.target.value })}
        placeholder="Brief professional summary highlighting your key strengths..."
        rows={4}
      />
    ),
  };

  const sectionAddHandlers: Partial<Record<SectionKey, () => void>> = {
    experience: () =>
      update({
        experience: [
          ...data.experience,
          { id: uuid(), company: "", role: "", location: "", startDate: "", endDate: "", bullets: [""] },
        ],
      }),
    projects: () =>
      update({
        projects: [
          ...data.projects,
          { id: uuid(), name: "", link: "", techStack: "", bullets: [""] },
        ],
      }),
    skills: () =>
      update({
        skills: [...data.skills, { id: uuid(), category: "", skills: "" }],
      }),
    education: () =>
      update({
        education: [
          ...data.education,
          { id: uuid(), school: "", degree: "", field: "", startDate: "", endDate: "", location: "" },
        ],
      }),
  };

  return (
    <div className="space-y-3 px-4 pb-4 pt-3 sm:px-5">
      {/* Personal Info — always pinned at top */}
      <Section
        title="Personal Info"
        icon={<User className="h-4 w-4" />}
        open={openSections.personal}
        onToggle={() => toggleSection("personal")}
      >
        <PersonalInfoContent data={data} update={update} />
      </Section>

      {/* Reorderable sections */}
      {data.sectionOrder.map((key, index) => (
        <Section
          key={key}
          title={SECTION_LABELS[key]}
          icon={SECTION_ICONS[key]}
          open={openSections[key]}
          onToggle={() => toggleSection(key)}
          onAdd={sectionAddHandlers[key]}
          onMoveUp={index > 0 ? () => moveSection(index, "up") : undefined}
          onMoveDown={
            index < data.sectionOrder.length - 1
              ? () => moveSection(index, "down")
              : undefined
          }
        >
          {sectionContent[key]()}
        </Section>
      ))}
    </div>
  );
}

function PersonalInfoContent({
  data,
  update,
}: {
  data: ResumeData;
  update: (p: Partial<ResumeData>) => void;
}) {
  return (
    <div className="space-y-3">
      <Input
        label="Full Name"
        value={data.personalInfo.fullName}
        onChange={(e) =>
          update({ personalInfo: { ...data.personalInfo, fullName: e.target.value } })
        }
        placeholder="Jake Ryan"
      />
      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Email"
          type="email"
          value={data.personalInfo.email}
          onChange={(e) =>
            update({ personalInfo: { ...data.personalInfo, email: e.target.value } })
          }
          placeholder="jake@su.edu"
        />
        <Input
          label="Phone"
          value={data.personalInfo.phone}
          onChange={(e) =>
            update({ personalInfo: { ...data.personalInfo, phone: e.target.value } })
          }
          placeholder="123-456-7890"
        />
      </div>
      <Input
        label="Location"
        value={data.personalInfo.location}
        onChange={(e) =>
          update({ personalInfo: { ...data.personalInfo, location: e.target.value } })
        }
        placeholder="San Francisco, CA"
      />
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            <Link2 className="h-3.5 w-3.5" />
            Links
          </label>
          <Button
            variant="ghost"
            size="sm"
            onClick={() =>
              update({
                personalInfo: {
                  ...data.personalInfo,
                  links: [...data.personalInfo.links, { label: "", url: "" }],
                },
              })
            }
          >
            <Plus className="h-3 w-3 mr-1" />
            Add
          </Button>
        </div>
        {data.personalInfo.links.map((link, i) => (
          <div
            key={i}
            className="mb-2 flex gap-2 rounded-[1.1rem] border border-border/70 bg-card/60 p-2"
          >
            <Input
              value={link.label}
              onChange={(e) => {
                const links = [...data.personalInfo.links];
                links[i] = { ...links[i], label: e.target.value };
                update({ personalInfo: { ...data.personalInfo, links } });
              }}
              placeholder="LinkedIn"
              className="flex-1"
            />
            <Input
              value={link.url}
              onChange={(e) => {
                const links = [...data.personalInfo.links];
                links[i] = { ...links[i], url: e.target.value };
                update({ personalInfo: { ...data.personalInfo, links } });
              }}
              placeholder="https://linkedin.com/in/..."
              className="flex-1"
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                const links = data.personalInfo.links.filter((_, idx) => idx !== i);
                update({ personalInfo: { ...data.personalInfo, links } });
              }}
            >
              <Trash2 className="h-3 w-3 text-destructive" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

function ExperienceContent({
  data,
  update,
}: {
  data: ResumeData;
  update: (p: Partial<ResumeData>) => void;
}) {
  return (
    <>
      {data.experience.map((exp, i) => (
        <ExperienceEntry
          key={exp.id}
          experience={exp}
          onChange={(updated) => {
            const experience = [...data.experience];
            experience[i] = updated;
            update({ experience });
          }}
          onRemove={() => update({ experience: data.experience.filter((_, idx) => idx !== i) })}
          onMoveUp={
            i > 0
              ? () => {
                  const experience = [...data.experience];
                  [experience[i - 1], experience[i]] = [experience[i], experience[i - 1]];
                  update({ experience });
                }
              : undefined
          }
          onMoveDown={
            i < data.experience.length - 1
              ? () => {
                  const experience = [...data.experience];
                  [experience[i], experience[i + 1]] = [experience[i + 1], experience[i]];
                  update({ experience });
                }
              : undefined
          }
        />
      ))}
    </>
  );
}

function ProjectsContent({
  data,
  update,
}: {
  data: ResumeData;
  update: (p: Partial<ResumeData>) => void;
}) {
  return (
    <>
      {data.projects.map((proj, i) => (
        <ProjectEntry
          key={proj.id}
          project={proj}
          onChange={(updated) => {
            const projects = [...data.projects];
            projects[i] = updated;
            update({ projects });
          }}
          onRemove={() => update({ projects: data.projects.filter((_, idx) => idx !== i) })}
          onMoveUp={
            i > 0
              ? () => {
                  const projects = [...data.projects];
                  [projects[i - 1], projects[i]] = [projects[i], projects[i - 1]];
                  update({ projects });
                }
              : undefined
          }
          onMoveDown={
            i < data.projects.length - 1
              ? () => {
                  const projects = [...data.projects];
                  [projects[i], projects[i + 1]] = [projects[i + 1], projects[i]];
                  update({ projects });
                }
              : undefined
          }
        />
      ))}
    </>
  );
}

function SkillsContent({
  data,
  update,
}: {
  data: ResumeData;
  update: (p: Partial<ResumeData>) => void;
}) {
  return (
    <>
      {data.skills.map((group, i) => (
        <div
          key={group.id}
          className="mb-2 flex items-start gap-2 rounded-[1.25rem] border border-border/75 bg-[#fffaf2] p-2.5"
        >
          <Input
            value={group.category}
            onChange={(e) => {
              const skills = [...data.skills];
              skills[i] = { ...skills[i], category: e.target.value };
              update({ skills });
            }}
            placeholder="Languages"
            className="w-1/3"
          />
          <Input
            value={group.skills}
            onChange={(e) => {
              const skills = [...data.skills];
              skills[i] = { ...skills[i], skills: e.target.value };
              update({ skills });
            }}
            placeholder="Java, Python, C/C++, JavaScript"
            className="flex-1"
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => update({ skills: data.skills.filter((_, idx) => idx !== i) })}
          >
            <Trash2 className="h-3 w-3 text-destructive" />
          </Button>
        </div>
      ))}
    </>
  );
}

function EducationContent({
  data,
  update,
}: {
  data: ResumeData;
  update: (p: Partial<ResumeData>) => void;
}) {
  return (
    <>
      {data.education.map((edu, i) => (
        <EducationEntry
          key={edu.id}
          education={edu}
          onChange={(updated) => {
            const education = [...data.education];
            education[i] = updated;
            update({ education });
          }}
          onRemove={() => update({ education: data.education.filter((_, idx) => idx !== i) })}
        />
      ))}
    </>
  );
}

function Section({
  title,
  icon,
  open,
  onToggle,
  onAdd,
  onMoveUp,
  onMoveDown,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  open: boolean;
  onToggle: () => void;
  onAdd?: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-[1.6rem] border border-border/80 bg-card/78 shadow-[0_18px_40px_-34px_rgba(24,34,28,0.35)]">
      <div
        className="flex cursor-pointer items-center justify-between px-4 py-3.5 transition-colors duration-150 hover:bg-muted/35"
        onClick={onToggle}
      >
        <div className="flex items-center gap-3 text-sm font-medium text-foreground">
          <span className="flex h-8 w-8 items-center justify-center rounded-2xl bg-[#edf3ee] text-primary">
            {icon}
          </span>
          {title}
        </div>
        <div className="flex items-center gap-0.5">
          {onMoveUp && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0"
              onClick={(e) => { e.stopPropagation(); onMoveUp(); }}
              title="Move section up"
            >
              <ArrowUp className="h-3.5 w-3.5 text-muted-foreground" />
            </Button>
          )}
          {onMoveDown && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0"
              onClick={(e) => { e.stopPropagation(); onMoveDown(); }}
              title="Move section down"
            >
              <ArrowDown className="h-3.5 w-3.5 text-muted-foreground" />
            </Button>
          )}
          {onAdd && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0"
              onClick={(e) => { e.stopPropagation(); onAdd(); }}
            >
              <Plus className="h-3.5 w-3.5 text-primary" />
            </Button>
          )}
          <ChevronDown className={`h-4 w-4 text-muted-foreground ml-0.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
        </div>
      </div>
      {open && <div className="border-t border-border/70 p-4">{children}</div>}
    </div>
  );
}

function ExperienceEntry({
  experience,
  onChange,
  onRemove,
  onMoveUp,
  onMoveDown,
}: {
  experience: WorkExperience;
  onChange: (exp: WorkExperience) => void;
  onRemove: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
}) {
  return (
    <div className="mb-3 space-y-3 rounded-[1.35rem] border border-border/75 bg-[#fffaf2] p-3.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <GripVertical className="h-4 w-4 text-muted-foreground" />
          <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            {experience.role || experience.company || "New Experience"}
          </span>
        </div>
        <div className="flex items-center gap-1">
          {onMoveUp && (
            <Button variant="ghost" size="sm" onClick={onMoveUp}>
              <ChevronUp className="h-3 w-3" />
            </Button>
          )}
          {onMoveDown && (
            <Button variant="ghost" size="sm" onClick={onMoveDown}>
              <ChevronDown className="h-3 w-3" />
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={onRemove}>
            <Trash2 className="h-3 w-3 text-destructive" />
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Role / Title"
          value={experience.role}
          onChange={(e) => onChange({ ...experience, role: e.target.value })}
          placeholder="Software Engineer"
        />
        <Input
          label="Company"
          value={experience.company}
          onChange={(e) => onChange({ ...experience, company: e.target.value })}
          placeholder="Acme Corp"
        />
      </div>
      <Input
        label="Location"
        value={experience.location}
        onChange={(e) => onChange({ ...experience, location: e.target.value })}
        placeholder="San Francisco, CA"
      />
      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Start Date"
          value={experience.startDate}
          onChange={(e) => onChange({ ...experience, startDate: e.target.value })}
          placeholder="Jan 2022"
        />
        <Input
          label="End Date"
          value={experience.endDate}
          onChange={(e) => onChange({ ...experience, endDate: e.target.value })}
          placeholder="Present"
        />
      </div>
      <BulletEditor
        bullets={experience.bullets}
        onChange={(bullets) => onChange({ ...experience, bullets })}
      />
    </div>
  );
}

function ProjectEntry({
  project,
  onChange,
  onRemove,
  onMoveUp,
  onMoveDown,
}: {
  project: Project;
  onChange: (proj: Project) => void;
  onRemove: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
}) {
  return (
    <div className="mb-3 space-y-3 rounded-[1.35rem] border border-border/75 bg-[#fffaf2] p-3.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          {project.name || "New Project"}
        </span>
        <div className="flex items-center gap-1">
          {onMoveUp && (
            <Button variant="ghost" size="sm" onClick={onMoveUp}>
              <ChevronUp className="h-3 w-3" />
            </Button>
          )}
          {onMoveDown && (
            <Button variant="ghost" size="sm" onClick={onMoveDown}>
              <ChevronDown className="h-3 w-3" />
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={onRemove}>
            <Trash2 className="h-3 w-3 text-destructive" />
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Project Name"
          value={project.name}
          onChange={(e) => onChange({ ...project, name: e.target.value })}
          placeholder="Cool Project"
        />
        <Input
          label="Link"
          value={project.link}
          onChange={(e) => onChange({ ...project, link: e.target.value })}
          placeholder="https://github.com/..."
        />
      </div>
      <Input
        label="Tech Stack"
        value={project.techStack}
        onChange={(e) => onChange({ ...project, techStack: e.target.value })}
        placeholder="React, Node.js, PostgreSQL"
      />
      <BulletEditor
        bullets={project.bullets}
        onChange={(bullets) => onChange({ ...project, bullets })}
      />
    </div>
  );
}

function EducationEntry({
  education,
  onChange,
  onRemove,
}: {
  education: Education;
  onChange: (edu: Education) => void;
  onRemove: () => void;
}) {
  return (
    <div className="mb-3 space-y-3 rounded-[1.35rem] border border-border/75 bg-[#fffaf2] p-3.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          {education.school || "New Education"}
        </span>
        <Button variant="ghost" size="sm" onClick={onRemove}>
          <Trash2 className="h-3 w-3 text-destructive" />
        </Button>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Input
          label="School"
          value={education.school}
          onChange={(e) => onChange({ ...education, school: e.target.value })}
          placeholder="MIT"
        />
        <Input
          label="Degree"
          value={education.degree}
          onChange={(e) => onChange({ ...education, degree: e.target.value })}
          placeholder="B.S."
        />
      </div>
      <Input
        label="Field of Study"
        value={education.field}
        onChange={(e) => onChange({ ...education, field: e.target.value })}
        placeholder="Computer Science"
      />
      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Start Date"
          value={education.startDate}
          onChange={(e) => onChange({ ...education, startDate: e.target.value })}
          placeholder="Sep 2018"
        />
        <Input
          label="End Date"
          value={education.endDate}
          onChange={(e) => onChange({ ...education, endDate: e.target.value })}
          placeholder="May 2022"
        />
      </div>
      <Input
        label="Location"
        value={education.location}
        onChange={(e) => onChange({ ...education, location: e.target.value })}
        placeholder="Cambridge, MA"
      />
    </div>
  );
}

function BulletEditor({
  bullets,
  onChange,
}: {
  bullets: string[];
  onChange: (bullets: string[]) => void;
}) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <label className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Bullet points
        </label>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onChange([...bullets, ""])}
        >
          <Plus className="h-3 w-3 mr-1" />
          Add
        </Button>
      </div>
      {bullets.map((bullet, i) => (
        <div key={i} className="mb-1.5 flex gap-2">
          <span className="mt-2.5 shrink-0 text-xs text-muted-foreground">•</span>
          <Input
            value={bullet}
            onChange={(e) => {
              const updated = [...bullets];
              updated[i] = e.target.value;
              onChange(updated);
            }}
            placeholder="Describe an achievement or responsibility..."
            className="flex-1"
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onChange(bullets.filter((_, idx) => idx !== i))}
          >
            <Trash2 className="h-3 w-3 text-destructive" />
          </Button>
        </div>
      ))}
    </div>
  );
}
