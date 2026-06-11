////////////////////////////////////////////////////////////////////////////////
///////// Stripe initialization (cached at module level) ///////////////////////
////////////////////////////////////////////////////////////////////////////////

import { loadStripe } from "@stripe/stripe-js";

const stripeKey =
  (typeof process !== "undefined" &&
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) ||
  "";

export const stripePromise = stripeKey ? loadStripe(stripeKey) : null;
