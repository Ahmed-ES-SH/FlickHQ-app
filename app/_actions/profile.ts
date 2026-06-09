"use server";

import { globalRequest } from "@/app/_helpers/globalRequest";
import { API_ENDPOINTS } from "@/app/constants/apis";
import type { AuthActionResult } from "./auth";
import type { User } from "@/app/types/auth";
import { revalidatePath } from "next/cache";

/**
 * Updates the authenticated user's profile (name, avatar).
 * Email is NOT editable here — it requires a separate verified flow.
 */
export async function updateProfileAction(
  userId: number,
  data: { name?: string; avatar?: string },
): Promise<AuthActionResult<User>> {
  const res = await globalRequest({
    endpoint: API_ENDPOINTS.USER.profile(userId),
    method: "PATCH",
    body: data,
    defaultErrorMessage: "Failed to update profile",
  });

  if (!res.success) {
    return {
      success: false,
      message:
        typeof res.message === "string"
          ? res.message
          : "Failed to update profile",
      statusCode: res.statusCode,
      errors: res.errors,
    };
  }

  revalidatePath("/userpanal");

  return {
    success: true,
    message: "Profile updated successfully",
    data: res.data as User,
    statusCode: res.statusCode,
  };
}

/**
 * Updates the authenticated user's password.
 * Sends only `{ password }` to the PATCH /user/:id endpoint.
 * After a successful password change, the frontend should force re-authentication.
 */
export async function updatePasswordAction(
  userId: number,
  password: string,
): Promise<AuthActionResult<User>> {
  const res = await globalRequest({
    endpoint: API_ENDPOINTS.USER.profile(userId),
    method: "PATCH",
    body: { password },
    defaultErrorMessage: "Failed to update password",
  });

  if (!res.success) {
    return {
      success: false,
      message:
        typeof res.message === "string"
          ? res.message
          : "Failed to update password",
      statusCode: res.statusCode,
      errors: res.errors,
    };
  }

  return {
    success: true,
    message: "Password updated successfully. Please sign in again.",
    data: res.data as User,
    statusCode: res.statusCode,
  };
}
