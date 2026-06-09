"use server";

import { globalRequest } from "@/app/_helpers/globalRequest";
import { API_ENDPOINTS } from "@/app/constants/apis";
import type { User } from "@/app/types/auth";

export async function fetchUserProfileAction(
  userId: number,
): Promise<{ success: boolean; data?: User; message?: string }> {
  const res = await globalRequest({
    endpoint: API_ENDPOINTS.USER.profile(userId),
    method: "GET",
    defaultErrorMessage: "Failed to fetch user profile",
  });

  if (!res.success || !res.data) {
    return { success: false, message: res.message };
  }

  return { success: true, data: res.data as User };
}
