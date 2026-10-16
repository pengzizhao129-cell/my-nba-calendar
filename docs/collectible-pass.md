# MyGame+ Promo V2.1 — Collectible Pass Structure

Historical construction reference. [V2.2 — Personal Pass System](personal-pass.md) now provides persistent local identity, separate game/season data, all 30 identity packs and one status-driven stub annotation. Its rules supersede V2.1's fixed user sample and five-team-only registry.

Main ticket: the game. Stub: the owner and collection. Security stock: the selected team.

## Construction

The 1080×1440 composition is unchanged outside GAME PASS. The pass remains at (176,456), 728×576px, radius 20px, with the existing ivory light and contact shadow. Its main section is 480px high; the tear guide is at local y=480, and the stub begins below its 2px printing band. Two 22px masked cutouts meet that same boundary. No cutout is added.

Date, GAME DAY, the single `Tip-off` annotation, team identities and their printed temperature washes keep their coordinates. The main time and caption move up 12px together (local y=332/428), retaining their fonts, sizes and 96px relationship. HOME / 主场 and 丰田中心 move into the main ticket's lower-right area. The main section ends with clear space above the tear guide.

The perforation uses the established 8px pitch, 3px ink / 5px gap, 0.7px faint ink and 0.5px lower light. It extends toward the two cutouts. The stub is slightly denser and has a 2.2% neutral wash and very weak upper edge light, without a separate card, border or new shadow.

## Issuing semantics

The three printed rows share Geist 500, 14px/20px, .10em tracking, tabular numerals and one left axis. PASS uses tertiary ink; GAME and SEASON use micro ink. The last row and existing `MG+ / HOU–LAL / 01` serial end on one baseline. The serial's syntax, font, tracking and separator spacing are unchanged.

| Printed field | Data owner | Meaning |
| --- | --- | --- |
| PASS 0147 | `PassIdentity.number` | User identity, independent of team, city and fixture |
| GAME 01 / 82 | `PassCollection.gameNumber/totalGames` | Explicit season ordinal and total |
| SEASON 26–27 | `PassCollection.seasonStart` | Explicit starting year, formatted as a season pair |

`src/lib/passDesign.ts` supplies the typed formatter to both React and the static exporter. `0147` is an explicit presentation sample. This pass does **not** create accounts, issue globally unique IDs, persist identity or claim authentication. A future issuer can inject another identity without changing the design. No random number is generated per render or city.

The demo HOU–LAL fixture alone has authored collection metadata. A partial mock schedule must never be interpreted as a complete 82-game season. Other fixtures without collection metadata do not manufacture GAME or SEASON fields. Existing UTC/IANA time conversion is unchanged.

## Team security stock

The original HOU, LAL, GSW, DAL and DEN abstract crests are stored once in `teamSymbolGeometry`. Identity icons and security printing read those same paths. The static export uses HOU; the App follows its existing selected team. New authored crests can be registered in the same map. An unregistered team renders no security stock; it never receives HOU's or another team's symbol.

This replaces the former large HOU abbreviation watermark. The security print combines native-scale 24px crests in a sparse 160×96px repeat with two 0.45px engraved curves. Warm neutral ink `#686259` is printed at 4.5% alpha: effective peak channel contrast is about 3% on ivory. It is not a large transparent logo or a team-colored background.

Separate masks confine main-ticket print to whitespace and edge paper, and stub print to its unused upper-right area. Date, status/annotation, both identity frames, VS, time, LOCAL TIME, venue, collection rows and serial are excluded. There is no animation or extra control. These are visual print conventions, not a security guarantee.

## Verification and export

Run:

```sh
npm test
npm run build
PROMO_BASELINE_DIR=/path/to/approved-pre-V2.1-pngs node design/promo/export.cjs
# With the built App running:
MYGAME_APP_URL=http://127.0.0.1:3300 node design/promo/check-app.cjs
```

The exporter serves a transpiled browser copy of the same TypeScript design module locally. No font or image request goes outside the local server. The fixed outputs are:

- `output/douyin/mygame-plus-douyin-01-tokyo.png`
- `output/douyin/mygame-plus-douyin-02-london.png`

Checks cover PNG decoding/nonzero bytes, 1080×1440, loaded fonts, no page overflow/black corners, main/stub boundary and venue ownership, all collection values and baselines, the single restrained annotation, matching city geometry/materials, identical dock pixels, and zero differences outside allowed city-state/time text. A supplied pre-V2.1 baseline also requires zero changes outside the ticket and its 16px contact-shadow envelope.

Hiding the security print must change no protected information frame and stay below 4% channel contrast. Diagnostics include 30% thumbnails, blur, border-off, 50/50 city overlay, no-annotation and no-security images under `/tmp/mygame-v2.1-*`; the report is `/tmp/mygame-v2.1-validation.json`. Diagnostics are not additional deliverables.

The App regression verifies city-independent identity/stock, all five authored team stocks, clearing on an unregistered team, the existing navigation/context logic, and no collection/serial collision at 320/390/480/1080px widths.
