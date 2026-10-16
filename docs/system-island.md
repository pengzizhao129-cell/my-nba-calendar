# MyGame+ Promo V1.2 — System Island

Deep warm graphite belongs to system controls. Sports content remains warm matte paper.
The existing team identity symbols, schedule data, timezones and brand structure are unchanged.

## Shared material and navigation

`src/styles/system-island.css` is used by the real App and both promotional exports.

- Surface: `#1A1B19`; radius: 32px; active segment: white 10%, radius 20px, no border.
- Top inset: white 11%; bottom inset: black 22%; outside shadow: 0 8px 24px, black 12%; soft edge: white 3.5%.
- Active icon/Chinese: warm white; English: white 60%; small brand-red dot.
- Inactive icon/Chinese: white 48%; English: white 32%.
- Three equal tracks; 20px icons, 1.5px rounded strokes; identical icon and text baselines.
- Promo island: x=76, y=1334, width=928, height=80, bottom=26 on a 1080×1440 canvas. Schedule ends at y=1296.
- Mini status surface: x=204, y=192, width=672, height=58, radius=16; warm white 78%, blur 12px, border 4.8%.
- GAME PASS remains paper, with cutouts, perforation, watermark and subtle team tint. No dark sports surfaces.

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
It also confirms that differences between the two images occur only in city, GMT, time and city-transition text regions.
The validation report is written to `/tmp/mygame-promo-v1.2-validation.json` rather than checked in as a generated artifact.

With the App running locally, run `node design/promo/check-app.cjs` (`MYGAME_APP_URL` defaults to `http://127.0.0.1:3200`).
This checks real city/team navigation, fixture/no-fixture states, context dismissal, reduced motion and 320/390/480/1080px safe areas.
