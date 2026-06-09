"use client";

import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { useSubscriptionStore } from "@/app/_stores/subscriptionStore";
import { fetchFullCurrentUserAction } from "@/app/_actions/auth";
import type { CurrentUserSubscriptionDto } from "@/app/types/subscriptions";

interface SubscriptionBootstrapProps {
  initialSubscription: CurrentUserSubscriptionDto | null;
}

export default function SubscriptionBootstrap({
  initialSubscription,
}: SubscriptionBootstrapProps) {
  const searchParams = useSearchParams();
  const setSubscription = useSubscriptionStore((s) => s.setSubscription);
  const setLoading = useSubscriptionStore((s) => s.setLoading);
  const hydrated = useRef(false);

  // Hydrate store with server-fetched subscription data on mount
  useEffect(() => {
    if (!hydrated.current) {
      hydrated.current = true;
      setSubscription(initialSubscription);
    }
  }, [initialSubscription, setSubscription]);

  // Refresh subscription when ?refresh=1 is present (from OAuth callback / login)
  useEffect(() => {
    const refresh = searchParams.get("refresh");
    if (refresh !== "1") return;

    let cancelled = false;

    (async () => {
      setLoading(true);
      const res = await fetchFullCurrentUserAction();
      if (cancelled) return;

      if (res.success && res.data) {
        setSubscription(res.data.subscription);
      } else {
        setSubscription(null);
      }
      setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [searchParams, setSubscription, setLoading]);

  return null;
}
