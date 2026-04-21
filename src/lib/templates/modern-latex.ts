import type { ResumeData, SectionKey } from "../types";
import { getSafeUrl } from "../safe-url";

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

export function generateModernLaTeX(data: ResumeData): string {
  const { personalInfo } = data;
  const order = data.sectionOrder ?? ["education", "experience", "projects", "skills"];
  const nameParts = personalInfo.fullName.split(" ");
  const firstName = nameParts.slice(0, -1).join(" ");
  const lastName = nameParts.slice(-1)[0] || "";

  let doc = `\\documentclass[11pt, a4paper]{article}

\\usepackage[T1]{fontenc}
\\usepackage[utf8]{inputenc}
\\usepackage[british]{babel}
\\usepackage[left=0mm, right=0mm, top=0mm, bottom=0mm]{geometry}
\\usepackage[stretch=25, shrink=25, tracking=true, letterspace=30]{microtype}
\\usepackage{xcolor}
\\usepackage{marvosym}
\\usepackage{enumitem}
\\setlist{parsep=0pt, topsep=0pt, partopsep=1pt, itemsep=1pt, leftmargin=6mm}
\\usepackage{FiraSans}
\\renewcommand{\\familydefault}{\\sfdefault}

\\definecolor{cvblue}{HTML}{304263}

\\newcommand{\\dates}[1]{\\hfill\\mbox{\\textbf{#1}}}
\\newcommand{\\is}{\\par\\vskip.5ex plus .4ex}
\\newcommand{\\smaller}[1]{{\\small$\\diamond$\\ #1}}
\\newcommand{\\headleft}[1]{\\vspace*{3ex}\\textsc{\\textbf{#1}}\\par%
    \\vspace*{-1.5ex}\\hrulefill\\par\\vspace*{0.7ex}}
\\newcommand{\\headright}[1]{\\vspace*{2.5ex}\\textsc{\\Large\\color{cvblue}#1}\\par%
     \\vspace*{-2ex}{\\color{cvblue}\\hrulefill}\\par}

\\usepackage[colorlinks=true, urlcolor=white, linkcolor=white]{hyperref}

\\begin{document}

\\setlength{\\topskip}{0pt}
\\setlength{\\parindent}{0pt}
\\setlength{\\parskip}{0pt}
\\setlength{\\fboxsep}{0pt}
\\pagestyle{empty}
\\raggedbottom

\\begin{minipage}[t]{0.33\\textwidth}
\\colorbox{cvblue}{\\begin{minipage}[t][5mm][t]{\\textwidth}\\null\\hfill\\null\\end{minipage}}

\\vspace{-.2ex}
\\colorbox{cvblue!90}{\\color{white}
\\kern0.09\\textwidth\\relax
\\begin{minipage}[t][293mm][t]{0.82\\textwidth}
\\raggedright
\\vspace*{2.5ex}

\\Large ${tex(firstName)} \\textbf{\\textsc{${tex(lastName)}}} \\normalsize

\\vspace*{2ex}

`;

  // Profile / Summary
  if (data.summary) {
    doc += `\\headleft{Profile}\n${tex(data.summary)}\n\n`;
  }

  // Contact
  doc += `\\headleft{Contact details}\n\\small\n`;
  if (personalInfo.email)
    doc += `\\MVAt\\ {\\small ${tex(personalInfo.email)}} \\\\[0.4ex]\n`;
  if (personalInfo.phone)
    doc += `\\Mobilefone\\ ${tex(personalInfo.phone)} \\\\[0.5ex]\n`;
  for (const link of personalInfo.links) {
    if (link.url || link.label)
      doc += `\\Mundus\\ ${href(link.url, link.label)} \\\\[0.5ex]\n`;
  }
  if (personalInfo.location)
    doc += `\\Letter\\ ${tex(personalInfo.location)} \\\\[0.1ex]\n`;
  doc += `\\normalsize\n\n`;

  // Skills in sidebar
  if (data.skills.length > 0) {
    doc += `\\headleft{Skills}\n\\begin{itemize}\n`;
    for (const group of data.skills) {
      const label = group.category ? `${tex(group.category)}: ` : "";
      doc += `\\item ${label}${tex(group.skills)}\n`;
    }
    doc += `\\end{itemize}\n\n`;
  }

  doc += `\\end{minipage}%
\\kern0.09\\textwidth\\relax
}
\\end{minipage}%
\\hskip2.5em%
\\begin{minipage}[t]{0.56\\textwidth}
\\setlength{\\parskip}{0.8ex}

\\vspace{2ex}

`;

  // Main sections in right column
  const mainSections = ["experience", "education", "projects"];
  const mainOrder = order.filter((k) => mainSections.includes(k));

  for (const key of mainOrder) {
    doc += renderMainSection(key, data);
  }

  doc += `\\end{minipage}\n\n\\end{document}\n`;
  return doc;
}

function renderMainSection(key: SectionKey, data: ResumeData): string {
  switch (key) {
    case "experience":
      return renderExperience(data);
    case "education":
      return renderEducation(data);
    case "projects":
      return renderProjects(data);
    default:
      return "";
  }
}

function renderExperience(data: ResumeData): string {
  if (data.experience.length === 0) return "";
  let s = `\\headright{Experience}\n\n`;
  for (const exp of data.experience) {
    const dates = `${tex(exp.startDate)}${exp.endDate ? `--${tex(exp.endDate)}` : ""}`;
    const loc = exp.location ? ` (${tex(exp.location)})` : "";
    s += `\\textsc{${tex(exp.role)}} at \\textit{${tex(exp.company)}${loc}.} \\dates{${dates}}\n`;
    const bullets = exp.bullets.filter((b) => b.trim());
    if (bullets.length > 0) {
      s += `\\\\\\n`;
      s += bullets.map((b) => `\\smaller{${tex(b)}}`).join("\n\n") + "\n";
    }
    s += `\n\\is\n`;
  }
  return s;
}

function renderEducation(data: ResumeData): string {
  if (data.education.length === 0) return "";
  let s = `\\headright{Education}\n\n`;
  for (const edu of data.education) {
    const dates = `${tex(edu.startDate)}${edu.endDate ? `--${tex(edu.endDate)}` : ""}`;
    const degree = `${tex(edu.degree)}${edu.field ? `, ${tex(edu.field)}` : ""}`;
    const loc = edu.location ? ` (${tex(edu.location)})` : "";
    s += `\\textsc{${degree}.} \\textit{${tex(edu.school)}${loc}.} \\dates{${dates}}\n`;
    s += `\n\\is\n`;
  }
  return s;
}

function renderProjects(data: ResumeData): string {
  if (data.projects.length === 0) return "";
  let s = `\\headright{Projects}\n\n`;
  for (const proj of data.projects) {
    const tech = proj.techStack ? ` (${tex(proj.techStack)})` : "";
    const link = proj.link ? ` -- ${href(proj.link)}` : "";
    s += `\\textsc{${tex(proj.name)}${tech}}${link}\n`;
    const bullets = proj.bullets.filter((b) => b.trim());
    if (bullets.length > 0) {
      s += `\\\\\n`;
      s += bullets.map((b) => `\\smaller{${tex(b)}}`).join("\n\n") + "\n";
    }
    s += `\n\\is\n`;
  }
  return s;
}
