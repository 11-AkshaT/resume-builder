import { describe, expect, it } from "vitest";
import { generateProfessionalLaTeX } from "../templates/professional-latex";
import { defaultResumeData } from "../types";

describe("LaTeX templates", () => {
  it("includes the package needed by the professional table macro", () => {
    expect(generateProfessionalLaTeX(defaultResumeData)).toContain("\\usepackage{etoolbox}");
  });

  it("does not emit clickable unsafe URLs", () => {
    const latex = generateProfessionalLaTeX({
      ...defaultResumeData,
      personalInfo: {
        ...defaultResumeData.personalInfo,
        links: [{ label: "Unsafe", url: "javascript:alert(1)" }],
      },
      projects: [
        {
          id: "project",
          name: "Unsafe project",
          techStack: "TypeScript",
          link: "javascript:alert(1)",
          bullets: [],
        },
      ],
    });

    expect(latex).not.toContain("\\href{javascript:alert(1)}");
    expect(latex).toContain("Unsafe");
  });
});
