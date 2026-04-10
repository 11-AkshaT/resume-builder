import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const ROOT_DOMAIN = process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? "";

const isProtectedRoute = createRouteMatcher(["/app(.*)"]);

export default clerkMiddleware(async (auth, request) => {
  const hostname = request.headers.get("host") ?? "";
  const { pathname } = request.nextUrl;

  if (
    ROOT_DOMAIN &&
    hostname !== ROOT_DOMAIN &&
    hostname !== `www.${ROOT_DOMAIN}`
  ) {
    const subdomain = hostname.replace(`.${ROOT_DOMAIN}`, "").split(".")[0];

    if (subdomain && subdomain !== "www" && !hostname.startsWith("localhost")) {
      const url = request.nextUrl.clone();
      url.pathname = `/r/${subdomain}${pathname === "/" ? "" : pathname}`;
      return NextResponse.rewrite(url);
    }
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
