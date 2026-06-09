import { beforeEach, describe, expect, it } from "vitest";
import { useAuthStore } from "@/app/_stores/authStore";
import type { User } from "@/app/types/auth";

const baseUser: User = {
  id: 1,
  email: "test@example.com",
  name: "Test User",
  role: "user",
  status: "active",
  isEmailVerified: true,
  isPremium: false,
  createdAt: "2024-01-01T00:00:00.000Z",
  updatedAt: "2024-01-01T00:00:00.000Z",
};

describe("useAuthStore", () => {
  beforeEach(() => {
    useAuthStore.setState({
      user: null,
      loading: true,
      isAuthenticated: false,
    });
  });

  it("starts in logged-out, loading state", () => {
    const s = useAuthStore.getState();
    expect(s.user).toBeNull();
    expect(s.loading).toBe(true);
    expect(s.isAuthenticated).toBe(false);
  });

  it("setUser(<user>) populates user, marks authenticated, stops loading", () => {
    useAuthStore.getState().setUser(baseUser);
    const s = useAuthStore.getState();
    expect(s.user).toEqual(baseUser);
    expect(s.isAuthenticated).toBe(true);
    expect(s.loading).toBe(false);
  });

  it("setUser(null) clears user and authentication, stops loading", () => {
    useAuthStore.getState().setUser(baseUser);
    useAuthStore.getState().setUser(null);
    const s = useAuthStore.getState();
    expect(s.user).toBeNull();
    expect(s.isAuthenticated).toBe(false);
    expect(s.loading).toBe(false);
  });

  it("setLoading only toggles loading, leaves user/auth alone", () => {
    useAuthStore.getState().setUser(baseUser);
    useAuthStore.getState().setLoading(true);
    const s = useAuthStore.getState();
    expect(s.loading).toBe(true);
    expect(s.user).toEqual(baseUser);
    expect(s.isAuthenticated).toBe(true);

    useAuthStore.getState().setLoading(false);
    expect(useAuthStore.getState().loading).toBe(false);
    expect(useAuthStore.getState().user).toEqual(baseUser);
  });

  it("clear() resets to logged-out with loading=false", () => {
    useAuthStore.getState().setUser(baseUser);
    useAuthStore.setState({ loading: true });
    useAuthStore.getState().clear();
    const s = useAuthStore.getState();
    expect(s.user).toBeNull();
    expect(s.isAuthenticated).toBe(false);
    expect(s.loading).toBe(false);
  });

  it("setUser reflects the most recent call (no stale state)", () => {
    const other: User = { ...baseUser, id: 2, email: "other@example.com" };
    useAuthStore.getState().setUser(baseUser);
    useAuthStore.getState().setUser(other);
    const s = useAuthStore.getState();
    expect(s.user).toEqual(other);
    expect(s.isAuthenticated).toBe(true);
  });
});
