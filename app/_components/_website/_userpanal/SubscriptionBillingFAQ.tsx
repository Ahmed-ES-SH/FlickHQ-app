// //////////////////////////////////////////////////////////////////////////////
// ///////// SubscriptionBillingFAQ — frequently asked billing questions ///////
// //////////////////////////////////////////////////////////////////////////////

import { LuExternalLink } from "react-icons/lu";
import { BILLING_FAQ_ITEMS } from "@/app/data/userpanal/subscription";

export default function SubscriptionBillingFAQ() {
  return (
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
        {BILLING_FAQ_ITEMS.map((item, index) => (
          <div key={index} className="space-y-2">
            <h4 className="text-sm font-semibold text-white">
              {item.question}
            </h4>
            <p className="text-[13px] text-second_text">{item.answer}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
