# Game+ Sports Signal System — V2.5

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
| next | 8px short line | Selected team's primaryColor mixed 90% with graphite | NEXT in the row matching existing `schedule.next.id` |

The day heading remains GAME DAY in both day states. Labels stay neutral. NEXT replaces the existing row's secondary date label, keeping its 44px height. Only the next unstarted game is marked; elapsed games are not marked NEXT. If no next game is in the seven-day list, no NEXT marker appears.

Limit state accents to the day dot and the single next-game line. HOME/AWAY stay neutral text; do not add a second home signal or markers on every row. No badges, rings, flashing, live indicators or notifications.

Matchday atmosphere uses `--matchday-tint` (1% selected-team color mixed into the existing pass surface), enabled solely by a game in `schedule.today`. Rest days retain the neutral surface. Borders, typography and layout never change with this tint.

## Shared tokens

- Signals: `--signal-size`, `--signal-gap`, `--signal-line-length`, `--signal-line-thickness`, `--signal-active-opacity`, `--signal-muted-opacity`.
- State: `--matchday-tint`, `--status-text`, `--status-muted`.
- Numbers: `--numeric-weight`, `--numeric-tracking`, `--numeric-separator`; reuse `NumericValue` for times and future numeric content.
- Timezones: `--timezone-label`, `--timezone-text`; never source these from a team color.
- Existing V2.4 color, type, spacing, geometry and motion tokens remain the foundation.

## Future surfaces — specification only

A future live-data source may supply an active signal labelled 比赛进行中. A verified final result may supply completed labelled 比赛结束. The current application has neither source and renders neither status. No live animation is implemented.

A future Game Pass share card should reuse `TeamIdentityBlock`, `TeamSymbol`, `SportsSignal`, `NumericValue`, local Geist and the same tokens. Include Game+ branding, teams, date, LOCAL TIME, city and tip-off time; omit navigation and the full weekly list. Use more whitespace and less information than the homepage. No export UI, image generation, sharing API or real-time integration is implemented.

City codes are omitted: city, country and GMT already establish context without adding travel aesthetics.
