import { beforeEach, describe, expect, it, vi } from "vitest";

const cookiesStore = {
  store: new Map<string, { value: string }>(),
  get: vi.fn(),
  set: vi.fn(),
  delete: vi.fn(),
};

vi.mock("next/headers", () => ({
  cookies: vi.fn(() => Promise.resolve(cookiesStore)),
}));

import {
  getAuthCookie,
  getServerAuthCookieHeader,
  setAuthCookie,
  deleteAuthCookie,
} from "@/app/_helpers/session";

beforeEach(() => {
  cookiesStore.store.clear();
  cookiesStore.get.mockReset();
  cookiesStore.set.mockReset();
  cookiesStore.delete.mockReset();
});

describe("getAuthCookie", () => {
  it("returns the value when the auth cookie exists", async () => {
    cookiesStore.store.set("flick_auth_token", { value: "abc123" });
    cookiesStore.get.mockImplementation((name: string) =>
      cookiesStore.store.get(name),
    );

    const token = await getAuthCookie();
    expect(token).toBe("abc123");
    expect(cookiesStore.get).toHaveBeenCalledWith("flick_auth_token");
  });

  it("returns undefined when the cookie is missing", async () => {
    cookiesStore.get.mockImplementation((name: string) =>
      cookiesStore.store.get(name),
    );

    const token = await getAuthCookie();
    expect(token).toBeUndefined();
  });
});

describe("getServerAuthCookieHeader", () => {
  it("returns null when no cookie is set", async () => {
    cookiesStore.get.mockImplementation((name: string) =>
      cookiesStore.store.get(name),
    );

    const header = await getServerAuthCookieHeader();
    expect(header).toBeNull();
  });

  it("builds a 'name=encoded' header when a cookie exists", async () => {
    cookiesStore.store.set("flick_auth_token", { value: "a+b=c d" });
    cookiesStore.get.mockImplementation((name: string) =>
      cookiesStore.store.get(name),
    );

    const header = await getServerAuthCookieHeader();
    expect(header).toBe("flick_auth_token=a%2Bb%3Dc%20d");
  });
});

describe("setAuthCookie", () => {
  it("writes the cookie with the correct security options in non-production", async () => {
    Object.assign(process.env, { NODE_ENV: "test" });

    await setAuthCookie("new-token");

    expect(cookiesStore.set).toHaveBeenCalledTimes(1);
    const [name, value, options] = cookiesStore.set.mock.calls[0];
    expect(name).toBe("flick_auth_token");
    expect(value).toBe("new-token");
    expect(options).toMatchObject({
      httpOnly: true,
      sameSite: "lax",
      secure: false,
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
  });

  it("uses sameSite='none' and secure=true in production", async () => {
    vi.resetModules();
    Object.assign(process.env, { NODE_ENV: "production" });
    const { setAuthCookie: setAuthCookieProd } =
      await import("@/app/_helpers/session");
    await setAuthCookieProd("prod-token");
    const [, , options] = cookiesStore.set.mock.calls[0];
    expect(options).toMatchObject({ sameSite: "none", secure: true });
    Object.assign(process.env, { NODE_ENV: "test" });
    vi.resetModules();
  });
});

describe("deleteAuthCookie", () => {
  it("calls cookies().delete with the correct name", async () => {
    await deleteAuthCookie();
    expect(cookiesStore.delete).toHaveBeenCalledWith("flick_auth_token");
  });
});

describe("cookie name resolution", () => {
  it("uses the env var name when NEXT_PUBLIC_AUTH_TOKEN is set", async () => {
    vi.resetModules();
    process.env.NEXT_PUBLIC_AUTH_TOKEN = "custom_auth";
    cookiesStore.store.set("custom_auth", { value: "tok" });
    cookiesStore.get.mockImplementation((name: string) =>
      cookiesStore.store.get(name),
    );
    const { getAuthCookie: getAuthCookieCustom } =
      await import("@/app/_helpers/session");
    const token = await getAuthCookieCustom();
    expect(token).toBe("tok");
    expect(cookiesStore.get).toHaveBeenCalledWith("custom_auth");

    delete process.env.NEXT_PUBLIC_AUTH_TOKEN;
    vi.resetModules();
  });

  it("falls back to 'flick_auth_token' when the env var is unset", async () => {
    delete process.env.NEXT_PUBLIC_AUTH_TOKEN;
    vi.resetModules();
    cookiesStore.store.set("flick_auth_token", { value: "fallback" });
    cookiesStore.get.mockImplementation((name: string) =>
      cookiesStore.store.get(name),
    );
    const { getAuthCookie: getAuthCookieDefault } =
      await import("@/app/_helpers/session");
    const token = await getAuthCookieDefault();
    expect(token).toBe("fallback");
  });
});
