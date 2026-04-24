"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Globe,
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
import { trackEvent } from "@/lib/analytics";

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
  const slugCheckTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const rootDomain =
    process.env.NEXT_PUBLIC_ROOT_DOMAIN ??
    (() => {
      const appUrl = process.env.NEXT_PUBLIC_APP_URL;
      if (!appUrl) return undefined;

      try {
        return new URL(appUrl).hostname;
      } catch {
        return undefined;
      }
    })();
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

  useEffect(() => {
    return () => {
      if (slugCheckTimeout.current) clearTimeout(slugCheckTimeout.current);
    };
  }, []);

  const handleSlugChange = (value: string) => {
    const cleaned = value
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, "")
      .slice(0, 40);
    setSlug(cleaned);
    setError(null);

    if (slugCheckTimeout.current) clearTimeout(slugCheckTimeout.current);

    if (cleaned.length >= 2) {
      setSlugStatus("checking");
      slugCheckTimeout.current = setTimeout(() => checkSlug(cleaned), 400);
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
        trackEvent("resume_published", {
          publishMode: hasLifetime ? "lifetime" : "blocked",
        });
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
    void navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!hasLifetime) {
    return (
      <div className="rounded-[1.7rem] border border-[#ddd0bc] bg-[linear-gradient(180deg,rgba(255,252,245,0.96)_0%,rgba(243,234,220,0.94)_100%)] p-5 shadow-[0_20px_46px_-34px_rgba(20,32,27,0.26)]">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="warning">Hosted resume page</Badge>
          <span className="inline-flex items-center gap-1 rounded-full border border-[#e7d8be] bg-white/80 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8a5a11]">
            <Crown className="h-3 w-3" />
            Lifetime
          </span>
        </div>
        <h3 className="mt-4 text-xl font-semibold tracking-[-0.03em] text-foreground">
          Turn the resume into yourname.resumeonce.co
        </h3>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Publish this resume to a clean subdomain for LinkedIn, email signatures,
          or direct outreach when you upgrade to the lifetime plan.
        </p>
        <div className="mt-4 rounded-[1.2rem] border border-[#e1d5c5] bg-white/70 p-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
            Includes with lifetime
          </p>
          <ul className="mt-3 space-y-2 text-sm text-foreground">
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-primary" />
              Custom resumeonce.co subdomain for every published resume
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-primary" />
              Updates stay synced with your editor changes
            </li>
          </ul>
        </div>
        <Button variant="outline" size="md" className="mt-4 w-full" onClick={onRequestUpgrade}>
          <Crown className="h-3.5 w-3.5" />
          Upgrade to lifetime
        </Button>
      </div>
    );
  }

  if (isPublished) {
    return (
      <div className="rounded-[1.7rem] border border-[#cfe0d4] bg-[linear-gradient(180deg,rgba(244,250,246,0.98)_0%,rgba(233,243,237,0.95)_100%)] p-5 shadow-[0_20px_46px_-34px_rgba(33,81,70,0.24)]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-foreground">Published</span>
          </div>
          <Badge variant="success">Live now</Badge>
        </div>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          Share this link anywhere. New edits keep flowing to the hosted page.
        </p>
        <div className="mt-4 flex items-center gap-1.5">
          <div className="flex-1 truncate rounded-xl border border-[#c9ddd1] bg-card/90 px-3 py-2 text-xs font-mono text-foreground">
            {publicUrl}
          </div>
          <Button variant="outline" size="sm" className="shrink-0 h-8 w-8 p-0" onClick={copyUrl} aria-label="Copy published resume URL">
            {copied ? (
              <Check className="h-3.5 w-3.5 text-teal-600" />
            ) : (
              <Copy className="h-3.5 w-3.5" />
            )}
          </Button>
          <a href={publicUrl} target="_blank" rel="noopener noreferrer">
            <Button variant="outline" size="sm" className="shrink-0 h-8 w-8 p-0" aria-label="Open published resume in a new tab">
              <ExternalLink className="h-3.5 w-3.5" />
            </Button>
          </a>
        </div>
        <p className="mt-3 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
          Changes auto-save and update your live page.
        </p>
        <Button
          variant="ghost"
          size="sm"
          aria-label="Unpublish resume"
          className="mt-3 text-red-600 hover:bg-red-50 hover:text-red-700"
          onClick={handleUnpublish}
          disabled={loading}
        >
          {loading ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <EyeOff className="h-3.5 w-3.5" />
          )}
          Unpublish
        </Button>
      </div>
    );
  }

  return (
    <div className="rounded-[1.7rem] border border-border/90 bg-card/80 p-5 shadow-[0_18px_42px_-34px_rgba(20,32,27,0.22)]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Globe className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium text-foreground">Publish online</span>
        </div>
        <Badge variant="success">Lifetime active</Badge>
      </div>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        Claim a clean resumeonce.co subdomain and keep it updated from the same editor.
      </p>

      <div className="mt-4 mb-4 rounded-[1.25rem] border border-border/80 bg-[#fcf7ef] p-4">
        <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
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
              <span className="shrink-0 rounded-r-xl border border-l-0 border-border bg-muted px-2.5 py-[9px] text-xs text-muted-foreground">
                .{rootDomain}
              </span>
            </>
          ) : (
            <>
              <span className="shrink-0 rounded-l-xl border border-r-0 border-border bg-muted px-2.5 py-[9px] text-xs text-muted-foreground">
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
          <p className="mt-1.5 flex items-center gap-1 text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
            <Loader2 className="h-3 w-3 animate-spin" /> Checking...
          </p>
        )}
        {slugStatus === "available" && (
          <p className="mt-1.5 flex items-center gap-1 text-[11px] uppercase tracking-[0.14em] text-primary">
            <Check className="h-3 w-3" /> Available
          </p>
        )}
        {slugStatus === "taken" && (
          <p className="mt-1.5 text-[11px] uppercase tracking-[0.14em] text-red-600">
            Already taken
          </p>
        )}
        {slugStatus === "invalid" && (
          <p className="mt-1.5 text-[11px] uppercase tracking-[0.14em] text-red-600">
            Use lowercase letters, numbers, and hyphens only
          </p>
        )}
      </div>

      {error && (
        <p className="mb-2 text-xs text-red-600">{error}</p>
      )}

      <Button
        size="md"
        className="w-full"
        aria-label="Publish resume online"
        onClick={handlePublish}
        disabled={loading || slug.length < 2 || slugStatus === "taken"}
      >
        {loading ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : (
          <Globe className="h-3.5 w-3.5" />
        )}
        Publish Resume
      </Button>
    </div>
  );
}
