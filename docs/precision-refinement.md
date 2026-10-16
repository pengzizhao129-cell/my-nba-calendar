# MyGame+ — Material & Brand Refinement

V2.9 adds [Personal Season Collection](personal-season-collection.md) behavior on this same approved visual baseline; it does not redesign the page or Pass.

This is a refinement of the full mobile product screenshot. All existing page groups remain: city label, brand, descriptor/slogan, WEB APP BETA, city state, MY TEAM / LOCAL TIME / AUTO CONVERTED, GAME PASS, NEXT 7 DAYS and Bottom System Island. Event data, user identity, timezone behavior and lifecycle are unchanged.

## Material subtraction

The former closed double casing is removed. The full 752 × 598 outline remains only as construction geometry in SVG definitions. Painted paths are open and local: three 1.15-unit bevel catches, 0.5-unit mounting returns and a 0.75-unit partial sidewall. There is no transparent face plane. Optical highlights are neutral clear; the original ivory paper keeps its warm top-left lighting and matte security stock. The canvas stays flat warm stone.

The fixed upper-right micro cut/neutral plus and the internal `MG-DNA-1` structure remain intact. Team refraction uses 6.5% team ink over 25.59% of the perimeter; state alters only opacity. The casing affects 2,668 rendered pixels per promo versus 26,948 before, and maximum on/off channel difference falls from 43 to 12. Hiding the casing changes zero paper-interior pixels. The contact shadow is reduced to `0 2px 4px / .028` plus `0 8px 20px / .032` through semantic tokens.

## One Brand Lockup

`BrandLockup` and `brand-lockup.css` are shared by the live App and promo. The seal, Chinese name and signature use one authored 480 × 64 coordinate family, uniformly scaled at native mobile sizes. The promo keeps the same x176/y64 brand region.

- Seal: 52 × 52, x0/y6, radius 14. Custom filled M and G contours retain their diagonal relationship; the plus has its own simple cross. More negative space separates the letters. Ivory edge light and contact depth are extremely slight.
- Chinese name: x72/y10, 34px / 600. It owns primary recognition.
- Approved script signature: x304/y4, 176 × 56. It is smaller and quieter than the former 224 × 70 signature, with a fixed gap after the Chinese name. Its original silhouette is preserved.

No extra brand copy, icon or decorative signature is introduced.

## Four ink levels

The existing graphite palette remains unchanged; assignments are tightened:

| Level | Ink | Main roles |
| --- | --- | --- |
| Primary | `--graphite-100` | Chinese brand, main time/date, selected city, weekly title |
| Secondary | `--graphite-70` | descriptor, slogan, venue, Chinese team names, schedule opponents/times |
| Tertiary | `--graphite-50` | WEB APP BETA, city state, MY TEAM / LOCAL TIME / NEXT 7 DAYS, weekday and HOME/AWAY |
| Micro | `--graphite-30` | AUTO CONVERTED, PASS/GAME/SEASON, serial and auxiliary English |

Collection records gain only the pre-existing limited archival emphasis in COLLECTED. Team abbreviations occupy the primary identity role through printed team ink, rather than a fifth neutral grey. WEB APP BETA and AUTO CONVERTED share type metrics but deliberately belong to different semantic ink levels.

## Timing and identity print

The main time remains exactly 100px in the promo and retains its original Timing Sanctuary. MyGame Timing's horizontal scale changes from .90 to .875, with unchanged cap height and 500/550 weights. Every digit has the same 54.10px advance at 100px, across both weights. Font kerning is disabled for timing runs; tabular features remain enabled.

The colon is drawn from two slightly square .046em dots, formerly .058em. Its footprint narrows from .16em to .14em, side margins from .025em to .02em, and dot separation tightens. Main opacity remains .60; programme times use .52. Main/schedule times use the same component and font system.

MyGame Identity's horizontal scale changes from .94 to .93; ticket tracking settles at −.026em. The local alphabet now covers A–Z so all 30 teams use the same native App type family. Abbreviations, crests and programme codes use `--team-print-ink`: 90% canonical team accent plus 10% warm secondary graphite. TeamIdentity's canonical color, season data and security identity are retained. Patch temperature strength falls to 70% of the existing state-dependent tint; no border or shadow is added. Chinese names become 22px secondary print and miniature crests 26px, inside unchanged identity regions.

The source font remains the bundled OFL-licensed Geist. `design/promo/build-type.py` reproduces the modified subsets; the existing license metadata is retained. The native App loads the same timing and identity files used by export.

## Functional lower page

The weekly programme retains its four columns, 64px promo row height and flat, rule-free composition. Date numerals and timing stay tabular; Chinese opponents and result times share secondary ink. The weekly title uses primary ink.

Bottom Island stays 928px wide and warm graphite, with bottom offset 28px. Height falls from 72 to 68px. Its Chinese labels remain 22px, English 10px and icons 20px; all three tabs share the same optical row positions. Active brightness drops from 8% to 5%, and the outer shadow drops to `0 6px 18px / .085`. It does not receive acrylic or paper materials.

## Validation

Run the commands in [Mobile Collectible Pass](mobile-collectible-pass.md). The current checks cover:

- 35 unit tests; semantic paint guards include both brand and enclosure CSS.
- Production build, with generated timing/identity font bytes checked against the bundled build assets.
- Eight live App regression groups, including Brand Lockup separation at 320/390/480/1080px, real selectors, user ID, team/season archive isolation and lifecycle.
- Unchanged content/ticket landmarks against the V2.8 baseline; only approved brand/dock refinement is allowed. Selector width differs by less than one pixel due to the refined identity font.
- Four-state geometry and paper DNA pixel equality; local casing paths never move or close into a frame.
- Both PNGs decode at 1080 × 1440 with no overflow, black borders or cropping.
- Tokyo/London differ only in authorized city, slogan, state and timing pixels; dock pixels are identical.
- 30% thumbnail, blur, grayscale, low saturation, border-off and overlay reviews. HOU/LAL and main time stay the first read; the full App structure remains visible.

Outputs remain `output/douyin/mygame-plus-douyin-01-tokyo.png` and `output/douyin/mygame-plus-douyin-02-london.png`. No standalone poster or new feature is produced.
