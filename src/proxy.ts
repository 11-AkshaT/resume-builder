import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { assertProductionEnv, env } from "./lib/env";
import { getHostedResumeSlugFromHost } from "./lib/subdomains";

const isProtectedRoute = createRouteMatcher(["/app(.*)"]);

assertProductionEnv();

export default clerkMiddleware(async (auth, request) => {
  const hostname = request.headers.get("host") ?? "";
  const { pathname } = request.nextUrl;
  const hostedResumeSlug = getHostedResumeSlugFromHost(hostname, env.rootDomain);

  if (hostedResumeSlug) {
    const url = request.nextUrl.clone();
    url.pathname = `/r/${hostedResumeSlug}${pathname === "/" ? "" : pathname}`;
    return NextResponse.rewrite(url);
  }

  if (isProtectedRoute(request)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
