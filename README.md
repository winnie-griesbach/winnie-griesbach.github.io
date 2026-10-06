# Winnie Griesbach – E-Commerce Portfolio (V7)

Live: [English](https://winnie-griesbach.github.io/en/) · [Deutsch](https://winnie-griesbach.github.io/de/)

V7 implements the missing points from `V7_HANDOFF.md` on top of the live repository's manual improvements. It preserves the banner, profile WebP, media, PDF preview cards, credentials, colors and typography direction.

## Current structure

- `en/index.html` and `de/index.html`: language-specific titles, descriptions and URLs.
- `_layouts/portfolio.html`: shared HTML structure, metadata, Person JSON-LD and server-rendered evidence.
- `_data/copy.json`, `journey.yml`, `journey_de.json`: translated content.
- `_data/work_evidence.json` and `work_evidence_de.json`: evidence records; edit these files to update the evidence. The public JSON endpoints render this same data with Jekyll.
- `assets/css/styles.css` and `assets/js/script.js`: existing design with targeted responsive, language and accessibility changes.
- Root `/`: defaults to `/en/`, preserves fragment links with a small redirect helper and provides links to both languages without JavaScript.
- `robots.txt` and `sitemap.xml`: crawlability and language discovery.

GitHub Pages builds the root of `main` with Jekyll. Make targeted commits; do not replace the repository with an older generated ZIP. Check both language URLs after deployment.

The Coursera Data Preparation & Infrastructure completion is listed without a PDF link because its certificate file is not in this repository. The SISTRIX milestone is explicitly historical, dated 31 August 2026; it is not a claim about today's index.

See `V7_IMPLEMENTATION.md` for implementation scope, evidence boundaries and validation.

## Historical V4 notes

V4 implements the current portfolio direction directly as a GitHub Pages/Jekyll site.

## V4 changes

- full-width LinkedIn/New-York banner behind the top navigation
- real profile photo in the hero card
- one single People / Data / Process / Experience navigation layer
- compact flagship case-study cards
- three video previews that open in a large modal
- three Before/After groups: Product, Category, Homepage
- recruiter evidence explorer with filters and search
- butterfly artwork moved to About
- New York image slider before the footer with subtle overlay captions

## Original V4 image slots (now populated)

The layout already contains slots for:
- Product: old + new
- Category: old + new
- Homepage: old + new

These original placeholders have since been populated with the current repository assets.
