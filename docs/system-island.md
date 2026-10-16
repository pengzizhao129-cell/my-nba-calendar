# MyGame+ Promo V1.6 — Final Art Direction Pass

System is engineered. Game is tactile.
V1.6 refines the existing brand seal, header hierarchy and tactile pass. Existing information architecture, event content, team symbols, bottom navigation destinations and App business logic are unchanged. No module, function, CTA or copy is added.

## Fixed brand lockup and four header levels

- Brand: the 56×56px ivory App Mark is at x=176/y=68, radius 16px. The Chinese title is 34px/44px, weight 500, warm graphite; the original script silhouette is 224×70px at x=468/y=60. These are one fixed, left-aligned lockup rather than competing headings.
- The mark uses three custom SVG contours, with no font glyphs. M has chamfered shoulders and a diagonal inner counter; G has a squared-round open contour, shared cuts and an integrated plus. M remains upper-left and G+ lower-right with negative space between. The ivory seal has a subtle upper-left light, restrained lower edge and a 0 1px 3px / 3.5% contact shadow. There is no red background.
- Emotion: Tokyo `无论在哪，主队准时见。`; London `换个城市，不换主队。`. Both use x=176/y=152, width=728, height=32, 26px type at weight 500. A 24px gap from the brand and 32px pause before product identity separate the slogan from ordinary explanatory text.
- Product identity: `NBA 主队赛程 · 本地时间` at y=216, with NBA 30px/650 and the descriptor 19px/450. WEB APP BETA and the existing capability copy sit at y=252 in a flat 32px row. No enclosing light, blur, border or card competes with the pass. Divider spacing is preserved explicitly.
- State: the city-state line sits at y=304; MY TEAM / LOCAL TIME starts at y=352, selector values at y=384, metadata at y=428. Spacing and smaller, lighter type group these as system state. GAME PASS, schedule and bottom island keep their established coordinates and sizes.
- Tokyo state: `当前城市 · TOKYO`. London state: `城市切换 · TOKYO → LONDON`. Same position, size and weight; the route is subtly darker.
- `AUTO CONVERTED` and WEB APP BETA share one system-microcopy token: 11px/16px, weight 500, tracking .13em, warm neutral `#9B958A`. AUTO remains unboxed before LOCAL TIME, supported only by a tiny neutral dot.
- Existing team/city chevrons are 18px with clearer warm-neutral ink `#817A6D`, retaining 1.5px rounded strokes and precise value-to-chevron gaps. There is no input frame, button surface or pill.
- The export renders the existing demo UTC fixtures through Intl/IANA timezone conversion, matching the real App's established behavior; this adds no product feature or live data source.
- GAME PASS receives restrained upper-left light at 32%/26%. Other editorial areas and Beta remain flat. The serial stays `MG+ / HOU–LAL / 01` with no developer/build/version wording.
- Product reality comes from WEB APP BETA, clickable-looking selectors, the functioning navigation language and the paired Tokyo/London state. No visible URL/domain, QR code or new CTA is added.

## Shared material and navigation

`src/styles/system-island.css` is used by the real App and both promotional exports.

- Surface: `#181917`; radius: 32px; active segment: white 12%, radius 20px, no border.
- Top inset: white 10%; bottom inset: black 26%; outside shadow: 0 8px 24px, black 12%; soft edge: white 2.5%.
- Active icon/Chinese: warm white, Chinese weight 550; English: white 64%; 3.6px signal-red dot.
- Inactive icon/Chinese: white 54%; English: white 35%.
- Chinese: 16px/22px, weight 500 (active 550). English: 10px/12px, weight 480, tracking .10em. A 2px internal gap preserves the 64px navigation stack within the 80px island, making Chinese the first reading level.
- Three equal tracks; 22px icons, 1.5px rounded strokes with non-scaling paths; identical icon and text baselines. The 80px outer height is retained.
- Promo island: x=76, y=1334, width=928, height=80, bottom=26 on a 1080×1440 canvas. Schedule ends at y=1296.
- Beta is now flat microcopy in the product-identity group rather than another surface. The brand seal is the sole small branding exception; GAME PASS is the only illuminated content object, and the dark island remains the distinct engineered control layer.

## Warm stone, tactile paper, signal color

- Canvas: `#F4F2EE`, a quiet, flat warm-stone editorial background.
- Paper: `#FCFAF7`; central light `#FEFDFA`; settled edge `#FAF8F4`. A broad luminance-only radial light gives the center air while keeping the edges stable; the pass has no blur, glossy reflection or 3D transform.
- Paper edge: white 70% top inset, dark 4.2% bottom inset, a 5.5% hairline. A low `drop-shadow(0 4px 8px rgba(34,29,21,.043))` follows the cut silhouette rather than a rectangular box. This increases separation from the flat canvas without making the pass float high.
- Exactly two original side punch positions are retained; their diameter is refined to 20px. The paper surface uses intersecting radial masks, so the holes reveal Canvas. A 72% white upper arc and 7.5–9% darker inner/lower arc describe the cut material.
- The tear guide uses a regular 8px pitch (3px mark / 5px gap), 0.7px ink at 9% and a restrained 0.5px light edge. It stays precisely centered on the cutouts, without a groove.
- Identity patches retain 12px radii with no border or shadow. Pale red/purple ink varies only from 1.2% in the center to about 2–2.1% at the edge, weaker than the pass lighting. HOU/LAL increase to 64px/72px at weight 580; core time uses 100px/104px from the existing 48px design token and promo scale. The watermark steps back to 1.6%.
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

The exporter verifies dimensions, complete PNG decoding, Geist readiness, text fit, radius and geometry, navigation alignment, equal material parameters and pixel-identical islands.
It also checks the two exact slogans, custom vector App Mark, unified system microcopy, chevron styling, four header levels and safe gaps, borderless summary, flat editorial regions and absence of visible URLs.
Differences between the two images occur only in slogan, city, GMT, time and city-transition text regions.
The validation report is written to `/tmp/mygame-promo-v1.6-validation.json` rather than checked in as a generated artifact.
For art-direction review, it also exports 324×432 (30%) thumbnails and borderless full-size/30% variants to `/tmp/mygame-promo-v1.6-{tokyo,london}-*.png`. Border removal is checked to leave every shared layout landmark unchanged. These diagnostics are not delivery images or extra repository artifacts.

With the App running locally, run `node design/promo/check-app.cjs` (`MYGAME_APP_URL` defaults to `http://127.0.0.1:3200`).
This checks real city/team navigation, fixture/no-fixture states, context dismissal, reduced motion and 320/390/480/1080px safe areas.
