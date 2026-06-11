// //////////////////////////////////////////////////////////////////////////////
// ///////// SubscriptionCurrentPlan — plan details, features, usage ///////////
// //////////////////////////////////////////////////////////////////////////////

import BenefitItem from "./SubscriptionBenefitItem";
import { LuZap, LuTriangleAlert, LuCalendar } from "react-icons/lu";
import type { CurrentUserSubscriptionDto } from "@/app/types/subscriptions";

interface CurrentPlanProps {
  subscription: CurrentUserSubscriptionDto | null;
  planName: string;
  planIcon: string | null;
  planFeatures: string[];
  isFree: boolean;
  isActive: boolean;
  isTrialing: boolean;
  isCancelScheduled: boolean;
  subStatus: string;
}

export default function SubscriptionCurrentPlan({
  subscription,
  planName,
  planIcon,
  planFeatures,
  isFree,
  isActive,
  isTrialing,
  isCancelScheduled,
  subStatus,
}: CurrentPlanProps) {
  return (
    <div className="bg-panel_bg border border-white/5 p-5 rounded-xl space-y-5 relative overflow-hidden">
      {/* Plan Header */}
      <div className="flex justify-between items-start flex-wrap gap-3">
        <div>
          <span className="text-[11px] text-accent font-bold tracking-[0.2em] uppercase">
            Current Plan
          </span>
          <h2 className="text-xl md:text-2xl font-bold text-white mt-1">
            {planIcon ? <span className="mr-2">{planIcon}</span> : null}
            {planName}
          </h2>
          {isCancelScheduled && (
            <p className="text-xs text-secondery flex items-center gap-1 mt-1">
              <LuTriangleAlert className="size-3.5" />
              Cancels at period end —{" "}
              {subscription?.periodEnd
                ? new Date(subscription.periodEnd).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })
                : "soon"}
            </p>
          )}
          {isTrialing && subscription?.trialEnd && (
            <p className="text-xs text-blue-400 flex items-center gap-1 mt-1">
              <LuCalendar className="size-3.5" />
              Trial ends{" "}
              {new Date(subscription.trialEnd).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          )}
        </div>
        {isActive ? (
          <span className="bg-accent text-white px-3 py-1 rounded-full text-xs font-bold uppercase shrink-0">
            Active
          </span>
        ) : isFree ? (
          <span className="bg-fourth_color text-second_text px-3 py-1 rounded-full text-xs font-bold uppercase border border-white/10 shrink-0">
            Free
          </span>
        ) : (
          <span className="bg-secondery/20 text-secondery px-3 py-1 rounded-full text-xs font-bold uppercase shrink-0">
            {subStatus}
          </span>
        )}
      </div>

      {/* Plan Features (Standalone Section) */}
      <div className="space-y-3">
        <span className="text-xs text-second_text uppercase tracking-wider font-medium">
          Plan Features
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
          {planFeatures.length > 0 ? (
            planFeatures.map((feat) => (
              <BenefitItem key={feat} text={feat} />
            ))
          ) : (
            <p className="text-[13px] text-second_text col-span-full">
              No features listed
            </p>
          )}
        </div>
      </div>

      {/* Free plan upgrade prompt */}
      {isFree && (
        <div className="bg-gradient-to-r from-accent/10 to-purble/10 p-4 rounded-lg border border-accent/20">
          <div className="flex items-start gap-3">
            <LuZap className="size-5 text-accent shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-white">
                Unlock the full experience
              </p>
              <p className="text-xs text-second_text mt-1">
                Upgrade to a paid plan and get ad-free 4K streaming, offline
                downloads, multi-device support, and more.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Usage Insights */}
      <div className="bg-main_bg/40 p-4 rounded-lg border border-white/5">
        <span className="text-xs text-second_text uppercase block mb-3">
          Usage Insights
        </span>
        <div className="space-y-3">
          {/* Mini bar chart */}
          <div className="flex items-end gap-2 h-20">
            {[40, 60, 90, 75, 45].map((h, i) => (
              <div
                key={i}
                className="w-full rounded-t transition-all duration-500"
                style={{
                  height: `${h}%`,
                  backgroundColor:
                    h >= 75
                      ? "var(--accent)"
                      : h >= 50
                        ? "rgba(229,9,20,0.6)"
                        : "rgba(229,9,20,0.25)",
                }}
              />
            ))}
          </div>
          <div className="flex justify-between items-center text-[11px] text-second_text">
            <span>
              Most Watched: <strong className="text-white">—</strong>
            </span>
            <span>
              Data: <strong className="text-white">—</strong>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
