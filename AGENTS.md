# MG+ development rules

Read [the Product & Visual Bible](docs/product-visual-bible.md) before changing product behavior or visuals. It supersedes historical iteration documents; current user instructions take precedence.

- Product: Personal Basketball Season Archive, built around `GAME × TEAM × LOCATION`.
- Preserve the mobile homepage as a usable product. Independent share artifacts have their own composition and reuse the same Pass data.
- Follow the documented phase order. Beta 1 covers 30 teams, city identity, local time, next game, issued Passes, meaningful References, Match DNA and share prototypes. Do not expand unrelated systems as part of routine refinement.
- A city is not a timezone. Keep stable city IDs/codes independent of IANA zones. Device timezone does not establish a city or prove viewing.
- Never fabricate LIVE, FINAL, scores, game ordinals, or `WATCHED FROM` records. Keep internal attention states separate from event facts.
- Preserve Pass DNA, user PASS ID and existing local archives. Archive by team + season, deduplicate game IDs, and derive counts. Tip-off does not mean completion.
- Keep the homepage quiet and flat; the Pass is its one visual hero. Use semantic material tokens, Geist-based typography and restrained team identity. No random decoration, aviation semantics, CTA clutter or new UI library.
- For behavior changes, run `npm test` and `npm run build`, plus the relevant browser regressions. Do not run Next dev and build concurrently against the same `.next` directory.
- `npm run export:promo` exports the running production App. `npm run export:season` exports native 1080×1440 / 1080×1920 artifacts and series validation fixtures. Validation mock data must not become a claimed real NBA feed or viewing history.
