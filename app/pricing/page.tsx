/* eslint-disable react/no-unescaped-entities */
"use client";
import React, { useState } from "react";
import { IoCheckmarkOutline } from "react-icons/io5";
import { RxCross1 } from "react-icons/rx";
import { TiBook } from "react-icons/ti";
import { TbTicket } from "react-icons/tb";
import { PiScreencastBold } from "react-icons/pi";
import { CiVideoOn } from "react-icons/ci";
import SwiperBartners from "@/app/_components/_website/_pricing/SwiperBartners";

const plans = [
  {
    id: "regular",
    title: "Regular",
    priceMonthly: 11.99,
    priceAnnual: 9.99,
    description: "Essential streaming for casual viewers",
    features: [
      { name: "FlickHQ Originals", included: true },
      { name: "Full streaming library", included: true },
      { name: "Watch on 1 device", included: true },
      { name: "HD (1080p) quality", included: true },
      { name: "Cloud DVR storage", included: false },
      { name: "Live TV channels", included: false },
      { name: "Premium TV channels", included: false },
    ],
    popular: false,
  },
  {
    id: "premium",
    title: "Premium",
    priceMonthly: 34.99,
    priceAnnual: 29.99,
    description: "The complete cinematic experience",
    features: [
      { name: "FlickHQ Originals", included: true },
      { name: "Full streaming library", included: true },
      { name: "Watch on 3 devices", included: true },
      { name: "4K HDR + Dolby Atmos", included: true },
      { name: "50hr Cloud DVR storage", included: true },
      { name: "65+ Live TV channels", included: true },
      { name: "Premium TV channels", included: false },
    ],
    popular: true,
  },
  {
    id: "ultimate",
    title: "Premium + TV",
    priceMonthly: 49.99,
    priceAnnual: 42.99,
    description: "Everything, including premium channels",
    features: [
      { name: "FlickHQ Originals", included: true },
      { name: "Full streaming library", included: true },
      { name: "Watch on 5 devices", included: true },
      { name: "4K HDR + Dolby Atmos", included: true },
      { name: "100hr Cloud DVR storage", included: true },
      { name: "65+ Live TV channels", included: true },
      { name: "Premium TV channels", included: true },
    ],
    popular: false,
  },
];

const featureCards = [
  {
    title: "Curated Library",
    content:
      "Explore thousands of movies, series, and documentaries — from indie gems to blockbuster hits. Our editorial team handpicks every title so you spend less time searching and more time watching.",
    icon: <TiBook className="size-10 text-accent" />,
  },
  {
    title: "Digital Premieres",
    content:
      "Get front-row access to exclusive virtual screenings and early releases. Buy digital tickets for premiere events and watch new releases alongside a global community of film lovers.",
    icon: <TbTicket className="size-10 text-accent" />,
  },
  {
    title: "Interactive Screenings",
    content:
      "Watch together with synchronized playback, live chat, and real-time reactions. Host watch parties, vote on what to play next, and turn movie night into a shared experience.",
    icon: <PiScreencastBold className="size-10 text-accent" />,
  },
  {
    title: "Behind the Scenes",
    content:
      "Go beyond the screen with exclusive director's cuts, making-of documentaries, cast interviews, and behind-the-scenes footage. See how your favorite films come to life.",
    icon: <CiVideoOn className="size-10 text-accent" />,
  },
];

export default function Pricing() {
  const [isAnnual, setIsAnnual] = useState(false);

  return (
    <div className="lg:mt-28 mt-20 custom-container min-h-screen pb-20">
      {/* Header */}
      <section className="mb-16">
        <h1 className="text-white text-3xl xl:text-5xl font-bold mb-6">
          Pricing plans
        </h1>
        <p className="text-gray-400 text-base xl:text-lg xl:w-[75%] w-full leading-relaxed mb-4">
          Stream thousands of movies, series, and exclusive originals in stunning
          4K HDR. Choose the plan that fits your cinematic lifestyle — upgrade,
          downgrade, or cancel anytime.
        </p>
        <p className="text-gray-500 text-sm xl:text-base xl:w-[65%] w-full leading-relaxed">
          All plans include access to FlickHQ Originals, personalized
          recommendations, and the ability to watch on your favorite devices.
        </p>
      </section>

      {/* Billing Toggle */}
      <div className="flex items-center justify-center gap-4 mb-12">
        <span
          className={`text-sm font-medium transition-colors ${
            !isAnnual ? "text-white" : "text-gray-500"
          }`}
        >
          Monthly
        </span>
        <button
          onClick={() => setIsAnnual(!isAnnual)}
          className={`relative w-14 h-7 rounded-full transition-colors ${
            isAnnual ? "bg-accent" : "bg-[#2a2a2a]"
          }`}
          aria-label={isAnnual ? "Switch to monthly billing" : "Switch to annual billing"}
        >
          <span
            className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full transition-transform ${
              isAnnual ? "translate-x-7" : "translate-x-0"
            }`}
          />
        </button>
        <span
          className={`text-sm font-medium transition-colors ${
            isAnnual ? "text-white" : "text-gray-500"
          }`}
        >
          Annual
        </span>
        {isAnnual && (
          <span className="text-xs font-semibold text-accent bg-accent/10 px-2.5 py-1 rounded-full">
            Save 17%
          </span>
        )}
      </div>

      {/* Feature Cards */}
      <section className="mb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {featureCards.map((card) => (
            <div
              key={card.title}
              className="flex gap-5 p-6 rounded-lg bg-[#0f0f0f] border border-white/5 hover:border-white/10 transition-colors"
            >
              <div className="shrink-0">{card.icon}</div>
              <div>
                <h2 className="text-white text-lg font-semibold mb-2">
                  {card.title}
                </h2>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {card.content}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="mb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative rounded-lg p-6 transition-all ${
                plan.popular
                  ? "bg-[#141414] border-2 border-accent"
                  : "bg-[#0f0f0f] border border-white/5"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-white text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap">
                  Most Popular
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-white text-lg font-semibold mb-1">
                  {plan.title}
                </h3>
                <p className="text-gray-500 text-sm mb-4">
                  {plan.description}
                </p>
                <div className="flex items-baseline gap-1">
                  <span className="text-white text-4xl font-bold">
                    ${isAnnual ? plan.priceAnnual : plan.priceMonthly}
                  </span>
                  <span className="text-gray-500 text-sm">/month</span>
                </div>
                {isAnnual && (
                  <p className="text-gray-600 text-xs mt-1">
                    Billed annually (${(plan.priceAnnual * 12).toFixed(2)}/yr)
                  </p>
                )}
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature.name} className="flex items-start gap-3">
                    {feature.included ? (
                      <IoCheckmarkOutline className="size-5 text-accent shrink-0 mt-0.5" />
                    ) : (
                      <RxCross1 className="size-5 text-gray-600 shrink-0 mt-0.5" />
                    )}
                    <span
                      className={`text-sm ${
                        feature.included ? "text-gray-300" : "text-gray-600"
                      }`}
                    >
                      {feature.name}
                    </span>
                  </li>
                ))}
              </ul>

              <button
                className={`w-full py-3 rounded-md text-sm font-medium transition-colors ${
                  plan.popular
                    ? "bg-accent text-white hover:bg-accent/90"
                    : "bg-[#1a1a1a] text-white hover:bg-[#222] border border-white/5"
                }`}
                aria-label={`Select ${plan.title} plan`}
              >
                Select {plan.title}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Partners */}
      <SwiperBartners />
    </div>
  );
}
