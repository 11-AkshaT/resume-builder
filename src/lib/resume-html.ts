import type { ResumeData, SectionKey, TemplateKey } from "./types";
import { generateProfessionalHTML } from "./templates/professional-html";
import { generateModernHTML } from "./templates/modern-html";

export function generateResumeHTMLByTemplate(data: ResumeData, title: string, template: TemplateKey): string {
  switch (template) {
    case "professional":
      return generateProfessionalHTML(data, title);
    case "modern":
      return generateModernHTML(data, title);
    case "minimal":
    default:
      return generateResumeHTML(data, title);
  }
}

function esc(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

const DEFAULT_ORDER: SectionKey[] = [
  "education",
  "experience",
  "projects",
  "skills",
  "summary",
];

export function generateResumeHTML(data: ResumeData, title: string): string {
  const { personalInfo } = data;
  const order = data.sectionOrder ?? DEFAULT_ORDER;

  const contactParts: string[] = [];
  if (personalInfo.phone) contactParts.push(esc(personalInfo.phone));
  if (personalInfo.email)
    contactParts.push(
      `<a href="mailto:${esc(personalInfo.email)}">${esc(personalInfo.email)}</a>`
    );
  personalInfo.links.forEach((link) => {
    if (link.url)
      contactParts.push(
        `<a href="${esc(link.url)}">${esc(link.label || link.url.replace(/^https?:\/\/(www\.)?/, ""))}</a>`
      );
    else if (link.label) contactParts.push(esc(link.label));
  });

  let html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>${esc(title)}</title>
<style>
@page { size: letter; margin: 0.5in 0.5in; }
* { margin: 0; padding: 0; box-sizing: border-box; }
body {
  font-family: "Computer Modern", "CMU Serif", "Latin Modern Roman", "Times New Roman", Georgia, serif;
  font-size: 11pt;
  line-height: 1.2;
  color: #000;
  padding: 0.5in;
  max-width: 8.5in;
}
h1 {
  font-size: 22pt;
  font-weight: 700;
  text-align: center;
  font-variant: small-caps;
  letter-spacing: 0.02em;
}
.contact {
  text-align: center;
  font-size: 9.5pt;
  margin-top: 1pt;
}
.contact a { color: #000; text-decoration: underline; }
.section-header {
  border-bottom: 1px solid #000;
  margin-top: 6pt;
  margin-bottom: 3pt;
}
.section-header h2 {
  font-size: 12pt;
  font-variant: small-caps;
  font-weight: 400;
  letter-spacing: 0.04em;
}
.sub { width: 97%; margin-left: 6pt; margin-bottom: 2pt; }
.row { display: flex; justify-content: space-between; align-items: baseline; }
.row-l { font-size: 10.5pt; }
.row-r { font-size: 10.5pt; flex-shrink: 0; text-align: right; }
.row-l-sm { font-size: 9.5pt; font-style: italic; }
.row-r-sm { font-size: 9.5pt; font-style: italic; flex-shrink: 0; text-align: right; }
b { font-weight: 700; }
i, em { font-style: italic; }
ul { margin-left: 22pt; margin-top: 0; margin-bottom: 2pt; }
li { font-size: 10pt; margin-bottom: 0; line-height: 1.25; }
.skills { width: 97%; margin-left: 6pt; font-size: 10pt; line-height: 1.35; }
a { color: #000; text-decoration: underline; }
@media print { body { padding: 0; } }
</style>
</head>
<body>
`;

  html += `<h1>${esc(personalInfo.fullName)}</h1>\n`;
  if (contactParts.length > 0)
    html += `<p class="contact">${contactParts.join(" | ")}</p>\n`;

  const renderers: Record<SectionKey, () => string> = {
    education: () => renderEducation(data),
    experience: () => renderExperience(data),
    projects: () => renderProjects(data),
    skills: () => renderSkills(data),
    summary: () => renderSummary(data),
  };

  for (const key of order) {
    html += renderers[key]();
  }

  html += `\n<script>window.onload=function(){window.print()}</script>\n</body>\n</html>`;
  return html;
}

function sub2row(
  l1: string, r1: string, l2: string, r2: string
): string {
  return `<div class="sub"><div class="row"><div class="row-l"><b>${l1}</b></div><div class="row-r">${r1}</div></div><div class="row"><div class="row-l-sm">${l2}</div><div class="row-r-sm">${r2}</div></div></div>\n`;
}

function proj1row(left: string, right: string): string {
  return `<div class="sub"><div class="row"><div class="row-l">${left}</div><div class="row-r">${right}</div></div></div>\n`;
}

function bullets(items: string[]): string {
  const filtered = items.filter((b) => b.trim());
  if (filtered.length === 0) return "";
  return `<ul>${filtered.map((b) => `<li>${esc(b)}</li>`).join("")}</ul>\n`;
}

function sectionHead(title: string): string {
  return `<div class="section-header"><h2>${title}</h2></div>\n`;
}

function renderEducation(data: ResumeData): string {
  if (data.education.length === 0) return "";
  let s = sectionHead("Education");
  for (const edu of data.education) {
    const degree = `${esc(edu.degree)}${edu.field ? `, ${esc(edu.field)}` : ""}`;
    const dates = `${esc(edu.startDate)}${edu.endDate ? ` &ndash; ${esc(edu.endDate)}` : ""}`;
    s += sub2row(esc(edu.school), esc(edu.location), degree, dates);
  }
  return s;
}

function renderExperience(data: ResumeData): string {
  if (data.experience.length === 0) return "";
  let s = sectionHead("Experience");
  for (const exp of data.experience) {
    const dates = `${esc(exp.startDate)}${exp.endDate ? ` &ndash; ${esc(exp.endDate)}` : ""}`;
    s += sub2row(esc(exp.role), dates, esc(exp.company), esc(exp.location));
    s += bullets(exp.bullets);
  }
  return s;
}

function renderProjects(data: ResumeData): string {
  if (data.projects.length === 0) return "";
  let s = sectionHead("Projects");
  for (const proj of data.projects) {
    const left = `<b>${esc(proj.name)}</b>${proj.techStack ? ` | <em>${esc(proj.techStack)}</em>` : ""}`;
    const right = proj.link
      ? `<a href="${esc(proj.link)}">${esc(proj.link.replace(/^https?:\/\/(www\.)?/, ""))}</a>`
      : "";
    s += proj1row(left, right);
    s += bullets(proj.bullets);
  }
  return s;
}

function renderSkills(data: ResumeData): string {
  if (data.skills.length === 0) return "";
  let s = sectionHead("Technical Skills");
  s += `<div class="skills">`;
  for (const group of data.skills) {
    s += `<p>`;
    if (group.category) s += `<b>${esc(group.category)}</b>: `;
    s += `${esc(group.skills)}</p>`;
  }
  s += `</div>\n`;
  return s;
}

function renderSummary(data: ResumeData): string {
  if (!data.summary) return "";
  let s = sectionHead("Summary");
  s += `<div class="skills"><p>${esc(data.summary)}</p></div>\n`;
  return s;
}
