export const SLUG_REGEX = /^[a-z0-9](?:[a-z0-9-]{0,38}[a-z0-9])?$/;
export const RESERVED_SLUGS = new Set([
  "admin",
  "api",
  "app",
  "billing",
  "blog",
  "dashboard",
  "docs",
  "help",
  "mail",
  "pricing",
  "sign-in",
  "sign-up",
  "status",
  "support",
  "www",
]);

export function normalizeResumeSlug(slug: string) {
  return slug.toLowerCase().trim();
}

export function isValidResumeSlug(slug: string) {
  const normalized = normalizeResumeSlug(slug);
  return SLUG_REGEX.test(normalized) && !RESERVED_SLUGS.has(normalized);
}

export function getResumeSlugValidationError(slug: string) {
  const normalized = normalizeResumeSlug(slug);
  if (!SLUG_REGEX.test(normalized)) {
    return "Slug must be 2-40 characters, lowercase letters, numbers, and hyphens only";
  }

  if (RESERVED_SLUGS.has(normalized)) {
    return "This URL is reserved. Try a different one.";
  }

  return null;
}
