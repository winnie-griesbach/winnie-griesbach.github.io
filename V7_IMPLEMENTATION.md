# V7 implementation · 06 October 2026

## Baseline and preservation

Read `V7_HANDOFF.md` before inspecting implementation files. Baseline: `c4c826b226f35902be8bd81ba2740baab5b09154`. The live root contained the recent WebP profile, PDF preview cards and updated filters from the manual September commits.

No existing image, video, PDF or credential asset was replaced or deleted. The current layout moved into one shared Jekyll layout; both language routes use that structure. Existing visual design, classes, preview-card layout and media presentation remain in place. CSS changes address navigation, contrast, focus and narrow-screen overflow.

## Missing handoff points implemented

- Independent `/en/` and `/de/` HTML pages, translated navigation, body content, evidence, accessibility labels and interaction messages.
- Canonicals, reciprocal hreflang plus x-default, robots, sitemap and Person structured data.
- Remote positioning in the profile; New York remains in the lower personal section with explicit context.
- DDZ scope, dates, Shopify Basic limitations, assigned price/budget boundaries and implementation ownership.
- GSC period comparison with unequal-period and causality limits. Existing 200-click milestone retained as a dated milestone.
- Latest dated Shopify / GA4 / Ads / AI referral evidence, with operational revenue separated from tracking and attribution.
- Career progression and AI-tool framing; ZS24 developer and external Ads-specialist collaboration clarified.
- Coursera course completion on 27 September 2026; existing credentials retained.
- Product / Tools filter, exact system matching, translated search and filter output, accessible pressed states and result counts.
- The initial 44 evidence records rendered in initial HTML and reused by the interactive JSON endpoints. Content remains available if JavaScript or JSON loading fails.
- Visible focus, skip link, video-dialog focus handling, background inertness and return focus; slideshow pause and reduced-motion behavior.
- Existing eager high-priority profile WebP retained; below-the-fold images have dimensions and lazy loading.

## Evidence boundaries and unresolved source items

- The SISTRIX screenshot confirms 1.743 on 01 June 2023 and the selected 3.491 point on 31 August 2026. Its overview also displays 3.384 without a capture date. The dated milestone is preserved; no current-date claim is made.
- The baseline lacked a newer DDZ SISTRIX screenshot and Coursera PDF. Supplied after the initial deployment; both are now included in the follow-up documented in `V7_FOLLOWUP.md`.
- The GSC comparison is transcribed from the handoff; the existing GSC image proves the separate 200-click milestone, not the new comparison table.
- Existing genuinely cross-system content journeys retain Magento + TYPO3 tags. Magento-only records retain Magento alone. No system was broadly added to every ZS24 record.
- BigQuery / SQL remains a developing skill. Qualitative redesign feedback is not presented as statistical A/B testing. Accessibility work is not presented as certification or WCAG conformance.

## Validation

- Shared Liquid template preview, front matter, translated references, JSON feeds and sitemap checked before publication. The preview uses LiquidJS; the production build is GitHub Pages/Jekyll and is checked after publication.
- Chromium checks in both languages: all area/system filters, search, empty state, reset, load more, equal desktop PDF-card widths, video focus/close/return, pause control and runtime errors.
- Viewports 320, 390, 768, 1024 and 1440 px checked for page-level overflow and visible language navigation.
- JavaScript-disabled pages retain all 44 evidence rows, readable content and language links.
- Local links, anchor targets, assets and PDFs checked; one H1, unique IDs, canonical/hreflang and parseable Person JSON-LD verified.
- Axe automated WCAG-tag checks reported no violations in either language at desktop and mobile widths after the targeted corrections. These checks are supplementary validation, not a formal audit or conformance certification.
