import type { ResumeData } from "../types";

function esc(str: string): string {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

export function generateProfessionalHTML(data: ResumeData, title: string): string {
  const { personalInfo } = data;
  const order = data.sectionOrder ?? ["education", "experience", "projects", "skills"];

  const leftSections = ["education", "experience", "projects", "summary"];
  const rightSections = ["skills"];
  const leftOrder = order.filter((k) => leftSections.includes(k));
  const rightOrder = order.filter((k) => rightSections.includes(k));

  const contactRows: string[] = [];
  if (personalInfo.phone)
    contactRows.push(`<tr><td class="icon">📞</td><td>${esc(personalInfo.phone)}</td></tr>`);
  if (personalInfo.email)
    contactRows.push(`<tr><td class="icon">✉</td><td><a href="mailto:${esc(personalInfo.email)}">${esc(personalInfo.email)}</a></td></tr>`);
  for (const link of personalInfo.links) {
    if (link.url)
      contactRows.push(`<tr><td class="icon">🔗</td><td><a href="${esc(link.url)}">${esc(link.label || link.url.replace(/^https?:\/\/(www\.)?/, ""))}</a></td></tr>`);
  }

  let html = `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><title>${esc(title)}</title>
<style>
@import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&display=swap');
@page { size: A4; margin: 2.5cm 1.75cm; }
* { margin:0; padding:0; box-sizing:border-box; }
body { font-family:'Libre Baskerville',Georgia,serif; font-size:10pt; line-height:1.3; color:#000; padding:2.5cm 1.75cm; max-width:210mm; }
h1 { font-family:sans-serif; font-size:24pt; font-weight:400; text-align:center; }
.headline { text-align:center; font-size:11pt; margin-top:4pt; color:#444; }
.header { display:flex; gap:1.5em; margin-bottom:10pt; }
.header-left { width:63%; }
.header-right { width:35%; padding-top:4pt; }
.header-right table { font-size:9pt; line-height:1.7; }
.header-right .icon { padding-right:6pt; color:#888; }
.columns { display:flex; gap:2em; }
.col-left { width:63%; }
.col-right { width:35%; }
h2 { font-size:14pt; font-weight:400; font-variant:small-caps; letter-spacing:0.04em; border-bottom:1px solid #000; padding-bottom:2pt; margin-top:14pt; margin-bottom:6pt; }
.entry-head { display:flex; justify-content:space-between; align-items:baseline; }
.entry-title { font-size:10.5pt; font-weight:700; }
.entry-date { font-size:9.5pt; flex-shrink:0; margin-left:8pt; }
.entry-sub { font-size:9.5pt; color:#555; }
ul { margin:3pt 0 8pt 14pt; font-size:9.5pt; }
li { margin-bottom:1pt; line-height:1.3; }
.skill-cat { font-size:8.5pt; text-transform:uppercase; letter-spacing:0.08em; color:#888; font-weight:700; }
.skill-list { font-size:9.5pt; margin-bottom:4pt; line-height:1.6; }
a { color:#000; text-decoration:underline; }
@media print { body { padding:0; } }
</style></head><body>
`;

  html += `<div class="header"><div class="header-left">`;
  html += `<h1>${esc(personalInfo.fullName)}</h1>`;
  if (data.summary) html += `<p class="headline">${esc(data.summary)}</p>`;
  html += `</div><div class="header-right"><table>${contactRows.join("")}</table></div></div>`;

  html += `<div class="columns"><div class="col-left">`;

  const leftRenderers: Record<string, () => string> = {
    education: () => renderEducation(data),
    experience: () => renderExperience(data),
    projects: () => renderProjects(data),
    summary: () => "",
  };

  for (const key of leftOrder) {
    const fn = leftRenderers[key];
    if (fn) html += fn();
  }

  html += `</div><div class="col-right">`;

  if (rightOrder.includes("skills")) html += renderSkills(data);

  html += `</div></div>`;
  html += `\n<script>window.onload=function(){window.print()}</script>\n</body></html>`;
  return html;
}

function renderEducation(data: ResumeData): string {
  if (data.education.length === 0) return "";
  let s = `<h2>Education</h2>`;
  for (const edu of data.education) {
    s += `<div class="entry-head"><span class="entry-title">${esc(edu.degree)}${edu.field ? `, ${esc(edu.field)}` : ""}</span><span class="entry-date">${esc(edu.startDate)}${edu.endDate ? ` – ${esc(edu.endDate)}` : ""}</span></div>`;
    s += `<div class="entry-sub">${esc(edu.school)}${edu.location ? `, ${esc(edu.location)}` : ""}</div>`;
  }
  return s;
}

function renderExperience(data: ResumeData): string {
  if (data.experience.length === 0) return "";
  let s = `<h2>Experience</h2>`;
  for (const exp of data.experience) {
    s += `<div class="entry-head"><span class="entry-title">${esc(exp.role)}</span><span class="entry-date">${esc(exp.startDate)}${exp.endDate ? ` – ${esc(exp.endDate)}` : ""}</span></div>`;
    s += `<div class="entry-sub">${esc(exp.company)}${exp.location ? `, ${esc(exp.location)}` : ""}</div>`;
    const bullets = exp.bullets.filter((b) => b.trim());
    if (bullets.length) s += `<ul>${bullets.map((b) => `<li>${esc(b)}</li>`).join("")}</ul>`;
  }
  return s;
}

function renderProjects(data: ResumeData): string {
  if (data.projects.length === 0) return "";
  let s = `<h2>Projects</h2>`;
  for (const proj of data.projects) {
    const right = proj.link ? `<a href="${esc(proj.link)}">${esc(proj.link.replace(/^https?:\/\/(www\.)?/, ""))}</a>` : "";
    s += `<div class="entry-head"><span class="entry-title">${esc(proj.name)}${proj.techStack ? ` <span style="font-weight:400;color:#666">· ${esc(proj.techStack)}</span>` : ""}</span><span class="entry-date">${right}</span></div>`;
    const bullets = proj.bullets.filter((b) => b.trim());
    if (bullets.length) s += `<ul>${bullets.map((b) => `<li>${esc(b)}</li>`).join("")}</ul>`;
  }
  return s;
}

function renderSkills(data: ResumeData): string {
  if (data.skills.length === 0) return "";
  let s = `<h2>Skills</h2>`;
  for (const group of data.skills) {
    if (group.category) s += `<div class="skill-cat">${esc(group.category)}</div>`;
    s += `<div class="skill-list">${esc(group.skills)}</div>`;
  }
  return s;
}
