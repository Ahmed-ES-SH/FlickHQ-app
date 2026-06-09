"use client";

import { create } from "zustand";
import type { CurrentUserSubscriptionDto } from "@/app/types/subscriptions";

interface SubscriptionState {
  subscription: CurrentUserSubscriptionDto | null;
  loading: boolean;
  error: string | null;
  setSubscription: (sub: CurrentUserSubscriptionDto | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clear: () => void;
}

/** Convenience helper — returns true if the user is on a free/no-cost plan. */
export function isFreeSubscription(
  sub: CurrentUserSubscriptionDto | null,
): boolean {
  if (!sub) return true;
  return sub.status === "free" || sub.plan?.code === "free";
}

export const useSubscriptionStore = create<SubscriptionState>((set) => ({
  subscription: null,
  loading: true,
  error: null,
  setSubscription: (subscription) =>
    set({ subscription, loading: false, error: null }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error, loading: false }),
  clear: () =>
    set({
      subscription: null,
      loading: false,
      error: null,
    }),
}));
