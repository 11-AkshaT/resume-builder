export interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  links: { label: string; url: string }[];
}

export interface WorkExperience {
  id: string;
  company: string;
  role: string;
  location: string;
  startDate: string;
  endDate: string;
  bullets: string[];
}

export interface Project {
  id: string;
  name: string;
  link: string;
  techStack: string;
  bullets: string[];
}

export interface Education {
  id: string;
  school: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  location: string;
}

export interface SkillGroup {
  id: string;
  category: string;
  skills: string;
}

export const TEMPLATE_KEYS = ["minimal", "professional", "modern"] as const;
export type TemplateKey = (typeof TEMPLATE_KEYS)[number];

export const TEMPLATE_META: Record<
  TemplateKey,
  { label: string; description: string }
> = {
  minimal: {
    label: "Minimal",
    description: "Dense single-column, LaTeX-style. Best for tech and academic roles.",
  },
  professional: {
    label: "Professional",
    description: "Clean two-column layout. Great for corporate and general use.",
  },
  modern: {
    label: "Modern",
    description: "Bold sidebar with color accent. Stands out for creative and business roles.",
  },
};

export const SECTION_KEYS = [
  "education",
  "experience",
  "projects",
  "skills",
  "summary",
] as const;

export type SectionKey = (typeof SECTION_KEYS)[number];

export const SECTION_LABELS: Record<SectionKey, string> = {
  education: "Education",
  experience: "Experience",
  projects: "Projects",
  skills: "Technical Skills",
  summary: "Summary",
};

export interface ResumeData {
  personalInfo: PersonalInfo;
  summary: string;
  experience: WorkExperience[];
  projects: Project[];
  skills: SkillGroup[];
  education: Education[];
  sectionOrder: SectionKey[];
}

export const emptyResumeData: ResumeData = {
  personalInfo: {
    fullName: "",
    email: "",
    phone: "",
    location: "",
    links: [],
  },
  summary: "",
  experience: [],
  projects: [],
  skills: [],
  education: [],
  sectionOrder: ["education", "experience", "projects", "skills"],
};

export const defaultResumeData: ResumeData = {
  personalInfo: {
    fullName: "Jake Ryan",
    email: "jake@su.edu",
    phone: "123-456-7890",
    location: "",
    links: [
      { label: "linkedin.com/in/jake", url: "https://linkedin.com/in/jake" },
      { label: "github.com/jake", url: "https://github.com/jake" },
    ],
  },
  summary: "",
  education: [
    {
      id: "edu1",
      school: "Southwestern University",
      degree: "Bachelor of Arts",
      field: "Computer Science, Minor in Business",
      startDate: "Aug. 2018",
      endDate: "May 2021",
      location: "Georgetown, TX",
    },
    {
      id: "edu2",
      school: "Blinn College",
      degree: "Associate's",
      field: "Liberal Arts",
      startDate: "Aug. 2014",
      endDate: "May 2018",
      location: "Bryan, TX",
    },
  ],
  experience: [
    {
      id: "exp1",
      role: "Undergraduate Research Assistant",
      company: "Texas A&M University",
      location: "College Station, TX",
      startDate: "June 2020",
      endDate: "Present",
      bullets: [
        "Developed a REST API using FastAPI and PostgreSQL to store data from learning management systems",
        "Developed a full-stack web application using Flask, React, PostgreSQL and Docker to analyze GitHub data",
        "Explored ways to visualize GitHub collaboration in a classroom setting",
      ],
    },
    {
      id: "exp2",
      role: "Information Technology Support Specialist",
      company: "Southwestern University",
      location: "Georgetown, TX",
      startDate: "Sep. 2018",
      endDate: "Present",
      bullets: [
        "Communicate with managers to set up campus computers used on campus",
        "Assess and troubleshoot computer problems brought by students, faculty and staff",
        "Maintain upkeep of computers, classroom equipment, and 200 printers across campus",
      ],
    },
  ],
  projects: [
    {
      id: "proj1",
      name: "Gitlytics",
      techStack: "Python, Flask, React, PostgreSQL, Docker",
      link: "",
      bullets: [
        "Developed a full-stack web application using with Flask serving a REST API with React as the frontend",
        "Implemented GitHub OAuth to get data from user's repositories",
        "Visualized GitHub data to show collaboration",
        "Used Celery and Redis for asynchronous tasks",
      ],
    },
    {
      id: "proj2",
      name: "Simple Paintball",
      techStack: "Spigot API, Java, Maven, TravisCI, Git",
      link: "",
      bullets: [
        "Developed a Minecraft server plugin to entertain kids during free time for a previous job",
        "Published plugin to websites gaining 2K+ downloads and an average 4.5/5-star review",
        "Implemented continuous delivery using TravisCI to build the plugin upon new a release",
      ],
    },
  ],
  skills: [
    { id: "sk1", category: "Languages", skills: "Java, Python, C/C++, SQL (Postgres), JavaScript, HTML/CSS, R" },
    { id: "sk2", category: "Frameworks", skills: "React, Node.js, Flask, JUnit, WordPress, Material-UI, FastAPI" },
    { id: "sk3", category: "Developer Tools", skills: "Git, Docker, TravisCI, Google Cloud Platform, VS Code, Visual Studio, PyCharm, IntelliJ, Eclipse" },
    { id: "sk4", category: "Libraries", skills: "pandas, NumPy, Matplotlib" },
  ],
  sectionOrder: ["education", "experience", "projects", "skills"],
};

export const PRODUCTS = {
  single_resume_unlock: {
    name: "Single Resume Unlock",
    price: 299,
    currency: "USD",
    displayPrice: "$2.99",
    description: "Unlock download and LaTeX export for this resume forever",
  },
  lifetime_unlimited: {
    name: "Lifetime Unlimited",
    price: 1900,
    currency: "USD",
    displayPrice: "$19",
    description: "Unlock exports for all resumes, forever",
  },
} as const;
