# MyGame+ V2.9 — Personal Season Collection

The homepage stays a functional mobile App. Brand, selectors, schedule and Bottom Island are unchanged. `MG-DNA-1`, its shell and all master coordinates are unchanged. Sharing is a separate reusable presentation, not a replacement homepage.

## Identity is issued on confirmation

`usePassId()` initially **reads**, without generating or writing an ID. A browser without a valid `mygame_pass_id` opens the existing team picker. Dismissing it or changing city does not issue anything. The first explicit team confirmation generates a four-digit, leading-zero-preserving ID and persists it before presentation starts. Existing IDs are grandfathered: no picker interruption or replay.

The same ID survives team, city, game, season and refresh. Web Locks serialize first confirmation across tabs where supported; storage events synchronize an already open page. If storage is denied, identity remains stable for that session, but cannot survive a browser reload. There is no new reset, account or registration UI.

Issuance lasts 800ms:

| Time | Change |
| --- | --- |
| 0–150ms | Selected team identity quietly settles |
| 150–350ms | Existing security stock resolves |
| 350–530ms | PASS ID resolves, briefly at primary ink |
| 530–690ms | GAME / SEASON / progress resolves |
| 690–800ms | Serial resolves; ID settles back to micro ink |

Only opacity and semantic ink change. There is no transform, scale, geometry animation or additional panel. `PASS ISSUED` temporarily occupies the existing annotation slot, with an accessible announcement including the issued number. The one normal Emotion Mark returns after issuance; neither is printed near timing. Reduced motion reveals all records immediately. Reloading mid-sequence restores the ID without replay.

## Collection and milestones are data

`resolveSeasonMilestone({gameNumber, collectedGames, totalGames})` accepts validated data, with priority Season Complete → Halfway → Early Season → First Pass. It supports GAME 01 before any archive and progress thresholds 10 / 41 / 82. The numeric overload remains available to `seasonSummary()`.

`resolveTicketMilestone()` separately preserves a ticket's own ordinal: GAME 01 keeps FIRST PASS even after the season finishes. Other ordinal marks require that ticket to be archived and its collection threshold reached. A later ticket does not inherit an earlier ticket's mark. Marks are small printed microcopy, not a second handwritten Emotion Mark.

`CollectionProgress` uses only `pass.season.collectedGames`, derived from unique archived IDs. Its fixed x272/y14 region sits inside existing stub whitespace. A protective security-ink exclusion prevents print under its text; the Security Window drawing does not move. Records never spill into Main Ticket or Timing Sanctuary.

Archive rules remain those in [Core Pass System](core-pass-system.md): final/endTime or an explicit mock estimate, never tip-off; unique IDs scoped to `mygame_archived_games:HOU:26-27`; no independent incrementing counter; old season files never overwritten. No manual CLAIM/COLLECT is added.

## Collected is archival, not disabled

COLLECTED retains the complete paper, security stock, shell, user ID and event/season record. The active red signal is off; the existing state tokens soften identity ink and lower timing by one ink level. Stub and serial use tertiary ink; spine opacity rises quietly from .45 to .58. Refraction is restrained. Root opacity remains 1, with no overall grayscale. The only script reads `Collected`.

## One Share DNA

`PassShareCard({pass, moment?})` accepts the same `PersonalPass` snapshot used by `GamePass`. It does not generate identity, recalculate time or maintain alternative fixture data. `passShareContext()` rejects unissued identity, mismatched team/season, inconsistent archive counts and unsupported lifecycle moments.

The fixed 1080 × 1440 composition has 15% quiet brand, 65% hero and 20% context/breathing space. Every team/location/state uses the same regions. It renders the same `BrandSeal`, `GamePass`, fonts, material tokens and enclosure. No navigation, weekly schedule, Beta banner, URL, CTA, QR or advertising language is included.

Supported moments: UPCOMING, NEXT UP, GAME DAY, COLLECTED, MILESTONE and SEASON COMPLETE. Milestone context comes from the resolver. `SeasonSummaryCard` reuses this composition and requires a genuinely complete archived season. No system Share API or product sharing page is introduced. The old V2.7 study is explicitly isolated as `EncasedArtifactStudy`, with outputs still confined to `output/studies/v2.7/`.

## One 82-pass series

`GamePass` supports `variant="full"`, `"compact"` and `"collection"`. All retain exactly the same master coordinates, silhouette, Bridge, spine, security stock, timing, ID and ordinal positions. Compact/collection reduce subordinate text using visibility, never a second template. Collection keeps date, team identity, time, state, GAME number and one Emotion Mark; no full MY SEASON page is added.

`design/validation/seasonSeriesFixture.ts` supplies **validation-only** mock fixtures with unique IDs and real per-team ordinals 01–82. It uses the production completion, archive and Pass resolvers. It is not imported into the App or substituted for the existing short demonstration schedule. At its reference clock, 41 passes are archived, one is GAME DAY, one NEXT UP and the remainder UPCOMING. All have one user, one team stock and one season.

## Reproduce

```bash
npm test
npm run build
npm run start -- --port 4801
# Another terminal:
MYGAME_APP_URL=http://127.0.0.1:4801 node design/promo/check-app.cjs
MYGAME_APP_URL=http://127.0.0.1:4801 node design/validation/check-personal-season.cjs
npm run export:promo
npm run export:season
```

Validation: 40 unit tests, eight App browser groups and three issuance groups. These cover 800ms stage order, no issuance on loading/dismissal/location/reload, stable architecture throughout issuance, reduced motion, one ID/write across concurrent tabs, IANA game-day boundaries, non-tip-off completion, persistent/deduplicated archives and team/season isolation. Share and series checks compare normalized geometry, enforce unique ordinals, confirm all four states and one stock, and decode every PNG. Both mobile promos differ from the prior approved version only inside the stub; Tokyo/London static pixels and dock match exactly.

Deliverables:

- `output/douyin/mygame-plus-douyin-01-tokyo.png` and `02-london.png`: full mobile composition, 1080 × 1440.
- `output/share/mygame-plus-{next-up,game-day,collected,milestone,season-complete,london,lal}.png`: seven 1080 × 1440 examples.
- `output/validation/mygame-plus-82-pass-series.png`: 2160 × 2508 validation contact sheet.
- `output/validation/mygame-plus-pass-variants.png`: full / compact / collection comparison.

Demo exports explicitly use PASS 0147; live identity is created only by the user's first team confirmation. Validation reports are `/tmp/mygame-v2.9-{issuance,artifacts,promo}.json`; the existing App suite writes its own JSON report. Historical material diagnostics retain their previous filenames for compatibility.
