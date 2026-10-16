# MyGame+ V2.4 — Core Pass System

> V2.7 promo/share presentation is documented in [Encased Pass Artifact](encased-pass-artifact.md). The core DNA, state and lifecycle rules below remain unchanged.

The existing UI, team identity packs and V2.3-CM palette remain in place. V2.4 fixes the ticket architecture, replaces hour-threshold status with a schedule-aware lifecycle, and persists each completed personal pass. No archive page, account service, share workflow or NBA API is added.

## Pass DNA invariants

`src/lib/passDNA.ts` owns `MG-DNA-1`, a frozen 728 × 576 drawing. `passDNAProperties()` supplies its coordinates and silhouette mask to the application and promo renderer. `src/styles/pass-dna.css` contains structural materials; `pass-app.css` scales the drawing using container units. Typography occupies fixed regions; long or changed text does not resize the ticket.

| Region | Master units |
| --- | --- |
| Main | x0, y0, w728, h480 |
| Perforation | x16, y480, w696, h2; 3-unit punch / 8-unit pitch |
| Stub | x0, y482, w728, h94 |
| MG+ Bridge | x348, y475, w32, h12 |
| Collectible Spine | x16, y176, w1, h240 |
| Security Print Window | x246, y16, w236, h144; fixed additional whitespace masks |
| Timing Sanctuary | x28, y328, w568, h136; timing ink is inset inside it |
| Team identity ends | x32 / x456, y176, w240, h144 |

The left cut has a shallow upper shoulder and a longer lower return; the right cut has a deeper, shorter return. Both are part of the full paper/content mask, rather than canvas-colored circles placed over the ticket. The contact shadow follows the cut outline. Exactly two cutouts remain.

Perforation stops across 32 units at the centre. This unpunched bridge physically connects main and stub; a minute deboss intersection suggests “+” without a logo badge. The spine stays inside the left structural margin. No team, event, location, state or season parameter can change this drawing. The same fixed normalized drawing now governs responsive app tickets and promo tickets; surrounding page structure is unchanged.

## State engine

`resolvePassStatus()` accepts an explicit event clock and `{timezone, nextGameId, archived, archivedAt, focused}`. `nextTeamGameId(games, selectedTeam, now, archivedIds)` filters by the selected team, excludes final/ended, archived and already-started fixtures, then orders by start time with a stable game-ID tie break. It is shared by the pass resolver and programme NEXT marker and uses no hour threshold. `createPersonalPass()` supplies the selected team's schedule and persisted archive.

Priority is **persisted/confirmed completion → local game date or ongoing event → next fixture → other future fixture**.

| Internal state | User meaning | Emotion | Material |
| --- | --- | --- | --- |
| `upcoming` | UPCOMING | Upcoming (may be omitted when not focused) | baseline paper, neutral/off active signal, lowest temperature/print visibility |
| `next_up` | NEXT UP | Next up | small NEXT signal, slightly brighter paper, slightly clearer team stock |
| `game_day` | GAME DAY | Tip-off | rare full brand-red signal, strongest timing hierarchy, quiet light/temperature progression |
| `archived` | COLLECTED | Collected | no active red; softer team accent; timing one ink level lower; records more archival |

GAME DAY compares the fixture's date and the current date **in the selected IANA timezone**. Tokyo and London may legitimately have different states at the same absolute instant. This is a deliberate V2.4 change from the earlier location-independent status rule; user ID, event ID, season, numbering and geometry remain identical. An unfinished ongoing event remains alive across midnight until explicit completion is known.

Private GAME DAY energy bands are `day` (>6h), `approaching` (3–6h), and `imminent` (<3h/ongoing). These add no public labels, counters or animations. They only change a few semantic paint/opacity tokens. All three retain Tip-off. Archive priority also means moving a demo clock backwards cannot uncollect a persisted ticket.

Completion is isolated in `src/lib/gameCompletion.ts`. Real `final` or `endTime` data has priority; mock fixtures explicitly opt into `estimatedEndTime`. A real-feed `final: false` suppresses stale estimates, and a real end time supersedes an estimate. Neither missing completion data nor tip-off itself implies COLLECTED. Legacy `finished` / `endsAt` fields are read for existing snapshots. Replacing estimates with real completion data requires no state/UI/storage rewrite.

Motion: paper light 180ms, timing crossfade 180ms, temperature 240ms, security opacity 240ms, signal 140ms, annotation 200ms, all ease-out. Reduced motion disables transitions. No geometry, font metrics, bounce, flip, glow or scale animation changes across states.

## Season lifecycle and persistence

`src/lib/seasonLifecycle.ts` separates:

- `UserPass`: the browser-owned four-digit `passId`.
- `GamePassRecord`: game ID, selected-team ordinal, season ID/code, state and archive timestamp.
- `ArchivedPass`: an authoritative collected game ID, with optional archive time and immutable fixture snapshot (matchup, instant, venue and team-specific ordinal). Missing optional snapshot metadata never removes the collected ID.
- `PersonalSeason`: season ID/code, team code, total games, unique archived IDs and derived `collectedGames`.

`useSeasonArchive()` catches up completed fixtures on first entry and on the existing 30-second real-clock updates. Storage is partitioned by **team + season**, and each ID array deduplicates by game ID. Refreshing never increments a counter; progress is recalculated from unique archived IDs. Another selected team's same fixture does not increment the first team's progress.

Local storage:

| Key | Meaning |
| --- | --- |
| `mygame_pass_id` | Existing persistent user ID; unchanged by game/team/city/season |
| `mygame_archived_games:HOU:26-27` | Authoritative JSON array of unique game IDs, e.g. `["hou-1", "hou-2"]`; no counter |
| `mygame_pass_records:HOU:26-27` | Optional versioned fixture snapshots / archive timestamps for those IDs |
| `mygame_current_season` | Current product season code, currently 26–27 |
| `mygame_selected_game` | Retains the focused pass, including after completion/reload |
| `mygame_selected_team` | Restores the team that owns that focused pass |

Each team/season pair has a separate ID array and snapshot file. Old season definitions remain in the season registry. A new season uses a new definition/file, starts with zero collected games, and receives its own authored game ordinals; it never rewrites old pass season codes. PASS ID is independent of these files. The current UI still uses the 26–27 demo season; no season selector is introduced.

The writer reads and merges only the selected team/season, writes snapshots before IDs, and skips identical serialized output. Collection progress is derived solely from the ID set. In-memory caches and storage-event listeners are also scoped by team. Version-1 `mygame_archived_games_26_27` shared snapshots migrate only the selected team into the new keys, without deleting or rewriting the legacy data. An existing new ID array is authoritative; stale snapshot-only records cannot inflate it. Storage events merge another tab's same-scope records. Corrupt entries are validated/ignored. When storage is denied, the page keeps session identity and in-memory collection; cross-refresh persistence is unavailable in that browser mode.

`seasonFixtures()` restores archived fixture snapshots even if the current schedule no longer contains those games. A selected completed pass stays rendered using the same `GamePass`, `MainTicket` and `TicketStub`. The existing schedule tab can select known archived fixtures again; no second history-card template is introduced. Unknown opponent-team game ordinals continue to print an em dash rather than fabricated numbering.

## Future extension points

`resolveSeasonMilestone()` supports First Pass, Early Season (10), Halfway (41/82) and Season Complete (82/82). `seasonSummary()` returns ordered archived pass records, user identity, collection progress and milestone for a future `SeasonSummaryCard`. These are data-only: normal tickets gain no milestone badges.

`PassShareCard` is an unlinked, reusable 1080 × 1440 renderer containing the same `GamePass` at the same master size. It supports future NEXT UP / GAME DAY / COLLECTED artifacts without alternate ticket DNA or a share feature. The current V2.7 promo export wraps this ticket family in an acrylic enclosure; see the artifact guide.

Long-term rules: **game → content; location → local time; team → identity; user → number; state → energy; season → collection.** Time passes; the object remains.

## Verification

```bash
npm test
npm run build
npm run start -- --port 4000
MYGAME_APP_URL=http://127.0.0.1:4000 node design/promo/check-app.cjs
npm run export:promo
```

`check-app.cjs` covers responsive geometry, team stock, real browser storage, cross-zone date boundaries, all four states/three energy bands, archive catch-up and retained pass selection. `check-material.cjs` reuses that same browser fixture suite with material focus rather than a divergent state model. Unit tests additionally exercise multi-season isolation, corrupt records, snapshot restoration and milestones.

Export diagnostics under `/tmp/mygame-v2.4-*` include 30% thumbnails, grayscale, 10% saturation, blur, border-off, material-only and Tokyo/London overlay. The export verifies dimensions/decoding, identical static geometry/dock, zero security ink over protected text, maximum security contrast, paper luminance and unchanged content.

Validated in this workspace: 31 unit tests, production build, and eight browser regression groups passed with no runtime/hydration errors. Promo output is 1080 × 1440 for both cities; static-area pixel differences are zero and the docks match exactly. Security ink changes at most 6/255 per channel (2.35%) with zero protected-text pixel differences. Unprinted paper curvature is 2.33%; main/stub luminance difference is 2.30%.

Boundary regression additionally exercises Tokyo game-day / London pre-game-day at `2026-10-24T16:00Z`, exact tip-off without collection, repeated archive ticks/reload, foreign-team key-read tracing, untouched 27–28 storage while processing 26–27, and paint-neutral four-state DNA raster comparison (silhouette, bridge, main/stub, spine, security window and timing sanctuary).
