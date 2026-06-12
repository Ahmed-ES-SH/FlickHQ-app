"use server";

import { globalRequest } from "@/app/_helpers/globalRequest";
import {
  setAuthCookie,
  deleteAuthCookie,
  getServerAuthCookieHeader,
} from "@/app/_helpers/session";
import { API_ENDPOINTS } from "@/app/constants/apis";
import type { User } from "@/app/types/auth";
import type { CurrentUserSubscriptionDto } from "@/app/types/subscriptions";

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

const AUTH_ERROR_MESSAGES: Record<string, { field: "email" | "password" | "general"; message: string }> = {
  "403:You need to verify your email first": {
    field: "email",
    message: "Please verify your email first. A new verification email has been sent.",
  },
  "408": {
    field: "general",
    message: "Couldn't send verification email. Try again later.",
  },
  "429": {
    field: "general",
    message: "Too many attempts. Please try again in 15 minutes.",
  },
  "400:User already exists": {
    field: "email",
    message: "An account with this email already exists.",
  },
};

const AUTH_ERROR_MESSAGE_DEFAULTS: Record<number, string> = {
  403: "Please verify your email first.",
  408: "Request timed out. Please try again.",
  429: "Too many attempts. Please try again in 15 minutes.",
};

function getAuthErrorMessage(
  statusCode: number | undefined,
  message: string,
): { field: "email" | "password" | "general"; message: string } | null {
  if (!statusCode) return null;

  // Try exact match first: "statusCode:message"
  const exactKey = `${statusCode}:${message}`;
  const exactMatch = AUTH_ERROR_MESSAGES[exactKey];
  if (exactMatch) return exactMatch;

  // Try status-only match for known status codes
  const statusMatch = AUTH_ERROR_MESSAGES[`${statusCode}`];
  if (statusMatch) return statusMatch;

  // No mapped message
  return null;
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
  if (statusCode === 400 && /user already exists/i.test(message)) return "email";
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
    const rawMessage = json.message || "";
    const mapped = getAuthErrorMessage(res.status, rawMessage);
    return {
      success: false,
      message: mapped ? mapped.message : rawMessage || "Login failed",
      statusCode: res.status,
      errors: json.errors,
      field: mapped ? mapped.field : inferField(res.status, rawMessage),
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

  const user = json?.data?.user ?? json?.user ?? null;

  return {
    success: true,
    message: json.message || "Logged in successfully",
    data: { user: user ?? (null as unknown as User) },
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

  const rawMessage = normalizeErrorMessage(res.message, "");

  if (!res.success) {
    const mapped = getAuthErrorMessage(res.statusCode, rawMessage);
    return {
      success: false,
      message: mapped ? mapped.message : rawMessage || "Registration failed",
      statusCode: res.statusCode,
      errors: res.errors,
      field: mapped ? mapped.field : inferField(res.statusCode, rawMessage),
    };
  }

  return {
    success: true,
    message: rawMessage || "Registration successful",
    statusCode: res.statusCode,
    errors: res.errors,
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

export async function resendVerificationAction(
  email: string,
): Promise<AuthActionResult> {
  const res = await globalRequest({
    endpoint: API_ENDPOINTS.AUTH.resendVerification,
    method: "POST",
    body: { email },
    defaultErrorMessage: "Could not resend verification email",
  });

  return {
    success: res.success,
    message: normalizeErrorMessage(res.message, "Could not resend verification email"),
    statusCode: res.statusCode,
    errors: res.errors,
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
  AuthActionResult<{
    user: User;
    subscription: CurrentUserSubscriptionDto | null;
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

  // Backend returns { user: {...}, subscription: {...} } inside the { data } envelope.
  // After globalRequest unwraps { data }, res.data = { user, subscription }.
  const data = res.data as {
    user: User;
    subscription: CurrentUserSubscriptionDto | null;
  };

  return {
    success: true,
    message: res.message,
    data,
    statusCode: res.statusCode,
  };
}
