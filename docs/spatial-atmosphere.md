# Phase 5 — Spatial Atmosphere

**The B × C direction stays fixed.** This pass changes physical roles, light and ink rather than inventing another composition. The approved 728 × 576 silhouette, 520-unit main/stub join, all existing print zones, typography, viewport, ticket position and time-coordinate mathematics remain the Phase 4 baseline.

## Material and color roles

- **Ivory:** the warm environment and fine uncoated ticket stock carry memory and paper. The stub is a slightly denser archival stock, still part of the same object.
- **Ink:** a neutral carbon time surface gives the instrument a night/precision role. It is an unrounded printing zone in the ticket, not another card or glass widget. The existing arc, city, clock and GMT remain in place.
- **Signal:** limited state, local-time index and current season-position ink. It is a product role, independent of which team is selected.
- **Team:** one printed identity event, the existing narrow rail. Team choice does not tint the page, navigation or neutral instrument surface.

One upper-left light source serves the entire object. Separate contact and ambient shadows support the cut silhouette. Occlusion is confined to tiny physical cuts or printed interfaces. Removing shadows must leave the hierarchy intact through surface contrast and ink.

Canvas and paper use separate very small grain budgets. The normal-size image must not read as a texture overlay, vintage stock, vignette, shiny panel or 3D presentation.

## Production capture

After the production build, run:

```sh
npm run export:phase5
```

The exporter allocates a fresh loopback port, starts the current production build, and cleans up only its own process. It never silently reuses an unknown server that may still hold HTML from an earlier build. `MYGAME_APP_URL` explicitly selects a separately managed production server; `MYGAME_PROMO_PORT` requests a specific unbound local port. The exporter checks the document's actual stylesheet URLs before capturing, so a stale server produces a descriptive asset error rather than misleading layout failures.

The source is the real homepage, with its working team/city controls, future itinerary and navigation; no promotional HTML template is maintained.

Outputs go to `output/phase5/`. Existing Phase 4 output/history is untouched.

The two principal files are:

- `mygame-plus-douyin-01-tokyo.png`
- `mygame-plus-douyin-02-london.png`

Both use a 600 × 800 CSS-pixel viewport at DPR 1.8, producing **1080 × 1440**. The same real demonstration fixture, PASS 0147, personal issue 047295, Game 01 / 82 and Season 26—27 are reused. Tokyo is 10:00 / GMT+9; London is 01:00 / GMT at this fixture's DST-aware event instant.

## Validation artifacts

`validation.json` records the actual run, including:

1. Exact Phase 4 frame, fixed print-zone and structural-path equality; exact Tokyo/London geometry equality.
2. A raw pixel comparison excluding only measured location, converted schedule-time and cursor bounds, rather than masking the whole ticket.
3. Two native phone captures, ticket crops, 30% thumbnails, blur, grayscale, 10% saturation, brand-hidden and overlay diagnostics.
4. HOU / GSW / BOS / LAL selected through the real team picker, each with its actual participating fixture, persistent user ID and shared ticket family. The family review explicitly inspects `hou-1`, `GSW-0`, `BOS-0`, and `hou-1` respectively through the existing schedule UI, so each fixture has a genuinely known selected-team game number. This does not fake one HOU–LAL fixture for unrelated teams, invent an unknown ordinal, or change NEXT UP ranking.
5. A four-team family contact sheet, plus individual phone and Pass captures. Team inks differ; brand, signal role, neutral instrument, paper, stub, light and grain remain shared.
6. No-shadow / no-team / no-signal captures. These diagnostic classes are temporary review tools, not product modes. They remove actual painted layers while preserving identity and geometry.
7. Existing lifecycle behavior: IANA-local GAME DAY, ordered NEXT UP, no collection at tip-off, completion-based archive, deduplication, reload persistence and team/season storage isolation.
8. First explicit confirmation issues once under normal/reduced motion; changing city and refreshing never reissues the user identity.
9. Responsive 320 / 390 / 480 / 600 CSS-pixel checks, no horizontal overflow, itinerary/nav separation and 44-pixel navigation targets.

The enlarged material-detail crop is a diagnostic, not the intended viewing scale. Grain that calls attention to itself at normal phone size is too strong.

## Verified result

The final production build and **82 / 82** unit tests passed. The final standard `npm run export:phase5` run started a fresh owned production server, verified both served CSS assets at HTTP 200, completed all browser checks, and stopped that server. A subsequent TCP fetch to its recorded port failed, confirming cleanup without relying on process-visibility tools.

Both native phone captures retain the approved CSS-pixel ticket bounds: **x 88 / y 232 / width 424 / height 335.46875**. Their main/stub, Bridge, perforation, season edge, sports window and timing geometry exactly match the committed Phase 4 validation baseline.

Tokyo/London have **8,848 changed pixels**, entirely within measured city/time/GMT/cursor/converted-schedule regions. **Static pixel differences: 0.** Their material snapshots, physical light/shadow tokens and actual neutral carbon/signal stop colors are identical. There are no browser runtime, hydration or artwork-asset errors.

The four-team family uses real participating mock fixtures with known selected-team ordinals:

| Team | Fixture | Personal issue | Printed identity ink |
| --- | --- | --- | --- |
| HOU | `hou-1` | `047295` | `rgb(188, 58, 64)` |
| GSW | `GSW-0` | `012688` | `rgb(55, 90, 131)` |
| BOS | `BOS-0` | `068368` | `rgb(0, 122, 51)` |
| LAL | `hou-1` | `070562` | `rgb(98, 83, 130)` |

All retain the same user **PASS 0147**, brand glyph ink, signal source, neutral material family, light and grain. Actual state-dependent carbon luminance is recorded separately: different fixtures may legitimately be GAME DAY or ISSUED without inventing a common status for the comparison.

No-shadow changed 301,989 pixels, no-team changed 21,444, and no-signal changed 194. These are layer-removal measurements, not measures of desirability; all three preserve the exact content identity and fixed geometry. The six-distance visual review passed for thumbnail hierarchy, normal-phone atmosphere, close material detail, Tokyo/London continuity, brand-hidden structure and isolated ticket completeness.

## Review standard

The page remains a usable, calm mobile product. The matchup leads; the clock and city remain legible within the same fixed world-time instrument. The dark printing zone must give depth without becoming an isolated widget. The stub remains mechanical, the rail remains the sole strong team-color event, and every archive field keeps its original meaning.

Removing shadow must not collapse the object. Removing team color must leave the MyGame+ system recognizable. Removing signal must reduce state emphasis without removing event information. The four real teams must look like one family with different identities.

Visual inspection can establish hierarchy, consistency and restraint. Actual save/share desire still requires user feedback; these diagnostics do not claim a user-study result.
