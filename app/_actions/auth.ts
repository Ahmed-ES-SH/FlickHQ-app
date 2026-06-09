"use server";

import { globalRequest } from "@/app/_helpers/globalRequest";
import {
  setAuthCookie,
  deleteAuthCookie,
  getServerAuthCookieHeader,
} from "@/app/_helpers/session";
import { API_ENDPOINTS } from "@/app/constants/apis";
import type { User, CurrentUserResponse } from "@/app/types/auth";

export interface AuthActionResult<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  statusCode?: number;
  errors?: Record<string, string[]>;
  field?: "email" | "password" | "general";
}

function buildAuthEndpoint(
  path: string,
  query?: Record<string, string | number | undefined>,
): string {
  if (!query) return path;
  const params = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== null && `${value}` !== "") {
      params.append(key, String(value));
    }
  });
  const qs = params.toString();
  return qs ? `${path}?${qs}` : path;
}

function normalizeErrorMessage(
  message: unknown,
  defaultError: string,
): string {
  if (Array.isArray(message)) return message.join(", ");
  if (typeof message === "string") return message;
  return defaultError;
}

function inferField(
  statusCode: number | undefined,
  message: string,
): "email" | "password" | "general" {
  if (!statusCode) return "general";
  if (statusCode === 403) return "email";
  if (statusCode === 429) return "general";
  if (statusCode === 400 && /email/i.test(message)) return "email";
  if (statusCode === 400 && /password/i.test(message)) return "password";
  return "general";
}

export async function loginAction(credentials: {
  email: string;
  password: string;
}): Promise<AuthActionResult<{ user: User }>> {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  if (!backendUrl) {
    return { success: false, message: "Backend URL not configured", field: "general" };
  }

  let res: Response;
  try {
    res = await fetch(`${backendUrl}${API_ENDPOINTS.AUTH.login}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });
  } catch (error) {
    return { success: false, message: "Network error. Please try again.", field: "general" };
  }

  const json = await res.json().catch(() => ({}));

  if (!res.ok) {
    return {
      success: false,
      message: json.message || "Login failed",
      statusCode: res.status,
      errors: json.errors,
      field: inferField(res.status, json.message || ""),
    };
  }

  // Extract JWT from Set-Cookie header (set by backend)
  const setCookieHeader = res.headers.get("set-cookie");
  if (setCookieHeader) {
    const cookieName = process.env.NEXT_PUBLIC_AUTH_TOKEN ?? "flick_auth_token";
    const match = setCookieHeader.match(new RegExp(`${cookieName}=([^;]+)`));
    if (match) {
      await setAuthCookie(decodeURIComponent(match[1]));
    }
  }

  // New backend wraps in { data: { user } }
  const user = json?.data?.user;
  if (!user) {
    return { success: false, message: "Invalid response from server", field: "general" };
  }

  return {
    success: true,
    message: json.message || "Logged in successfully",
    data: { user },
    statusCode: res.status,
  };
}

export async function registerAction(payload: {
  email: string;
  password: string;
  name?: string;
  avatar?: string;
}): Promise<AuthActionResult> {
  const res = await globalRequest({
    endpoint: API_ENDPOINTS.AUTH.register,
    method: "POST",
    body: payload,
    defaultErrorMessage: "Registration failed",
  });

  return {
    success: res.success,
    message: normalizeErrorMessage(res.message, "Registration failed"),
    statusCode: res.statusCode,
    errors: res.errors,
    field: inferField(res.statusCode, res.message),
  };
}

export async function logoutAction(): Promise<AuthActionResult> {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  if (!backendUrl) {
    // Still clear the cookie locally even without backend URL
    await deleteAuthCookie();
    return { success: true, message: "Signed out successfully" };
  }

  const authCookieHeader = await getServerAuthCookieHeader();

  try {
    await fetch(`${backendUrl}${API_ENDPOINTS.AUTH.logout}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(authCookieHeader ? { Cookie: authCookieHeader } : {}),
      },
    });
  } catch {
    // best-effort: still clear the cookie locally
  }

  await deleteAuthCookie();

  return {
    success: true,
    message: "Signed out successfully",
  };
}

export async function verifyEmailAction(
  token: string,
): Promise<AuthActionResult> {
  // Pass undefined query when token is empty to exercise the buildAuthEndpoint guard
  const endpoint = buildAuthEndpoint(
    API_ENDPOINTS.AUTH.verifyEmail,
    token ? { token } : undefined,
  );

  const res = await globalRequest({
    endpoint,
    method: "POST",
    defaultErrorMessage: "Verification failed",
  });

  return {
    success: res.success,
    message: normalizeErrorMessage(res.message, "Verification failed"),
    statusCode: res.statusCode,
    errors: res.errors,
    field: inferField(res.statusCode, res.message),
  };
}

export async function sendResetPasswordAction(
  email: string,
): Promise<AuthActionResult> {
  const res = await globalRequest({
    endpoint: API_ENDPOINTS.AUTH.sendResetPassword,
    method: "POST",
    body: { email },
    defaultErrorMessage:
      "If an account exists with this email, a reset link has been sent.",
  });

  // With unwrapData, res.data = { message: "..." } or undefined
  const backendMessage =
    res.success && res.data && typeof (res.data as { message?: string }).message === "string"
      ? (res.data as { message: string }).message
      : null;

  return {
    success: res.success,
    message:
      res.success && backendMessage
        ? backendMessage
        : "If an account exists with this email, a reset link has been sent.",
    statusCode: res.statusCode,
    errors: res.errors,
  };
}

export async function verifyResetTokenAction(payload: {
  token: string;
  email: string;
}): Promise<AuthActionResult<{ userId: number }>> {
  const res = await globalRequest({
    endpoint: API_ENDPOINTS.AUTH.verifyResetToken,
    method: "POST",
    body: payload,
    // Public endpoint — do not forward auth cookie
    authenticated: false,
    defaultErrorMessage: "Invalid or expired reset link",
  });

  if (!res.success || !res.data) {
    return {
      success: false,
      message: normalizeErrorMessage(res.message, "Invalid or expired reset link"),
      statusCode: res.statusCode,
      errors: res.errors,
    };
  }

  // With unwrapData, res.data = { userId: number }
  return {
    success: true,
    message: res.message,
    data: res.data as { userId: number },
    statusCode: res.statusCode,
  };
}

export async function resetPasswordAction(payload: {
  email: string;
  token: string;
  password: string;
}): Promise<AuthActionResult> {
  const res = await globalRequest({
    endpoint: API_ENDPOINTS.AUTH.resetPassword,
    method: "POST",
    body: payload,
    // Public endpoint — do not forward auth cookie
    authenticated: false,
    defaultErrorMessage: "Password reset failed",
  });

  return {
    success: res.success,
    message: normalizeErrorMessage(res.message, "Password reset failed"),
    statusCode: res.statusCode,
    errors: res.errors,
    field: inferField(res.statusCode, res.message),
  };
}

export async function fetchCurrentUserAction(): Promise<
  AuthActionResult<CurrentUserResponse>
> {
  const res = await globalRequest({
    endpoint: API_ENDPOINTS.AUTH.currentUser,
    method: "GET",
    defaultErrorMessage: "Not authenticated",
  });

  if (!res.success || !res.data) {
    return {
      success: false,
      message: normalizeErrorMessage(res.message, "Not authenticated"),
      statusCode: res.statusCode,
    };
  }

  // res.data is now CurrentUserResponse (unwrapped from { data } envelope)
  return {
    success: true,
    message: res.message,
    data: res.data as CurrentUserResponse,
    statusCode: res.statusCode,
  };
}

/**
 * Fetch full user + subscription data from the current-user endpoint.
 * This is used by the refresh flow (?refresh=1) and subscription bootstrap
 * to get both the user and their current subscription in one request.
 */
export async function fetchFullCurrentUserAction(): Promise<
  AuthActionResult<{
    user: User;
    subscription: import("@/app/types/subscriptions").CurrentUserSubscriptionDto | null;
  }>
> {
  const res = await globalRequest({
    endpoint: API_ENDPOINTS.AUTH.currentUser,
    method: "GET",
    defaultErrorMessage: "Not authenticated",
  });

  if (!res.success || !res.data) {
    return {
      success: false,
      message: normalizeErrorMessage(res.message, "Not authenticated"),
      statusCode: res.statusCode,
    };
  }

  const data = res.data as {
    user: User;
    subscription: import("@/app/types/subscriptions").CurrentUserSubscriptionDto | null;
  };

  return {
    success: true,
    message: res.message,
    data,
    statusCode: res.statusCode,
  };
}
