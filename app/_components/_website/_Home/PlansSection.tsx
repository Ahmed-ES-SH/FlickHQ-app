import { plans, sharedOptions } from "@/app/constants/website";
import React from "react";
import { IoCheckmark } from "react-icons/io5";
import { RxCross1 } from "react-icons/rx";

export default function PlansSection() {
  return (
    <section className="custom-container my-12 md:my-16 max-sm:my-8">
      <div className="mb-10 md:mb-14 max-sm:mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3">
          Select Your Plan
        </h1>
        <p className="text-gray-400 text-base md:text-lg font-light max-sm:text-sm">
          No hidden fees, equipment rentals, or installation appointments.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8 items-start">
        {plans.map((plan, planIndex) => {
          const isPopular = planIndex === 1;
          return (
            <div
              className={`w-full flex flex-col p-6 md:p-8 rounded-lg border transition-all ${
                isPopular
                  ? "bg-accent border-accent md:-translate-y-4"
                  : "bg-[#0f0f0f] border-white/5"
              }`}
              key={plan.title}
            >
              {isPopular && (
                <span className="inline-block self-start text-xs font-semibold text-accent bg-white px-2.5 py-1 rounded-full mb-4">
                  Most Popular
                </span>
              )}

              <h2 className="text-white text-xl md:text-2xl font-semibold mb-6">
                {plan.title}
              </h2>

              <ul className="flex flex-col gap-4 mb-8 pb-6 border-b border-white/10">
                {sharedOptions.map((option, index) => (
                  <li
                    className="flex items-start gap-3"
                    key={option}
                  >
                    {plan.icons[index] ? (
                      <IoCheckmark
                        className={`size-5 shrink-0 mt-0.5 ${
                          isPopular ? "text-white" : "text-accent"
                        }`}
                      />
                    ) : (
                      <RxCross1 className="size-5 shrink-0 mt-0.5 text-gray-600" />
                    )}
                    <span
                      className={`text-sm leading-snug ${
                        plan.icons[index]
                          ? isPopular
                            ? "text-white/90"
                            : "text-gray-300"
                          : "text-gray-600"
                      }`}
                    >
                      {option}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-white text-3xl font-bold">
                  ${plan.price}
                </span>
                <span className={`text-sm ${isPopular ? "text-white/70" : "text-gray-500"}`}>
                  /month
                </span>
              </div>

              <button
                className={`w-full py-3.5 rounded-md text-sm font-medium transition-colors min-h-[44px] ${
                  isPopular
                    ? "bg-white text-accent hover:bg-white/90"
                    : "bg-[#1a1a1a] text-white hover:bg-[#222] border border-white/5"
                }`}
                aria-label={`Select ${plan.title} plan`}
              >
                Select {plan.title}
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}
