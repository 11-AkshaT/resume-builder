import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { ResumeData } from "@/lib/types";
import { ResumeEditor } from "./resume-editor";

vi.mock("@/app/app/actions", () => ({
  updateResumeData: vi.fn(),
  updateResumeTitle: vi.fn(),
  updateResumeTemplate: vi.fn(),
}));

vi.mock("./editor-sidebar", () => ({
  EditorSidebar: () => <div>Editor sidebar</div>,
}));

vi.mock("./publish-panel", () => ({
  PublishPanel: () => <div>Publish panel</div>,
}));

vi.mock("./resume-preview", () => ({
  ResumePreview: () => <div>Resume preview</div>,
}));

vi.mock("./paywall-modal", () => ({
  PaywallModal: () => <div>Paywall modal</div>,
}));

const baseResumeData: ResumeData = {
  personalInfo: {
    fullName: "Jane Doe",
    email: "jane@example.com",
    phone: "1234567890",
    location: "Remote",
    links: [],
  },
  summary: "",
  experience: [],
  projects: [],
  skills: [],
  education: [],
  sectionOrder: ["education", "experience", "projects", "skills"],
};

describe("ResumeEditor", () => {
  it("renders the desktop-only notice alongside the desktop editor markup", () => {
    const { container } = render(
      <ResumeEditor
        resumeId="resume_1"
        initialTitle="My Resume"
        initialData={baseResumeData}
        initialTemplate="minimal"
        unlocked={false}
        hasLifetime={false}
        initialSlug={null}
        initialPublished={false}
      />
    );

    expect(
      screen.getByText("Open the editor on a laptop or desktop.")
    ).toBeInTheDocument();
    expect(screen.getByText("Resume preview")).toBeInTheDocument();
    expect(container.textContent).toContain("Desktop only for v1");
  });
});
