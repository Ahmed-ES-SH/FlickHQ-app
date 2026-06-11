/**
 * stripeAppearance — Stripe Appearance API configuration
 *
 * Maps the FlickHQ design system (cinematic crimson, shadow velvet panels,
 * midnight obsidian backdrop, Outfit font) to Stripe Elements.
 *
 * Usage:
 *   <Elements
 *     stripe={stripePromise}
 *     options={{ clientSecret, appearance: flickhqStripeAppearance }}
 *   >
 *     <PaymentElement />
 *   </Elements>
 */

import type { Appearance } from "@stripe/stripe-js";

const appearanceVariables: Record<string, string> = {
  colorPrimary: "#E50914",
  colorBackground: "#0b0b0b",
  colorText: "#ffffff",
  colorTextSecondary: "#94a3b8",
  colorDanger: "#dc3545",
  fontFamily: "Outfit, ui-sans-serif, system-ui, sans-serif",
  borderRadius: "4px",
  spacingUnit: "4px",
  spacingGridRow: "16px",
  fontSizeBase: "14px",
  fontWeightNormal: "300",
  fontWeightMedium: "500",
  fontWeightBold: "700",
  tabIconColor: "#94a3b8",
  tabIconSelectedColor: "#E50914",
  tabTextColor: "#94a3b8",
  tabTextSelectedColor: "#ffffff",
  tabBackground: "#141414",
  tabBackgroundSelected: "#0b0b0b",
};

export const flickhqStripeAppearance: Appearance = {
  theme: "night",
  variables: appearanceVariables,
  rules: {
    ".Input": {
      backgroundColor: "#141414",
      border: "1px solid rgba(255, 255, 255, 0.08)",
      color: "#ffffff",
      padding: "12px 14px",
      fontSize: "14px",
      transition: "border-color 200ms cubic-bezier(0.16, 1, 0.3, 1)",
    },
    ".Input:focus": {
      border: "1px solid rgba(255, 255, 255, 0.2)",
      boxShadow: "0 0 20px rgba(229, 9, 20, 0.15)",
    },
    ".Input::placeholder": {
      color: "#64748b",
      fontWeight: "300",
    },
    ".Input--invalid": {
      border: "1px solid #dc3545",
      boxShadow: "0 0 10px rgba(220, 53, 69, 0.15)",
    },
    ".Label": {
      color: "#94a3b8",
      fontWeight: "500",
      fontSize: "13px",
      marginBottom: "4px",
      textTransform: "uppercase",
      letterSpacing: "0.05em",
    },
    ".Tab": {
      border: "1px solid rgba(255, 255, 255, 0.08)",
      padding: "10px 14px",
      transition: "all 200ms cubic-bezier(0.16, 1, 0.3, 1)",
    },
    ".Tab:hover": {
      border: "1px solid rgba(255, 255, 255, 0.15)",
    },
    ".Tab--selected": {
      border: "1px solid #E50914",
      boxShadow: "0 0 15px rgba(229, 9, 20, 0.1)",
    },
    ".Error": {
      color: "#dc3545",
      fontSize: "12px",
      fontWeight: "400",
      marginTop: "6px",
    },
    ".Block": {
      border: "1px solid rgba(255, 255, 255, 0.06)",
      borderRadius: "4px",
      boxShadow: "none",
    },
    ".CheckboxInput": {
      border: "1px solid rgba(255, 255, 255, 0.15)",
      backgroundColor: "#141414",
    },
    ".CheckboxInput--checked": {
      backgroundColor: "#E50914",
      border: "1px solid #E50914",
    },
    ".DiscountCode": {
      color: "#94a3b8",
      fontWeight: "300",
      fontSize: "13px",
    },
    ".PickerItem": {
      backgroundColor: "#141414",
      border: "1px solid rgba(255, 255, 255, 0.06)",
      padding: "10px 14px",
      transition: "all 200ms cubic-bezier(0.16, 1, 0.3, 1)",
    },
    ".PickerItem--selected": {
      backgroundColor: "rgba(229, 9, 20, 0.08)",
      border: "1px solid rgba(229, 9, 20, 0.3)",
    },
  },
};
