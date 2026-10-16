# MyGame+ V2.2 — Personal Pass System

> V2.4 lifecycle and structural rules now live in [Core Pass System](core-pass-system.md). The V2.3-CM palette remains authoritative; earlier emotion/hour-threshold and symmetric-cutout rules are superseded.

Color/material paint is now governed by [V2.3-CM](color-material-tokens.md). Its shared palette, team temperatures and alpha-mask printing supersede the fixed ink values below; V2.2's product model, persistence and ticket ownership rules remain unchanged.

比赛决定内容。城市决定时间。主队决定身份。用户决定编号。赛季决定收藏。

## Variable ownership

`createPersonalPass` creates a typed, readonly presentation model. It contains six separate layers, passed to reusable ticket components rather than assembled throughout the page JSX.

| Layer | Owned values | Must not own |
| --- | --- | --- |
| User | `passId` | Team, event number, season, city |
| Team | Code, identity ink, secondary tint, symbol, security pattern, temperature, micro mark | User ID, event ordinal, layout |
| Game | UTC start, opponent, home/away, venue, explicit per-team game ordinal | User ID, viewing city, season total |
| Location | City, IANA timezone, formatted local time/date, current city GMT | User ID, team stock, event identity, emotion |
| Season | Season code, total games | User identity, partial-list index |
| Status | Phase and one emotion mark | Location-specific decorative choices |

`selectPassGame` has no location argument. Changing viewing timezone never silently chooses another fixture. The existing schedule rows are now accessible buttons that select a ticket; the same home page shows the selected event. A team change retains that event when the new team participates, otherwise chooses an active/upcoming fixture for that team. No new navigation page is added.

Local date is formatted from the selected fixture, not from today's date. It may cross midnight when viewing across the Pacific, while the game ID and collection record remain stable. Intl/IANA rules determine actual local game times, including DST. The existing demo remains Tokyo **10:00 / GMT+9** and London **01:00 / GMT+1**. The GMT field retains its established role as the selected city's **current** system offset at the demo clock (`2026-10-25T00:00Z`); the game is one hour later, across London's DST fallback. The display does not claim that GMT+1 is the event-time offset. There is no competing original-US time.

## Local user identity

- `usePassId` reads `localStorage.mygame_pass_id` after mounting. SSR renders an equal-width placeholder; it neither accesses browser storage nor issues a shared server ID.
- First visit generates four digits using `crypto.getRandomValues` with rejection sampling. Leading zeroes are preserved. A valid stored ID is reused on refresh, team/city/game changes, navigation and another tab.
- Invalid stored IDs are replaced. Storage events synchronize a concurrent first visit in another tab.
- If storage is denied, the app retains one in-memory ID for that session and continues working. Refresh persistence requires permitted browser storage. Clearing site storage starts a new local identity.
- A four-digit local smoke-test ID is not globally unique and does not identify an authenticated account. There is no account, backend, database or tracking request. Future authenticated identity can replace the hook without changing ticket components.

## Ticket construction and components

`GamePass` composes `MainTicket` and `TicketStub` using the existing architecture, typography sizes, punch/cutout positions and light paper treatment.

Main ticket owns date, status, team identities, the primary timing block, LOCAL TIME, home/away and venue. Stub owns `PassId`, `GameNumber`, `SeasonCode`, the serial and **one** `EmotionMark`. User/collection fields never appear above the perforation. `TicketMicroLabel` provides printed labels and `TeamSecurityPattern` provides both masked print regions.

`TimingNumber` uses the existing locally bundled MyGame Timing 500/550 subsets, tabular advances and the custom quieter square-dot colon. Main time remains 48px in the App; programme times inherit the same family. `QuietValue` crossfades changed times/cities for 180ms, with immediate changes under reduced motion. The System Island retains its established navigation and contextual behavior.

The App stub remains 82px high at all supported widths. Emotion and serial occupy separate right-side rows; collection occupies the left. Changing the emotion does not change ticket height or typography spacing. No badge, barcode, QR code or new control is introduced.

## Team Identity Pack

All 30 existing selectable teams have a `TeamIdentity` pack and distinct original miniature geometry. The five established crests retain their concepts and paths:

- HOU — ASCEND
- LAL — PRESTIGE
- GSW — SPAN
- DAL — FORWARD
- DEN — SUMMIT

The remaining teams use equally small abstract line geometry, not copied official logos. Identity icons, lightly printed patches and neutral security stock use the same registry. A future team must register its own pack and geometry; unknown keys do not borrow another team's mark.

Security print remains sparse, with native miniature symbols and fine engraved lines, masked away from core text. Neutral ink is 4.5% alpha, approximately 2–4% effective channel contrast on ivory. Team temperature and identity tint remain extremely subtle. Team ink belongs to identity; active status and NEXT signals use limited brand red. The pattern is a visual print convention, not a claim of authentication.

## Collection semantics

Season data is separate in `src/data/seasons.ts`. Fixtures hold `seasonId` and explicit `gameNumbers` keyed by participating team, because an event can be a different season ordinal for each team. No number is inferred from the order of a filtered list.

Current demo: `GAME 01 / 82`, `SEASON 26–27`. The five HOU fixtures have explicitly authored demo ordinals. Synthetic fixtures retain limited mock data; no 82-game schedule is added. An unknown participating team's ordinal prints `GAME — / 82` and an em dash in the serial, preserving the layout without inventing data.

## One emotion, driven by status

`resolvePassStatus` accepts the event clock, optional explicit end/finished state and an explicit home-night condition. It does not accept the viewing city or timezone.

| Priority / condition | Emotion |
| --- | --- |
| Explicitly finished, or explicit fixture end reached | Remember this one |
| More than 72h before tip-off | Next up |
| 24h through 72h before tip-off | Coming up |
| Within 24h / started, explicitly marked home-night event for the home team | Home night |
| Otherwise within 24h / started | Tip-off |

The first demo event remains Tip-off. The third HOU fixture explicitly demonstrates home-night semantics. A game is never declared finished simply because tip-off passed; fixture end values here are authored demo data, not a universal game-duration rule or a live-score feed. Real-date mode refreshes the local clock every 30 seconds so an open ticket updates its state. Demo mode remains frozen for repeatable evaluation.

Only `EmotionMark` uses the locally bundled editorial handwriting, in low-contrast warm graphite. Its existing OFL font subset now covers the five complete phrases. Brand signatures retain their separate role. No other system, timing, identity or navigation label uses script.

## Promo and verification

The static 1080×1440 promo retains the existing composition. Its sole script annotation moves from GAME DAY into the stub and uses the same status resolver. The export browser seeds `0147` solely for deterministic promotional output; production does not hardcode this ID. The same local ID helper is used in the promo source, and both cities share one browser storage context.

Run `npm test`, `npm run build`, and then:

```sh
npm run start -- --port 3400
MYGAME_APP_URL=http://127.0.0.1:3400 node design/promo/check-app.cjs
PROMO_BASELINE_DIR=/path/to/approved-V2.1-images node design/promo/export.cjs
```

Tests cover persisted/repaired/blocked storage, leading zeroes, event ordinal validation, all 30 unique stocks, variable isolation, IANA/DST conversion, emotion boundaries, server rendering and stub-only ownership. Browser checks exercise refresh/another tab, row selection, team/city transitions, all five emotions under a controlled clock, reduced motion, hydration and 320/390/480/1080px safe areas. PNG export additionally verifies size/decoding, protected-print masks, unchanged outside-ticket pixels, identical city construction and navigation, and the existing 30% / blur / border-off / overlay reviews.

Final PNG filenames stay under `output/douyin/`. Review images/reports stay under `/tmp/mygame-v2.2-*`.
