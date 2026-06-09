"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { createAdminPlanAction } from "@/app/_actions/plans";
import { VscLoading } from "react-icons/vsc";
import { FaArrowLeft, FaPlus } from "react-icons/fa";

interface FormData {
  code: string;
  name: string;
  description: string;
  features: string[];
  displayOrder: number;
  icon: string;
  highlight: boolean;
}

interface FormErrors {
  code?: string;
  name?: string;
  features?: string;
}

export default function CreatePlanPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    code: "",
    name: "",
    description: "",
    features: [],
    displayOrder: 0,
    icon: "",
    highlight: false,
  });
  const [featureInput, setFeatureInput] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});

  // ── Validation ───────────────────────────────────

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.code.trim()) {
      newErrors.code = "Code is required (slug format, e.g. 'pro_monthly')";
    } else if (!/^[a-z0-9_]+$/.test(formData.code)) {
      newErrors.code = "Code must be a slug (lowercase, numbers, underscores only)";
    } else if (formData.code.length > 50) {
      newErrors.code = "Code must be 50 characters or less";
    }

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.length > 255) {
      newErrors.name = "Name must be 255 characters or less";
    }

    if (formData.features.length === 0) {
      newErrors.features = "Add at least one feature";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ── Feature management ───────────────────────────

  const addFeature = () => {
    const trimmed = featureInput.trim();
    if (!trimmed) return;
    if (formData.features.includes(trimmed)) {
      toast.error("Feature already added");
      return;
    }
    setFormData((prev) => ({
      ...prev,
      features: [...prev.features, trimmed],
    }));
    setFeatureInput("");
  };

  const removeFeature = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addFeature();
    }
  };

  // ── Submit ───────────────────────────────────────

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);

    try {
      const res = await createAdminPlanAction({
        code: formData.code.trim(),
        name: formData.name.trim(),
        description: formData.description.trim() || null,
        features: formData.features,
        displayOrder: formData.displayOrder,
        icon: formData.icon.trim() || null,
        highlight: formData.highlight,
      });

      if (res.success && res.data) {
        toast.success(`Plan "${res.data.name}" created successfully!`);
        router.push(`/admin/plans/${res.data.id}`);
      } else {
        if (res.statusCode === 409) {
          toast.error("A plan with this code already exists.");
        } else {
          toast.error(res.message || "Failed to create plan.");
        }
      }
    } catch {
      toast.error("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  // ── Render ───────────────────────────────────────

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
        <h1 className="text-2xl lg:text-3xl font-bold text-white">
          Create Plan
        </h1>
        <p className="text-gray-400 mt-1 text-sm">
          Create a new subscription plan with prices.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div className="rounded-xl border border-glass_border bg-fourth_color overflow-hidden">
          <div className="p-6 space-y-6">
            {/* Code */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Code <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={formData.code}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, code: e.target.value }))
                }
                placeholder="pro_monthly"
                className="w-full px-3 py-2.5 bg-[#141414] border border-glass_border rounded-lg text-white text-sm placeholder-gray-600 focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/30 transition-colors"
              />
              {errors.code && (
                <p className="mt-1 text-xs text-red-400">{errors.code}</p>
              )}
              <p className="mt-1 text-xs text-gray-600">
                Stable slug code (lowercase, numbers, underscores). Cannot be
                changed later.
              </p>
            </div>

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="Pro Monthly"
                className="w-full px-3 py-2.5 bg-[#141414] border border-glass_border rounded-lg text-white text-sm placeholder-gray-600 focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/30 transition-colors"
              />
              {errors.name && (
                <p className="mt-1 text-xs text-red-400">{errors.name}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                rows={3}
                placeholder="Pro features billed monthly."
                className="w-full px-3 py-2.5 bg-[#141414] border border-glass_border rounded-lg text-white text-sm placeholder-gray-600 focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/30 transition-colors resize-none"
              />
            </div>

            {/* Features */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Features <span className="text-red-400">*</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={featureInput}
                  onChange={(e) => setFeatureInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="e.g. premium_reports"
                  className="flex-1 px-3 py-2.5 bg-[#141414] border border-glass_border rounded-lg text-white text-sm placeholder-gray-600 focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/30 transition-colors"
                />
                <button
                  type="button"
                  onClick={addFeature}
                  className="px-3 py-2.5 bg-accent text-white rounded-lg text-sm hover:bg-red-700 transition-colors"
                >
                  <FaPlus className="size-4" />
                </button>
              </div>
              {errors.features && (
                <p className="mt-1 text-xs text-red-400">{errors.features}</p>
              )}
              {formData.features.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.features.map((feature, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-white/5 text-gray-300 border border-glass_border"
                    >
                      {feature}
                      <button
                        type="button"
                        onClick={() => removeFeature(index)}
                        className="text-gray-500 hover:text-red-400 transition-colors"
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                </div>
              )}
              <p className="mt-1 text-xs text-gray-600">
                Feature keys (e.g. &quot;premium_reports&quot;). Press Enter or click + to add.
              </p>
            </div>

            {/* Display Order & Highlight */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                  Display Order
                </label>
                <input
                  type="number"
                  value={formData.displayOrder}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      displayOrder: parseInt(e.target.value) || 0,
                    }))
                  }
                  min={0}
                  className="w-full px-3 py-2.5 bg-[#141414] border border-glass_border rounded-lg text-white text-sm focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/30 transition-colors"
                />
                <p className="mt-1 text-xs text-gray-600">
                  Lower numbers appear first on pricing page.
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                  Icon URL
                </label>
                <input
                  type="text"
                  value={formData.icon}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, icon: e.target.value }))
                  }
                  placeholder="https://cdn.example.com/icons/pro.svg"
                  className="w-full px-3 py-2.5 bg-[#141414] border border-glass_border rounded-lg text-white text-sm placeholder-gray-600 focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/30 transition-colors"
                />
              </div>
            </div>

            {/* Highlight toggle */}
            <div>
              <label className="flex items-center gap-3 cursor-pointer">
                <div
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      highlight: !prev.highlight,
                    }))
                  }
                  className={`relative w-10 h-5 rounded-full transition-colors ${
                    formData.highlight ? "bg-accent" : "bg-gray-700"
                  }`}
                >
                  <div
                    className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                      formData.highlight ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </div>
                <div>
                  <span className="text-sm text-gray-300 font-medium">
                    Highlight as Popular
                  </span>
                  <p className="text-xs text-gray-600">
                    Show a &quot;Most Popular&quot; badge on this plan.
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-glass_border flex items-center justify-end gap-3">
            <Link
              href="/admin/plans"
              className="px-4 py-2.5 bg-white/5 text-gray-300 rounded-lg text-sm hover:bg-white/10 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-accent text-white rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <>
                  <VscLoading className="size-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Plan"
              )}
            </button>
          </div>
        </div>
      </form>
    </motion.div>
  );
}
