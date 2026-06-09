"use client";

import { create } from "zustand";
import type { User } from "@/app/types/auth";

interface AuthState {
  user: Partial<User> | null;
  loading: boolean;
  isAuthenticated: boolean;
  /** Accepts full User or partial auth data (e.g. CurrentUserResponse from JWT).
   *  Components access fields via optional chaining (user?.name) so partial data is safe. */
  setUser: (user: Partial<User> | null) => void;
  setLoading: (loading: boolean) => void;
  clear: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  isAuthenticated: false,
  setUser: (user) =>
    set({
      user,
      isAuthenticated: !!user,
      loading: false,
    }),
  setLoading: (loading) => set({ loading }),
  clear: () =>
    set({
      user: null,
      isAuthenticated: false,
      loading: false,
    }),
}));
