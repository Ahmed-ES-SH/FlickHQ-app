/**
 * CheckoutShell — shared layout wrapper for checkout-related pages.
 *
 * Provides the Midnight Obsidian canvas with centered content, optional
 * top-nav offset, and a subtle radial-depth overlay.
 *
 * Usage:
 *   <CheckoutShell>
 *     <CheckoutContent />
 *   </CheckoutShell>
 */

interface CheckoutShellProps {
  children: React.ReactNode;
  /** Optional CSS class override for the inner container */
  className?: string;
  /** When true, adds pt-[72px] to account for the fixed Navbar. Default: true */
  withNavPadding?: boolean;
  /** Max-width for the inner content container. Default: max-w-md */
  maxWidth?: string;
}

export function CheckoutShell({
  children,
  className = "",
  withNavPadding = true,
  maxWidth = "max-w-md",
}: CheckoutShellProps) {
  return (
    <div
      className={`relative w-full min-h-screen bg-main_bg font-sans selection:bg-accent selection:text-white ${
        withNavPadding ? "pt-[72px]" : ""
      }`}
    >
      {/* Subtle radial-depth overlay */}
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 40%, rgba(229, 9, 20, 0.03) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 flex items-center justify-center w-full min-h-[calc(100vh-72px)] px-4 py-8">
        <div className={`w-full ${maxWidth} mx-auto ${className}`}>
          {children}
        </div>
      </div>
    </div>
  );
}
