"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Globe,
  Lock,
  Copy,
  Check,
  Loader2,
  ExternalLink,
  Crown,
  EyeOff,
} from "lucide-react";
import {
  publishResume,
  unpublishResume,
  checkSlugAvailability,
} from "@/app/app/actions";

interface PublishPanelProps {
  resumeId: string;
  hasLifetime: boolean;
  initialSlug: string | null;
  initialPublished: boolean;
  onRequestUpgrade: () => void;
}

export function PublishPanel({
  resumeId,
  hasLifetime,
  initialSlug,
  initialPublished,
  onRequestUpgrade,
}: PublishPanelProps) {
  const [slug, setSlug] = useState(initialSlug ?? "");
  const [isPublished, setIsPublished] = useState(initialPublished);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [slugStatus, setSlugStatus] = useState<
    "idle" | "checking" | "available" | "taken" | "invalid"
  >("idle");

  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN;
  const origin =
    typeof window !== "undefined"
      ? window.location.origin
      : "https://yoursite.com";

  const publicUrl = rootDomain
    ? `https://${slug}.${rootDomain}`
    : `${origin}/r/${slug}`;

  const checkSlug = useCallback(
    async (value: string) => {
      if (value.length < 2) {
        setSlugStatus("idle");
        return;
      }
      setSlugStatus("checking");
      try {
        const result = await checkSlugAvailability(value, resumeId);
        setSlugStatus(result.available ? "available" : "taken");
      } catch {
        setSlugStatus("invalid");
      }
    },
    [resumeId]
  );

  const handleSlugChange = (value: string) => {
    const cleaned = value
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, "")
      .slice(0, 40);
    setSlug(cleaned);
    setError(null);

    if (cleaned.length >= 2) {
      const timeout = setTimeout(() => checkSlug(cleaned), 400);
      return () => clearTimeout(timeout);
    } else {
      setSlugStatus("idle");
    }
  };

  const handlePublish = async () => {
    if (!slug || slug.length < 2) {
      setError("URL must be at least 2 characters");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const result = await publishResume(resumeId, slug);
      if (result.success) {
        setIsPublished(true);
        setSlug(result.slug);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to publish");
    } finally {
      setLoading(false);
    }
  };

  const handleUnpublish = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await unpublishResume(resumeId);
      if (result.success) {
        setIsPublished(false);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to unpublish");
    } finally {
      setLoading(false);
    }
  };

  const copyUrl = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!hasLifetime) {
    return (
      <div className="border border-border rounded-lg p-4 bg-muted/30">
        <div className="flex items-center gap-2 mb-2">
          <Lock className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Hosted Resume Page</span>
          <span className="text-[10px] bg-amber-100 text-amber-800 font-semibold px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
            <Crown className="h-2.5 w-2.5" />
            Lifetime
          </span>
        </div>
        <p className="text-xs text-muted-foreground mb-3">
          Get a shareable link to your resume. Put it on LinkedIn, email
          signatures, or anywhere. Always up-to-date.
        </p>
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={onRequestUpgrade}
        >
          <Crown className="h-3.5 w-3.5 mr-1.5" />
          Upgrade to Lifetime — $19
        </Button>
      </div>
    );
  }

  if (isPublished) {
    return (
      <div className="border border-green-200 rounded-lg p-4 bg-green-50/50">
        <div className="flex items-center gap-2 mb-2">
          <Globe className="h-4 w-4 text-green-600" />
          <span className="text-sm font-medium text-green-800">
            Published
          </span>
        </div>
        <div className="flex items-center gap-2 mb-3">
          <div className="flex-1 bg-white border border-green-200 rounded px-3 py-1.5 text-xs font-mono text-green-800 truncate">
            {publicUrl}
          </div>
          <Button variant="outline" size="sm" className="shrink-0" onClick={copyUrl}>
            {copied ? (
              <Check className="h-3.5 w-3.5 text-green-600" />
            ) : (
              <Copy className="h-3.5 w-3.5" />
            )}
          </Button>
          <a href={publicUrl} target="_blank" rel="noopener noreferrer">
            <Button variant="outline" size="sm" className="shrink-0">
              <ExternalLink className="h-3.5 w-3.5" />
            </Button>
          </a>
        </div>
        <p className="text-[11px] text-muted-foreground mb-3">
          Changes auto-save and update your live page.
        </p>
        <Button
          variant="ghost"
          size="sm"
          className="text-red-600 hover:text-red-700 hover:bg-red-50"
          onClick={handleUnpublish}
          disabled={loading}
        >
          {loading ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />
          ) : (
            <EyeOff className="h-3.5 w-3.5 mr-1.5" />
          )}
          Unpublish
        </Button>
      </div>
    );
  }

  return (
    <div className="border border-border rounded-lg p-4 bg-muted/30">
      <div className="flex items-center gap-2 mb-2">
        <Globe className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium">Publish Online</span>
      </div>
      <p className="text-xs text-muted-foreground mb-3">
        Get a shareable link. Put it on LinkedIn, email signatures, or business
        cards.
      </p>

      <div className="mb-3">
        <label className="text-xs font-medium text-muted-foreground mb-1 block">
          Choose your URL
        </label>
        <div className="flex items-center gap-0">
          {rootDomain ? (
            <>
              <Input
                value={slug}
                onChange={(e) => handleSlugChange(e.target.value)}
                placeholder="jake-ryan"
                className="rounded-r-none text-sm"
              />
              <span className="text-xs text-muted-foreground bg-muted border border-l-0 border-border rounded-r px-2 py-[7px] shrink-0">
                .{rootDomain}
              </span>
            </>
          ) : (
            <>
              <span className="text-xs text-muted-foreground bg-muted border border-r-0 border-border rounded-l px-2 py-[7px] shrink-0">
                {origin.replace(/^https?:\/\//, "")}/r/
              </span>
              <Input
                value={slug}
                onChange={(e) => handleSlugChange(e.target.value)}
                placeholder="jake-ryan"
                className="rounded-l-none text-sm"
              />
            </>
          )}
        </div>
        {slugStatus === "checking" && (
          <p className="text-[11px] text-muted-foreground mt-1 flex items-center gap-1">
            <Loader2 className="h-3 w-3 animate-spin" /> Checking...
          </p>
        )}
        {slugStatus === "available" && (
          <p className="text-[11px] text-green-600 mt-1 flex items-center gap-1">
            <Check className="h-3 w-3" /> Available
          </p>
        )}
        {slugStatus === "taken" && (
          <p className="text-[11px] text-red-600 mt-1">Already taken</p>
        )}
      </div>

      {error && (
        <p className="text-xs text-red-600 mb-2">{error}</p>
      )}

      <Button
        size="sm"
        className="w-full"
        onClick={handlePublish}
        disabled={loading || slug.length < 2 || slugStatus === "taken"}
      >
        {loading ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />
        ) : (
          <Globe className="h-3.5 w-3.5 mr-1.5" />
        )}
        Publish Resume
      </Button>
    </div>
  );
}
