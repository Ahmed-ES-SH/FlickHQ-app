"use server";

import { globalRequest } from "@/app/_helpers/globalRequest";
import { API_ENDPOINTS } from "@/app/constants/apis";
import type {
  CreateContactMessagePayload,
  SubmitContactResponse,
} from "@/app/types/contact";

// ─── Result Type ───────────────────────────────────

export interface ContactActionResult<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  statusCode?: number;
  errors?: Record<string, string[]>;
}

// ─── Submit Contact Message ─────────────────────────

/**
 * Submit a new contact message via POST /api/contact.
 * Public endpoint — no authentication required.
 * Rate-limited to 5 submissions per IP per hour (enforced server-side).
 *
 * Returns the success message and the created message ID on success.
 */
export async function submitContactAction(
  payload: CreateContactMessagePayload,
): Promise<ContactActionResult<SubmitContactResponse>> {
  const res = await globalRequest<
    CreateContactMessagePayload,
    SubmitContactResponse
  >({
    endpoint: API_ENDPOINTS.CONTACT.submit,
    method: "POST",
    body: payload,
    authenticated: false,
    defaultErrorMessage: "Failed to send your message. Please try again.",
  });

  if (!res.success || !res.data) {
    // Handle rate limiting specifically
    if (res.statusCode === 429) {
      return {
        success: false,
        message:
          "You've reached the hourly limit. Please try again later.",
        statusCode: 429,
      };
    }

    return {
      success: false,
      message:
        typeof res.message === "string"
          ? res.message
          : "Failed to send your message. Please try again.",
      statusCode: res.statusCode,
      errors: res.errors,
    };
  }

  return {
    success: true,
    message: res.data.message || "Your message has been sent successfully!",
    data: res.data as SubmitContactResponse,
    statusCode: res.statusCode,
  };
}
