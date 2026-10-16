# MyGame+ Promo V1.5 — Brand Signal & Product Reality

System is engineered. Game is tactile.
V1.5 adds brand and product-state cues to the V1.4 material system. Existing event content, team symbols, bottom navigation and App business logic are unchanged.

## Brand and product reality

- The existing brand title and script wordmark keep their coordinates and shapes. A 56×56px ivory App Mark sits at x=104/y=68 to the title's left, with a 14px radius and a very faint border. Geist M sits upper-left; G+ sits lower-right. There is no red background, horizontal abbreviation or stacked center alignment.
- Tokyo slogan: `无论在哪，主队准时见。` London slogan: `换个城市，不换主队。` Both use x=176/y=184, width=728, height=28, 24px type at weight 550. The slogan sits between the original subtitle and the product status surface.
- To fit the slogan, only the Beta strip and city state move within the header area. GAME PASS, schedule and bottom island keep their previous coordinates and sizes.
- Tokyo state: `当前城市 · TOKYO`. London state: `城市切换 · TOKYO → LONDON`. Same position, size and weight; the route is subtly darker.
- `AUTO CONVERTED` is a 10px unboxed neutral microstate immediately before LOCAL TIME. A tiny neutral dot supports it without turning it into a feature badge. The main LOCAL TIME/arrow coordinates remain intact.
- Existing team/city chevrons increase from 14px to 16px with about 12% stronger ink contrast, retaining 1.5px rounded strokes. There is no input frame, button surface or pill.
- The export renders the existing demo UTC fixtures through Intl/IANA timezone conversion, matching the real App's established behavior; this adds no product feature or live data source.
- GAME PASS receives restrained upper-left light at 34%/22%. Other editorial areas and the quieter Beta remain flat. The serial stays `MG+ / HOU–LAL / 01` with no developer/build/version wording.
- Product reality comes from WEB APP BETA, clickable-looking selectors, the functioning navigation language and the paired Tokyo/London state. No visible URL/domain, QR code or new CTA is added.

## Shared material and navigation

`src/styles/system-island.css` is used by the real App and both promotional exports.

- Surface: `#181917`; radius: 32px; active segment: white 12%, radius 20px, no border.
- Top inset: white 10%; bottom inset: black 26%; outside shadow: 0 8px 24px, black 12%; soft edge: white 2.5%.
- Active icon/Chinese: warm white, Chinese weight 550; English: white 64%; 3.6px signal-red dot.
- Inactive icon/Chinese: white 54%; English: white 35%.
- Chinese: 15px/20px, weight 500 (active 550). English: 10px/12px, weight 480, tracking .10em.
- Three equal tracks; 22px icons, 1.5px rounded strokes with non-scaling paths; identical icon and text baselines. The 80px outer height is retained.
- Promo island: x=76, y=1334, width=928, height=80, bottom=26 on a 1080×1440 canvas. Schedule ends at y=1296.
- Mini status surface: x=204, y=224, width=672, height=54, radius=16; warm white 58%, blur 8px, border 3.8%, no inner highlight or external shadow.

## Warm stone, tactile paper, signal color

- Canvas: `#F5F3EF`, a quiet warm-stone editorial background.
- Paper: `#FBF9F6`; central light `#FDFBF9`; settled edge `#F9F7F4`. The very low-contrast radial light is luminance-only; the pass has no blur or glossy reflection.
- Paper edge: white 64% top inset, dark 3.4% bottom inset, a 4.8% hairline. A low `drop-shadow(0 3px 6px rgba(20,20,20,.035))` follows the genuinely cut silhouette.
- Exactly two original 16px side punch positions are retained. The paper surface uses intersecting radial masks; the holes reveal Canvas. A faint white upper arc and darker inner arc describe the cut edge.
- The tear guide uses a regular 8px pitch (3px mark / 5px gap), 0.65px ink and a restrained 0.5px light edge. It stays centered on the cutouts, without a groove.
- Identity patches retain 12px radii with no border or shadow. Pale red/purple ink varies only from 1.4% in the center to about 2.4–2.5% at the edge, weaker than the pass lighting.
- Unified signal red: `#C7343D`; LAL purple: `#76548E`; GSW blue: `#375A83`. Color encodes identity/state. The MyGame+ script silhouette is reused as a mask, changing ink color without reshaping the mark.
- Ordinary city/identity/schedule regions remain flat. Dividers use 3.8% opacity; no additional boxes or shadows are introduced there.

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
It also checks the two exact slogans, diagonal App Mark, AUTO CONVERTED, chevron styling, header safe gaps, flat editorial regions and absence of visible URLs.
Differences between the two images occur only in slogan, city, GMT, time and city-transition text regions.
The validation report is written to `/tmp/mygame-promo-v1.5-validation.json` rather than checked in as a generated artifact.

With the App running locally, run `node design/promo/check-app.cjs` (`MYGAME_APP_URL` defaults to `http://127.0.0.1:3200`).
This checks real city/team navigation, fixture/no-fixture states, context dismissal, reduced motion and 320/390/480/1080px safe areas.
