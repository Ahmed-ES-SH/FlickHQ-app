import { NextResponse, type NextRequest } from "next/server";

const AUTH_COOKIE =
  process.env.NEXT_PUBLIC_AUTH_TOKEN ?? "flick_auth_token";

const PROTECTED_PREFIXES = ["/profile", "/checkout", "/userpanal"];
const PUBLIC_AUTH_ROUTES = [
  "/signin",
  "/signup",
  "/forget-password",
  "/reset-password",
  "/verify-email",
];

export function proxy(req: NextRequest) {
  const hasAuthCookie = !!req.cookies.get(AUTH_COOKIE);
  const { pathname } = req.nextUrl;

  const isProtected = PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
  const isPublicAuth = PUBLIC_AUTH_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );

  if (isProtected && !hasAuthCookie) {
    const url = req.nextUrl.clone();
    url.pathname = "/signin";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  if (isPublicAuth && hasAuthCookie) {
    const url = req.nextUrl.clone();
    url.pathname = "/";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/profile/:path*",
    "/checkout",
    "/checkout/success",
    "/userpanal",
    "/userpanal/:path*",
    "/signin",
    "/signup",
    "/forget-password",
    "/reset-password",
    "/verify-email",
  ],
};
