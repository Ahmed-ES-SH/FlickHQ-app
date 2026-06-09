"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  LuTv,
  LuSmartphone,
  LuLaptop,
  LuCreditCard,
  LuExternalLink,
  LuUser,
  LuZap,
  LuCrown,
  LuArrowRight,
  LuLoader,
} from "react-icons/lu";
import { IoCheckmarkCircle, IoStar } from "react-icons/io5";
import { useAuthStore } from "@/app/_stores/authStore";
import { useSubscriptionStore, isFreeSubscription } from "@/app/_stores/subscriptionStore";
import PlansSection from "@/app/_components/_website/_Home/PlansSection";
import { createBillingPortalSessionAction } from "@/app/_actions/billing";
import { toast } from "sonner";

// ─── Animation wrapper ─────────────────────────────

function FadeIn({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay }}
    >
      {children}
    </motion.div>
  );
}

// ─── Stat Card ─────────────────────────────────────

function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center p-4 bg-fourth_color rounded-lg border border-white/5 min-w-[120px]">
      <span className="text-xl font-bold text-accent">{value}</span>
      <span className="text-[11px] text-second_text uppercase tracking-widest">
        {label}
      </span>
    </div>
  );
}

// ─── Benefit Item ──────────────────────────────────

function BenefitItem({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-2 text-[13px] text-gray-200">
      <IoCheckmarkCircle className="size-4 text-accent shrink-0" />
      {text}
    </div>
  );
}

// ─── Device Item ───────────────────────────────────

function DeviceItem({
  icon,
  name,
  detail,
}: {
  icon: React.ReactNode;
  name: string;
  detail: string;
}) {
  return (
    <div className="py-4 flex justify-between items-center border-b border-white/5 last:border-0">
      <div className="flex items-center gap-4">
        <span className="text-accent p-2 bg-fourth_color rounded">{icon}</span>
        <div>
          <p className="text-sm text-white font-medium">{name}</p>
          <p className="text-[11px] text-second_text">{detail}</p>
        </div>
      </div>
      <button className="text-xs text-accent font-medium hover:underline">
        Logout
      </button>
    </div>
  );
}

// ─── Free vs Paid badge / icon helper ──────────────

function getPlanIcon(icon: string | null, planCode: string): string {
  if (icon) return icon;
  if (planCode === "free") return "🎬";
  return "👑";
}

function getPlanPriceDisplay(
  planCode: string,
): { amount: string; periodic: string } | null {
  // Free plan has no price
  if (planCode === "free") return null;
  // Paid plans — we don't have price info in the current-user response.
  // The PlansSection (fetched separately) has full pricing.
  return null;
}

// ─── Invoice Item ──────────────────────────────────

function InvoiceItem({
  date,
  amount,
  status,
}: {
  date: string;
  amount: string;
  status: string;
}) {
  return (
    <div className="flex justify-between items-center p-2.5 hover:bg-white/5 rounded-lg transition-colors cursor-pointer">
      <div>
        <p className="text-sm text-white font-medium">{date}</p>
        <span className="text-[10px] text-accent bg-accent/20 px-1.5 py-0.5 rounded">
          {status}
        </span>
      </div>
      <span className="text-sm font-semibold text-white">{amount}</span>
    </div>
  );
}

// ─── Page ──────────────────────────────────────────

export default function SubscriptionPage() {
  const user = useAuthStore((s) => s.user);
  const subscription = useSubscriptionStore((s) => s.subscription);
  const subLoading = useSubscriptionStore((s) => s.loading);

  const [portalLoading, setPortalLoading] = useState(false);

  const isFree = useMemo(() => isFreeSubscription(subscription), [subscription]);
  const planCode = subscription?.plan?.code ?? "free";
  const planName = subscription?.plan?.name ?? "Free";
  const planIcon = subscription?.plan?.icon;
  const planFeatures = subscription?.plan?.features ?? [];
  const subStatus = subscription?.status ?? "free";
  const isActive = subStatus === "active";

  // ── Derived user values ──────────────────────────

  const displayName = useMemo(
    () => user?.name ?? user?.email?.split("@")[0] ?? "User",
    [user],
  );

  const memberSince = useMemo(
    () =>
      user?.createdAt
        ? new Date(user.createdAt).toLocaleDateString("en-US", {
            month: "short",
            year: "numeric",
          })
        : "—",
    [user?.createdAt],
  );

  const avatarLetter = useMemo(
    () => (displayName?.[0] ?? "U").toUpperCase(),
    [displayName],
  );

  // ── Handlers ─────────────────────────────────────

  const handleManagePayment = async () => {
    setPortalLoading(true);
    try {
      const res = await createBillingPortalSessionAction();
      if (res.success && res.data?.url) {
        window.location.href = res.data.url;
      } else {
        toast.error(res.message || "Failed to open billing portal");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setPortalLoading(false);
    }
  };

  // ── Loading state ────────────────────────────────

  if (!user || subLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <LuLoader className="size-8 text-accent animate-spin" />
      </div>
    );
  }

  // ── Render ───────────────────────────────────────

  return (
    <div className="space-y-6">
      {/* ── Profile Overview ───────────────────────── */}
      <FadeIn delay={0}>
        <div className="bg-panel_bg border border-white/5 p-5 rounded-xl flex flex-col md:flex-row justify-between items-center gap-5">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-24 h-24 rounded-xl overflow-hidden border-2 border-accent bg-fourth_color flex items-center justify-center">
                {user.avatar ? (
                  <Image
                    src={user.avatar}
                    alt={displayName}
                    width={96}
                    height={96}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <span className="text-3xl text-gray-600 font-bold">
                    {avatarLetter}
                  </span>
                )}
              </div>
              {/* Plan badge */}
              {!isFree ? (
                <span className="absolute -bottom-2 -right-2 bg-accent text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg">
                  PRO
                </span>
              ) : null}
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-white">
                {displayName}
              </h1>
              <p className="text-sm text-second_text">
                Member since {memberSince}
              </p>
            </div>
          </div>

          <div className="flex gap-4 w-full md:w-auto overflow-x-auto">
            <StatCard value="—" label="Movies Watched" />
            <StatCard value="—" label="Series Binged" />
            <StatCard value="—" label="Total Time" />
          </div>
        </div>
      </FadeIn>

      {/* ── Main Grid ─────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* ── Left (2/3) ─────────────────────────── */}
        <div className="lg:col-span-2 space-y-5">
          {/* Current Plan */}
          <FadeIn delay={0.1}>
            <div className="bg-panel_bg border border-white/5 p-5 rounded-xl space-y-5 relative overflow-hidden">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[11px] text-accent font-bold tracking-[0.2em] uppercase">
                    Current Plan
                  </span>
                  <h2 className="text-xl md:text-2xl font-bold text-white mt-1">
                    {planIcon ? (
                      <span className="mr-2">{planIcon}</span>
                    ) : null}
                    {planName}
                  </h2>
                </div>
                {isActive ? (
                  <span className="bg-accent text-white px-3 py-1 rounded-full text-xs font-bold uppercase">
                    Active
                  </span>
                ) : isFree ? (
                  <span className="bg-fourth_color text-second_text px-3 py-1 rounded-full text-xs font-bold uppercase border border-white/10">
                    Free
                  </span>
                ) : (
                  <span className="bg-secondery/20 text-secondery px-3 py-1 rounded-full text-xs font-bold uppercase">
                    {subStatus}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Features & Benefits */}
                <div className="space-y-4">
                  {/* Plan Features */}
                  <div className="space-y-2">
                    <span className="text-xs text-second_text uppercase block">
                      Plan Features
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      {planFeatures.length > 0 ? (
                        planFeatures.map((feat) => (
                          <BenefitItem key={feat} text={feat} />
                        ))
                      ) : (
                        <p className="text-[13px] text-second_text col-span-2">
                          No features listed
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Free plan upgrade prompt */}
                  {isFree && (
                    <div className="pt-4 border-t border-white/5">
                      <div className="bg-gradient-to-r from-accent/10 to-purble/10 p-4 rounded-lg border border-accent/20">
                        <div className="flex items-start gap-3">
                          <LuZap className="size-5 text-accent shrink-0 mt-0.5" />
                          <div>
                            <p className="text-sm font-semibold text-white">
                              Unlock the full experience
                            </p>
                            <p className="text-xs text-second_text mt-1">
                              Upgrade to a paid plan and get ad-free 4K
                              streaming, offline downloads, multi-device support,
                              and more.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Usage Insights (placeholder — no backend data yet) */}
                <div className="space-y-3 bg-main_bg/40 p-4 rounded-lg border border-white/5">
                  <span className="text-xs text-second_text uppercase block">
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
                        Most Watched:{" "}
                        <strong className="text-white">—</strong>
                      </span>
                      <span>
                        Data: <strong className="text-white">—</strong>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>

          {/* Active Devices (placeholder — no backend data yet) */}
          <FadeIn delay={0.15}>
            <div className="bg-panel_bg border border-white/5 p-5 rounded-xl space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-white">
                  Active Devices
                </h3>
                {isFree ? (
                  <span className="text-xs text-second_text">
                    Available on paid plans
                  </span>
                ) : (
                  <span className="text-xs text-second_text">
                    0 of — concurrent streams active
                  </span>
                )}
              </div>
              {isFree ? (
                <div className="py-6 text-center text-sm text-second_text">
                  <p>Upgrade to a paid plan to manage your devices.</p>
                </div>
              ) : (
                <div className="divide-y divide-white/5">
                  <DeviceItem
                    icon={<LuTv className="size-5" />}
                    name="Living Room TV"
                    detail="Sony Bravia 4K • Active Now"
                  />
                  <DeviceItem
                    icon={<LuSmartphone className="size-5" />}
                    name="iPhone"
                    detail="iPhone • Last used 2h ago"
                  />
                  <DeviceItem
                    icon={<LuLaptop className="size-5" />}
                    name="Laptop"
                    detail='MacBook Pro • Last used 1d ago'
                  />
                </div>
              )}
            </div>
          </FadeIn>
        </div>

        {/* ── Right (1/3) — Billing Sidebar ──────── */}
        {isFree ? (
          /* ── Free user: show upgrade prompt instead of billing ── */
          <aside className="space-y-5">
            <FadeIn delay={0.2}>
              <div className="bg-panel_bg border border-white/5 p-5 rounded-xl space-y-4 text-center">
                <div className="text-4xl mb-2">🎬</div>
                <h3 className="text-lg font-semibold text-white">
                  Free Plan
                </h3>
                <p className="text-sm text-second_text">
                  You&apos;re currently on the Free plan. Upgrade to unlock
                  premium features, ad-free streaming, and multi-device support.
                </p>
                <button
                  onClick={() => {
                    document
                      .getElementById("upgrade-plans-section")
                      ?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="w-full bg-accent hover:bg-red-700 text-white py-3 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2"
                >
                  <LuCrown className="size-4" />
                  View Plans
                  <LuArrowRight className="size-4" />
                </button>
              </div>
            </FadeIn>
          </aside>
        ) : (
          /* ── Paid user: show billing sidebar ─────── */
          <aside className="space-y-5">
            <FadeIn delay={0.2}>
              {/* Next Payment */}
              <div className="bg-panel_bg border border-white/5 p-5 rounded-xl space-y-4">
                <h3 className="text-lg font-semibold text-white">
                  Next Payment
                </h3>
                {subscription?.periodEnd ? (
                  <>
                    <div className="flex justify-between items-baseline">
                      <span className="text-3xl font-bold text-white">
                        —
                      </span>
                      <span className="text-sm text-second_text">
                        Due{" "}
                        {new Date(subscription.periodEnd).toLocaleDateString(
                          "en-US",
                          { month: "short", day: "numeric" },
                        )}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 p-2.5 bg-fourth_color rounded-lg border border-white/5">
                      <LuCreditCard className="size-5 text-accent" />
                      <span className="text-sm text-white">
                        {user?.stripeCustomerId ? "Stripe ••••" : "No card on file"}
                      </span>
                    </div>
                  </>
                ) : (
                  <p className="text-sm text-second_text">
                    No upcoming payments scheduled.
                  </p>
                )}
                <button
                  onClick={handleManagePayment}
                  disabled={portalLoading}
                  className="w-full bg-accent hover:bg-red-700 text-white py-2.5 rounded-lg text-sm font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {portalLoading ? (
                    <>
                      <LuLoader className="size-4 animate-spin" />
                      Opening…
                    </>
                  ) : (
                    "Manage Payment"
                  )}
                </button>
                <button className="w-full bg-fourth_color hover:bg-[#3a2522] transition-colors text-second_text py-2 rounded-lg text-sm border border-white/10">
                  View Invoices
                </button>
              </div>
            </FadeIn>

            <FadeIn delay={0.25}>
              {/* Recent Invoices */}
              <div className="bg-panel_bg border border-white/5 p-5 rounded-xl space-y-3">
                <h3 className="text-xs uppercase tracking-widest text-second_text font-medium">
                  Recent Invoices
                </h3>
                <p className="text-sm text-second_text text-center py-4">
                  Invoice history coming soon
                </p>
              </div>
            </FadeIn>
          </aside>
        )}
      </div>

      {/* ── Upgrade Options ────────────────────────── */}
      <FadeIn delay={0.3}>
        <div className="space-y-6 pt-4" id="upgrade-plans-section">
          <div className="text-center space-y-2">
            <h2 className="text-xl md:text-2xl font-bold text-white">
              {isFree ? "Find Your Perfect Plan" : "Expand Your Universe"}
            </h2>
            <p className="text-sm text-second_text max-w-2xl mx-auto">
              {isFree
                ? "Choose a plan that fits your needs. Upgrade anytime to unlock premium features."
                : "Upgrade or downgrade your plan anytime. No long-term commitments."}
            </p>
          </div>
          <PlansSection />
        </div>
      </FadeIn>

      {/* ── Billing FAQ ────────────────────────────── */}
      <FadeIn delay={0.35}>
        <div className="bg-panel_bg border border-white/5 p-5 rounded-xl space-y-5">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-white">
                Billing FAQ
              </h2>
              <p className="text-sm text-second_text">
                Quick answers to common questions about your account.
              </p>
            </div>
            <button className="text-accent text-sm font-medium flex items-center gap-2 hover:underline">
              Visit Help Center
              <LuExternalLink className="size-4" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-white">
                Can I change my plan mid-month?
              </h4>
              <p className="text-[13px] text-second_text">
                Yes. Upgrades take effect immediately and are pro-rated.
                Downgrades take effect at the start of your next billing cycle.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-white">
                How do I update my payment method?
              </h4>
              <p className="text-[13px] text-second_text">
                Use the &quot;Manage Payment&quot; button above to securely
                update your credit card information through our billing portal.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-white">
                What devices support 4K UHD?
              </h4>
              <p className="text-[13px] text-second_text">
                4K UHD requires a 4K-capable display, a stable 25Mbps+
                connection, and a supported device like Apple TV 4K or Sony
                Bravia.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-white">
                Are there any hidden fees?
              </h4>
              <p className="text-[13px] text-second_text">
                No. The monthly subscription fee includes all taxes and fees.
                Any additional costs are clearly stated before purchase.
              </p>
            </div>
          </div>
        </div>
      </FadeIn>
    </div>
  );
}
