---
target: PlansSection.tsx
total_score: 20
p0_count: 1
p1_count: 2
timestamp: 2026-06-09T07-33-04Z
slug: app-components-website-home-planssection-tsx
---
# Critique Report: PlansSection.tsx

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3/4 | Loading state is good; no transition explanation when redirecting to Stripe |
| 2 | Match System / Real World | 2/4 | "Select Your Plan" copy is generic SaaS, not cinematic |
| 3 | User Control and Freedom | 2/4 | No back/escape from checkout commitment; no billing toggle on homepage |
| 4 | Consistency and Standards | 3/4 | Consistent with dark theme, but crimson-card approach differs from /pricing page |
| 5 | Error Prevention | 2/4 | No confirmation before Stripe redirect; no charge-indication preview |
| 6 | Recognition Rather Than Recall | 3/4 | Features visible at a glance; no plan differentiation beyond text lists |
| 7 | Flexibility and Efficiency | 1/4 | No annual/monthly toggle; no side-by-side comparison; no shortcuts |
| 8 | Aesthetic and Minimalist Design | 2/4 | Functional but lacks cinematic drama; no hover effects despite DESIGN.md spec |
| 9 | Error Recovery | 2/4 | Retry exists; Stripe errors leave user at dead end with no recovery path |
| 10 | Help and Documentation | 0/4 | No FAQ, no "Compare plans", no tooltips, no "cancel anytime" reassurance |
| **Total** | | **20/40** | **Acceptable — significant improvements needed** |

---

## Anti-Patterns Verdict

**Start here:** Does this look AI-generated?

**LLM assessment:** Borderline. The component doesn't scream "AI made this" — it avoids the most egregious slop tells (no tracked eyebrows, no gradient text, no side-stripe borders, no numbered markers). But it fails the brand distinctiveness test. When a competitor's pricing page says "Select Your Plan — No hidden fees," FlickHQ's section is indistinguishable. The section is functionally complete but brand-anonymous. The `console.log("Loaded plans:", plans)` at line 47 is a leftover that indicates either AI or sloppy human — either way, it ships to production. The subtitle "No hidden fees, equipment rentals, or installation appointments" reads like a cable company apology, not a cinematic streaming pitch.

**Deterministic scan:** Ran `detect.mjs` against the file. Returned empty `[]` — no automated issues found. The detector doesn't catch design-level concerns (brand violations, copy, hierarchy, trust signals), so the human review caught all substantive issues.

**Visual overlays:** No browser injection was performed (the target is a source file, not a live URL).

---

## Overall Impression

This pricing section is **functional but forgettable**. It handles every state (loading, error, empty, populated) which is excellent production discipline. But for a conversion-critical section on a "cinematic, premium, immersive" brand, it doesn't sell. It lists. The crimson-card background on the popular plan violates the Spotlighting Rule (30% crimson vs the 10% maximum), and the section lacks the hover magic, trust signals, and persuasive copy needed to turn a browser into a subscriber. The biggest opportunity: make this feel like a movie theater decision, not a spreadsheet.

---

## What's Working

1. **State management.** Loading skeletons faithfully mirror card structure. Error state has retry. Empty state is clear. "Price unavailable" fallback on individual cards. This is production-grade robustness.

2. **Responsive grid execution.** `grid-cols-1 md:grid-cols-2 xl:grid-cols-3` with `items-start` handles all breakpoints gracefully. The popular card `md:-translate-y-4` creates subtle visual lift without breaking layout.

3. **Correct button inversion.** The popular card's SubscribeButton correctly uses `bg-white text-accent` variant, inverting the brand pattern to signal "this is the action on the featured item." The non-popular cards use the muted secondary treatment.

---

## Priority Issues

### P0: Crimson full-card background violates Spotlighting Rule
- **What:** The popular card uses `bg-accent border-accent` (full `#E50914` background) at lines 130-131. At desktop this is ~30% of viewport width — 10× the DESIGN.md limit.
- **Why it matters:** Crimson is meant to be a dramatic accent, not a flood. It cheapens the premium feel, creates contrast issues (white-on-red is 4.1:1 vs white-on-obsidian at 21:1), and makes the card feel like a "sale" banner rather than a "premium" selection.
- **Fix:** Follow the `/pricing/page.tsx` pattern — use `bg-[#141414] border-2 border-accent` instead, making crimson a 2px border accent (~1-2% of viewport). The "Most Popular" badge already floats above the card, providing visual priority without a color flood.
- **Suggested command:** `/impeccable polish`

### P1: No billing frequency toggle
- **What:** The homepage PlansSection only shows monthly prices. No annual/monthly toggle exists.
- **Why it matters:** Annual subscriptions drive 2-3× higher LTV. Users who discover pricing on the homepage never see the annual option, creating a conversion leak. The separate `/pricing` page has a full toggle with savings badge.
- **Fix:** Add a billing toggle, or at minimum show "Save 17% with annual" micro-copy per card.
- **Suggested command:** `/impeccable craft`

### P1: No trust signals near CTA
- **What:** At the exact moment of conversion (clicking "Select Plan"), there's zero reassurance — no "Cancel anytime," no "Secure checkout," no trial indication, no "you won't be charged yet" message.
- **Why it matters:** The gap between clicking a button and being asked for payment is the highest-anxiety moment in the flow. Without trust signals, users hesitate, second-guess, and abandon.
- **Fix:** Add a subtle `<p>` below each SubscribeButton: "Cancel anytime. No questions asked." or "Start with a 7-day free trial."
- **Suggested command:** `/impeccable clarify`

### P2: No card hover interaction
- **What:** Pricing cards have zero hover effect — no scale, no shadow, no border change. DESIGN.md specifies `hover:scale-[1.03]` with Crimson Halo (`box-shadow: 0 0 30px rgba(229, 9, 20, 0.15)`) for cards.
- **Why it matters:** Every other interactive card in the app (movie cards, show cards) gets hover treatment. Pricing cards look dead by comparison. This is an inconsistency that undermines the tactile, responsive brand feel.
- **Fix:** Add `hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(229,9,20,0.15)] transition-all duration-200` to the card container.
- **Suggested command:** `/impeccable animate`

### P2: Weak CTA copy
- **What:** "Select Basic" / "Select Premium" (line 73 of SubscribeButton) is administrative language, not persuasive.
- **Why it matters:** The CTA is the most important text on a pricing page. "Select {Plan}" sounds like filling out a form. "Start Watching" or "Begin Free Trial" sounds like beginning an experience.
- **Fix:** Accept `ctaLabel` prop or use defaults like "Start Watching" / "Get Started" / "Go Premium".
- **Suggested command:** `/impeccable clarify`

### P3: `console.log` in production code
- **What:** Line 57: `console.log("Loaded plans:", plans)` executes on every render.
- **Fix:** Remove the debug log.
- **Suggested command:** `/impeccable polish`

---

## Persona Red Flags

### Jordan (First-Timer — converting for first time)
- "Select Plan" gives no advance warning about what happens. Jordan clicks → gets redirected to `/signin?next=...` with no context. Trust-breaking moment.
- "No hidden fees, equipment rentals" copy speaks to cable victims, not cinephiles. Jordan wants value ("Unlimited access to 10,000+ films"), not anti-cable reassurance.
- No FAQ, no "What happens next?" — Jordan needs handholding at the payment decision point. Gets none.

### Casey (Mobile User — scrolling on 375px viewport)
- Popular card's `md:-translate-y-4` doesn't apply on mobile (correctly), but removes the only visual differentiator beyond the crimson flood. On mobile, the popular card is a wall of red.
- Feature lists with 6+ items create excessive vertical scrolling. Comparing two plans requires scroll-back-and-forth memory work.
- Price at `text-3xl` is adequate but could make the decision point more prominent.

### Riley (Stress Tester — edge cases)
- 4 plans on xl breakpoint: fourth card wraps alone in a 3-column grid, looking orphaned. Need `place-content-start` or conditional logic.
- "Price unavailable" → disabled "Unavailable" button is a dead end. No "Contact support" or alternative path.
- Empty features list shows "No features listed" — communicates clearly but indicates an upstream data quality issue.

---

## Minor Observations

- **`<h1>` tag concern (line 114):** If this section renders on the homepage, there should only be one `<h1>` per page (the HeroSection's). This should be an `<h2>` or `<h3>`.
- **`border-white/10` divider:** Consistent but boring. Consider gold `#eaa71c` at low opacity for premium-tier cards.
- **No icons per plan tier:** Text-only cards. Even a simple film reel or clapperboard icon per tier would add personality.
- **Design inconsistency with `/pricing` page:** The pricing page uses border-based highlighting; PlansSection uses background-color highlighting. Same proposition, different visual languages.

---

## Questions to Consider

1. **"No hidden fees, equipment rentals, or installation appointments" — who is this for?** FlickHQ's audience is streaming natives who haven't touched a cable box in years. Why is the opening value proposition defensive anti-cable copy instead of aspirational cinema copy?

2. **The Spotlighting Rule says crimson <10% of viewport. But this is a conversion-critical section. Is the rule wrong for this context, or is the design wrong?** I'd argue the rule is right — crimson as a background reads as "danger" or "sale," not "premium cinema." But if crimson can't be the background, what color does make the popular plan feel special? (Answer: structure and hierarchy, not color.)

3. **The `/pricing` page has billing toggle, feature details, partner logos. The homepage version is stripped down. Users who land on the homepage see the weaker pitch. Why?** Shouldn't the homepage version match, since it's the first impression?

4. **What's the emotional difference between "Select Basic" and "Start Watching"?** One is form-filling. The other is the beginning of an experience. The current CTA is administrative, not experiential.
