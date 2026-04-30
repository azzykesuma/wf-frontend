import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SESSION_COOKIE = "session";
const AUTH_PATH = "/auth";
const ROOT_PATH = "/";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAuthenticated = request.cookies.has(SESSION_COOKIE);
  const isAuthRoute = pathname === AUTH_PATH || pathname.startsWith(`${AUTH_PATH}/`);

  if (!isAuthenticated && !isAuthRoute) {
    return NextResponse.redirect(new URL(AUTH_PATH, request.url));
  }

  if (isAuthenticated && isAuthRoute) {
    return NextResponse.redirect(new URL(ROOT_PATH, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)"],
};
