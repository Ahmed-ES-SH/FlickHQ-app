"use client";
import React, { ReactNode, Suspense, useState } from "react";
import DataProvider from "@/app/context/DataContext";
import VaribalesProvider from "@/app/context/VariablesContext";
import AuthBootstrap from "@/app/_components/_client/auth/AuthBootstrap";
import SubscriptionBootstrap from "@/app/_components/_client/subscription/SubscriptionBootstrap";
import ListBootstrap from "@/app/_components/_client/lists/ListBootstrap";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { CurrentUserResponse } from "@/app/types/auth";
import type { CurrentUserSubscriptionDto } from "@/app/types/subscriptions";

type ClientLayoutProps = {
  children: ReactNode;
  initialUser: CurrentUserResponse | null;
  initialSubscription: CurrentUserSubscriptionDto | null;
};

export default function ClientLayout({
  children,
  initialUser,
  initialSubscription,
}: ClientLayoutProps) {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Suspense fallback={null}>
          <AuthBootstrap initialUser={initialUser} />
        </Suspense>
        <Suspense fallback={null}>
          <SubscriptionBootstrap initialSubscription={initialSubscription} />
        </Suspense>
        <ListBootstrap />
        <VaribalesProvider>
          <DataProvider>{children}</DataProvider>
        </VaribalesProvider>
      </QueryClientProvider>
    </>
  );
}
