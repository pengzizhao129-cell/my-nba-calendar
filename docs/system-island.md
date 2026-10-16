# MyGame+ Promo V1.8 — Luxury Precision Pass

System is engineered. Game is tactile.
V1.8 reduces noise through four brightness tiers, alternating dense/open spacing, a light-defined ticket edge and a thinner system island. The V1.7 timing/identity type, logo contours, event content, abstract team symbols, destinations and App business logic are unchanged. No module, function, CTA, decorative concept or copy is added.

## Four brightness tiers and deliberate restraint

| Ink tier | Token | Role |
| --- | --- | --- |
| Primary | `#262521` | Main time, event date, team Chinese names, match status, programme times/count |
| Secondary | `#686259` | Chinese brand name, slogan, city, venue, future opponents and summary heading |
| Tertiary | `#948C80` | NBA descriptor, city-state line, weekday, HOME/AWAY, selector hints, date structure and GMT metadata |
| Micro | `#AAA397` | Technical uppercase labels, auxiliary English, WEB APP BETA, AUTO CONVERTED and serial |

Signal/team colors and inverse island ink retain their specific identity/state roles. Neutral content no longer chooses local near-duplicate greys. GAME PASS's label steps back to the same micro tier as GAME DAY; it is the physical pass and its sporting content that lead the composition.
Beta/AUTO, English metadata, weekdays and secondary labels retreat through the shared ink system. The existing watermark recedes from 1.6% to 0.9%; the brand seal's edge/contact shadow also softens. Programme dividers remain absent. No information is removed.

## Premium sports timing and identity type

- `MyGame Timing` is a small, OFL-licensed derivative of the bundled Geist, not a downloaded display or scoreboard font. It retains Geist's modern solid numeral skeleton and narrows the tabular advance by 8% to 569/1000 em. Every digit has the same advance both by default and with `tnum` enabled.
- Zero has a custom upright, controlled-shoulder outline and a carefully opened counter. One keeps a substantial stem, flag and foot. There are no broken strokes, LED dots, stencil cuts, glow or italic shapes. Weight 550 serves the main time/date; 500 serves smaller programme times, dates and count.
- Main time remains 100px in its existing 104px frame. No enlargement compensates for the new type character. Programme times remain 30px, right-aligned on the same axis.
- Colon is not a font glyph: two rounded-square marks at .064em, radius .012em, sit at 34%/64% of a .74em carrier. The previous .01em downward offset is removed for optical balance. The same geometry scales from main to programme time; opacity remains 64% in the pass and 56% in the programme. A hidden textual colon and complete accessible label preserve the time's meaning.
- `25` uses the same timing family at 64px/550, with a -1px horizontal correction. `OCT` is 21px/500 with .12em tracking, an 8px group gap and a -2px baseline compensation. The main time receives -2px horizontal/-1px vertical optical compensation within its unchanged frame; LOCAL TIME stays on the 32px ticket-content axis. Programme times retain their tabular alignment. Weekday/SUN recede to tertiary/micro ink.
- `MyGame Identity` is a Geist-derived uppercase subset, 6% narrower at weight 600, retaining the original clear, upright letter construction. HOU/LAL are 64px with -.025em tracking; MY TEAM and programme team codes inherit this stamp-like family. Team colors remain restrained.
- Source and license: `src/app/fonts/GeistSans.woff2` and [SIL Open Font License](../src/app/fonts/OFL.txt). Copyright (c) 2023 Vercel, in collaboration with basement.studio. Modified font families have their own names and embed the upstream copyright and complete license in their metadata. The original Geist file is unchanged.
- `design/promo/build-type.py` reproduces the three checked-in WOFF2 subsets. Optional authoring dependencies are `fonttools[woff]==4.61.1` and `Brotli==1.1.0`. Regular PNG export consumes the checked-in subsets and needs no Python packages or external font requests.

## Fixed brand lockup and four header levels

- Brand: the 56×56px ivory App Mark remains at x=176/y=68, radius 16px. The Chinese title remains 34px/44px, weight 500, now using secondary ink. It moves down 1px; the original 224×70px script silhouette moves down 2px to x=468/y=62 for optical alignment. Neither is enlarged or redrawn.
- The mark retains three custom SVG contours: M upper-left, G+ lower-right, with the existing independent chamfered plus and negative space. The ivory seal's hairline and contact shadow step back to 2.5%. The script remains the signature and MG+ the seal, without an additional decorative signature.
- Fixed visual order remains city label → brand lockup → NBA descriptor → slogan. The descriptor sits at y=136, 8px below the brand frame; slogan sits at y=192, 24px below the descriptor. Tokyo `无论在哪，主队准时见。`; London `换个城市，不换主队。`. Both remain 26px/32px, weight 500, width 728, in secondary ink.
- Product/system row: Beta and the existing capability copy sit at y=240 in a flat 24px row, 16px below the slogan. NBA remains 30px/650; descriptor 19px/450; Beta 11px/500; capability copy 18px/450. No enclosing surface competes with the pass; the small separator recedes to 4% ink.
- State: city-state at y=296, 32px below Beta; MY TEAM / LOCAL TIME at y=328, only 8px below the city-state frame. Selectors sit at y=352, metadata at y=392 and AUTO at y=408. The 96px identity frame ends at y=424; GAME PASS begins at y=456 after a deliberate 32px open gap.
- Full vertical rhythm, measured frame-to-frame: city label → brand **8**, brand → descriptor **8**, descriptor → slogan **24**, slogan → Beta **16**, Beta → city state **32**, city state → identity **8**, identity → pass **32**, pass → summary **48**, summary → island **32** px. The dense state group and open event transitions produce a deliberate rhythm rather than repeated similar gaps.
- Tokyo state: `当前城市 · TOKYO`. London state: `城市切换 · TOKYO → LONDON`. Both use one tertiary tier; route text does not introduce another nearly identical grey.
- LOCAL TIME retains one 280×96px right-aligned group. City remains 30px/550 in secondary ink; location/GMT metadata is 14px tertiary; AUTO is 11px micro, beneath the metadata. It shares the same right edge and remains clearly owned by the time system.
- All technical labels use Geist, weight 500, .13em tracking and the same micro ink `#AAA397`. GAME PASS remains 20px; other labels remain 14px or 11px. AUTO/Beta share exact 11px/16px tokens.
- Existing team/city chevrons remain 18px with 1.5px rounded strokes and precise gaps; their ink is unified to tertiary. There is no input frame, button surface or pill.
- The export renders the existing demo UTC fixtures through Intl/IANA timezone conversion, matching the real App's established behavior; this adds no product feature or live data source.
- The original abstract crests retain their paths, 1.5px rounded strokes and non-scaling detail. Their stamp frames are optically balanced at 28px; LAL gets a 1px vertical correction. No additional crest detail or symbol concept is introduced.
- GAME DAY remains an unboxed 14px micro label above 22px/500 primary Chinese state and its small red signal. In the stub, `HOME · 主场` is 17px/450 tertiary; `丰田中心` is 22px/500 secondary, separated by 24px like printed event detail.
- `MG+ / HOU–LAL / 01` is the sole third-look brand detail. Its text is unchanged; it now uses a fixed 14px/20px size, weight 500, .10em tracking, 8px gaps around two separators, and micro ink. Slash tracking is neutral and opacity 62%. The serial remains aligned to the stub's 32px right inset. No additional numbering or signature is introduced.
- Product reality comes from WEB APP BETA, clickable-looking selectors, the functioning navigation language and the paired Tokyo/London state. No visible URL/domain, QR code or new CTA is added.

## Shared material and navigation

`src/styles/system-island.css` is used by the real App and both promotional exports.

- Surface remains `#181917`; radius settles to 30px; active segment softens from white 12% to 8.5%, radius 20px, no border.
- Top inset: white 8%; bottom inset: black 18%; outside shadow: 0 4px 12px, black 7%; soft edge: white 2%. Height reduces from 80px to 76px; shadows and depth are reduced rather than reinforced.
- Active icon/Chinese remain warm white, Chinese weight 550; English: white 62%; 3.6px signal-red dot.
- Inactive icon/Chinese: white 60%; English: white 40%, preserving legibility against the quieter active segment.
- Chinese remains 22px/26px, weight 500 (active 550), rendering at 6.6px in the 30% thumbnail. English remains 10px/12px, weight 480, tracking .10em. The unchanged 64px internal stack is kept through 6px outer vertical padding; no label is compressed or added.
- Three equal tracks; 22px icons, 1.5px rounded strokes with non-scaling paths; identical icon and text baselines. All tracks retain the same optical center.
- Promo island: x=76, y=1336, width=928, height=76, bottom=28 on a 1080×1440 canvas. Schedule frame ends at y=1304, leaving 32px clear above the island.
- Beta is now flat microcopy in the product-identity group rather than another surface. The brand seal is the sole small branding exception; GAME PASS is the only illuminated content object, and the dark island remains the distinct engineered control layer.

## Warm stone, tactile paper, signal color

- Canvas: `#F4F2EE`, a quiet, flat warm-stone editorial background.
- Paper: `#FCFAF7`; central light `#FFFEFA`; settled edge `#F8F5EF`. Broad upper-left light at 32%/24% slightly increases soft volume through luminance alone. The pass has no blur, glossy reflection or 3D transform.
- Paper edge is now defined principally by Canvas/paper luminance, cutouts and contact light: white 64% top inset, dark 2.5% bottom inset and only a 1.8% supporting border (about 2% after Chromium color quantization). Contact shadow decreases to `0 4px 9px rgba(34,29,21,.036)`. The existing broad luminance surface remains unchanged; no stronger gradient or extra texture is added.
- Exactly two original side punch positions are retained at 22px diameter. The paper surface uses intersecting radial masks, so the holes reveal Canvas. A 78% white upper arc and 9.5–11% darker inner/lower arc describe the cut material. Ticket dimensions, relative punch centers and the tear-guide axis remain unchanged.
- The tear guide retains its 8px pitch (3px mark / 5px gap) and cutout alignment. Ink decreases to 7.5% at 0.7px, and its 0.5px light edge to 38%; it suggests the manufacturing process quietly.
- Identity patches retain 12px radii with no border or shadow. Existing HOU red now contributes only 0.8–1.6% warmth; existing LAL purple contributes 0.7–1.4% cooler purple-grey temperature. They modulate the ivory rather than read as colored cards, inheriting the pass's broad light. No new color is added. Core time remains 100px/104px; watermark recedes to 0.9%.
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
It also checks all four assigned neutral-ink tiers, the exact dense/open gap sequence, restrained paper-border alpha, fixed serial syntax/spacing/alignment, softer active segment, unchanged slogans, custom App Mark, equal digit advances, date/time consistency, LOCAL TIME ownership, flat editorial regions and absence of visible URLs.
Differences between the two images occur only in slogan, city, GMT, time and city-transition text regions.
The validation report is written to `/tmp/mygame-promo-v1.8-validation.json` rather than checked in as a generated artifact.
Four art-direction reviews are exported only under `/tmp`:

- 30%: 324×432 thumbnails for both cities; verify HOU/LAL, time, ticket silhouette, script signature and navigation survive.
- Squint/Blur: a 5px browser blur, full size and 30%, for both cities; verify sporting object, brand and island remain distinct masses.
- Border-Off: suppress borders/outlines and both divider/tear-guide drawings while preserving dimensions; every shared layout landmark must remain unchanged, and typography/whitespace/light must retain the order.
- Tokyo/London Overlay: exact 50/50 pixel average at 1080×1440 and 30%; fixed regions are also compared directly and must have zero differing pixels outside the allowed content regions.

Diagnostics use `/tmp/mygame-promo-v1.8-{tokyo,london}-*.png` and `/tmp/mygame-promo-v1.8-overlay{,-30}.png`. These are review images, not additional delivery elements or repository artifacts. The final two PNGs retain their required filenames.

With the App running locally, run `node design/promo/check-app.cjs` (`MYGAME_APP_URL` defaults to `http://127.0.0.1:3200`).
This checks real city/team navigation, fixture/no-fixture states, context dismissal, reduced motion and 320/390/480/1080px safe areas.
