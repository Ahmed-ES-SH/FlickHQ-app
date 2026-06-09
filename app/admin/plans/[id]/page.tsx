"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  fetchAdminPlanDetailAction,
  updateAdminPlanAction,
  archiveAdminPlanAction,
  addAdminPriceAction,
  deactivateAdminPriceAction,
} from "@/app/_actions/plans";
import type { PlanResponseDto, PriceResponseDto } from "@/app/types/subscriptions";
import {
  BillingPlanStatus,
  BillingPriceType,
  BillingRecurringInterval,
} from "@/app/types/subscriptions";
import { VscLoading } from "react-icons/vsc";
import { FaArrowLeft, FaPlus, FaArchive } from "react-icons/fa";

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

// ─── Helpers ────────────────────────────────────────

function formatAmount(amount: number, currency: string): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount / 100);
}

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

function DetailSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-8 bg-fourth_color rounded w-1/3" />
      <div className="h-4 bg-fourth_color rounded w-1/2" />
      <div className="h-40 bg-fourth_color rounded-lg" />
      <div className="h-40 bg-fourth_color rounded-lg" />
    </div>
  );
}

// ─── Props ──────────────────────────────────────────

type Props = {
  params: Promise<{ id: string }>;
};

// ─── Page ───────────────────────────────────────────

export default function AdminPlanDetailPage({ params }: Props) {
  const { id } = use(params);
  const router = useRouter();

  const [plan, setPlan] = useState<PlanResponseDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [archiving, setArchiving] = useState(false);

  // Edit form state
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editDisplayOrder, setEditDisplayOrder] = useState(0);
  const [editIcon, setEditIcon] = useState("");
  const [editHighlight, setEditHighlight] = useState(false);
  const [editFeatures, setEditFeatures] = useState<string[]>([]);
  const [featureInput, setFeatureInput] = useState("");

  // Price form state
  const [showPriceForm, setShowPriceForm] = useState(false);
  const [priceStripeId, setPriceStripeId] = useState("");
  const [priceCurrency, setPriceCurrency] = useState("usd");
  const [priceUnitAmount, setPriceUnitAmount] = useState<number>(0);
  const [priceType, setPriceType] = useState<BillingPriceType>(BillingPriceType.RECURRING);
  const [priceInterval, setPriceInterval] = useState<BillingRecurringInterval>(BillingRecurringInterval.MONTH);
  const [priceTrialDays, setPriceTrialDays] = useState<number>(0);
  const [priceActive, setPriceActive] = useState(true);
  const [savingPrice, setSavingPrice] = useState(false);

  const fetchPlan = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetchAdminPlanDetailAction(id);
      if (res.success && res.data) {
        setPlan(res.data);
        // Populate edit form
        setEditName(res.data.name);
        setEditDescription(res.data.description ?? "");
        setEditDisplayOrder(res.data.displayOrder);
        setEditIcon(res.data.icon ?? "");
        setEditHighlight(res.data.highlight);
        setEditFeatures(res.data.features ?? []);
      } else {
        setError(res.message || "Failed to load plan.");
      }
    } catch {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlan();
  }, [id]);

  // ── Update plan ──────────────────────────────────

  const handleUpdate = async () => {
    setSaving(true);
    try {
      const res = await updateAdminPlanAction(id, {
        name: editName,
        description: editDescription || null,
        displayOrder: editDisplayOrder,
        icon: editIcon || null,
        highlight: editHighlight,
        features: editFeatures,
      });

      if (res.success) {
        toast.success("Plan updated successfully!");
        fetchPlan();
      } else {
        if (res.statusCode === 409) {
          toast.error("Cannot update an archived plan.");
        } else {
          toast.error(res.message || "Failed to update plan.");
        }
      }
    } catch {
      toast.error("An unexpected error occurred.");
    } finally {
      setSaving(false);
    }
  };

  // ── Archive plan ─────────────────────────────────

  const handleArchive = async () => {
    if (!confirm(`Are you sure you want to archive "${plan?.name}"? This action cannot be undone.`)) return;

    setArchiving(true);
    try {
      const res = await archiveAdminPlanAction(id);
      if (res.success) {
        toast.success(`"${plan?.name}" has been archived.`);
        fetchPlan();
      } else {
        toast.error(res.message || "Failed to archive plan.");
      }
    } catch {
      toast.error("An unexpected error occurred.");
    } finally {
      setArchiving(false);
    }
  };

  // ── Add price ────────────────────────────────────

  const handleAddPrice = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!priceStripeId.trim()) {
      toast.error("Stripe Price ID is required.");
      return;
    }
    if (priceUnitAmount <= 0) {
      toast.error("Unit amount must be greater than 0.");
      return;
    }

    setSavingPrice(true);
    try {
      const res = await addAdminPriceAction(id, {
        stripePriceId: priceStripeId.trim(),
        currency: priceCurrency.toLowerCase(),
        unitAmount: priceUnitAmount,
        type: priceType,
        interval: priceType === BillingPriceType.RECURRING ? priceInterval : null,
        trialPeriodDays: priceTrialDays > 0 ? priceTrialDays : null,
        active: priceActive,
      });

      if (res.success) {
        toast.success("Price added successfully!");
        setShowPriceForm(false);
        // Reset form
        setPriceStripeId("");
        setPriceUnitAmount(0);
        setPriceTrialDays(0);
        setPriceActive(true);
        fetchPlan();
      } else {
        toast.error(res.message || "Failed to add price.");
      }
    } catch {
      toast.error("An unexpected error occurred.");
    } finally {
      setSavingPrice(false);
    }
  };

  // ── Deactivate price ─────────────────────────────

  const handleDeactivatePrice = async (priceId: string) => {
    if (!confirm("Are you sure you want to deactivate this price?")) return;

    try {
      const res = await deactivateAdminPriceAction(priceId);
      if (res.success) {
        toast.success("Price deactivated.");
        fetchPlan();
      } else {
        toast.error(res.message || "Failed to deactivate price.");
      }
    } catch {
      toast.error("An unexpected error occurred.");
    }
  };

  // ── Feature management ───────────────────────────

  const addEditFeature = () => {
    const trimmed = featureInput.trim();
    if (!trimmed) return;
    if (editFeatures.includes(trimmed)) {
      toast.error("Feature already added");
      return;
    }
    setEditFeatures((prev) => [...prev, trimmed]);
    setFeatureInput("");
  };

  const removeEditFeature = (index: number) => {
    setEditFeatures((prev) => prev.filter((_, i) => i !== index));
  };

  // ── Loading / Error states ───────────────────────

  if (loading) {
    return (
      <div className="p-4">
        <DetailSkeleton />
      </div>
    );
  }

  if (error || !plan) {
    return (
      <div className="p-4">
        <Link
          href="/admin/plans"
          className="text-sm text-accent hover:underline inline-flex items-center gap-1 mb-4"
        >
          <FaArrowLeft className="size-3" />
          Back to Plans
        </Link>
        <div className="rounded-xl border border-glass_border bg-fourth_color p-8 text-center">
          <p className="text-red-400 mb-3">{error || "Plan not found."}</p>
          <button
            onClick={fetchPlan}
            className="px-4 py-2 bg-accent text-white rounded-lg text-sm hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const isArchived = plan.status === BillingPlanStatus.ARCHIVED;
  const badge = STATUS_BADGE[plan.status] ?? STATUS_BADGE.draft;
  const activePrices = plan.prices?.filter((p) => p.active) ?? [];
  const inactivePrices = plan.prices?.filter((p) => !p.active) ?? [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/admin/plans"
          className="text-sm text-accent hover:underline inline-flex items-center gap-1 mb-2"
        >
          <FaArrowLeft className="size-3" />
          Back to Plans
        </Link>
        <div className="flex items-center gap-3 flex-wrap">
          <h1 className="text-2xl lg:text-3xl font-bold text-white">
            {plan.name}
          </h1>
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}
          >
            {badge.label}
          </span>
        </div>
        <p className="text-gray-400 mt-1 text-sm">
          Code: <span className="font-mono text-gray-500">{plan.code}</span>
          {" · "}Created {formatDateTime(plan.createdAt)}
        </p>
      </div>

      {/* Archive action */}
      {!isArchived && (
        <div className="mb-6 p-4 rounded-xl border border-red-900/30 bg-red-900/10">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <p className="text-sm text-gray-300 font-medium">Archive this plan</p>
              <p className="text-xs text-gray-500 mt-0.5">
                Archived plans are hidden from the public pricing page and cannot be subscribed to.
              </p>
            </div>
            <button
              onClick={handleArchive}
              disabled={archiving}
              className="inline-flex items-center gap-2 px-4 py-2 bg-red-900/50 text-red-400 rounded-lg text-sm hover:bg-red-900/70 transition-colors disabled:opacity-50"
            >
              {archiving ? (
                <VscLoading className="size-4 animate-spin" />
              ) : (
                <FaArchive className="size-4" />
              )}
              Archive Plan
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* ── Edit Form ──────────────────────────────── */}
        <div className="rounded-xl border border-glass_border bg-fourth_color overflow-hidden">
          <div className="px-6 py-4 border-b border-glass_border">
            <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wide">
              Plan Details
            </h2>
          </div>
          <div className="p-6 space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Name</label>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full px-3 py-2.5 bg-[#141414] border border-glass_border rounded-lg text-white text-sm focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/30 transition-colors"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Description</label>
              <textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                rows={2}
                className="w-full px-3 py-2.5 bg-[#141414] border border-glass_border rounded-lg text-white text-sm focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/30 transition-colors resize-none"
              />
            </div>

            {/* Display Order & Icon */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Display Order</label>
                <input
                  type="number"
                  value={editDisplayOrder}
                  onChange={(e) => setEditDisplayOrder(parseInt(e.target.value) || 0)}
                  min={0}
                  className="w-full px-3 py-2.5 bg-[#141414] border border-glass_border rounded-lg text-white text-sm focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/30 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Icon URL</label>
                <input
                  type="text"
                  value={editIcon}
                  onChange={(e) => setEditIcon(e.target.value)}
                  className="w-full px-3 py-2.5 bg-[#141414] border border-glass_border rounded-lg text-white text-sm focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/30 transition-colors"
                />
              </div>
            </div>

            {/* Highlight toggle */}
            <div>
              <label className="flex items-center gap-3 cursor-pointer">
                <div
                  onClick={() => setEditHighlight(!editHighlight)}
                  className={`relative w-10 h-5 rounded-full transition-colors ${
                    editHighlight ? "bg-accent" : "bg-gray-700"
                  }`}
                >
                  <div
                    className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                      editHighlight ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </div>
                <span className="text-sm text-gray-300">Highlight as Popular</span>
              </label>
            </div>

            {/* Features */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Features</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={featureInput}
                  onChange={(e) => setFeatureInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addEditFeature();
                    }
                  }}
                  placeholder="Add a feature key"
                  className="flex-1 px-3 py-2.5 bg-[#141414] border border-glass_border rounded-lg text-white text-sm placeholder-gray-600 focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/30 transition-colors"
                />
                <button
                  type="button"
                  onClick={addEditFeature}
                  className="px-3 py-2.5 bg-accent text-white rounded-lg text-sm hover:bg-red-700 transition-colors"
                >
                  <FaPlus className="size-4" />
                </button>
              </div>
              {editFeatures.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {editFeatures.map((feature, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-white/5 text-gray-300 border border-glass_border"
                    >
                      {feature}
                      <button
                        type="button"
                        onClick={() => removeEditFeature(index)}
                        className="text-gray-500 hover:text-red-400 transition-colors"
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Save button */}
            <div className="pt-2">
              <button
                onClick={handleUpdate}
                disabled={saving || isArchived}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-accent text-white rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {saving ? (
                  <>
                    <VscLoading className="size-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </button>
              {isArchived && (
                <p className="text-xs text-gray-500 mt-2">
                  Archived plans cannot be edited.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* ── Prices Section ─────────────────────────── */}
        <div className="space-y-4">
          {/* Active Prices */}
          <div className="rounded-xl border border-glass_border bg-fourth_color overflow-hidden">
            <div className="px-6 py-4 border-b border-glass_border flex items-center justify-between">
              <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wide">
                Prices ({activePrices.length + inactivePrices.length})
              </h2>
              {!isArchived && (
                <button
                  onClick={() => setShowPriceForm(!showPriceForm)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-accent text-white rounded-lg text-xs font-medium hover:bg-red-700 transition-colors"
                >
                  <FaPlus className="size-3" />
                  Add Price
                </button>
              )}
            </div>

            {/* Active prices list */}
            {activePrices.length > 0 && (
              <div className="divide-y divide-glass_border/50">
                {activePrices.map((price) => (
                  <div key={price.id} className="p-4 hover:bg-white/5 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-white font-medium">
                            {formatAmount(price.unitAmount, price.currency)}
                          </span>
                          <span className="text-xs px-1.5 py-0.5 rounded-full bg-green-900/30 text-green-400">
                            Active
                          </span>
                        </div>
                        <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                          <span className="capitalize">{price.type.replace("_", " ")}</span>
                          {price.interval && (
                            <span>/ {price.interval}</span>
                          )}
                          {price.trialPeriodDays && (
                            <span>{price.trialPeriodDays}d trial</span>
                          )}
                          <span className="uppercase">{price.currency}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {!isArchived && (
                          <button
                            onClick={() => handleDeactivatePrice(price.id)}
                            className="text-xs text-gray-500 hover:text-red-400 transition-colors"
                          >
                            Deactivate
                          </button>
                        )}
                      </div>
                    </div>
                    <p className="text-[10px] text-gray-600 mt-1 font-mono truncate">
                      {price.stripePriceId}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Inactive prices */}
            {inactivePrices.length > 0 && (
              <div className="border-t border-glass_border">
                <div className="px-4 py-2">
                  <p className="text-[11px] text-gray-600 font-medium uppercase tracking-wide">
                    Deactivated ({inactivePrices.length})
                  </p>
                </div>
                <div className="divide-y divide-glass_border/50">
                  {inactivePrices.map((price) => (
                    <div key={price.id} className="p-3 opacity-60">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400 text-sm">
                          {formatAmount(price.unitAmount, price.currency)}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-gray-800/50 text-gray-500">
                          Inactive
                        </span>
                      </div>
                      <p className="text-[10px] text-gray-600 mt-0.5 font-mono">
                        {price.stripePriceId}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Empty state */}
            {activePrices.length === 0 && inactivePrices.length === 0 && (
              <div className="p-8 text-center">
                <p className="text-gray-500 text-sm">No prices yet.</p>
                {!isArchived && (
                  <p className="text-xs text-gray-600 mt-1">
                    Add a price to allow subscriptions.
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Add Price Form */}
          {showPriceForm && !isArchived && (
            <div className="rounded-xl border border-accent/20 bg-accent/5 overflow-hidden">
              <div className="px-6 py-4 border-b border-accent/10">
                <h2 className="text-sm font-medium text-accent">Add Price</h2>
              </div>
              <form onSubmit={handleAddPrice} className="p-6 space-y-4">
                {/* Stripe Price ID */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">
                    Stripe Price ID <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={priceStripeId}
                    onChange={(e) => setPriceStripeId(e.target.value)}
                    placeholder="price_1ABCxyz"
                    className="w-full px-3 py-2.5 bg-[#141414] border border-glass_border rounded-lg text-white text-sm placeholder-gray-600 font-mono focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/30 transition-colors"
                  />
                </div>

                {/* Currency & Amount */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">Currency</label>
                    <input
                      type="text"
                      value={priceCurrency}
                      onChange={(e) => setPriceCurrency(e.target.value)}
                      placeholder="usd"
                      className="w-full px-3 py-2.5 bg-[#141414] border border-glass_border rounded-lg text-white text-sm placeholder-gray-600 font-mono focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/30 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">
                      Amount (cents)
                    </label>
                    <input
                      type="number"
                      value={priceUnitAmount || ""}
                      onChange={(e) => setPriceUnitAmount(parseInt(e.target.value) || 0)}
                      min={1}
                      placeholder="1900"
                      className="w-full px-3 py-2.5 bg-[#141414] border border-glass_border rounded-lg text-white text-sm placeholder-gray-600 focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/30 transition-colors"
                    />
                  </div>
                </div>
                <p className="text-xs text-gray-600 -mt-2">
                  Amount in minor units (e.g. 1900 = $19.00)
                </p>

                {/* Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Type</label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setPriceType(BillingPriceType.RECURRING)}
                      className={`flex-1 px-3 py-2 rounded-lg text-sm transition-colors ${
                        priceType === BillingPriceType.RECURRING
                          ? "bg-accent text-white"
                          : "bg-[#141414] text-gray-400 border border-glass_border hover:border-accent/30"
                      }`}
                    >
                      Recurring
                    </button>
                    <button
                      type="button"
                      onClick={() => setPriceType(BillingPriceType.ONE_TIME)}
                      className={`flex-1 px-3 py-2 rounded-lg text-sm transition-colors ${
                        priceType === BillingPriceType.ONE_TIME
                          ? "bg-accent text-white"
                          : "bg-[#141414] text-gray-400 border border-glass_border hover:border-accent/30"
                      }`}
                    >
                      One-Time
                    </button>
                  </div>
                </div>

                {/* Interval (recurring only) */}
                {priceType === BillingPriceType.RECURRING && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1.5">Interval</label>
                      <select
                        value={priceInterval}
                        onChange={(e) => setPriceInterval(e.target.value as BillingRecurringInterval)}
                        className="w-full px-3 py-2.5 bg-[#141414] border border-glass_border rounded-lg text-white text-sm focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/30 transition-colors"
                      >
                        <option value={BillingRecurringInterval.DAY}>Day</option>
                        <option value={BillingRecurringInterval.WEEK}>Week</option>
                        <option value={BillingRecurringInterval.MONTH}>Month</option>
                        <option value={BillingRecurringInterval.YEAR}>Year</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1.5">
                        Trial Days
                      </label>
                      <input
                        type="number"
                        value={priceTrialDays || ""}
                        onChange={(e) => setPriceTrialDays(parseInt(e.target.value) || 0)}
                        min={0}
                        max={365}
                        className="w-full px-3 py-2.5 bg-[#141414] border border-glass_border rounded-lg text-white text-sm focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/30 transition-colors"
                      />
                    </div>
                  </div>
                )}

                {/* Active toggle */}
                <div>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <div
                      onClick={() => setPriceActive(!priceActive)}
                      className={`relative w-10 h-5 rounded-full transition-colors ${
                        priceActive ? "bg-accent" : "bg-gray-700"
                      }`}
                    >
                      <div
                        className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                          priceActive ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </div>
                    <span className="text-sm text-gray-300">Active on creation</span>
                  </label>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowPriceForm(false)}
                    className="px-4 py-2 bg-white/5 text-gray-300 rounded-lg text-sm hover:bg-white/10 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={savingPrice}
                    className="inline-flex items-center gap-2 px-6 py-2 bg-accent text-white rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {savingPrice ? (
                      <>
                        <VscLoading className="size-4 animate-spin" />
                        Adding...
                      </>
                    ) : (
                      "Add Price"
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
