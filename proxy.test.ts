import { beforeEach, describe, expect, it, vi } from "vitest";
import type { NextRequest, NextResponse } from "next/server";
import { proxy, config } from "./proxy";

vi.mock("next/server", () => {
  return {
    NextResponse: {
      redirect: (url: URL | string) => {
        const u =
          typeof url === "string" ? new URL(url, "http://localhost") : url;
        return new Response(null, {
          status: 307,
          headers: { location: u.toString() },
        });
      },
      next: () => new Response(null, { status: 200 }),
    },
  };
});

type CookieJar = Map<string, { value: string }>;

interface FakeNextUrl {
  pathname: string;
  search: string;
  searchParams: URLSearchParams;
  clone: () => FakeNextUrl;
}

interface FakeRequest {
  cookies: {
    get: (name: string) => { value: string } | undefined;
  };
  nextUrl: FakeNextUrl;
}

function makeRequest(
  pathname: string,
  cookies: Record<string, string> = {},
): FakeRequest {
  const jar: CookieJar = new Map(
    Object.entries(cookies).map(([k, v]) => [k, { value: v }]),
  );
  const realUrl = new URL(pathname, "http://localhost");
  (realUrl as URL & { clone: () => URL }).clone = function () {
    return new URL(this.toString());
  };

  return {
    cookies: {
      get: (name: string) => jar.get(name),
    },
    nextUrl: realUrl as unknown as FakeNextUrl,
  };
}

function isRedirect(res: Response | undefined): boolean {
  return (
    !!res &&
    res.status >= 300 &&
    res.status < 400 &&
    !!res.headers.get("location")
  );
}

function getLocationPath(res: Response): { pathname: string; search: string } {
  const loc = res.headers.get("location") ?? "";
  const u = new URL(loc, "http://localhost");
  return { pathname: u.pathname, search: u.search };
}

beforeEach(() => {
  delete process.env.NEXT_PUBLIC_AUTH_TOKEN;
});

describe("proxy — protected routes (/profile)", () => {
  it("redirects to /signin with ?next=… when no auth cookie is set", () => {
    const req = makeRequest("/profile", {});
    const res = proxy(req as unknown as NextRequest) as NextResponse;

    expect(isRedirect(res)).toBe(true);
    const { pathname, search } = getLocationPath(res);
    expect(pathname).toBe("/signin");
    expect(search).toBe("?next=%2Fprofile");
  });

  it("redirects nested protected routes with the correct ?next", () => {
    const req = makeRequest("/profile/edit", {});
    const res = proxy(req as unknown as NextRequest) as NextResponse;
    const { search } = getLocationPath(res);
    expect(search).toBe("?next=%2Fprofile%2Fedit");
  });

  it("allows the request through when the auth cookie is set", () => {
    const req = makeRequest("/profile", { flick_auth_token: "abc" });
    const res = proxy(req as unknown as NextRequest) as NextResponse;
    expect(res?.status).not.toBeGreaterThanOrEqual(300);
  });
});

describe("proxy — protected routes (/checkout)", () => {
  it("redirects to /signin with ?next=… when no auth cookie is set", () => {
    const req = makeRequest("/checkout", {});
    const res = proxy(req as unknown as NextRequest) as NextResponse;

    expect(isRedirect(res)).toBe(true);
    const { pathname, search } = getLocationPath(res);
    expect(pathname).toBe("/signin");
    expect(search).toBe("?next=%2Fcheckout");
  });

  it("preserves existing query params when redirecting to /signin", () => {
    const req = makeRequest("/checkout?priceId=price_123", {});
    const res = proxy(req as unknown as NextRequest) as NextResponse;
    const { search } = getLocationPath(res);
    expect(search).toContain("next=%2Fcheckout");
    expect(search).toContain("priceId=price_123");
  });

  it("allows the request through when the auth cookie is set", () => {
    const req = makeRequest("/checkout", { flick_auth_token: "abc" });
    const res = proxy(req as unknown as NextRequest) as NextResponse;
    expect(res?.status).not.toBeGreaterThanOrEqual(300);
  });

  it("redirects /checkout/success when no auth cookie", () => {
    const req = makeRequest("/checkout/success", {});
    const res = proxy(req as unknown as NextRequest) as NextResponse;
    expect(isRedirect(res)).toBe(true);
  });

  it("allows /checkout/success through with auth cookie", () => {
    const req = makeRequest("/checkout/success", { flick_auth_token: "abc" });
    const res = proxy(req as unknown as NextRequest) as NextResponse;
    expect(res?.status).not.toBeGreaterThanOrEqual(300);
  });
});

describe("proxy — public auth routes", () => {
  it.each(["/signin", "/signup", "/forget-password", "/verify-email"])(
    "redirects to / when an auth cookie is set (%s)",
    (path) => {
      const req = makeRequest(path, { flick_auth_token: "abc" });
      const res = proxy(req as unknown as NextRequest) as NextResponse;

      expect(isRedirect(res)).toBe(true);
      const { pathname, search } = getLocationPath(res);
      expect(pathname).toBe("/");
      expect(search).toBe("");
    },
  );

  it("allows /signin through when there is no auth cookie", () => {
    const req = makeRequest("/signin", {});
    const res = proxy(req as unknown as NextRequest) as NextResponse;
    expect(res?.status).not.toBeGreaterThanOrEqual(300);
  });
});

describe("proxy — protected routes (/userpanal)", () => {
  it("redirects to /signin with ?next=… when no auth cookie is set", () => {
    const req = makeRequest("/userpanal", {});
    const res = proxy(req as unknown as NextRequest) as NextResponse;

    expect(isRedirect(res)).toBe(true);
    const { pathname, search } = getLocationPath(res);
    expect(pathname).toBe("/signin");
    expect(search).toBe("?next=%2Fuserpanal");
  });

  it("redirects nested userpanal routes with the correct ?next", () => {
    const req = makeRequest("/userpanal/watched", {});
    const res = proxy(req as unknown as NextRequest) as NextResponse;
    const { search } = getLocationPath(res);
    expect(search).toBe("?next=%2Fuserpanal%2Fwatched");
  });

  it("allows the request through when the auth cookie is set", () => {
    const req = makeRequest("/userpanal", { flick_auth_token: "abc" });
    const res = proxy(req as unknown as NextRequest) as NextResponse;
    expect(res?.status).not.toBeGreaterThanOrEqual(300);
  });
});

describe("proxy — unprotected routes", () => {
  it("lets an unauthenticated user through on /", () => {
    const req = makeRequest("/", {});
    const res = proxy(req as unknown as NextRequest) as NextResponse;
    expect(res?.status).not.toBeGreaterThanOrEqual(300);
  });

  it("lets an authenticated user through on /", () => {
    const req = makeRequest("/", { flick_auth_token: "abc" });
    const res = proxy(req as unknown as NextRequest) as NextResponse;
    expect(res?.status).not.toBeGreaterThanOrEqual(300);
  });

  it("does not treat a path that merely starts with 'profile' (e.g. /profiles) as protected", () => {
    const req = makeRequest("/profiles", {});
    const res = proxy(req as unknown as NextRequest) as NextResponse;
    expect(res?.status).not.toBeGreaterThanOrEqual(300);
  });
});

describe("proxy — cookie name resolution", () => {
  it("uses NEXT_PUBLIC_AUTH_TOKEN when provided", async () => {
    vi.resetModules();
    process.env.NEXT_PUBLIC_AUTH_TOKEN = "custom_cookie";
    const { proxy: proxyCustom } = await import("./proxy");
    const req = makeRequest("/profile", { custom_cookie: "abc" });
    const res = proxyCustom(req as unknown as NextRequest) as Response;
    expect(res?.status).not.toBeGreaterThanOrEqual(300);
    delete process.env.NEXT_PUBLIC_AUTH_TOKEN;
    vi.resetModules();
  });

  it("falls back to 'flick_auth_token' from the literal default", async () => {
    vi.resetModules();
    delete process.env.NEXT_PUBLIC_AUTH_TOKEN;
    const { proxy: proxyDefault } = await import("./proxy");
    const req = makeRequest("/profile", { flick_auth_token: "abc" });
    const res = proxyDefault(req as unknown as NextRequest) as Response;
    expect(res?.status).not.toBeGreaterThanOrEqual(300);

    const reqNoCookie = makeRequest("/profile", {});
    const resNoCookie = proxyDefault(
      reqNoCookie as unknown as NextRequest,
    ) as Response;
    expect(resNoCookie?.status).toBeGreaterThanOrEqual(300);
    vi.resetModules();
  });

  it("falls back to 'flick_auth_token' (in-session env)", () => {
    const req = makeRequest("/profile", { flick_auth_token: "abc" });
    const res = proxy(req as unknown as NextRequest) as Response;
    expect(res?.status).not.toBeGreaterThanOrEqual(300);
  });
});

describe("proxy — config matcher", () => {
  it("exports a matcher covering protected and public-auth routes", () => {
    expect(config).toBeDefined();
    expect(config.matcher).toEqual([
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
    ]);
  });
});
