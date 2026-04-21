import type { ResumeData, SectionKey } from "../types";
import { getSafeMailto, getSafeUrl } from "../safe-url";

function tex(str: string): string {
  return str
    .replace(/\\/g, "\\textbackslash{}")
    .replace(/[&%$#_{}]/g, (m) => `\\${m}`)
    .replace(/~/g, "\\textasciitilde{}")
    .replace(/\^/g, "\\textasciicircum{}")
    .replace(/\n/g, " ");
}

function href(url: string, label?: string): string {
  const safeUrl = getSafeUrl(url);
  const display = label || url.replace(/^https?:\/\/(www\.)?/, "");
  return safeUrl ? `\\href{${safeUrl}}{\\underline{${tex(display)}}}` : tex(display);
}

export function generateProfessionalLaTeX(data: ResumeData): string {
  const { personalInfo } = data;
  const order = data.sectionOrder ?? ["education", "experience", "projects", "skills"];

  let doc = `\\documentclass[12pt]{article}
\\usepackage[english]{babel}
\\usepackage{cmbright}
\\usepackage{enumitem}
\\usepackage{fancyhdr}
\\usepackage{fontawesome5}
\\usepackage{geometry}
\\usepackage{hyperref}
\\usepackage[sf]{libertine}
\\usepackage{microtype}
\\usepackage{paracol}
\\usepackage{supertabular}
\\usepackage{titlesec}
\\usepackage{etoolbox}
\\hypersetup{colorlinks, urlcolor=black, linkcolor=black}

\\geometry{hmargin=1.75cm, vmargin=2.5cm}
\\columnratio{0.65, 0.35}
\\setlength\\columnsep{0.05\\textwidth}
\\setlength\\parindent{0pt}
\\setlength{\\smallskipamount}{8pt plus 3pt minus 3pt}
\\setlength{\\medskipamount}{16pt plus 6pt minus 6pt}
\\setlength{\\bigskipamount}{24pt plus 8pt minus 8pt}

\\pagestyle{empty}
\\titleformat{\\section}{\\scshape\\LARGE\\raggedright}{}{0em}{}[\\titlerule]
\\titlespacing{\\section}{0pt}{\\bigskipamount}{\\smallskipamount}
\\newcommand{\\heading}[2]{\\centering{\\sffamily\\Huge #1}\\\\\\smallskip{\\large{#2}}}
\\newcommand{\\entry}[4]{{\\textbf{#1}} \\hfill #3 \\\\ #2 \\hfill #4}
\\newcommand{\\tableentry}[3]{\\textsc{#1} & #2\\expandafter\\ifstrequal\\expandafter{#3}{}{\\\\}{\\\\[6pt]}}

\\begin{document}

\\vspace*{\\fill}

\\begin{paracol}{2}

`;

  // Header: name + summary
  const summaryText = data.summary ? `, \\\\ ${tex(data.summary)}` : "";
  doc += `\\heading{${tex(personalInfo.fullName)}}{${summaryText}}\n\n`;

  // Contact in right column
  doc += `\\switchcolumn\n\n`;
  doc += `\\vspace{0.01\\textheight}\n`;
  doc += `\\begin{supertabular}{ll}\n`;
  if (personalInfo.phone)
    doc += `  \\footnotesize\\faPhone & ${tex(personalInfo.phone)} \\\\\n`;
  if (personalInfo.email) {
    const emailHref = getSafeMailto(personalInfo.email);
    doc += `  \\footnotesize\\faEnvelope & ${emailHref ? `\\href{${emailHref}}{${tex(personalInfo.email)}}` : tex(personalInfo.email)} \\\\\n`;
  }
  for (const link of personalInfo.links) {
    if (link.url)
      doc += `  \\footnotesize\\faLink & ${href(link.url, link.label)} \\\\\n`;
  }
  doc += `\\end{supertabular}\n\n`;

  // Sections — left column gets education, experience, projects, summary
  // Right column gets skills
  const leftSections = ["education", "experience", "projects", "summary"];
  const rightSections = ["skills"];

  const leftOrder = order.filter((k) => leftSections.includes(k));
  const rightOrder = order.filter((k) => rightSections.includes(k));

  doc += `\\bigskip\n\\switchcolumn*\n\n`;

  for (const key of leftOrder) {
    doc += renderLeftSection(key, data);
  }

  doc += `\\switchcolumn\n\n`;

  for (const key of rightOrder) {
    doc += renderRightSection(key, data);
  }

  doc += `\\end{paracol}\n\n\\vspace*{\\fill}\n\n\\end{document}\n`;
  return doc;
}

function renderLeftSection(key: SectionKey, data: ResumeData): string {
  switch (key) {
    case "education":
      return renderEducation(data);
    case "experience":
      return renderExperience(data);
    case "projects":
      return renderProjects(data);
    case "summary":
      return "";
    default:
      return "";
  }
}

function renderRightSection(key: SectionKey, data: ResumeData): string {
  switch (key) {
    case "skills":
      return renderSkills(data);
    default:
      return "";
  }
}

function renderEducation(data: ResumeData): string {
  if (data.education.length === 0) return "";
  let s = `\\section{education}\n\n`;
  for (let i = 0; i < data.education.length; i++) {
    const edu = data.education[i];
    const dates = `${tex(edu.startDate)}${edu.endDate ? ` -- ${tex(edu.endDate)}` : ""}`;
    const degree = `${tex(edu.degree)}${edu.field ? `, ${tex(edu.field)}` : ""}`;
    const loc = edu.location ? `${tex(edu.school)}, ${tex(edu.location)}` : tex(edu.school);
    s += `\\entry{${degree}}{${loc}}{}{${dates}}\n`;
    if (i < data.education.length - 1) s += `\n\\medskip\n\n`;
  }
  s += `\n`;
  return s;
}

function renderExperience(data: ResumeData): string {
  if (data.experience.length === 0) return "";
  let s = `\\section{experience}\n\n`;
  for (let i = 0; i < data.experience.length; i++) {
    const exp = data.experience[i];
    const dates = `${tex(exp.startDate)}${exp.endDate ? ` -- ${tex(exp.endDate)}` : ""}`;
    const loc = exp.location ? `${tex(exp.company)}, ${tex(exp.location)}` : tex(exp.company);
    s += `\\entry{${tex(exp.role)}}{${loc}}{}{${dates}}\n`;
    const bullets = exp.bullets.filter((b) => b.trim());
    if (bullets.length > 0) {
      s += `\\begin{itemize}[noitemsep,leftmargin=3.5mm,rightmargin=0mm,topsep=6pt]\n`;
      for (const b of bullets) s += `  \\item ${tex(b)}\n`;
      s += `\\end{itemize}\n`;
    }
    if (i < data.experience.length - 1) s += `\n\\medskip\n\n`;
  }
  s += `\n`;
  return s;
}

function renderProjects(data: ResumeData): string {
  if (data.projects.length === 0) return "";
  let s = `\\section{projects}\n\n`;
  for (let i = 0; i < data.projects.length; i++) {
    const proj = data.projects[i];
    const tech = proj.techStack ? ` \\textperiodcentered{} ${tex(proj.techStack)}` : "";
    const right = proj.link ? href(proj.link) : "";
    s += `\\entry{${tex(proj.name)}${tech}}{}{${right}}{}\n`;
    const bullets = proj.bullets.filter((b) => b.trim());
    if (bullets.length > 0) {
      s += `\\begin{itemize}[noitemsep,leftmargin=3.5mm,rightmargin=0mm,topsep=6pt]\n`;
      for (const b of bullets) s += `  \\item ${tex(b)}\n`;
      s += `\\end{itemize}\n`;
    }
    if (i < data.projects.length - 1) s += `\n\\medskip\n\n`;
  }
  s += `\n`;
  return s;
}

function renderSkills(data: ResumeData): string {
  if (data.skills.length === 0) return "";
  let s = `\\section{skills}\n`;
  s += `\\begin{supertabular}{rl}\n`;
  for (const group of data.skills) {
    if (group.category) {
      s += `  \\tableentry{\\footnotesize\\faCode}{${tex(group.skills)}}{}\n`;
    } else {
      s += `  \\tableentry{}{${tex(group.skills)}}{}\n`;
    }
  }
  s += `\\end{supertabular}\n\n`;
  return s;
}
