# MyGame+ Promo — Material and System Reference

Current ticket construction is [V2.1 — Collectible Pass Structure](collectible-pass.md). It supersedes the older watermark, venue, tear-guide and stub placement described below. The V1.9 material, timing, header and navigation rules remain in effect.

System is engineered. Game is tactile.
V1.9 focuses only on the three header groups, tactile event pass, branded timing numerals, printed team identity areas and thinner system island. It retains the existing composition, logo, slogans, event information, programme, serial and App business logic. No module, information, icon, feature or decorative concept is added.

## Signature Script Placement — Ultra Fine Pass

System information is printed. Emotional information is signed.

- Exactly one nonessential event annotation, `Tip-off`, appears below the existing GAME DAY / 今天有比赛 group. There is no second handwritten cue and no script in team, timing, date, venue, technical, serial, programme or navigation information.
- Placement is absolute within GAME DAY: right=0, top=76px, 72×24px frame. The note clears match status/red signal by at least 8px and team identity by at least 24px. Nothing is reflowed or moved.
- Type is 16px/24px, weight 400, zero tracking, warm graphite `#262521` at 50% opacity. There is no underline, glow, shadow, red ink, rotation or added flourish. The natural handwriting differs from the existing large red MyGame+ signature; the brand mask is unchanged.
- The font is a local `Tip-off` glyph subset of Nothing You Could Do, version 1.005, copyright 2010 Kimberly Geswein, from Google Fonts. It is licensed under [SIL OFL 1.1](../design/promo/event-annotation-OFL.txt). Source: `https://raw.githubusercontent.com/google/fonts/main/ofl/nothingyoucoulddo/NothingYouCouldDo.ttf`; source SHA-256: `1daf8cf79076bf59c5a9117b5efd6ecea35e57a05ef127fe4f95b072b8a5245d`. The local CSS alias is Event Annotation; PNG export needs no external font request.
- Export checks enforce exactly one script text node, its tone/type, safe placement and identical city geometry. Hiding the note must leave all geometry unchanged and affect pixels only inside its bounds. V2.1 retains this check; its optional `PROMO_BASELINE_DIR` comparison instead protects all pixels outside the ticket against the approved pre-V2.1 exports.
- This pass was checked with `/tmp/mygame-script-study/baseline` containing the approved V1.9 exports: exactly 230 changed pixels per city, zero changes elsewhere, and an exact no-note baseline match. At 30% the note recedes while teams and time remain primary.

## Four brightness tiers and deliberate restraint

| Ink tier | Token | Role |
| --- | --- | --- |
| Primary | `#262521` | Chinese brand name, main time, event date, team Chinese names, match status, programme times/count |
| Secondary | `#686259` | Slogan, city, venue, future opponents and summary heading |
| Tertiary | `#948C80` | NBA descriptor, city-state line, weekday, HOME/AWAY, selector hints, date structure and GMT metadata |
| Micro | `#AAA397` | Technical uppercase labels, auxiliary English, WEB APP BETA, AUTO CONVERTED and serial |

Signal/team colors and inverse island ink retain their specific identity/state roles. Neutral content no longer chooses local near-duplicate greys. GAME PASS's label steps back to the same micro tier as GAME DAY; it is the physical pass and its sporting content that lead the composition.
Beta/AUTO, English metadata, weekdays and secondary labels retreat through the shared ink system. The existing watermark recedes from 1.6% to 0.9%; the brand seal's edge/contact shadow also softens. Programme dividers remain absent. No information is removed.

## Premium sports timing and identity type

- `MyGame Timing` is a small, OFL-licensed derivative of the bundled Geist, not a downloaded display or scoreboard font. It retains Geist's modern solid numeral skeleton and narrows the tabular advance to 556/1000 em (10% horizontal condensation of the Geist tabular construction). Every digit has the same advance both by default and with `tnum` enabled.
- Zero has slimmer upright flanks, more decisive shoulders and a carefully opened counter. One now has a custom continuous shoulder, substantial stem and shorter balanced foot. Both use solid custom outlines; glyph height is unchanged. There are no broken strokes, LED dots, stencil cuts, glow or italic shapes. Weight 550 serves the main time/date; 500 serves smaller programme times, dates and count.
- Main time remains 100px in its existing 104px frame. No enlargement compensates for the new type character. Programme times remain 30px, right-aligned on the same axis.
- Colon is not a font glyph: two smaller rounded-square marks at .058em, radius .008em, sit at 35%/62% of a .74em carrier. Carrier width is .16em, with .025em side margins. The same tighter geometry scales from main to programme time; opacity is 60% in the pass and 56% in the programme. A hidden textual colon and complete accessible label preserve the time's meaning.
- `25` uses the same timing family at 64px/550, with a -1px horizontal correction. `OCT` is 21px/500 with .12em tracking, an 8px group gap and a -2px baseline compensation. The main time receives -2px horizontal/-1px vertical optical compensation within its unchanged frame; LOCAL TIME stays on the 32px ticket-content axis; the caption moves from top=452 to 440px, bringing it 12px closer to the main time. Programme times retain their tabular alignment. Weekday/SUN recede to tertiary/micro ink.
- `MyGame Identity` is a Geist-derived uppercase subset, 6% narrower at weight 600, retaining the original clear, upright letter construction. HOU/LAL remain 64px with stable 600 weight, explicit normal kerning and slightly tighter -.032em tracking. MY TEAM and programme team codes retain the same identity family. Team colors remain restrained.
- Source and license: `src/app/fonts/GeistSans.woff2` and [SIL Open Font License](../src/app/fonts/OFL.txt). Copyright (c) 2023 Vercel, in collaboration with basement.studio. Modified font families have their own names and embed the upstream copyright and complete license in their metadata. The original Geist file is unchanged.
- `design/promo/build-type.py` reproduces the three checked-in WOFF2 subsets. Optional authoring dependencies are `fonttools[woff]==4.61.1` and `Brotli==1.1.0`. Regular PNG export consumes the checked-in subsets and needs no Python packages or external font requests.

## Three header groups

- Brand: the existing 56×56px MG+ seal, 34px/44px Chinese title and 224×70px script signature retain their positions and contours. The Chinese title returns to primary ink, establishing the strongest header level without enlargement. Mark remains at x=176/y=68; brand frame remains y=64–128.
- Product: descriptor at y=160, 32px below Brand; slogan at y=196, only 4px below the descriptor frame. Slogan is 26px/32px secondary; descriptor is 19px/450 tertiary with the existing 30px NBA cue. Tokyo remains `无论在哪，主队准时见。`; London remains `换个城市，不换主队。`.
- System: Beta begins at y=260, 32px below Product. City state at y=292 follows by 8px; identity group at y=324 follows by 8px. System labels remain the lightest micro ink. This places related system state together rather than distributing it between Product and Brand.
- Tokyo state remains `当前城市 · TOKYO`; London remains `城市切换 · TOKYO → LONDON`. No text is added or removed.
- LOCAL TIME retains one right-aligned 280×96px group: label, selector, GMT metadata, AUTO CONVERTED. Selector values sit at y=348, metadata at y=388 and AUTO at y=404. The group ends at y=420, leaving 36px before the unchanged GAME PASS position at y=456.
- The exact measured frame-gap sequence is **8 / 32 / 4 / 32 / 8 / 8 / 36 / 48 / 36px** from city label through the bottom island. The two principal layer gaps are 32px; in-layer Product/System gaps are 4–8px. Ticket, programme and serial retain their established layout.
- Technical labels retain Geist 500, .13em tracking and `#AAA397` micro ink; Beta/AUTO remain 11px/16px. Chevrons remain 18px/1.5px, with no input frame or button surface.
- Abstract team crests, GAME DAY/red signal and event venue/serial are retained. `MG+ / HOU–LAL / 01` remains 14px/20px, .10em tracking, 8px separator gaps, 62% slash opacity, at the existing stub right axis.
- The demo UTC fixtures still use Intl/IANA conversion, and product reality still comes from the existing system states, selectors and navigation. There is no URL, QR code, CTA or live-data feature.

## Shared material and navigation

`src/styles/system-island.css` is shared by the real App and both exports.

- Surface remains deep warm graphite `#181917`. Height reduces from 76px to 72px, radius from 30px to 28px. Active radius settles to 18px; active brightness softens to white 7%, without border or glow.
- Top inset: white 7%; bottom inset: black 14%; contact shadow: 0 3px 10px at black 5%; edge: white 2%. The surface becomes thinner through its outer padding and shadow, while labels retain their sizes.
- Three equal tracks retain the same 64px stack. Outer vertical padding reduces from 6px to 4px. Icons remain 22px/1.5px rounded strokes; Chinese remains 22px/26px at 500 (active 550); English remains 10px/12px, 480, .10em tracking. All icon/Chinese/English baselines are identical across tabs.
- Active icon/Chinese: warm white; English: white 62%; signal dot: 3.6px. Inactive icon/Chinese: white 60%; English: white 40%. Chinese remains the first reading layer at 30%.
- Promo island is x=76/y=1340, 928×72px, bottom=28px. The programme frame ends at y=1304, leaving 36px clear space above the island. No tab, label or state is added.

## Tactile event pass and printed identity

- Canvas remains flat warm stone `#F4F2EE`. GAME PASS remains x=176/y=456, 728×576px, radius 20px, and the only illuminated content object.
- Paper is `#FCFAF7`, with a slightly brighter `#FFFEFB` center and settled `#F8F6F1` edge. Broad radial light moves to 32%/28%; an extremely low-amplitude top light changes luminance by roughly one or two RGB steps rather than adding a visible effect.
- Border retreats from 1.8% to 0.8%, with 72% white top inset and 3.2% lower edge. The single contact shadow tightens from a 9px blur to `0 3px 5px rgba(34,29,21,.042)`. It suggests close contact rather than a high floating card. No blur, glossy reflection or 3D transform is used.
- Two original 22px punch positions retain genuine intersected masks. Inner-edge lighting is corrected to a faint darker upper lip (11.5%) and lighter lower lip (82%), describing a concave punched edge rather than another convex rim. Side edge remains 7.5%.
- Perforation retains its 8px pitch (3px mark / 5px gap), .7px ink and .5px lower light. Ink/light are refined to 9.5%/50%, suggesting a tear process without a groove or additional divider.
- HOU/LAL identity areas retain their original text/symbol coordinates but lose a visible card perimeter. A broad team-temperature wash reaches full transparency at 75% of the gradient before the area edge. HOU warmth peaks at 1.6%; LAL purple-grey at 1.5%, falling through 0.8%/0.7% to zero. Border, shadow and blur are explicitly absent.
- Team abbreviation weight stays 600, with -.032em tracking and normal kerning. Existing colors remain `#C7343D`, `#76548E`, `#375A83`; the identity font file, crests and MyGame+ script asset are unchanged. No area becomes a red/purple card.
- Dates, weekday, venue, watermark (0.9%), programme layout and serial are retained. The shared timing family advances consistently at every size; this is the only inherited type change outside the main timing block. Ordinary page regions stay flat.

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

The exporter verifies dimensions, complete PNG decoding, all four font families, text fit, radius and geometry, navigation alignment, equal material parameters and pixel-identical islands.
It also checks all four assigned neutral-ink tiers, the three-layer gaps, unboxed edge-free identity washes, tighter timing-block relationship, sub-1% paper border, fixed serial syntax/spacing/alignment, softer 72px island, unchanged slogans, custom App Mark, equal digit advances, date/time consistency, LOCAL TIME ownership, flat editorial regions and absence of visible URLs.
Differences between the two images occur only in slogan, city, GMT, time and city-transition text regions.
The current validation report is `/tmp/mygame-v2.1-validation.json` rather than a checked-in generated artifact. The outside-ticket baseline comparison can be repeated with `PROMO_BASELINE_DIR=/path/to/approved-png-directory node design/promo/export.cjs`.
Four art-direction reviews are exported only under `/tmp`:

- 30%: 324×432 thumbnails for both cities; verify HOU/LAL, time, ticket silhouette, script signature and navigation survive.
- Squint/Blur: a 5px browser blur, full size and 30%, for both cities; verify sporting object, brand and island remain distinct masses.
- Border-Off: suppress borders/outlines and both divider/tear-guide drawings while preserving dimensions; every shared layout landmark must remain unchanged, and typography/whitespace/light must retain the order.
- Tokyo/London Overlay: exact 50/50 pixel average at 1080×1440 and 30%; fixed regions are also compared directly and must have zero differing pixels outside the allowed content regions.

Diagnostics use `/tmp/mygame-v2.1-{tokyo,london}-*.png` and `/tmp/mygame-v2.1-overlay{,-30}.png`. They include the no-note scope check and no-security check. These are review images, not additional delivery elements or repository artifacts. The final two PNGs retain their required filenames.

With the App running locally, run `node design/promo/check-app.cjs` (`MYGAME_APP_URL` defaults to `http://127.0.0.1:3200`).
This checks real city/team navigation, fixture/no-fixture states, context dismissal, reduced motion and 320/390/480/1080px safe areas.
