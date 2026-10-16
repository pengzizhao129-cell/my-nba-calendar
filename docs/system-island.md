# MyGame+ Promo V1.7 — Branded Sports Language

System is engineered. Game is tactile.
V1.7 unifies timing numerals, event dates, team wordmarks and technical labels within the existing composition. Existing event content, abstract team-symbol concepts, navigation destinations and App business logic are unchanged. No module, function, CTA or copy is added.

## Premium sports timing and identity type

- `MyGame Timing` is a small, OFL-licensed derivative of the bundled Geist, not a downloaded display or scoreboard font. It retains Geist's modern solid numeral skeleton and narrows the tabular advance by 8% to 569/1000 em. Every digit has the same advance both by default and with `tnum` enabled.
- Zero has a custom upright, controlled-shoulder outline and a carefully opened counter. One keeps a substantial stem, flag and foot. There are no broken strokes, LED dots, stencil cuts, glow or italic shapes. Weight 550 serves the main time/date; 500 serves smaller programme times, dates and count.
- Main time remains 100px in its existing 104px frame. No enlargement compensates for the new type character. Programme times remain 30px, right-aligned on the same axis.
- Colon is not a font glyph: two rounded-square marks at .064em, radius .012em, sit at 34%/64% of a .74em carrier. The same geometry scales from main to programme time; opacity is 64% in the pass and 56% in the programme. A hidden textual colon and complete accessible label preserve the time's meaning.
- `25` uses the same timing family at 64px/550. `OCT` is 21px/500 with .12em tracking and a -1px baseline compensation. Weekday/SUN recede to secondary warm greys.
- `MyGame Identity` is a Geist-derived uppercase subset, 6% narrower at weight 600, retaining the original clear, upright letter construction. HOU/LAL are 64px with -.025em tracking; MY TEAM and programme team codes inherit this stamp-like family. Team colors remain restrained.
- Source and license: `src/app/fonts/GeistSans.woff2` and [SIL Open Font License](../src/app/fonts/OFL.txt). Copyright (c) 2023 Vercel, in collaboration with basement.studio. Modified font families have their own names and embed the upstream copyright and complete license in their metadata. The original Geist file is unchanged.
- `design/promo/build-type.py` reproduces the three checked-in WOFF2 subsets. Optional authoring dependencies are `fonttools[woff]==4.61.1` and `Brotli==1.1.0`. Regular PNG export consumes the checked-in subsets and needs no Python packages or external font requests.

## Fixed brand lockup and four header levels

- Brand: the 56×56px ivory App Mark is at x=176/y=68, radius 16px. The Chinese title is 34px/44px, weight 500, warm graphite; the original script silhouette is 224×70px at x=468/y=60. These are one fixed, left-aligned lockup rather than competing headings.
- The mark uses three custom SVG contours, with no font glyphs. M has chamfered shoulders and a tighter diagonal inner counter; G keeps its squared-round open contour. A separately drawn plus now ends in a small chamfer that echoes M's cuts. M remains upper-left and G+ lower-right with a clearer diagonal gap. The ivory seal has a broad upper-left radial light, a 4.5% hairline, restrained lower edge and a 0 1px 3px / 4% contact shadow. There is no red background; the script remains the signature and MG+ the seal.
- Fixed visual order follows city label → brand lockup → NBA descriptor → slogan. Descriptor is at y=144, 16px below the brand frame; slogan is at y=192, 16px below the descriptor frame. Tokyo `无论在哪，主队准时见。`; London `换个城市，不换主队。`. Both slogans remain 26px/32px, weight 500, width 728. They form an emotional pause rather than another explanatory heading.
- Product/system row: WEB APP BETA and the existing capability copy sit at y=248 in a flat 32px row, 24px below the slogan. NBA is 30px/650 and the descriptor 19px/450; Beta microcopy is 11px/500 and capability copy 18px/450. No enclosing light, blur, border or card competes with the pass.
- State: city-state at y=304, 24px below Beta; MY TEAM / LOCAL TIME at y=352, 24px below the city-state frame. Selector values sit at y=376 and metadata at y=416. Product, emotional and state text use deliberate weight/grey differences rather than a stack of similarly strong headings. GAME PASS, schedule and island keep their established coordinates and sizes.
- Tokyo state: `当前城市 · TOKYO`. London state: `城市切换 · TOKYO → LONDON`. Same position, size and weight; the route is subtly darker.
- `LOCAL TIME` now owns a single 280×96px right-aligned group containing its label/arrow, city, IANA-derived location/GMT metadata and `AUTO CONVERTED` beneath the metadata at y=432. City is primary at 30px/550; metadata is 14px secondary; AUTO is 11px tertiary and shares the group's exact right edge. It no longer floats beside the label.
- All technical labels—GAME PASS, GAME DAY, MY TEAM, LOCAL TIME, NEXT 7 DAYS, WEB APP BETA and AUTO CONVERTED—use Geist, weight 500, .13em tracking and a related warm-grey family. GAME PASS is 20px and slightly darker; other labels are 14px or 11px according to hierarchy. AUTO/Beta share exact 11px/16px tokens, including color `#999184`.
- Existing team/city chevrons are 18px with clearer warm-neutral ink `#817A6D`, retaining 1.5px rounded strokes and precise value-to-chevron gaps. There is no input frame, button surface or pill.
- The export renders the existing demo UTC fixtures through Intl/IANA timezone conversion, matching the real App's established behavior; this adds no product feature or live data source.
- The original abstract crests retain their paths, 1.5px rounded strokes and non-scaling detail. Their stamp frames are optically balanced at 28px; LAL gets a 1px vertical correction. No additional crest detail or symbol concept is introduced.
- GAME DAY is an unboxed 14px technical label above 22px/500 Chinese state and its small solid red signal. In the stub, `HOME · 主场` recedes to 17px/450 tertiary ink; `丰田中心` remains 22px/500 secondary, separated by 24px like printed event detail. The serial stays `MG+ / HOU–LAL / 01`, with no developer/build/version wording.
- Product reality comes from WEB APP BETA, clickable-looking selectors, the functioning navigation language and the paired Tokyo/London state. No visible URL/domain, QR code or new CTA is added.

## Shared material and navigation

`src/styles/system-island.css` is used by the real App and both promotional exports.

- Surface: `#181917`; radius: 32px; active segment: white 12%, radius 20px, no border.
- Top inset: white 10%; bottom inset: black 26%; outside shadow: 0 8px 24px, black 12%; soft edge: white 2.5%.
- Active icon/Chinese: warm white, Chinese weight 550; English: white 64%; 3.6px signal-red dot.
- Inactive icon/Chinese: white 58%; English: white 35%.
- Chinese: 22px/26px, weight 500 (active 550), so its 30% rendering is 6.6px rather than 4.8px. English remains the second layer at 10px/12px, weight 480, tracking .10em. A 1px gap and 1px vertical padding preserve the 64px stack within the same 80px island; no item or state is added.
- Three equal tracks; 22px icons, 1.5px rounded strokes with non-scaling paths; identical icon and text baselines. The 80px outer height is retained.
- Promo island: x=76, y=1334, width=928, height=80, bottom=26 on a 1080×1440 canvas. Schedule ends at y=1296.
- Beta is now flat microcopy in the product-identity group rather than another surface. The brand seal is the sole small branding exception; GAME PASS is the only illuminated content object, and the dark island remains the distinct engineered control layer.

## Warm stone, tactile paper, signal color

- Canvas: `#F4F2EE`, a quiet, flat warm-stone editorial background.
- Paper: `#FCFAF7`; central light `#FFFEFA`; settled edge `#F8F5EF`. Broad upper-left light at 32%/24% slightly increases soft volume through luminance alone. The pass has no blur, glossy reflection or 3D transform.
- Paper edge: white 76% top inset, dark 5% bottom inset, a 5% hairline. A low `drop-shadow(0 4px 9px rgba(34,29,21,.052))` follows the cut silhouette rather than a rectangular box. This increases contact separation from the flat canvas without making the pass float high.
- Exactly two original side punch positions are retained; diameter is refined to 22px. The paper surface uses intersecting radial masks, so the holes reveal Canvas. A 78% white upper arc and 9.5–11% darker inner/lower arc describe the cut material. The frame, punch centers and tear-guide axis remain unchanged.
- The tear guide uses a regular 8px pitch (3px mark / 5px gap), 0.7px ink at 11% and a restrained 0.5px light edge at 50%. It stays precisely centered on the cutouts, without a groove.
- Printed/laminated identity patches retain 12px radii with no border or shadow. Pale red/purple ink varies only from 1.2% in the center to about 2–2.1% at the edge, weaker than the pass lighting; they inherit the pass's broader light. Core time remains 100px/104px from the existing 48px design token and promo scale. Watermark remains 1.6%.
- Unified signal red: `#C7343D`; LAL purple: `#76548E`; GSW blue: `#375A83`. Color encodes identity/state. The MyGame+ script silhouette is reused as a mask, changing ink color without reshaping the mark.
- Ordinary city/identity/schedule regions remain flat. NEXT 7 DAYS becomes a quieter summary: 30px/500 section heading, 42px/500 count, smaller secondary dates, aligned team identities and 30px times. Schedule rules are removed; row grouping relies on spacing and alignment rather than a table frame. No additional boxes or shadows are introduced there.

## Contextual Island State in the real App

`SystemIsland` accepts an optional `IslandGameContext` supplied by `CalendarApp` from the existing `schedule.today[0]`.
This uses the selected app clock (fixed demo or real date) and the selected IANA timezone; it is not a live-score or official-schedule feature.

The resting state always shows 首页 / HOME, 赛程 / SCHEDULE, 我的 / PROFILE.
After a team, timezone or app-clock change, a valid same-day fixture briefly opens a context row above the navigation inside the island:

`● HOU · GAME DAY · 10:00` (Tokyo) or `● HOU · GAME DAY · 01:00` (London).

The context closes after 1800ms or immediately on navigation. Navigation remains usable throughout.
Switching to a team/date without a same-day fixture cancels it; a no-game state never announces a game.
It does not run automatically on initial mount or on unrelated rerenders. Timers are cleaned up on state changes/unmount.
The App reserves bottom padding for the expanded state. Width and context-row transitions are 180ms ease-out.
`QuietValue` crossfades only changed city/time values for 180ms; reduced-motion users receive immediate state changes.
No bounce, spring, rotation, glow or decorative animation is added.

Static promotional exports intentionally show only resting navigation with 首页 active; they do not include temporary context text.

## Re-export

Run `node design/promo/export.cjs` from an installed checkout. It uses Sharp from the repository and Playwright from Node's resolution path (with a Codex-runtime fallback).
Chromium defaults to `/usr/bin/chromium`; `PROMO_CHROMIUM` can select another installed executable.
All fonts/assets are served locally for export; the browser makes no external asset requests.

Output:

- `output/douyin/mygame-plus-douyin-01-tokyo.png`
- `output/douyin/mygame-plus-douyin-02-london.png`

The exporter verifies dimensions, complete PNG decoding, all three font families, text fit, radius and geometry, navigation alignment, equal material parameters and pixel-identical islands.
It also checks the two exact slogans, custom vector App Mark, unified technical labels, equal digit advances, custom colon geometry/contrast, date/time-family consistency, LOCAL TIME ownership/alignment, exact header gaps, borderless summary, flat editorial regions and absence of visible URLs.
Differences between the two images occur only in slogan, city, GMT, time and city-transition text regions.
The validation report is written to `/tmp/mygame-promo-v1.7-validation.json` rather than checked in as a generated artifact.
For art-direction review, it also exports 324×432 (30%) thumbnails and border-off full-size/30% variants to `/tmp/mygame-promo-v1.7-{tokyo,london}-*.png`. Border-Off suppresses borders/outlines and both divider/tear-guide drawings, without altering widths or positions. Every shared layout landmark must remain unchanged; visual review checks that type and whitespace still carry the hierarchy. These diagnostics are not delivery images or extra repository artifacts.

With the App running locally, run `node design/promo/check-app.cjs` (`MYGAME_APP_URL` defaults to `http://127.0.0.1:3200`).
This checks real city/team navigation, fixture/no-fixture states, context dismissal, reduced motion and 320/390/480/1080px safe areas.
