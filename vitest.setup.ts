import { vi, beforeEach, afterEach } from "vitest";

Object.assign(process.env, { NODE_ENV: "test" });
process.env.NEXT_PUBLIC_BACKEND_URL ??= "http://localhost:3000";
process.env.NEXT_PUBLIC_AUTH_TOKEN ??= "flick_auth_token";

beforeEach(() => {
  vi.restoreAllMocks();
});

afterEach(() => {
  vi.unstubAllEnvs();
});
