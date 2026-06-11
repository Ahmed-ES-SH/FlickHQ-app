////////////////////////////////////////////////////////////////////////////////
///////// Pricing page — header / hero section ////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

export default function PricingHeaderSection() {
  return (
    <section className="mb-16">
      <h1 className="text-white text-3xl xl:text-5xl font-bold mb-4 text-balance">
        Choose Your{" "}
        <span className="relative inline-block">
          Cinema Experience
          <span
            className="absolute -bottom-1 left-0 right-0 h-0.5 bg-accent rounded-full"
            aria-hidden="true"
          />
        </span>
      </h1>
      <p className="text-second_text text-base xl:text-lg leading-relaxed max-w-[75ch] mb-4 font-light">
        Stream thousands of movies, series, and exclusive originals in
        stunning 4K HDR. Select the plan that fits your lifestyle — upgrade,
        downgrade, or cancel whenever you want.
      </p>
      <p className="text-light_text text-sm leading-relaxed max-w-[65ch] font-light">
        All plans unlock FlickHQ Originals, personalized recommendations, and
        seamless streaming across all your devices.
      </p>
    </section>
  );
}
