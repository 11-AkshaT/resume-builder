import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ROOT_DOMAIN = process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? "";

export default function middleware(req: NextRequest) {
  const hostname = req.headers.get("host") ?? "";
  const { pathname } = req.nextUrl;

  // Subdomain rewrite: jake.resumetek.com → /r/jake
  if (ROOT_DOMAIN && hostname !== ROOT_DOMAIN && hostname !== `www.${ROOT_DOMAIN}`) {
    const subdomain = hostname.replace(`.${ROOT_DOMAIN}`, "").split(".")[0];

    if (subdomain && subdomain !== "www" && !hostname.startsWith("localhost")) {
      const url = req.nextUrl.clone();
      url.pathname = `/r/${subdomain}${pathname === "/" ? "" : pathname}`;
      return NextResponse.rewrite(url);
    }
  }

  if (process.env.DEV_BYPASS_AUTH === "true") {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
