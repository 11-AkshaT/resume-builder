import type { ResumeData } from "../types";
import { getSafeUrl } from "../safe-url";

function esc(str: string): string {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

const ACCENT = "#304263";

export function generateModernHTML(data: ResumeData, title: string): string {
  const { personalInfo } = data;
  const order = data.sectionOrder ?? ["education", "experience", "projects", "skills"];
  const mainSections = ["experience", "education", "projects"];
  const mainOrder = order.filter((k) => mainSections.includes(k));

  const nameParts = personalInfo.fullName.split(" ");
  const firstName = nameParts.slice(0, -1).join(" ");
  const lastName = nameParts.slice(-1)[0] || "";

  let html = `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><title>${esc(title)}</title>
<style>
@import url('https://fonts.googleapis.com/css2?family=Fira+Sans:ital,wght@0,300;0,400;0,700;1,400&display=swap');
@page { size: A4; margin: 0; }
* { margin:0; padding:0; box-sizing:border-box; }
body { font-family:'Fira Sans',system-ui,sans-serif; font-size:9pt; line-height:1.3; color:#000; }
.page { display:flex; min-height:297mm; width:210mm; }
.sidebar { width:33%; background:${ACCENT}; color:#fff; padding:20pt 14pt; }
.sidebar a { color:#fff; text-decoration:underline; }
.main { flex:1; padding:20pt 18pt 20pt 22pt; }
.name { font-size:16pt; font-weight:300; margin-bottom:12pt; }
.name strong { font-weight:700; text-transform:uppercase; letter-spacing:0.04em; }
.sb-header { font-size:9pt; font-weight:700; text-transform:uppercase; letter-spacing:0.06em; border-bottom:1px solid rgba(255,255,255,0.3); padding-bottom:2pt; margin-top:12pt; margin-bottom:4pt; }
.sb-text { font-size:8pt; line-height:1.6; opacity:0.9; }
.sb-row { display:flex; gap:4pt; align-items:flex-start; margin-bottom:2pt; }
.sb-icon { opacity:0.6; flex-shrink:0; }
.sb-skill-cat { font-size:7.5pt; text-transform:uppercase; letter-spacing:0.06em; opacity:0.7; font-weight:700; }
.sb-skill-val { font-size:8pt; margin-bottom:4pt; }
.mn-header { font-size:13pt; font-variant:small-caps; color:${ACCENT}; border-bottom:1.5px solid ${ACCENT}; padding-bottom:2pt; margin-top:10pt; margin-bottom:6pt; }
.mn-entry { margin-bottom:8pt; }
.mn-row { display:flex; justify-content:space-between; align-items:baseline; }
.mn-title { font-size:10pt; font-weight:700; font-variant:small-caps; }
.mn-date { font-size:8pt; font-weight:700; color:#fff; background:${ACCENT}; padding:1pt 6pt; border-radius:2px; flex-shrink:0; margin-left:6pt; }
.mn-sub { font-size:8.5pt; color:#666; font-style:italic; }
.mn-bullet { display:flex; gap:4pt; align-items:flex-start; font-size:8.5pt; color:#555; line-height:1.4; }
.mn-bullet-icon { color:#aaa; flex-shrink:0; margin-top:1pt; }
a.mn-link { color:${ACCENT}; font-size:8pt; text-decoration:underline; }
@media print { body { padding:0; } .page { min-height:auto; } }
</style></head><body>
<div class="page">
<div class="sidebar">
`;

  // Name
  html += `<div class="name">${esc(firstName)} <strong>${esc(lastName)}</strong></div>`;

  // Summary
  if (data.summary) {
    html += `<div class="sb-header">Profile</div>`;
    html += `<div class="sb-text" style="margin-bottom:10pt">${esc(data.summary)}</div>`;
  }

  // Contact
  html += `<div class="sb-header">Contact</div><div class="sb-text">`;
  if (personalInfo.email)
    html += `<div class="sb-row"><span class="sb-icon">@</span><span style="word-break:break-all">${esc(personalInfo.email)}</span></div>`;
  if (personalInfo.phone)
    html += `<div class="sb-row"><span class="sb-icon">☎</span><span>${esc(personalInfo.phone)}</span></div>`;
  if (personalInfo.location)
    html += `<div class="sb-row"><span class="sb-icon">⌂</span><span>${esc(personalInfo.location)}</span></div>`;
  for (const link of personalInfo.links) {
    const safeUrl = getSafeUrl(link.url);
    if (safeUrl)
      html += `<div class="sb-row"><span class="sb-icon">⟶</span><a href="${esc(safeUrl)}" style="word-break:break-all">${esc(link.label || link.url.replace(/^https?:\/\/(www\.)?/, ""))}</a></div>`;
    else if (link.url || link.label)
      html += `<div class="sb-row"><span class="sb-icon">⟶</span><span style="word-break:break-all">${esc(link.label || link.url)}</span></div>`;
  }
  html += `</div>`;

  // Skills
  if (data.skills.length > 0) {
    html += `<div class="sb-header">Skills</div><div class="sb-text">`;
    for (const group of data.skills) {
      if (group.category) html += `<div class="sb-skill-cat">${esc(group.category)}</div>`;
      html += `<div class="sb-skill-val">${esc(group.skills)}</div>`;
    }
    html += `</div>`;
  }

  html += `</div><div class="main">`;

  // Main content
  const renderers: Record<string, () => string> = {
    experience: () => renderExperience(data),
    education: () => renderEducation(data),
    projects: () => renderProjects(data),
  };

  for (const key of mainOrder) {
    const fn = renderers[key];
    if (fn) html += fn();
  }

  html += `</div></div>`;
  html += `\n<script>window.onload=function(){window.print()}</script>\n</body></html>`;
  return html;
}

function renderExperience(data: ResumeData): string {
  if (data.experience.length === 0) return "";
  let s = `<div class="mn-header">Experience</div>`;
  for (const exp of data.experience) {
    s += `<div class="mn-entry">`;
    s += `<div class="mn-row"><span class="mn-title">${esc(exp.role)}</span><span class="mn-date">${esc(exp.startDate)}${exp.endDate ? ` – ${esc(exp.endDate)}` : ""}</span></div>`;
    s += `<div class="mn-sub">${esc(exp.company)}${exp.location ? ` (${esc(exp.location)})` : ""}</div>`;
    for (const b of exp.bullets.filter((b) => b.trim())) {
      s += `<div class="mn-bullet"><span class="mn-bullet-icon">◆</span><span>${esc(b)}</span></div>`;
    }
    s += `</div>`;
  }
  return s;
}

function renderEducation(data: ResumeData): string {
  if (data.education.length === 0) return "";
  let s = `<div class="mn-header">Education</div>`;
  for (const edu of data.education) {
    s += `<div class="mn-entry">`;
    s += `<div class="mn-row"><span class="mn-title">${esc(edu.degree)}${edu.field ? `, ${esc(edu.field)}` : ""}</span><span class="mn-date">${esc(edu.startDate)}${edu.endDate ? ` – ${esc(edu.endDate)}` : ""}</span></div>`;
    s += `<div class="mn-sub">${esc(edu.school)}${edu.location ? ` (${esc(edu.location)})` : ""}</div>`;
    s += `</div>`;
  }
  return s;
}

function renderProjects(data: ResumeData): string {
  if (data.projects.length === 0) return "";
  let s = `<div class="mn-header">Projects</div>`;
  for (const proj of data.projects) {
    s += `<div class="mn-entry">`;
    const safeUrl = getSafeUrl(proj.link);
    const linkHtml = safeUrl ? `<a class="mn-link" href="${esc(safeUrl)}">${esc(proj.link.replace(/^https?:\/\/(www\.)?/, ""))}</a>` : esc(proj.link);
    s += `<div class="mn-row"><span class="mn-title">${esc(proj.name)}${proj.techStack ? ` <span style="font-variant:normal;font-weight:400;font-size:8.5pt;color:#666">· ${esc(proj.techStack)}</span>` : ""}</span><span>${linkHtml}</span></div>`;
    for (const b of proj.bullets.filter((b) => b.trim())) {
      s += `<div class="mn-bullet"><span class="mn-bullet-icon">◆</span><span>${esc(b)}</span></div>`;
    }
    s += `</div>`;
  }
  return s;
}
