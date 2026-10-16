# MyGame+ Color & Material Token Guide — V2.3-CM

> V2.4 lifecycle and structural rules now live in [Core Pass System](core-pass-system.md). The V2.3-CM palette remains authoritative; earlier emotion/hour-threshold and symmetric-cutout rules are superseded.

Premium Sports / Quiet Luxury / Collectible Pass.

Canvas 负责安静。Pass 负责价值。Stub 负责收藏。Graphite 负责系统。Team Color 负责身份。Brand Red 负责状态。Security Ink 负责工艺。Light 负责物体感。

## Sources and ownership

- [color-material.css](../src/styles/color-material.css) is the shared global palette, light, shadow, print and material vocabulary for both the App and promotional exports. Component CSS consumes semantic variables; components contain no hex/RGB literals or Tailwind palette bypasses.
- [teamIdentities.ts](../src/data/teamIdentities.ts) owns the 30 team packs. `teamMaterialProperties` supplies `--team-accent`, `--team-temperature-tint` and `--team-security-ink` from `primaryColor`, `temperatureTint` and `securityInk`. Components do not invent team paint.
- [system-island.css](../src/styles/system-island.css) consumes the same tokens as the paper/editorial layers. Its geometry, icon/type stacks and interaction timings are unchanged.
- The V2.2 User / Team / Game / Location / Season / Status separation remains in effect. This version changes paint and material behavior only.

## Base color families

| Family | Tokens / approved values | Responsibility |
| --- | --- | --- |
| Canvas | `--canvas-base #F1EFEA`, `--canvas-soft #F4F2ED`, `--canvas-deep #ECE9E3` | Flat matte stone; ordinary editorial areas |
| Pass | `--pass-base #FAF8F4`, `--pass-highlight #FCFBF8`, `--pass-edge #F5F2EC`, `--pass-depth #EFECE6` | Clean ivory paper and controlled edge light |
| Stub | `--stub-base #F5F3EF`, `--stub-cool #F2F1ED`, `--stub-edge #EBE9E4` | Slightly cooler archival paper belonging to the same ticket |
| Graphite | `100 #1B1C1A`, `90 #252623`, `70 #4B4C48`, `50 #767771`, `30 #A6A59F`, `15 #D0CEC8` | One neutral hierarchy |
| Brand | `--brand-red[-100] #A92732`, `-60`, `-20`, `-10` | Brand seal/signature and limited active signals |
| HOU | `--hou-accent #BC3A40`, `--hou-warm-tint rgba(188,58,64,.025)` | Visible identity ink and felt warm temperature |
| LAL | `--lal-accent #625382`, `--lal-cool-tint rgba(98,83,130,.025)` | Visible identity ink and felt cool violet-grey temperature |

`--text-primary/secondary/tertiary/micro` map to graphite 100/70/50/30. Inverse text uses warm ivory at named contrast levels. Annotation and separator ink have named tokens. Dialog, selection, switch and focus paint use semantic aliases to these same families; they do not introduce a separate grey palette.

HOU/LAL data values are checked against the guide's CSS tokens. Other existing team accents remain identity-only inputs. Solid canvas, paper and device surfaces use neither pure white nor pure black. Alpha white/black in lighting and alpha-only mask geometry describe light or occlusion, not solid product surfaces.

## Paper, stub and light

The sole light source is `--light-source-x:24%` / `--light-source-y:12%`. The canvas stays flat; optional canvas-soft/deep tokens do not require a visible environmental gradient.

`--material-pass` combines a very weak directional wash and broad luminance curvature using the approved ivory family. `--pass-edge-light` supplies the upper/lower material edge. The border remains only 0.8% ink; light and silhouette carry the boundary.

`--stub-surface` derives from 55% stub-base and 45% pass-base. Its almost-flat material uses only a 5% move toward stub-cool at the far edge. This keeps the illuminated main/stub difference within 1–3%, rather than turning the stub into a second grey card. Type sizes, record baselines, tear-guide coordinates and all ticket geometry are unchanged.

Contact depth uses `--pass-shadow-far:0 14px 35px rgba(26,26,23,.055)` and `--pass-shadow-near:0 2px 6px rgba(26,26,23,.035)`. The App uses the combined box shadow; the physically masked promotional paper uses the equivalent drop-shadow filter, following its cut silhouette.

## Team temperature and status

Team color is visible. Team temperature is felt.

The pack's temperature is confined to printed identity areas. It never dyes the whole pass or the device layer. Base tint alpha is 2.5%; state intensity scales it without adding colors.

| Product phase | Material meaning | Paper / temperature / signal |
| --- | --- | --- |
| `next-up` (>72h) | UPCOMING | Quiet base paper; 1.625% identity temperature; restrained neutral hollow state |
| `coming-up` (24–72h) | NEXT UP | Small lift toward pass-highlight; 2% identity temperature; clearer hollow state |
| `game-day` / `started` | GAME DAY | Brightest ivory within the same family; 2.5% temperature; brand-red active signal |
| `finished` | COLLECTED | Base paper; 1.5% temperature; team ink mixed slightly toward graphite; hollow neutral state; collection/serial move toward graphite 50 |

No state changes the canvas, island paint, ticket architecture, numbering, typography or spacing. Brand red remains independent of the selected team's identity ink. Local timezone changes preserve team stock and material state.

## Security print and physical craft

`passSecuritySvg` now generates an **alpha-only shape mask**: the existing miniature crest repeat and fine engraved curves with text-safe regions. Paint is applied by CSS, not embedded in the SVG.

- Primary process: matte ink, 75% `--security-ink-dark rgba(40,40,36,.025)` plus 25% pack-supplied `securityInk` at 3% alpha.
- Sole secondary finish: `--security-blind rgba(255,255,255,.22)`, shifted less than 1px and limited by the same upper-left light direction. It creates a faint blind-print edge rather than a shiny logo.
- Main time, identities, LOCAL TIME, date, status, annotation and collection text remain outside the print mask. Pattern count and miniature-symbol concepts are unchanged.

Emboss/deboss tokens define a 1px craft vocabulary: highlight `.45`, shadow `.06`, upper deboss `.04`, lower `.30`. They remain controlled material options; this pass enables only matte ink plus one blind-print finish. Core timing/team text has no relief effect. Spine tokens define graphite-50 type, a 12% neutral line and 6% optional team trace; no new spine module is introduced.

Perforation uses paired tiny printed/punched marks: `--perforation-dark rgba(60,58,53,.08)` and `--perforation-light rgba(255,255,255,.35)`. Existing pitch and physical alignment are retained. Cutout upper lips use `--cutout-highlight`; inner lips use `--cutout-inner`. Cutouts receive no independent drop shadow.

## Precision device surface

The island uses graphite 100, a 7% upper light, 12% lower edge, and `0 10px 28px rgba(20,20,18,.14)` external shadow. The active segment uses 8% light with a 3% upper internal edge, warm inverse text and the existing tiny brand-red dot. Its width, height, corner radii, placement and navigation contents are unchanged.

## Verification and review files

```sh
npm test
npm run build
npm run start -- --port 3700
MYGAME_APP_URL=http://127.0.0.1:3700 node design/promo/check-app.cjs
MYGAME_APP_URL=http://127.0.0.1:3700 node design/promo/check-material.cjs
# Optional geometry baseline directory also contains V2.2 validation.json:
PROMO_BASELINE_DIR=/path/to/v2.2-baseline node design/promo/export.cjs
```

The baseline check compares every shared layout landmark, all approved copy and type size/weight/line/tracking with V2.2. Pixel equality outside the ticket is intentionally replaced by geometry equality because this version updates the whole semantic palette.

Required reviews are emitted under `/tmp/mygame-v2.3-cm-*`:

- **Greyscale:** full-size and 30% for each city; sporting identities/time/paper remain readable through value alone.
- **10% saturation:** full-size and 30% for each city; hierarchy remains intact.
- **30% thumbnail:** teams, main time, pass silhouette, brand and dark island remain distinct.
- **Team swap:** HOU/LAL App ticket captures, their greyscale/low-saturation variants, and assertions for changed stock/tint/identity while canvas/paper/island/geometry/records remain unchanged.
- **Squint:** 5px blur at full size and 30%; brand, pass and device remain separate masses.
- Additional border-off, material-only and 50/50 city-overlay reviews retain the earlier precision checks.

The material-only image samples the unprinted main paper on a 16px grid. Encoded Rec.709-weighted luminance variation must remain under 3%; sampled main/stub difference must stay within 1–3%. Security on/off comparison must stay below 4% channel contrast and produce zero differences inside protected information frames. Current exports measure about 2.3% paper variation, 2.3% main/stub difference and 2.4% maximum security channel contrast.

Reports: `/tmp/mygame-v2.3-cm-validation.json`, `-app-validation.json`, and `-material-validation.json`. Final deliverables remain the two 1080×1440 PNGs in `output/douyin/`; diagnostic images are not extra visual elements in the product.
