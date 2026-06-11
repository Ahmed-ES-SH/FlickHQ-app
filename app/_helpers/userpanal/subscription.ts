// //////////////////////////////////////////////////////////////////////////////
// ///////// Subscription page formatting helpers ///////////////////////////////
// //////////////////////////////////////////////////////////////////////////////

/** Format a monetary amount (in cents) to a currency string (e.g. "$14.99"). */
export function formatAmount(amount: number, currency: string): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(amount / 100);
}

/** Format an ISO date string to a short human-readable date (e.g. "Jun 1, 2026"). */
export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/** Format an ISO date string to a full date + time (e.g. "Jun 1, 2026, 10:30 AM"). */
export function formatDateTime(dateStr: string): string {
  return new Date(dateStr).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
