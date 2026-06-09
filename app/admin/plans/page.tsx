"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  fetchAdminPlansAction,
  archiveAdminPlanAction,
} from "@/app/_actions/plans";
import type { PlanResponseDto } from "@/app/types/subscriptions";
import { BillingPlanStatus } from "@/app/types/subscriptions";
import { FaPlus, FaArchive, FaEdit, FaLayerGroup } from "react-icons/fa";

// ─── Status badge config ───────────────────────────

const STATUS_BADGE: Record<
  BillingPlanStatus,
  { bg: string; text: string; label: string }
> = {
  [BillingPlanStatus.DRAFT]: {
    bg: "bg-gray-800/50",
    text: "text-gray-400",
    label: "Draft",
  },
  [BillingPlanStatus.ACTIVE]: {
    bg: "bg-green-900/50",
    text: "text-green-400",
    label: "Active",
  },
  [BillingPlanStatus.ARCHIVED]: {
    bg: "bg-red-900/50",
    text: "text-red-400",
    label: "Archived",
  },
};

const STATUS_TABS = [
  { label: "All", value: "" },
  { label: "Active", value: "active" },
  { label: "Draft", value: "draft" },
  { label: "Archived", value: "archived" },
];

// ─── Helpers ────────────────────────────────────────

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatDateTime(dateStr: string): string {
  return new Date(dateStr).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ─── Skeleton ───────────────────────────────────────

function TableSkeleton() {
  return (
    <div className="animate-pulse space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="h-14 bg-fourth_color rounded-lg border border-glass_border"
        />
      ))}
    </div>
  );
}

// ─── Page ───────────────────────────────────────────

export default function AdminPlansPage() {
  const router = useRouter();
  const [plans, setPlans] = useState<PlanResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState("");
  const [archivingId, setArchivingId] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetchAdminPlansAction(statusFilter || undefined);
      if (res.success && res.data) {
        setPlans(res.data);
      } else {
        setError(res.message || "Failed to load plans.");
      }
    } catch {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleArchive = async (planId: string, planName: string) => {
    if (!confirm(`Are you sure you want to archive "${planName}"? This action cannot be undone.`)) {
      return;
    }

    setArchivingId(planId);
    try {
      const res = await archiveAdminPlanAction(planId);
      if (res.success) {
        toast.success(`"${planName}" has been archived.`);
        fetchData();
      } else {
        toast.error(res.message || "Failed to archive plan.");
      }
    } catch {
      toast.error("An unexpected error occurred.");
    } finally {
      setArchivingId(null);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white">Plans</h1>
          <p className="text-gray-400 mt-1 text-sm">
            Manage subscription plans and pricing.
          </p>
        </div>
        <Link
          href="/admin/plans/create"
          className="inline-flex items-center gap-2 bg-accent hover:bg-red-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
        >
          <FaPlus className="size-4" />
          Create Plan
        </Link>
      </div>

      {/* Status filter tabs */}
      <div className="flex items-center gap-1 mb-4 border-b border-glass_border">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setStatusFilter(tab.value)}
            className={`px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-[1px] ${
              statusFilter === tab.value
                ? "text-white border-accent"
                : "text-gray-500 border-transparent hover:text-gray-300"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content card */}
      <div className="rounded-xl border border-glass_border bg-fourth_color overflow-hidden">
        {/* Error state */}
        {error && !loading && (
          <div className="p-8 text-center">
            <p className="text-red-400 mb-3">{error}</p>
            <button
              onClick={fetchData}
              className="px-4 py-2 bg-accent text-white rounded-lg text-sm hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Loading state */}
        {loading && <div className="p-4"><TableSkeleton /></div>}

        {/* Empty state */}
        {!loading && !error && plans.length === 0 && (
          <div className="p-8 text-center">
            <div className="flex flex-col items-center gap-3">
              <FaLayerGroup className="size-12 text-gray-600" />
              <p className="text-gray-400">
                {statusFilter
                  ? `No ${statusFilter} plans found.`
                  : "No plans found."}
              </p>
              <Link
                href="/admin/plans/create"
                className="text-accent hover:underline text-sm font-medium"
              >
                Create your first plan →
              </Link>
            </div>
          </div>
        )}

        {/* Table */}
        {!loading && !error && plans.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-glass_border text-gray-400 text-left">
                  <th className="px-4 py-3 font-medium">Code</th>
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium hidden sm:table-cell">Prices</th>
                  <th className="px-4 py-3 font-medium hidden md:table-cell">Order</th>
                  <th className="px-4 py-3 font-medium hidden lg:table-cell">Created</th>
                  <th className="px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {plans.map((plan) => {
                  const badge = STATUS_BADGE[plan.status] ?? STATUS_BADGE.draft;
                  const isArchived = plan.status === BillingPlanStatus.ARCHIVED;

                  return (
                    <tr
                      key={plan.id}
                      className="border-b border-glass_border/50 hover:bg-white/5 transition-colors"
                    >
                      <td className="px-4 py-3 text-gray-300 font-mono text-xs">
                        {plan.code}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className="text-white font-medium">
                            {plan.name}
                          </span>
                          {plan.highlight && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-secondery/20 text-secondery font-medium">
                              Popular
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}
                        >
                          {badge.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-300 hidden sm:table-cell">
                        {plan.prices?.length ?? 0}
                      </td>
                      <td className="px-4 py-3 text-gray-300 hidden md:table-cell">
                        {plan.displayOrder}
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-xs hidden lg:table-cell">
                        {formatDate(plan.createdAt)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => router.push(`/admin/plans/${plan.id}`)}
                            className="p-1.5 rounded-md hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                            title="Edit plan"
                          >
                            <FaEdit className="size-4" />
                          </button>
                          {!isArchived && (
                            <button
                              onClick={() => handleArchive(plan.id, plan.name)}
                              disabled={archivingId === plan.id}
                              className="p-1.5 rounded-md hover:bg-white/10 text-gray-400 hover:text-red-400 transition-colors disabled:opacity-50"
                              title="Archive plan"
                            >
                              <FaArchive className="size-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </motion.div>
  );
}
