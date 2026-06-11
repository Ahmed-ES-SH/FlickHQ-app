"use client";

// //////////////////////////////////////////////////////////////////////////////
// ///////// ContactMessagesClient — Contact Messages page main component ///////
// //////////////////////////////////////////////////////////////////////////////

import { useMemo, useState } from "react";
import {
  LuMail,
  LuMessageSquare,
  LuClock,
  LuSearch,
  LuUser,
  LuLoader,
  LuInbox,
} from "react-icons/lu";
import { IoCheckmarkCircle } from "react-icons/io5";
import { useAuthStore } from "@/app/_stores/authStore";
import { FadeIn } from "@/app/_components/_globalComponents/FadeIn";
import { STATIC_CONTACT_MESSAGES } from "@/app/data/userpanal/contactMessages";
import { formatDateTime, getTimeAgo } from "@/app/_helpers/userpanal/contactMessages";
import type { UserContactMessage } from "@/app/types/contact";

// ─── Page ──────────────────────────────────────────

export default function ContactMessagesClient() {
  const user = useAuthStore((s) => s.user);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMessage, setSelectedMessage] =
    useState<UserContactMessage | null>(null);

  // ── Filter messages by search ────────────────────

  const filteredMessages = useMemo(() => {
    if (!searchQuery.trim()) return STATIC_CONTACT_MESSAGES;
    const query = searchQuery.toLowerCase();
    return STATIC_CONTACT_MESSAGES.filter(
      (msg) =>
        msg.subject.toLowerCase().includes(query) ||
        msg.message.toLowerCase().includes(query) ||
        msg.fullName.toLowerCase().includes(query),
    );
  }, [searchQuery]);

  // ── Stats ───────────────────────────────────────

  const stats = useMemo(() => {
    const total = STATIC_CONTACT_MESSAGES.length;
    const replied = STATIC_CONTACT_MESSAGES.filter((m) => m.repliedAt).length;
    const pending = total - replied;
    return { total, replied, pending };
  }, []);

  // ── Loading state ───────────────────────────────

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <LuLoader className="size-8 text-accent animate-spin" />
      </div>
    );
  }

  // ── Render ──────────────────────────────────────

  return (
    <div className="space-y-6">
      {/* Header */}
      <FadeIn delay={0}>
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <LuMail className="text-accent" />
            Contact Messages
          </h1>
          <p className="text-second_text text-sm mt-1">
            Your submitted messages and their status
          </p>
        </div>
      </FadeIn>

      {/* Stats cards */}
      <FadeIn delay={0.05}>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-panel_bg border border-white/5 rounded-xl p-4 text-center">
            <span className="text-2xl font-bold text-accent">{stats.total}</span>
            <p className="text-[11px] text-second_text uppercase tracking-widest mt-1">
              Total
            </p>
          </div>
          <div className="bg-panel_bg border border-white/5 rounded-xl p-4 text-center">
            <span className="text-2xl font-bold text-green-400">{stats.replied}</span>
            <p className="text-[11px] text-second_text uppercase tracking-widest mt-1">
              Replied
            </p>
          </div>
          <div className="bg-panel_bg border border-white/5 rounded-xl p-4 text-center">
            <span className="text-2xl font-bold text-yellow-400">{stats.pending}</span>
            <p className="text-[11px] text-second_text uppercase tracking-widest mt-1">
              Pending
            </p>
          </div>
        </div>
      </FadeIn>

      {/* Search bar */}
      <FadeIn delay={0.1}>
        <div className="relative">
          <LuSearch className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-second_text" />
          <input
            type="text"
            placeholder="Search messages by subject, content, or name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-panel_bg border border-white/5 rounded-xl py-3 pl-11 pr-4 text-sm text-white placeholder-second_text outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20 transition-colors"
          />
        </div>
      </FadeIn>

      {/* Content area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Messages list */}
        <FadeIn delay={0.15}>
          <div className="bg-panel_bg border border-white/5 rounded-xl overflow-hidden">
            {filteredMessages.length === 0 ? (
              <div className="py-16 text-center space-y-3">
                <LuInbox className="size-10 text-gray-600 mx-auto" />
                <p className="text-sm text-second_text">No messages found.</p>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="text-accent text-xs font-medium hover:underline"
                  >
                    Clear search
                  </button>
                )}
              </div>
            ) : (
              <div className="divide-y divide-white/5">
                {filteredMessages.map((msg) => (
                  <button
                    key={msg.id}
                    onClick={() => setSelectedMessage(msg)}
                    className={`w-full text-left p-4 transition-all hover:bg-white/5 ${
                      selectedMessage?.id === msg.id
                        ? "bg-accent/5 border-l-2 border-accent"
                        : ""
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-7 h-7 rounded-full bg-accent/20 flex items-center justify-center shrink-0">
                            <LuUser className="size-3.5 text-accent" />
                          </div>
                          <span className="text-sm font-medium text-white truncate">
                            {msg.fullName}
                          </span>
                          <span className="text-[10px] text-second_text shrink-0">
                            {getTimeAgo(msg.createdAt)}
                          </span>
                        </div>
                        <p className="text-sm text-white font-medium truncate mt-1">
                          {msg.subject}
                        </p>
                        <p className="text-xs text-second_text mt-0.5 line-clamp-2">
                          {msg.message}
                        </p>
                      </div>
                      <div className="shrink-0">
                        {msg.repliedAt ? (
                          <span className="flex items-center gap-1 text-[10px] text-green-400 font-medium">
                            <IoCheckmarkCircle className="size-3" />
                            Replied
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-[10px] text-yellow-400 font-medium">
                            <LuClock className="size-3" />
                            Pending
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </FadeIn>

        {/* Message detail panel */}
        <FadeIn delay={0.2}>
          <div className="bg-panel_bg border border-white/5 rounded-xl p-6 min-h-[300px] flex flex-col">
            {selectedMessage ? (
              <>
                {/* Status badge */}
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-lg font-semibold text-white truncate pr-3">
                    {selectedMessage.subject}
                  </h3>
                  {selectedMessage.repliedAt ? (
                    <span className="flex items-center gap-1.5 px-3 py-1 bg-green-900/30 text-green-400 rounded-full text-[11px] font-medium shrink-0">
                      <IoCheckmarkCircle className="size-3.5" />
                      Replied
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 px-3 py-1 bg-yellow-900/30 text-yellow-400 rounded-full text-[11px] font-medium shrink-0">
                      <LuClock className="size-3.5" />
                      Pending
                    </span>
                  )}
                </div>

                {/* Sender info */}
                <div className="flex items-center gap-3 p-3 bg-fourth_color rounded-xl border border-white/5 mb-4">
                  <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center shrink-0">
                    <LuUser className="size-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm text-white font-medium">
                      {selectedMessage.fullName}
                    </p>
                    <p className="text-xs text-second_text">
                      {selectedMessage.email}
                    </p>
                  </div>
                </div>

                {/* Timestamps */}
                <div className="space-y-1 mb-4">
                  <div className="flex items-center gap-2 text-xs text-second_text">
                    <LuClock className="size-3.5" />
                    <span>Sent: {formatDateTime(selectedMessage.createdAt)}</span>
                  </div>
                  {selectedMessage.repliedAt && (
                    <div className="flex items-center gap-2 text-xs text-green-400/70">
                      <IoCheckmarkCircle className="size-3.5" />
                      <span>
                        Replied: {formatDateTime(selectedMessage.repliedAt)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Divider */}
                <div className="h-px bg-white/5 mb-4" />

                {/* Message body */}
                <div className="flex-1 overflow-y-auto">
                  <p className="text-sm text-gray-200 leading-relaxed whitespace-pre-wrap">
                    {selectedMessage.message}
                  </p>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center flex-1 text-center">
                <LuMessageSquare className="size-12 text-gray-600 mb-3" />
                <p className="text-sm text-second_text">Select a message</p>
                <p className="text-xs text-second_text mt-1">
                  Click on a message from the list to view its details.
                </p>
              </div>
            )}
          </div>
        </FadeIn>
      </div>

      {/* Footer note */}
      <FadeIn delay={0.25}>
        <div className="bg-fourth_color border border-white/5 rounded-xl p-4 text-center">
          <p className="text-xs text-second_text">
            Showing your most recent contact messages. For full message history,
            please contact support.
          </p>
        </div>
      </FadeIn>
    </div>
  );
}
