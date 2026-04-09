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
  const [template, setTemplate] = useState<TemplateKey>(initialTemplate);
  const [showTemplatePicker, setShowTemplatePicker] = useState(false);
  const [title, setTitle] = useState(initialTitle);
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving" | "unsaved">(
    "saved"
  );
  const [showPaywall, setShowPaywall] = useState(false);
  const saveTimeout = useRef<ReturnType<typeof setTimeout>>(undefined);
  const latestData = useRef(data);
  latestData.current = data;

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
    async (newTitle: string) => {
      setTitle(newTitle);
      try {
        await updateResumeTitle(resumeId, newTitle);
      } catch {
        /* silent fail for title */
      }
    },
    [resumeId]
  );

  useEffect(() => {
    return () => {
      if (saveTimeout.current) clearTimeout(saveTimeout.current);
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

  const handleExport = (format: "pdf" | "latex") => {
    if (!unlocked) {
      setShowPaywall(true);
      return;
    }
    window.open(`/api/export/${format}/${resumeId}`, "_blank");
  };

  return (
    <div className="h-[calc(100vh-3.5rem)] flex flex-col">
      {/* Toolbar */}
      <div className="border-b border-border bg-background px-4 py-2 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <Link
            href="/app"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <input
            type="text"
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
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
            onClick={() => handleExport("pdf")}
          >
            {unlocked ? (
              <Download className="h-4 w-4 mr-1.5" />
            ) : (
              <Lock className="h-4 w-4 mr-1.5" />
            )}
            PDF
          </Button>
          <Button
            variant="outline"
            size="sm"
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
  );
}
