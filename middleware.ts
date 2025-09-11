// middleware.ts
import { NextResponse } from "next/server";
import { auth } from "./auth";

const PROTECTED_PAGES = ["/r", "/creator"];
const ONBOARDING_PREFIX = "/onboarding";

export default auth((req) => {
  const { pathname, origin, search } = req.nextUrl;
  const isAuthenticated = !!req.auth;
  const isCreator = req.auth?.user?.cProfile;
  const isReader = req.auth?.user?.rProfile;
  const isAuthPage = pathname === "/signin";
  const isOnboardingPage = pathname.startsWith(ONBOARDING_PREFIX);
  const isSelectRolePage = pathname === "/role";
  const hasCompletedOnboarding = isCreator || isReader;
  const isDualUser = isCreator && isReader;

  if (!isAuthenticated) {
    if (
      PROTECTED_PAGES.some((p) => pathname.startsWith(p)) ||
      isOnboardingPage
    ) {
      const redirectUrl = new URL("/signin", origin);
      redirectUrl.searchParams.set("callbackUrl", `${pathname}${search}`);
      return NextResponse.redirect(redirectUrl);
    }
    return NextResponse.next();
  }

  if (!hasCompletedOnboarding && !isOnboardingPage) {
    return NextResponse.redirect(new URL(ONBOARDING_PREFIX, origin));
  }

  if (hasCompletedOnboarding && (isAuthPage || isOnboardingPage)) {
    if (isDualUser) {
      return NextResponse.redirect(new URL("/role", origin));
    }
    if (isCreator) {
      return NextResponse.redirect(new URL("/creator/comics", origin));
    }
    if (isReader) {
      return NextResponse.redirect(new URL("/r/comics", origin));
    }
  }

  if (!isDualUser && isSelectRolePage) {
    if (isCreator) {
      return NextResponse.redirect(new URL("/creator/comics", origin));
    }
    if (isReader) {
      return NextResponse.redirect(new URL("/r/comics", origin));
    }
    return NextResponse.redirect(new URL(ONBOARDING_PREFIX, origin));
  }

  if (pathname.startsWith("/creator") && !isCreator) {
    return NextResponse.redirect(new URL("/r/comics", origin));
  }
  if (pathname.startsWith("/r") && !isReader) {
    return NextResponse.redirect(new URL("/creator/comics", origin));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon\\.ico|assets|images|fonts|css|public|logo\\.svg).*)",
  ],
};
