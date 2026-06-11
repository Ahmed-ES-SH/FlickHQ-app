"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/app/_stores/authStore";
import { fetchCurrentUserAction } from "@/app/_actions/auth";
import { fetchUserProfileAction } from "@/app/_actions/user";
import { toast } from "sonner";
import type { CurrentUserResponse } from "@/app/types/auth";

interface AuthBootstrapProps {
  initialUser: CurrentUserResponse | null;
}

export default function AuthBootstrap({ initialUser }: AuthBootstrapProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const setUser = useAuthStore((s) => s.setUser);
  const setLoading = useAuthStore((s) => s.setLoading);
  const fullProfileFetched = useRef(false);
  const fetchAttempted = useRef(false);

  // Hydrate store with initial auth data (CurrentUserResponse = { id, email, role })
  // The store's User type has all optional fields for this initial state.
  // Components using user.name/avatar already handle undefined gracefully.
  useEffect(() => {
    setUser(initialUser);

    // SSR fallback: if SSR didn't find a user (e.g. OAuth redirect with SameSite
    // cookie timing issue), try to fetch from client. The server action
    // request includes cookies, so this succeeds even when SSR misses them.
    if (!initialUser && !fetchAttempted.current) {
      fetchAttempted.current = true;
      fetchCurrentUserAction().then((res) => {
        if (res.success && res.data?.user) {
          setUser(res.data.user);
          if (res.data.user.id && !fullProfileFetched.current) {
            fullProfileFetched.current = true;
            fetchUserProfileAction(res.data.user.id).then((profile) => {
              if (profile.success && profile.data) {
                setUser({ ...res.data!.user, ...profile.data });
              }
            });
          }
        }
      });
    }

    // If we have a basic auth profile, lazily fetch the full user profile
    // for name, avatar, and other details needed by the navbar.
    if (initialUser?.id && !fullProfileFetched.current) {
      fullProfileFetched.current = true;
      fetchUserProfileAction(initialUser.id).then((profile) => {
        if (profile.success && profile.data) {
          // Merge full profile data (name, avatar, etc.) with existing auth data
          setUser({ ...initialUser, ...profile.data });
        }
      });
    }
  }, [initialUser, setUser]);

  // Handle ?error= from backend OAuth failure redirect
  useEffect(() => {
    const error = searchParams.get("error");
    if (error) {
      toast.error(
        error === "access_denied"
          ? "Google sign-in was cancelled."
          : `Authentication failed: ${error.replace(/_/g, " ")}`,
      );
      const params = new URLSearchParams(searchParams.toString());
      params.delete("error");
      const query = params.toString();
      router.replace(`/signin${query ? `?${query}` : ""}`);
    }
  }, [searchParams, router]);

  useEffect(() => {
    const refresh = searchParams.get("refresh");
    if (refresh !== "1") return;

    let cancelled = false;

    (async () => {
      setLoading(true);
      const res = await fetchCurrentUserAction();
      if (cancelled) return;

      if (res.success && res.data?.user) {
        setUser(res.data.user);

        if (res.data.user.id) {
          const profile = await fetchUserProfileAction(res.data.user.id);
          if (!cancelled && profile.success && profile.data) {
            setUser({ ...res.data.user, ...profile.data });
          }
        }

        const params = new URLSearchParams(searchParams.toString());
        params.delete("refresh");
        const query = params.toString();
        router.replace(query ? `${pathname}?${query}` : pathname);
      } else {
        setUser(null);
        toast.error(
          "Authentication failed. Please try signing in again.",
        );
        const params = new URLSearchParams(searchParams.toString());
        params.delete("refresh");
        const query = params.toString();
        router.replace(
          `/signin${query ? `?${query}` : ""}`,
        );
      }
      setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [pathname, router, searchParams, setLoading, setUser]);

  return null;
}
