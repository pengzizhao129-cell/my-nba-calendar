# Phase 4 — Atmosphere & Refinement

The production homepage now has one direction: **Precision Sports Collectible**. C supplies the physical ticket/stub relationship; B supplies the mathematically meaningful local-time instrument. The previous A/B/C studies remain development references, not production choices.

## One object in a quiet environment

The page is a functional mobile Web App: product identity, team and city selection, current Pass, future season itinerary, and navigation remain present. It does not become a poster or an isolated share card.

- **Environment:** a warm neutral canvas, almost imperceptible tonal variation, and editorial spacing.
- **Main ticket:** clean ivory stock, controlled printed ink, generous timing space, and an asymmetric matchup.
- **Stub:** a slightly different stock, dense mechanical numbering, and a restrained issuer signature.
- **Depth:** separate contact and ambient shadows, plus a very light cut-edge highlight. Shadow does not carry the layout.
- **Color:** one primary team-color event. Opponent color remains subordinate; the surrounding UI stays neutral.

The main/stub join, ticket silhouette, Bridge, season edge, sports print window, and timing zone are fixed geometry. State changes can alter limited ink, light, signal and annotation, never the architecture.

## Information that earns its place

`HOU — LAL` leads. The local clock, date and city follow. The six-digit **MG+ Nº 047295** is the zero-padded presentation of the existing personal issue, not a new identity or a claim of global uniqueness. The user still owns the persistent four-digit `PASS 0147`.

The time instrument is a **24-hour clock coordinate**, not a map, route, slider, elapsed-time bar, or geographical distance. Tokyo `10:00` maps to minute 600; London `01:00` maps to minute 60. The local date, time, GMT offset and city come from the existing IANA/city data. For the demonstration fixture on 25 October 2026, London is **GMT**, after the seasonal clock change.

The season edge comprises 82 individually indexed marks, with the current game identified by one registration mark. The marks belong to the paper edge, rather than appearing as a progress widget.

`WATCHING FROM` is current location context. No selection or screenshot claims a historical `WATCHED FROM` experience. Likewise, a mock GAME DAY is not invented LIVE data or a fabricated result.

## Reproduce the actual product captures

After a production build, run the standard exporter:

```sh
npm run export:promo
```

`npm run export:phase4` runs the same formal homepage capture. Without an explicit URL it reuses a production server already responding on port 5300; otherwise it starts one and stops only the process it created. To target a separately managed production server:

```sh
MYGAME_APP_URL=http://127.0.0.1:5300 node design/promo/export-phase4.cjs
```

The exporter uses a 600 × 800 CSS-pixel viewport with DPR 1.8, yielding **1080 × 1440** PNGs. It seeds only a browser-local review identity and actual mock fixture selection. It does not use a parallel promotional HTML template, and does not overwrite the Phase 2 or Phase 3 comparison files.

Outputs live in `output/phase4/`:

- `mygame-plus-douyin-01-tokyo.png`
- `mygame-plus-douyin-02-london.png`
- `tokyo-london-comparison.png` and `pass-comparison.png`
- Separate ticket crops, 30% phone thumbnails, blur, grayscale, reduced-saturation and brand-hidden diagnostic captures.
- `tokyo-london-overlay.png` for aligned location-state comparison.
- `validation.json` records measured geometry, identity, real cursor movement, responsive layouts, browser errors and behavior checks.

## Verification contract

The automated export asserts:

1. Both PNGs decode at 1080 × 1440. The same fixture, personal issue, game number, season, page scale, ticket bounds and fixed print-zone geometry are retained.
2. Tokyo/London change city, local time, GMT and an actual clock cursor. Production has no A/B/C switch.
3. All 82 season marks exist independently; exactly the current event is selected.
4. At 320 / 390 / 480 / 600 CSS pixels, the page has no horizontal overflow, the itinerary clears navigation, and all three navigation targets are at least 44 × 44 pixels.
5. Six team choices retain the user identity and ticket architecture.
6. At the same instant, Tokyo can be GAME DAY while London remains NEXT UP, based on the selected IANA zone's calendar date.
7. Tip-off does not archive. Estimated completion archives once; repeated ticks do not increment again. Reload preserves collection, and home returns to the earliest unfinished event.
8. Team archive reads are isolated. Another team's archive and a different season's existing bytes remain unchanged.
9. Four lifecycle states retain the same print-zone geometry and structural paths. The active season ordinal is content, not a moving container.
10. First explicit confirmation issues once. Normal/reduced-motion browsers retain the identity across refresh and city changes.

The JSON is the run record. The production export passed all of the checks above with no runtime, hydration or artwork-asset error. Both captures use the identical CSS-pixel Pass bounds: **x 88 / y 232 / width 424 / height 335.46875**. The PNGs are **1080 × 1440**, and the isolated ticket crops are **1080 × 856**. The final run exercised the exporter's own production-server startup and cleanup; the process it started was no longer listening after completion.

The raw Tokyo/London comparison found **8,855 changed pixels**, all inside the actual city, local-time, GMT, cursor or converted future-time bounds. **Static pixel differences: 0.** The allowed masks come from those elements' measured DOM bounds, with a 3-device-pixel antialiasing allowance; the entire ticket is not excluded.

The simultaneous timezone test used **24 October 2026, 16:00 UTC**: Tokyo had entered 25 October and GAME DAY; London was still 24 October and NEXT UP. The 25 October 01:00 UTC tip-off did not archive. The explicit mock estimated completion at 04:00 UTC archived `hou-1` once, and repeated clock updates and reload kept the derived collection count at one.

The full suite passed **79 / 79** tests, and the final **Next.js production build passed**. Four additional semantic unit tests cover shared immutable issue data, the true 24-hour coordinates, fixed print-zone contracts across lifecycle states, and previews without false identity/results/viewing history. Existing unit tests still cover the archive data model, season rollover, malformed storage, meaningful References, no false viewing history, and state resolver boundaries.

## Six viewing distances

Use the generated diagnostics alongside the full phone captures:

| Distance | Review question |
| --- | --- |
| 30% thumbnail | Passed visual review: the matchup and physical Pass lead; the light navigation remains subordinate. |
| Normal phone | Passed visual review: the functional page is quiet, with the ticket's stock and narrow team rail providing the main event. |
| Close ticket | Passed visual review: serial, season edge, mechanical stub, local-time scale and center-court geometry reward closer looking. |
| Tokyo → London | Passed visual review: one personal object and unchanged framing show a changed city, GMT, clock and real time-index cursor. |
| Brand hidden | Passed visual review: ticket construction, matchup and instrument remain a coherent visual identity without the issuer signature. |
| Ticket crop | Passed visual review: the Pass remains complete without importing navigation, schedule or promotional CTA. |

These are visual review questions, not measurements of user desire. Whether people want to save or share the Pass requires actual user feedback.
