function normalizeHostname(hostname: string) {
  return hostname
    .trim()
    .toLowerCase()
    .replace(/\.$/, "")
    .replace(/:\d+$/, "");
}

export function getHostedResumeSlugFromHost(
  hostname: string,
  rootDomain?: string
) {
  if (!rootDomain) return null;

  const host = normalizeHostname(hostname);
  const root = normalizeHostname(rootDomain);
  const suffix = `.${root}`;

  if (
    !host ||
    host === root ||
    host === `www.${root}` ||
    host === "localhost" ||
    host.endsWith(".localhost") ||
    host.endsWith(".vercel.app") ||
    !host.endsWith(suffix)
  ) {
    return null;
  }

  const subdomain = host.slice(0, -suffix.length);
  if (!subdomain || subdomain.includes(".")) return null;

  return subdomain;
}
