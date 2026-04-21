const SAFE_PROTOCOLS = new Set(["http:", "https:", "mailto:"]);
const UNSAFE_CHARACTERS = /[\u0000-\u001F\u007F\s]/;

export function getSafeUrl(value: string | null | undefined) {
  const trimmed = value?.trim();
  if (!trimmed || UNSAFE_CHARACTERS.test(trimmed)) return null;

  try {
    const url = new URL(trimmed);
    if (!SAFE_PROTOCOLS.has(url.protocol.toLowerCase())) return null;

    if (url.protocol.toLowerCase() === "mailto:" && !url.pathname) {
      return null;
    }

    return trimmed;
  } catch {
    return null;
  }
}

export function getSafeMailto(email: string | null | undefined) {
  return getSafeUrl(email ? `mailto:${email}` : null);
}
