"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  LuShield,
  LuLink,
  LuUnlink,
  LuLock,
  LuPlay,
  LuHistory,
  LuStar,
  LuDownload,
  LuBadgeCheck,
  LuPencil,
  LuCircle,
  LuCreditCard,
  LuUser,
  LuCheck,
  LuX,
  LuCamera,
  LuSave,
} from "react-icons/lu";
import { useAuthStore } from "@/app/_stores/authStore";
import { useSubscriptionStore, isFreeSubscription } from "@/app/_stores/subscriptionStore";
import { useListStore } from "@/app/_stores/listStore";
import { updateProfileAction } from "@/app/_actions/profile";
import ChangePasswordModal from "@/app/_components/_client/auth/ChangePasswordModal";
import Link from "next/link";
import { toast } from "sonner";

// ─── Fade-in animation wrapper ─────────────────────

function Section({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay }}
    >
      {children}
    </motion.div>
  );
}

// ─── Badge ─────────────────────────────────────────

function Badge({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded text-[10px] uppercase tracking-widest font-bold border ${className}`}
    >
      {children}
    </span>
  );
}

// ─── Activity Icon ─────────────────────────────────

function ActivityIcon({
  icon,
  className,
}: {
  icon: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 ${className}`}
    >
      {icon}
    </div>
  );
}

// ─── Movie Poster Placeholder ──────────────────────

function MoviePoster({ title, imgSrc }: { title: string; imgSrc?: string }) {
  return (
    <div className="group relative rounded-lg overflow-hidden border border-white/5 aspect-[2/3] hover:scale-105 transition-transform duration-300 cursor-pointer bg-fourth_color">
      {imgSrc ? (
        <Image
          src={imgSrc}
          alt={title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 33vw, 150px"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <LuPlay className="size-8 text-gray-600" />
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
        <span className="text-[10px] font-bold text-white truncate">
          {title}
        </span>
      </div>
    </div>
  );
}

// ─── Form Input ────────────────────────────────────

function FormField({
  label,
  value,
  onChange,
  readOnly = false,
  placeholder = "",
  error,
}: {
  label: string;
  value: string;
  onChange?: (v: string) => void;
  readOnly?: boolean;
  placeholder?: string;
  error?: string;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-second_text uppercase tracking-wider">
        {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        readOnly={readOnly}
        placeholder={placeholder}
        className={`w-full bg-fourth_color border border-glass_border rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none transition-colors ${
          readOnly
            ? "opacity-60 cursor-not-allowed"
            : "focus:border-accent/50 focus:ring-1 focus:ring-accent/20"
        }`}
      />
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}

// ─── Page ──────────────────────────────────────────

export default function UserPanelOverview() {
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);
  const subscription = useSubscriptionStore((s) => s.subscription);
  const watchlistList = useListStore((s) => s.getSystemList("watchlist"));
  const favoritesList = useListStore((s) => s.getSystemList("favorites"));
  const fetchListItems = useListStore((s) => s.fetchListItems);

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [formName, setFormName] = useState("");
  const [formAvatar, setFormAvatar] = useState("");

  // Sync form fields when entering edit mode
  useEffect(() => {
    if (isEditing && user) {
      setFormName(user.name ?? "");
      setFormAvatar(user.avatar ?? "");
    }
  }, [isEditing, user]);

  // ── Fetch list items if not loaded ──────────────

  useEffect(() => {
    if (watchlistList?.id && !watchlistList.items && !watchlistList._loadingItems) {
      fetchListItems(watchlistList.id, { perPage: 50 });
    }
  }, [watchlistList?.id, watchlistList?.items, watchlistList?._loadingItems, fetchListItems]);

  // ── Derived display values ──────────────────────

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

  const lastUpdated = useMemo(
    () =>
      user?.updatedAt
        ? new Date(user.updatedAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })
        : "—",
    [user?.updatedAt],
  );

  // ── Handlers ────────────────────────────────────

  const handleCancel = () => {
    setIsEditing(false);
    if (user) {
      setFormName(user.name ?? "");
      setFormAvatar(user.avatar ?? "");
    }
  };

  const handleSave = async () => {
    if (!user?.id) return;
    setIsSaving(true);

    try {
      const result = await updateProfileAction(user.id, {
        name: formName.trim() || undefined,
        avatar: formAvatar.trim() || undefined,
      });

      if (result.success && result.data) {
        setUser({ ...user, ...result.data });
        toast.success(result.message || "Profile updated");
        setIsEditing(false);
      } else {
        toast.error(result.message || "Failed to update profile");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsSaving(false);
    }
  };

  // ── Loading state ───────────────────────────────

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="size-8 rounded-full border-2 border-accent border-t-transparent animate-spin" />
      </div>
    );
  }

  // ── Render ──────────────────────────────────────

  return (
    <div className="space-y-6 w-full">
      {/* ── Profile Header ─────────────────────────── */}
      <Section delay={0}>
        <div className="bg-panel_bg border border-glass_border rounded-xl p-6 transition-all hover:border-white/10">
          <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
            {/* Avatar */}
            <div className="relative group shrink-0">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-2 border-accent/20 group-hover:border-accent/50 transition-all duration-300">
                {user.avatar ? (
                  <Image
                    src={user.avatar}
                    alt={displayName}
                    fill
                    className="object-cover"
                    sizes="160px"
                  />
                ) : (
                  <div className="w-full h-full bg-fourth_color flex items-center justify-center text-5xl text-gray-600">
                    <LuUser className="size-16" />
                  </div>
                )}
              </div>
              {/* Camera overlay — only show quick hint when not editing */}
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="absolute bottom-1 right-1 bg-accent text-white p-2 rounded-full scale-0 group-hover:scale-100 transition-transform duration-200"
                  aria-label="Change avatar"
                >
                  <LuCamera className="size-4" />
                </button>
              )}
            </div>

            {/* Info + Form */}
            <div className="flex-1 text-center md:text-left space-y-3 min-w-0">
              {/* Name & badges */}
              <div className="flex flex-col md:flex-row md:items-center gap-3">
                <h1 className="text-2xl md:text-3xl font-bold text-white truncate">
                  {displayName}
                </h1>
                <div className="flex gap-2 justify-center md:justify-start flex-wrap">
                  {user.isPremium && (
                    <Badge className="bg-accent/20 text-accent border-accent/30">
                      Pro Member
                    </Badge>
                  )}
                  {subscription?.plan?.name && !isFreeSubscription(subscription) && (
                    <Badge className="bg-accent/10 text-accent border-accent/20">
                      {subscription.plan.name}
                    </Badge>
                  )}
                  {user.status === "active" && (
                    <Badge className="bg-green-500/20 text-green-500 border-green-500/30">
                      Active
                    </Badge>
                  )}
                </div>
              </div>

              {/* Email & verified status */}
              <div className="space-y-1">
                <div className="flex items-center justify-center md:justify-start gap-2 flex-wrap">
                  <span className="text-gray-300 text-sm">{user.email}</span>
                  {user.isEmailVerified && (
                    <span className="flex items-center gap-1 text-[11px] text-green-500 font-medium bg-green-500/10 px-2 py-0.5 rounded-full">
                      <LuBadgeCheck className="size-3.5" />
                      Verified
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-1">
                  <p className="text-second_text text-xs">
                    Member since:{" "}
                    <span className="text-gray-300">{memberSince}</span>
                  </p>
                  <p className="text-second_text text-xs">
                    Last updated:{" "}
                    <span className="text-gray-300">{lastUpdated}</span>
                  </p>
                </div>
              </div>

              {/* ── Edit Form ───────────────────────── */}
              <AnimatePresence initial={false}>
                {isEditing && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="pt-5 mt-5 border-t border-glass_border space-y-4">
                      <FormField
                        label="Name"
                        value={formName}
                        onChange={setFormName}
                        placeholder="Your display name"
                      />
                      <FormField
                        label="Email"
                        value={user.email ?? ""}
                        readOnly
                      />
                      <FormField
                        label="Avatar URL"
                        value={formAvatar}
                        onChange={setFormAvatar}
                        placeholder="https://example.com/avatar.jpg"
                      />
                      <p className="text-[11px] text-second_text">
                        Email changes require a separate verified process.
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2 self-center md:self-start shrink-0">
              {isEditing ? (
                <>
                  <button
                    onClick={handleCancel}
                    disabled={isSaving}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-medium border border-glass_border text-second_text hover:text-white hover:border-white/20 active:scale-95 transition-all duration-200"
                  >
                    <LuX className="size-4" />
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex items-center gap-1.5 bg-accent text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-red-700 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    {isSaving ? (
                      <>
                        <div className="size-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                        Saving…
                      </>
                    ) : (
                      <>
                        <LuCheck className="size-4" />
                        Save
                      </>
                    )}
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-1.5 bg-accent text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-red-700 active:scale-95 transition-all duration-200"
                >
                  <LuPencil className="size-4" />
                  Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>
      </Section>

      {/* ── Grid: Security + Watchlist ─────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* ── Account Security ──────────────────── */}
        <Section delay={0.1}>
          <div className="bg-panel_bg border border-glass_border rounded-xl p-6 flex flex-col justify-between h-full">
            <div>
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <LuShield className="text-accent" />
                Account Security
              </h2>

              <div className="space-y-3">
                {/* Google account */}
                <div className="flex items-center justify-between p-3.5 bg-fourth_color rounded-xl border border-glass_border">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-white/5">
                      <svg className="w-5 h-5 opacity-80" viewBox="0 0 24 24">
                        <path
                          fill="#4285F4"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-white font-medium">
                        Google Account
                      </p>
                      <p className="text-xs text-second_text">
                        {user.googleId ? "Connected" : "Not connected"}
                      </p>
                    </div>
                  </div>
                  {user.googleId ? (
                    <LuLink className="text-green-500 size-4" />
                  ) : (
                    <LuUnlink className="text-gray-500 size-4" />
                  )}
                </div>

                {/* Password */}
                <div className="flex items-center justify-between p-3.5 bg-fourth_color rounded-xl border border-glass_border">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-white/5">
                      <LuLock className="text-second_text size-4" />
                    </div>
                    <div>
                      <p className="text-sm text-white font-medium">Password</p>
                      <p className="text-xs text-second_text">
                        {user.googleId
                          ? "Managed via Google"
                          : "Set during registration"}
                      </p>
                    </div>
                  </div>
                  {!user.googleId && (
                    <button
                      onClick={() => setShowPasswordModal(true)}
                      className="text-accent text-xs font-bold hover:underline"
                    >
                      Change
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* 2FA — only show if real data exists */}
            {/* <p className="text-second_text text-xs mt-6">
              Two-factor authentication is{" "}
              <span className="text-accent font-bold">Enabled</span>
            </p> */}
          </div>
        </Section>

        {/* ── Recent Watchlist ──────────────────── */}
        <Section delay={0.15}>
          <div className="bg-panel_bg border border-glass_border rounded-xl p-6 flex flex-col h-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <LuPlay className="text-accent" />
                Recent Watchlist
              </h2>
              <Link
                href="/userpanal/watchlist"
                className="text-accent text-xs font-bold hover:underline"
              >
                View All
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-2 flex-1">
              {watchlistList?.items && watchlistList.items.length > 0 ? (
                watchlistList.items.slice(0, 3).map((item) => (
                  <MoviePoster
                    key={item.tmdbId}
                    title={item.title}
                    imgSrc={
                      item.posterPath
                        ? `https://image.tmdb.org/t/p/w342${item.posterPath}`
                        : undefined
                    }
                  />
                ))
              ) : (
                <>
                  <MoviePoster title="No items yet" />
                  <div />
                  <div />
                </>
              )}
            </div>
          </div>
        </Section>
      </div>

      {/* ── Recent Activity ────────────────────────── */}
      <Section delay={0.2}>
        <div className="bg-panel_bg border border-glass_border rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <LuHistory className="text-accent" />
            Recent Activity
          </h2>

          <div className="space-y-1">
            {/* Activity 1 */}
            <div className="flex items-center justify-between p-3.5 hover:bg-white/5 rounded-lg transition-colors border-b border-glass_border last:border-0">
              <div className="flex items-center gap-3">
                <ActivityIcon
                  className="bg-accent/10 text-accent"
                  icon={<LuCircle className="size-5" />}
                />
                <div>
                  <p className="text-sm text-white font-medium">
                    Finished watching &quot;The Dark Frontier&quot;
                  </p>
                  <p className="text-xs text-second_text">
                    Season 2, Episode 8 • Today at 10:45 PM
                  </p>
                </div>
              </div>
              <span className="text-xs font-bold text-accent shrink-0 ml-3">
                +150 XP
              </span>
            </div>

            {/* Activity 2 */}
            <div className="flex items-center justify-between p-3.5 hover:bg-white/5 rounded-lg transition-colors border-b border-glass_border last:border-0">
              <div className="flex items-center gap-3">
                <ActivityIcon
                  className="bg-secondery/10 text-secondery"
                  icon={<LuStar className="size-5" />}
                />
                <div>
                  <p className="text-sm text-white font-medium">
                    Rated &quot;Noir City&quot; 4.5 Stars
                  </p>
                  <p className="text-xs text-second_text">
                    Feature Film • Yesterday
                  </p>
                </div>
              </div>
              <span className="text-xs font-bold text-secondery shrink-0 ml-3">
                Updated
              </span>
            </div>

            {/* Activity 3 */}
            <div className="flex items-center justify-between p-3.5 hover:bg-white/5 rounded-lg transition-colors border-b border-glass_border last:border-0">
              <div className="flex items-center gap-3">
                <ActivityIcon
                  className="bg-purble/10 text-purble"
                  icon={<LuCreditCard className="size-5" />}
                />
                <div>
                  <p className="text-sm text-white font-medium">
                    Subscription renewed
                  </p>
                  <p className="text-xs text-second_text">
                    Annual Premium Plan • Oct 12, 2024
                  </p>
                </div>
              </div>
              <button className="text-second_text hover:text-white transition-colors shrink-0 ml-3">
                <LuDownload className="size-4" />
              </button>
            </div>
          </div>
        </div>
      </Section>

      {/* ── Change Password Modal ──────────────────── */}
      {user.id && (
        <ChangePasswordModal
          isOpen={showPasswordModal}
          onClose={() => setShowPasswordModal(false)}
          userId={user.id}
        />
      )}
    </div>
  );
}
