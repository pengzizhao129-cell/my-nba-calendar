# MyGame+ Brand Identity — V2.6

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
| next | 2×12px vertical line | Selected team's primaryColor mixed 90% with graphite | NEXT in the row matching existing `schedule.next.id` |

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

Team regions use 2% flat tint and 8px corners on one continuous pass. Date and day status leave the middle of the header empty. Venue name sits above HOME/AWAY in information weight. Weekly counts are a 24px number and caption, one summary unit. Four-column schedule and V2.5 state detection are retained. NEXT keeps the existing secondary row label and uses a 2×12px marker at the row's left edge without increasing row height.

Only the pass serial area uses the neutral 8px micro signature `MG+ / HOU–LAL / 01`. MG+ is not another logo and must not repeat elsewhere in the UI. Navigation remains neutral with a 3px brand-red active detail and 44px minimum button height.

Debug-only data explanations use the opt-in `NEXT_PUBLIC_DEBUG_UI=true` build/development environment variable. Normal UI hides these explanations; fixtures, demo clock, live-date switch and all sports state sources are unchanged.
