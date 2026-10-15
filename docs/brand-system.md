# MyGame+ Quiet Motion — V2.7 Homepage Brand Final

## Brand semantics

- Team colors identify teams and, sparingly, changing sports states.
- Timezones use neutral typography: LOCAL TIME, city, country code, GMT.
- Sports numbers share Geist Sans, tabular figures, 500 weight, slight negative tracking and low-contrast colon separators.
- Identity symbols answer **who**; sports signals answer **what is happening**.
- Whitespace, repeated alignment and restrained micro typography carry the brand. State changes convey motion; animation is unnecessary.

## Components and state sources

`SportsSignal` is presentation only. It accepts a supplied `type`, optional `teamColor`, and visible `label`.

| Type | Mark | Color | Current use |
| --- | --- | --- | --- |
| active | 5px solid dot | Selected team's primaryColor mixed 90% with graphite | Existing `schedule.today` contains a game: 今天有比赛 |
| inactive | 5px open dot | Neutral grey | No game in `schedule.today`: 今天无比赛 |
| completed | 5px open dot | Neutral grey | Visual contract only; no final result is inferred |
| next | 2×11px vertical line | Selected team's primaryColor mixed 90% with graphite | NEXT in the row matching existing `schedule.next.id` |

The day heading remains GAME DAY in both day states. Labels stay neutral. NEXT replaces the existing row's secondary date label, keeping its 44px height. Only the next unstarted game is marked; elapsed games are not marked NEXT. If no next game is in the seven-day list, no NEXT marker appears.

Limit state accents to the day dot and the single next-game vertical line. HOME/AWAY stay neutral text; do not add a second home signal or markers on every row. No badges, rings, flashing, live indicators or notifications.

Matchday atmosphere uses `--matchday-tint` (1% selected-team color mixed into the existing pass surface), enabled solely by a game in `schedule.today`. Rest days retain the neutral surface. Borders, typography and layout never change with this tint.

## Shared tokens

- Signals: `--signal-size`, `--signal-gap`, `--signal-line-length`, `--signal-line-thickness`, `--signal-active-opacity`, `--signal-muted-opacity`.
- State: `--matchday-tint`, `--status-text`, `--status-muted`.
- Numbers: `--numeric-weight`, `--numeric-tracking`, `--numeric-separator`; reuse `NumericValue` for times and future numeric content.
- Timezones: `--timezone-label`, `--timezone-text`; never source these from a team color.
- Existing V2.4 color, type, spacing, geometry and motion tokens remain the foundation.

## Future surfaces — specification only

A future live-data source may supply an active signal labelled 比赛进行中. A verified final result may supply completed labelled 比赛结束. The current application has neither source and renders neither status. No live animation is implemented.

A future Game Pass share card should reuse `TeamIdentityBlock`, `TeamSymbol`, `SportsSignal`, `NumericValue`, local Geist and the same tokens. Include MyGame+ branding, teams, date, LOCAL TIME, city and tip-off time; omit navigation and the full weekly list. Use more whitespace and less information than the homepage. No export UI, image generation, sharing API or real-time integration is implemented.

City codes are omitted: city, country and GMT already establish context without adding travel aesthetics.

## V2.6 identity refinements

The complete brand is 我的主队日历 MyGame+: Chinese 600, English 500, brand-red plus. Keep a natural word gap and a single line at mobile widths. MY TEAM is identity context, with a quiet chevron and signature-like English team name.

Team regions use 2% flat tint and 8px corners on one continuous pass. Date and day status leave the middle of the header empty. Venue name sits above HOME/AWAY in information weight. Weekly counts are a 24px number and caption, one summary unit. Four-column schedule and V2.5 state detection are retained. NEXT keeps the existing secondary row label and uses a 2×11px marker at the row's left edge without increasing row height.

Only the pass serial area uses the neutral 8px micro signature `MG+ / HOU–LAL / 01`. MG+ is not another logo and must not repeat elsewhere in the UI. Navigation remains neutral with a 3px brand-red active detail and 44px minimum button height.

Debug-only data explanations use the opt-in `NEXT_PUBLIC_DEBUG_UI=true` build/development environment variable. Normal UI hides these explanations; fixtures, demo clock, live-date switch and all sports state sources are unchanged.

## Quiet Motion — final constraints

Quiet is the static foundation: neutral date, venue, local time, navigation and geometry. Motion is changing sports information: team identity, active-day dot and the single upcoming-event marker. Motion does not require animation.

The subtitle is NBA 主队赛程 · 本地时间. Do not explain time conversion a second time in the header. MY TEAM and LOCAL TIME share three grid tracks for their micro labels, main identity/context and English metadata. Team color stays on the left; local context stays neutral on the right. Long team or city names may grow shared tracks without overlap.

The upcoming-event grammar is a 2×11px team-colored vertical mark, 1px radius, .9 opacity. The active-day dot stays 5px and the inactive dot stays neutral and open. There is only one NEXT marker; scheduling decides its identity exactly as before. Program separators use rgba(32,33,31,.05); spacing and type carry more weight than rules.

Keep the existing 48px/500 Geist time, 24px/500 weekly summary, 2% flat team regions with 8px corners, 1% matchday surface tint, mirrored team signatures and neutral MG+ serial. Do not add logos, animations, textures, banners, labels or new sports integrations. Preserve 44px navigation hit targets and opt-in debug explanations.

Brand-occlusion review: without the title, warm white, colored team abbreviations, abstract signatures, restrained state signals, LOCAL TIME, consistent numbers and the MG+ serial must still read as one system. Solve inconsistencies through alignment and subtraction, not decoration.

Local Geist is preloaded with a brief font block period to prevent visible fallback glyph swaps. Delayed-font layout stability is part of the final responsive checks.

Date number, venue status, serial and clipped watermark have reserved geometry so fallback glyph widths cannot shift adjacent content. These are layout-stability tokens, not additional visual elements.
