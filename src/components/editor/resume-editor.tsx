"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import {
  updateResumeData,
  updateResumeTitle,
  updateResumeTemplate,
} from "@/app/app/actions";
import type { ResumeData, TemplateKey } from "@/lib/types";
import { TEMPLATE_META, TEMPLATE_KEYS } from "@/lib/types";
import { ResumePreview } from "./resume-preview";
import { EditorSidebar } from "./editor-sidebar";
import { PublishPanel } from "./publish-panel";
import { Button } from "@/components/ui/button";
import {
  Save,
  Download,
  Lock,
  ArrowLeft,
  Check,
  Loader2,
  Layout,
} from "lucide-react";
import Link from "next/link";
import { PaywallModal } from "./paywall-modal";

interface ResumeEditorProps {
  resumeId: string;
  initialTitle: string;
  initialData: ResumeData;
  initialTemplate: TemplateKey;
  unlocked: boolean;
  hasLifetime: boolean;
  initialSlug: string | null;
  initialPublished: boolean;
}

export function ResumeEditor({
  resumeId,
  initialTitle,
  initialData,
  initialTemplate,
  unlocked,
  hasLifetime,
  initialSlug,
  initialPublished,
}: ResumeEditorProps) {
  const [data, setData] = useState<ResumeData>(initialData);
  const safeTemplate = TEMPLATE_KEYS.includes(initialTemplate) ? initialTemplate : "minimal";
  const [template, setTemplate] = useState<TemplateKey>(safeTemplate);
  const [showTemplatePicker, setShowTemplatePicker] = useState(false);
  const [title, setTitle] = useState(initialTitle);
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving" | "unsaved">(
    "saved"
  );
  const [showPaywall, setShowPaywall] = useState(false);
  const saveTimeout = useRef<ReturnType<typeof setTimeout>>(undefined);
  const latestData = useRef(data);
  const titleSaveTimeout = useRef<ReturnType<typeof setTimeout>>(undefined);
  const latestTitle = useRef(title);

  useEffect(() => {
    latestData.current = data;
  }, [data]);

  useEffect(() => {
    latestTitle.current = title;
  }, [title]);

  const autoSave = useCallback(async () => {
    setSaveStatus("saving");
    try {
      await updateResumeData(resumeId, latestData.current);
      setSaveStatus("saved");
    } catch {
      setSaveStatus("unsaved");
    }
  }, [resumeId]);

  const handleDataChange = useCallback(
    (newData: ResumeData) => {
      setData(newData);
      setSaveStatus("unsaved");

      if (saveTimeout.current) clearTimeout(saveTimeout.current);
      saveTimeout.current = setTimeout(autoSave, 1500);
    },
    [autoSave]
  );

  const handleTitleChange = useCallback(
    (newTitle: string) => {
      setTitle(newTitle);
      setSaveStatus("unsaved");

      if (titleSaveTimeout.current) clearTimeout(titleSaveTimeout.current);
      titleSaveTimeout.current = setTimeout(async () => {
        setSaveStatus("saving");
        try {
          await updateResumeTitle(resumeId, latestTitle.current);
          setSaveStatus("saved");
        } catch {
          setSaveStatus("unsaved");
        }
      }, 700);
    },
    [resumeId]
  );

  useEffect(() => {
    return () => {
      if (saveTimeout.current) clearTimeout(saveTimeout.current);
      if (titleSaveTimeout.current) clearTimeout(titleSaveTimeout.current);
    };
  }, []);

  const handleTemplateChange = useCallback(
    async (key: TemplateKey) => {
      setTemplate(key);
      setShowTemplatePicker(false);
      try {
        await updateResumeTemplate(resumeId, key);
      } catch { /* silent fail */ }
    },
    [resumeId]
  );

  const handleExport = (format: "download" | "latex") => {
    if (!unlocked) {
      setShowPaywall(true);
      return;
    }
    window.open(`/api/export/${format}/${resumeId}`, "_blank");
  };

  return (
      <div className="h-[calc(100vh-3.5rem)]">
        <div className="flex h-full flex-col lg:hidden">
          <div className="flex-1 px-6 py-10">
            <div className="mx-auto flex h-full max-w-md flex-col justify-center rounded-[2rem] border border-border/90 bg-card/95 p-8 text-center shadow-[0_26px_70px_-42px_rgba(20,32,27,0.28)]">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                Desktop only for v1
              </p>
              <h1 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-foreground">
                Open the editor on a laptop or desktop.
              </h1>
              <p className="mt-4 text-sm leading-7 text-muted-foreground">
                The v1 editor is optimized for larger screens so your layout and preview
                stay accurate while you edit.
              </p>
              <div className="mt-6">
                <Link
                  href="/app"
                  className="inline-flex items-center justify-center rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-[0_14px_32px_-18px_rgba(33,81,70,0.65)]"
                >
                  Back to dashboard
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="hidden h-full flex-col lg:flex">
      {/* Toolbar */}
      <div className="border-b border-border bg-background px-4 py-2 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <Link
            href="/app"
            aria-label="Back to dashboard"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <input
            type="text"
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            aria-label="Resume title"
            className="font-semibold bg-transparent border-none outline-none text-sm focus:ring-0 w-48"
          />
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            {saveStatus === "saved" && (
              <>
                <Check className="h-3 w-3 text-green-600" />
                Saved
              </>
            )}
            {saveStatus === "saving" && (
              <>
                <Loader2 className="h-3 w-3 animate-spin" />
                Saving...
              </>
            )}
            {saveStatus === "unsaved" && (
              <>
                <Save className="h-3 w-3" />
                Unsaved
              </>
            )}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Button
              variant="outline"
              size="sm"
              aria-haspopup="menu"
              aria-expanded={showTemplatePicker}
              aria-label="Choose resume template"
              onClick={() => setShowTemplatePicker((v) => !v)}
            >
              <Layout className="h-4 w-4 mr-1.5" />
              {TEMPLATE_META[template].label}
            </Button>
            {showTemplatePicker && (
              <div className="absolute right-0 top-full mt-1 z-50 bg-background border border-border rounded-lg shadow-lg p-2 w-64">
                {TEMPLATE_KEYS.map((key) => (
                  <button
                    key={key}
                    onClick={() => handleTemplateChange(key)}
                    aria-pressed={key === template}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                      key === template
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted"
                    }`}
                  >
                    <div className="font-medium">{TEMPLATE_META[key].label}</div>
                    <div className={`text-xs mt-0.5 ${key === template ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                      {TEMPLATE_META[key].description}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
            <Button
              variant="outline"
              size="sm"
              aria-label="Open download view"
              onClick={() => handleExport("download")}
            >
              {unlocked ? (
                <Download className="h-4 w-4 mr-1.5" />
            ) : (
              <Lock className="h-4 w-4 mr-1.5" />
            )}
            Download
          </Button>
          <Button
            variant="outline"
            size="sm"
            aria-label="Export LaTeX file"
            onClick={() => handleExport("latex")}
          >
            {unlocked ? (
              <Download className="h-4 w-4 mr-1.5" />
            ) : (
              <Lock className="h-4 w-4 mr-1.5" />
            )}
            LaTeX
          </Button>
        </div>
      </div>

      {/* Editor + Preview */}
      <div className="flex-1 flex overflow-hidden">
        <div className="w-1/2 border-r border-border overflow-y-auto">
          <EditorSidebar data={data} onChange={handleDataChange} />
          <div className="p-4 border-t border-border">
            <PublishPanel
              resumeId={resumeId}
              hasLifetime={hasLifetime}
              initialSlug={initialSlug}
              initialPublished={initialPublished}
              onRequestUpgrade={() => setShowPaywall(true)}
            />
          </div>
        </div>
        <div className="w-1/2 overflow-y-auto bg-muted/30 p-6 flex justify-center">
          <ResumePreview data={data} sectionOrder={data.sectionOrder} template={template} />
        </div>
      </div>

      {showPaywall && (
        <PaywallModal
          resumeId={resumeId}
          onClose={() => setShowPaywall(false)}
        />
      )}
        </div>
      </div>
    );
}
