# MyGame+ — Collectible Pass Inside Real Mobile UI

> 当前版本见 [Digital Game Ticket](digital-game-ticket.md)：仍保留真实手机 App，票面已授权重建为 MG-DNA-2，默认不显示亚克力壳。下文 V2.8 壳体参数是历史实现记录。

The current identity, collection and sharing behavior is specified in [V2.9 Personal Season Collection](personal-season-collection.md). Material/type/brand refinement remains specified in [Precision Refinement](precision-refinement.md). V2.8's mobile composition and ticket architecture remain the foundation.

The current promo is the complete 1080 × 1440 mobile product composition in `design/promo/promo.html`. Its top brand/product/state groups, MY TEAM / LOCAL TIME selectors, WEB APP BETA, AUTO CONVERTED, NEXT 7 DAYS and Bottom System Island remain in their approved positions. There is no standalone studio setting or poster conversion.

## One local material upgrade

`MobilePassEnclosure` is a decorative, pointer-transparent SVG sibling **behind** the paper. The same component is used by the real `GamePass` and server-rendered into the promo source. It never covers the timing face or introduces a backdrop filter. Native UI stays responsive; the SVG follows the original Pass aspect ratio without changing its layout footprint.

The surrounding App remains flat warm stone. The soft ivory main ticket and slightly cooler archival stub retain paper lighting, printed identities and security stock. The enclosure has no painted closed outline, face plane or complete inner seam. Three short bevel catches, two tiny mounting returns, a thin partial sidewall and faint refraction are the only optical cues. Contact depth is weaker than the earlier paper-only shadow. No reflection crosses the paper.

All paint remains in `src/styles/color-material.css`; `mobile-pass-enclosure.css` consumes only semantic tokens. Team ink is inherited from the existing TeamIdentity pack, including inside SVG gradient stops.

## Fixed shell architecture

`MOBILE_PASS_ENCLOSURE` in `src/lib/passEnclosure.ts` is separate from immutable `PASS_DNA`.

| Element | Master units |
| --- | --- |
| Unchanged internal paper | 728 × 576 at page x176, y456 |
| Compact casing | 752 × 598 at page x164, y445 |
| Paper slot | x12, y11 inside casing |
| Hard rim / mounting edge | 6 |
| Clear air gap after rim | 6 horizontal / 5 vertical |
| Fixed upper-right cut | 45° segment from (734, 1) to (751, 18) |
| Neutral plus indentation | centred at (734, 12), 6 × 6 |

The casing grows 3.30% in width and 3.82% in height. Its narrow sidewall remains inside the 4% total physical budget. The upper-right micro cut and almost invisible plus are fixed for every team, city, game, state and season. They are optical structure, not a badge.

Paper master geometry, cutouts, bridge, spine, security window, timing sanctuary and main/stub ratio are unchanged. Type and printed identity details are refined within these fixed regions. At full promo scale there are 25px between the identity group and casing, and 37px between casing and the weekly programme.

## Team and state inputs

Two unequal optical edge paths cover **25.59%** of the casing perimeter. Team ink is mixed at 6.5% before the directional gradient and state opacity. Local bevels cover 19.79% and the mounting returns 5.36%; neither forms a full ring. No full-color rim, luminous blur or metallic effect is used.

State changes only the refraction opacity:

| State | Refraction energy |
| --- | --- |
| UPCOMING | .65 |
| NEXT UP | .70 |
| GAME DAY | .84 — 20% above NEXT UP |
| COLLECTED | .55 |

Existing status signals, paper luminance, emotion and record emphasis still come from the state engine. No state changes any shell or ticket coordinate. HOU → LAL changes inherited warm-red ink to violet-grey, with the same shell drawing. Location changes retain user ID, game/season records, stock and structure.

## Reproduce and validate

```bash
npm test
npm run build
npm run start -- --port 4600
# In a second terminal:
MYGAME_APP_URL=http://127.0.0.1:4600 node design/promo/check-app.cjs
npm run export:promo
```

These two mobile deliverables are retained; V2.9 adds a small collection progress/ordinal mark inside existing stub whitespace:

- `output/douyin/mygame-plus-douyin-01-tokyo.png`
- `output/douyin/mygame-plus-douyin-02-london.png`

The export reuses approved local fonts, source brand assets and ticket markup. Its browser seeds demonstration PASS 0147; the real product still generates/persists each user's ID. Both cities keep GAME 01 / 82 and SEASON 26–27.

The exporter checks full PNG decoding, 1080 × 1440, nonzero size, no overflow/black borders, complete visible UI, paper/stub luminance, protected security-print masks, geometry and exact city-static pixels. `review-mobile-enclosure.cjs` also verifies local bevel/mount coverage, absence of painted closed paths, permanent cut/plus, four-state geometry, zero paper-interior changes with casing hidden, and a rim-only team swap that cannot recolor paper. A `PROMO_BASELINE_DIR` containing approved PNGs plus `validation.json` enables original content-region, ticket-geometry and copy checks. Only the authorized seal/name/signature and dock refinements are exempted; the selector's text-width change is limited to a subpixel.

The live App regression includes 320/390/480/1080px layouts; six team stocks; Tokyo local GAME DAY while London is NEXT UP; automatic post-end archive; reload persistence; ID deduplication; isolated team/season archives; and pixel-identical four-state paper DNA. Its architecture fingerprint also includes the casing, signature and all SVG paths. Unit rendering checks that no variable can redraw the casing or add a second shell.

Diagnostics are written to `/tmp/mygame-refine-validation.json` and `/tmp/mygame-refine-*-without-shell.png`; the existing 30% thumbnail, grayscale, saturation, blur, border-off, material-only and true 50% overlay diagnostics retain their `/tmp/mygame-v2.4-*` filenames. At 30%, HOU/LAL, main time, pass outline, MyGame+ and the complete System Island remain visible; acrylic engraving and collection microcopy recede.

The V2.7 standalone study is historical only. Its explicit renderer writes to `output/studies/v2.7/` and cannot overwrite this delivery.
