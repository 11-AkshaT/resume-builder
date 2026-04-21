import type { ResumeData, SectionKey, TemplateKey } from "./types";
import { generateProfessionalLaTeX } from "./templates/professional-latex";
import { generateModernLaTeX } from "./templates/modern-latex";
import { getSafeMailto, getSafeUrl } from "./safe-url";

export function generateResumeLaTeXByTemplate(data: ResumeData, template: TemplateKey): string {
  switch (template) {
    case "professional":
      return generateProfessionalLaTeX(data);
    case "modern":
      return generateModernLaTeX(data);
    case "minimal":
    default:
      return generateResumeLaTeX(data);
  }
}

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

const DEFAULT_ORDER: SectionKey[] = [
  "education",
  "experience",
  "projects",
  "skills",
  "summary",
];

export function generateResumeLaTeX(data: ResumeData): string {
  const { personalInfo } = data;
  const order = data.sectionOrder ?? DEFAULT_ORDER;

  let doc = `%-------------------------
% Resume in Latex
% Based off of: https://github.com/sb2nov/resume
% License : MIT
%------------------------

\\documentclass[letterpaper,11pt]{article}

\\usepackage{latexsym}
\\usepackage[empty]{fullpage}
\\usepackage{titlesec}
\\usepackage{marvosym}
\\usepackage[usenames,dvipsnames]{color}
\\usepackage{verbatim}
\\usepackage{enumitem}
\\usepackage[hidelinks]{hyperref}
\\usepackage{fancyhdr}
\\usepackage[english]{babel}
\\usepackage{tabularx}
\\input{glyphtounicode}

\\pagestyle{fancy}
\\fancyhf{}
\\fancyfoot{}
\\renewcommand{\\headrulewidth}{0pt}
\\renewcommand{\\footrulewidth}{0pt}

\\addtolength{\\oddsidemargin}{-0.5in}
\\addtolength{\\evensidemargin}{-0.5in}
\\addtolength{\\textwidth}{1in}
\\addtolength{\\topmargin}{-.5in}
\\addtolength{\\textheight}{1.0in}

\\urlstyle{same}
\\raggedbottom
\\raggedright
\\setlength{\\tabcolsep}{0in}

\\titleformat{\\section}{
  \\vspace{-4pt}\\scshape\\raggedright\\large
}{}{0em}{}[\\color{black}\\titlerule \\vspace{-5pt}]

\\pdfgentounicode=1

\\newcommand{\\resumeItem}[1]{
  \\item\\small{
    {#1 \\vspace{-2pt}}
  }
}

\\newcommand{\\resumeSubheading}[4]{
  \\vspace{-2pt}\\item
    \\begin{tabular*}{0.97\\textwidth}[t]{l@{\\extracolsep{\\fill}}r}
      \\textbf{#1} & #2 \\\\
      \\textit{\\small#3} & \\textit{\\small #4} \\\\
    \\end{tabular*}\\vspace{-7pt}
}

\\newcommand{\\resumeSubSubheading}[2]{
    \\item
    \\begin{tabular*}{0.97\\textwidth}{l@{\\extracolsep{\\fill}}r}
      \\textit{\\small#1} & \\textit{\\small #2} \\\\
    \\end{tabular*}\\vspace{-7pt}
}

\\newcommand{\\resumeProjectHeading}[2]{
    \\item
    \\begin{tabular*}{0.97\\textwidth}{l@{\\extracolsep{\\fill}}r}
      \\small#1 & #2 \\\\
    \\end{tabular*}\\vspace{-7pt}
}

\\newcommand{\\resumeSubItem}[1]{\\resumeItem{#1}\\vspace{-4pt}}

\\renewcommand\\labelitemii{$\\vcenter{\\hbox{\\tiny$\\bullet$}}$}

\\newcommand{\\resumeSubHeadingListStart}{\\begin{itemize}[leftmargin=0.15in, label={}]}
\\newcommand{\\resumeSubHeadingListEnd}{\\end{itemize}}
\\newcommand{\\resumeItemListStart}{\\begin{itemize}}
\\newcommand{\\resumeItemListEnd}{\\end{itemize}\\vspace{-5pt}}

\\begin{document}

`;

  // Header
  doc += `\\begin{center}\n`;
  doc += `    \\textbf{\\Huge \\scshape ${tex(personalInfo.fullName)}} \\\\ \\vspace{1pt}\n`;
  const contact: string[] = [];
  if (personalInfo.phone) contact.push(`\\small ${tex(personalInfo.phone)}`);
  if (personalInfo.email) {
    const emailHref = getSafeMailto(personalInfo.email);
    contact.push(
      emailHref
        ? `\\href{${emailHref}}{\\underline{${tex(personalInfo.email)}}}`
        : tex(personalInfo.email)
    );
  }
  personalInfo.links.forEach((link) => {
    if (link.url) contact.push(href(link.url, link.label));
    else if (link.label) contact.push(tex(link.label));
  });
  if (contact.length > 0) doc += `    ${contact.join(" $|$ ")}\n`;
  doc += `\\end{center}\n\n`;

  const renderers: Record<SectionKey, () => string> = {
    education: () => latexEducation(data),
    experience: () => latexExperience(data),
    projects: () => latexProjects(data),
    skills: () => latexSkills(data),
    summary: () => latexSummary(data),
  };

  for (const key of order) {
    doc += renderers[key]();
  }

  doc += `\\end{document}\n`;
  return doc;
}

function latexEducation(data: ResumeData): string {
  if (data.education.length === 0) return "";
  let s = `%-----------EDUCATION-----------\n\\section{Education}\n  \\resumeSubHeadingListStart\n`;
  for (const edu of data.education) {
    const degree = `${tex(edu.degree)}${edu.field ? `, ${tex(edu.field)}` : ""}`;
    const dates = `${tex(edu.startDate)}${edu.endDate ? ` -- ${tex(edu.endDate)}` : ""}`;
    s += `    \\resumeSubheading\n`;
    s += `      {${tex(edu.school)}}{${tex(edu.location)}}\n`;
    s += `      {${degree}}{${dates}}\n`;
  }
  s += `  \\resumeSubHeadingListEnd\n\n`;
  return s;
}

function latexExperience(data: ResumeData): string {
  if (data.experience.length === 0) return "";
  let s = `%-----------EXPERIENCE-----------\n\\section{Experience}\n  \\resumeSubHeadingListStart\n\n`;
  for (const exp of data.experience) {
    const dates = `${tex(exp.startDate)}${exp.endDate ? ` -- ${tex(exp.endDate)}` : ""}`;
    s += `    \\resumeSubheading\n`;
    s += `      {${tex(exp.role)}}{${dates}}\n`;
    s += `      {${tex(exp.company)}}{${tex(exp.location)}}\n`;
    const bullets = exp.bullets.filter((b) => b.trim());
    if (bullets.length > 0) {
      s += `      \\resumeItemListStart\n`;
      for (const b of bullets) s += `        \\resumeItem{${tex(b)}}\n`;
      s += `      \\resumeItemListEnd\n`;
    }
    s += `\n`;
  }
  s += `  \\resumeSubHeadingListEnd\n\n`;
  return s;
}

function latexProjects(data: ResumeData): string {
  if (data.projects.length === 0) return "";
  let s = `%-----------PROJECTS-----------\n\\section{Projects}\n    \\resumeSubHeadingListStart\n`;
  for (const proj of data.projects) {
    const title = `\\textbf{${tex(proj.name)}}${proj.techStack ? ` $|$ \\emph{${tex(proj.techStack)}}` : ""}`;
    const right = proj.link ? href(proj.link) : "";
    s += `      \\resumeProjectHeading\n`;
    s += `          {${title}}{${right}}\n`;
    const bullets = proj.bullets.filter((b) => b.trim());
    if (bullets.length > 0) {
      s += `          \\resumeItemListStart\n`;
      for (const b of bullets) s += `            \\resumeItem{${tex(b)}}\n`;
      s += `          \\resumeItemListEnd\n`;
    }
  }
  s += `    \\resumeSubHeadingListEnd\n\n`;
  return s;
}

function latexSkills(data: ResumeData): string {
  if (data.skills.length === 0) return "";
  let s = `%-----------TECHNICAL SKILLS-----------\n\\section{Technical Skills}\n`;
  s += ` \\begin{itemize}[leftmargin=0.15in, label={}]\n`;
  s += `    \\small{\\item{\n`;
  for (const group of data.skills) {
    if (group.category)
      s += `     \\textbf{${tex(group.category)}}{: ${tex(group.skills)}} \\\\\n`;
    else s += `     ${tex(group.skills)} \\\\\n`;
  }
  s += `    }}\n \\end{itemize}\n\n`;
  return s;
}

function latexSummary(data: ResumeData): string {
  if (!data.summary) return "";
  return `%-----------SUMMARY-----------\n\\section{Summary}\n  \\small{${tex(data.summary)}}\n  \\vspace{-5pt}\n\n`;
}
